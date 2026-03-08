---
title: "Writing Custom Code Nodes"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "10 min"
permalink: /learn/build/custom-code-nodes
metaTitle: "Writing Custom Code Nodes - Technical Walkthrough"
metaDescription: "Learn to write custom code nodes in Outrun — sandboxed Docker containers for data transformation, API orchestration, and complex business logic within workflows."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How code nodes execute in sandboxed Docker containers"
  - "How to read input data and write output results"
  - "How to handle errors, timeouts, and resource limits"
  - "Patterns for common code node use cases"
crossTrackUrl: /learn/build/ai-data-cleanup/
crossTrackTitle: "AI for Data Cleanup"
crossTrackLabel: "Want the business overview?"
prevArticle:
  title: "Workflow Debugging"
  url: /learn/build/workflow-debugging/
nextArticle:
---

Standard workflow nodes handle most tasks — AI nodes for reasoning, action nodes for API calls, conditionals for branching. But sometimes you need custom logic: data transformation, complex validation, multi-step API orchestration, or business rules that don't fit neatly into a pre-built node.

Code nodes fill this gap. They run your custom JavaScript in a sandboxed Docker container with defined inputs and outputs. This guide covers the execution model, I/O conventions, error handling, and practical patterns.

## How Code Nodes Work

When a code node executes, the workflow engine:

1. **Provisions a Docker container** from a secure base image
2. **Mounts input data** at `/tmp/io/input/` (read-only)
3. **Runs your code** inside the container
4. **Reads output** from `/tmp/io/output/result.json`
5. **Destroys the container** after execution

The container runs as a non-root user (UID 1001) for security. It has no network access by default — if your code needs to call external APIs, enable network access in the node configuration.

```
┌──────────────────────────────────┐
│  Docker Container                │
│                                  │
│  /tmp/io/input/   (read-only)    │
│    ├── context.json              │
│    └── data.json                 │
│                                  │
│  /tmp/io/output/  (writable)     │
│    └── result.json               │
│                                  │
│  Your code runs here (UID 1001)  │
└──────────────────────────────────┘
```

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Code nodes are executed by the <code>CodeExecutor</code> in the execution engine. The container is provisioned by the dispatcher, which handles resource allocation, timeout enforcement, and result collection. The write path is specifically <code>/tmp/io/output/</code> — not <code>/io/</code> at root — because the container runs as a non-root user who cannot write to root-level directories.</p>
</div>

## Reading Input Data

Upstream node outputs are serialised to JSON files in the input directory. The primary input file is `context.json`, which contains all upstream node outputs keyed by node ID:

```javascript
const fs = require('fs');

// Read the full context from upstream nodes
const context = JSON.parse(
  fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
);

// Access specific node outputs
const sourceData = context['source-1'];
const aiResult = context['ai-1'];

console.log(`Processing lead: ${sourceData.email}`);
console.log(`AI classification: ${aiResult.classification}`);
```

The `context.json` structure mirrors the workflow graph:

```json
{
  "source-1": {
    "email": "sarah@acme.com",
    "company": "Acme Corp",
    "message": "Looking for enterprise pricing..."
  },
  "ai-1": {
    "classification": "hot",
    "intent": "purchasing",
    "timeline": "6 weeks",
    "confidence": 0.92
  }
}
```

## Writing Output

Your code must write a valid JSON file to `/tmp/io/output/result.json`. This output becomes available to downstream nodes as `code-1.fieldName`:

```javascript
const fs = require('fs');

// Read input
const context = JSON.parse(
  fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
);

// Process data
const source = context['source-1'];
const ai = context['ai-1'];

const result = {
  enrichedLead: {
    email: source.email,
    company: source.company,
    classification: ai.classification,
    score: calculateScore(ai.confidence, ai.timeline),
    priority: ai.classification === 'hot' ? 'P1' : 'P2',
    assignee: routeToRep(source.company),
    processedAt: new Date().toISOString()
  }
};

// Write output
fs.writeFileSync(
  '/tmp/io/output/result.json',
  JSON.stringify(result, null, 2)
);

function calculateScore(confidence, timeline) {
  let score = confidence * 100;
  if (timeline && timeline.includes('week')) {
    score += 20; // Bonus for near-term timeline
  }
  return Math.min(score, 100);
}

function routeToRep(company) {
  // Round-robin assignment logic
  const reps = ['alice', 'bob', 'charlie'];
  const hash = company.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return reps[hash % reps.length];
}
```

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Always write <code>result.json</code> even if your code fails partway through. Write a partial result with an <code>error</code> field so downstream nodes can handle the failure gracefully instead of crashing on missing input. A code node that exits without writing output causes a <code>CodeExecutionError</code> in the run log.</p>
</div>

## Error Handling

Robust code nodes handle errors explicitly and write meaningful output regardless of success or failure:

```javascript
const fs = require('fs');

try {
  const context = JSON.parse(
    fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
  );

  // Your processing logic
  const result = processData(context);

  fs.writeFileSync(
    '/tmp/io/output/result.json',
    JSON.stringify({
      status: 'success',
      data: result
    }, null, 2)
  );

} catch (error) {
  // Always write output, even on failure
  fs.writeFileSync(
    '/tmp/io/output/result.json',
    JSON.stringify({
      status: 'error',
      error: error.message,
      stack: error.stack
    }, null, 2)
  );

  // Exit with non-zero to mark node as failed
  process.exit(1);
}
```

### Exit Codes

| Exit Code | Meaning | Workflow Behaviour |
|---|---|---|
| `0` | Success | Node marked completed, output passed downstream |
| `1` | Error | Node marked failed, run may stop or continue based on error handling config |
| `124` | Timeout | Node exceeded time limit, killed by container runtime |
| `137` | OOM killed | Node exceeded memory limit, killed by kernel |

## Configuration Options

Configure code nodes in the workflow editor or via the workflow definition:

```json
{
  "type": "code",
  "config": {
    "runtime": "node",
    "entrypoint": "index.js",
    "code": "const fs = require('fs');\n// ... your code ...",
    "timeout": 30000,
    "memory": "256Mi",
    "cpu": "0.5",
    "networkAccess": false,
    "env": {
      "LOG_LEVEL": "debug"
    }
  }
}
```

### Resource Limits

| Parameter | Default | Max | Notes |
|---|---|---|---|
| `timeout` | 30s | 300s | Execution killed after this duration |
| `memory` | 256Mi | 2Gi | Container OOM-killed if exceeded |
| `cpu` | 0.5 | 2.0 | CPU cores allocated |

Start with defaults and increase only if needed. Most data transformation tasks complete well within 256Mi and 30 seconds. If your code consistently needs more, consider breaking it into multiple smaller code nodes.

### Enabling Network Access

By default, code nodes run without network access. This prevents exfiltration of data from your workflow. Enable network access only when your code needs to call external APIs:

```json
{
  "config": {
    "networkAccess": true,
    "allowedHosts": [
      "api.enrichment-service.com",
      "hooks.slack.com"
    ]
  }
}
```

When `networkAccess` is true, restrict it to specific hosts using `allowedHosts`. This limits the blast radius if your code has a bug that could leak data.

## Practical Patterns

### Pattern 1: Data Transformation

Transform AI output into the exact format an action node expects:

```javascript
const fs = require('fs');
const context = JSON.parse(
  fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
);

const ai = context['ai-1'];
const source = context['source-1'];

// Transform AI output into Salesforce-compatible format
const salesforceRecord = {
  FirstName: source.name.split(' ')[0],
  LastName: source.name.split(' ').slice(1).join(' '),
  Email: source.email,
  Company: source.company,
  LeadSource: 'Inbound - AI Qualified',
  Rating: ai.classification === 'hot' ? 'Hot' : 'Warm',
  Description: `Intent: ${ai.intent}\nTimeline: ${ai.timeline}`,
  Custom_AI_Score__c: Math.round(ai.confidence * 100)
};

fs.writeFileSync(
  '/tmp/io/output/result.json',
  JSON.stringify({ record: salesforceRecord }, null, 2)
);
```

### Pattern 2: Multi-Step Validation

Validate data against multiple business rules before allowing the workflow to continue:

```javascript
const fs = require('fs');
const context = JSON.parse(
  fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
);

const lead = context['source-1'];
const errors = [];

// Rule 1: Valid email domain
const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
const domain = lead.email.split('@')[1];
if (blockedDomains.includes(domain)) {
  errors.push(`Personal email domain: ${domain}`);
}

// Rule 2: Company size threshold
if (lead.employeeCount && lead.employeeCount < 10) {
  errors.push(`Company too small: ${lead.employeeCount} employees`);
}

// Rule 3: Geographic eligibility
const eligibleCountries = ['US', 'CA', 'GB', 'AU', 'DE'];
if (!eligibleCountries.includes(lead.country)) {
  errors.push(`Ineligible country: ${lead.country}`);
}

const isValid = errors.length === 0;

fs.writeFileSync(
  '/tmp/io/output/result.json',
  JSON.stringify({
    valid: isValid,
    errors: errors,
    passedRules: 3 - errors.length,
    totalRules: 3
  }, null, 2)
);
```

Downstream conditional nodes can branch on `code-1.valid` to route valid leads to sales and invalid leads to a rejection flow.

### Pattern 3: API Orchestration

Call external APIs that aren't available as native Outrun action nodes:

```javascript
const fs = require('fs');
const context = JSON.parse(
  fs.readFileSync('/tmp/io/input/context.json', 'utf-8')
);

async function enrichLead(email) {
  // Call an enrichment API
  const response = await fetch(
    `https://api.enrichment-service.com/v2/lookup?email=${encodeURIComponent(email)}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.ENRICHMENT_API_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Enrichment API returned ${response.status}`);
  }

  return response.json();
}

async function main() {
  try {
    const lead = context['source-1'];
    const enrichment = await enrichLead(lead.email);

    fs.writeFileSync(
      '/tmp/io/output/result.json',
      JSON.stringify({
        status: 'success',
        enriched: {
          ...lead,
          companySize: enrichment.company.size,
          industry: enrichment.company.industry,
          techStack: enrichment.company.technologies,
          fundingStage: enrichment.company.funding
        }
      }, null, 2)
    );
  } catch (error) {
    fs.writeFileSync(
      '/tmp/io/output/result.json',
      JSON.stringify({
        status: 'error',
        error: error.message
      }, null, 2)
    );
    process.exit(1);
  }
}

main();
```

Remember to enable `networkAccess` and add the API host to `allowedHosts` in the node configuration. Pass API keys through the `env` config — never hardcode secrets in your code.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>The <a href="/features/ai-workflow-builder">AI Workflow Builder</a> includes a built-in code editor with syntax highlighting and input preview. Write your code directly in the editor, preview the input your node will receive, and test-run the node in isolation. For more advanced use cases, check out the <a href="/features/ai-code-automation">AI Code Automation</a> feature to have Claude write code nodes for you from a description.</p>
</div>

## Testing Code Nodes

### Isolated Node Testing

Test a code node independently before running the full workflow:

1. Open the code node in the workflow editor
2. Click **Test This Node**
3. Paste or select sample input data
4. Run and inspect the output

This catches most issues — bad JSON parsing, missing fields, logic errors — without executing the entire workflow.

### Local Testing

For complex code nodes, develop and test locally before pasting into the editor:

```bash
# Create the input structure
mkdir -p /tmp/test-node/input /tmp/test-node/output

# Write test input
echo '{
  "source-1": { "email": "test@acme.com", "company": "Acme" },
  "ai-1": { "classification": "hot", "confidence": 0.9 }
}' > /tmp/test-node/input/context.json

# Run your code
node my-code-node.js

# Check the output
cat /tmp/test-node/output/result.json | jq .
```

Adjust the file paths in your code to match the test structure, or use environment variables to toggle between local and container paths.

## Performance Tips

- **Avoid unnecessary parsing.** If you only need one field from the context, don't process the entire object.
- **Stream large files.** If input data is large, use streaming JSON parsers instead of `JSON.parse` on the entire file.
- **Minimise dependencies.** The container has Node.js built-in modules available. Avoid npm packages unless absolutely necessary — they increase container start time.
- **Write output early.** If your code has multiple stages, write partial output after each stage. If the container is killed mid-execution, downstream nodes get partial data instead of nothing.

## What You've Learned

This guide covered the code node execution model, I/O conventions, error handling, resource configuration, and practical patterns. Code nodes are the escape hatch when standard nodes don't fit — use them for custom data transformation, complex validation, and API orchestration.

Combined with the previous guides on [workflow building](/learn/build/building-first-workflow), [AI agents](/learn/build/configuring-ai-agents), [GitHub automation](/learn/build/github-automation-ai), [MCP integration](/learn/build/setting-up-mcp), and [debugging](/learn/build/workflow-debugging), you now have the full toolkit for building, deploying, and maintaining production AI workflows in Outrun.
