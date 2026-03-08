---
title: "Building Your First Workflow"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "12 min"
permalink: /learn/build/building-first-workflow
metaTitle: "Building Your First Workflow - Technical Walkthrough"
metaDescription: "Step-by-step guide to building your first AI-powered workflow in Outrun, from creating nodes to configuring execution and testing the full pipeline."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How to create a workflow using the visual DAG editor"
  - "The six node types and when to use each one"
  - "How to connect nodes and configure data flow between them"
  - "How to test and debug your workflow before deploying"
crossTrackUrl: /learn/build/first-ai-workflow/
crossTrackTitle: "Your First AI Workflow"
crossTrackLabel: "Want the business overview?"
prevArticle:
nextArticle:
  title: "Configuring AI Agents"
  url: /learn/build/configuring-ai-agents/
---

Outrun workflows are directed acyclic graphs — nodes connected by edges, executed in topological order. This guide walks you through building a complete workflow from scratch: creating nodes, wiring them together, configuring each step, and running it end to end.

By the end of this walkthrough, you'll have a working workflow that ingests data from an external source, processes it with AI, and takes action based on the result.

## Understanding the Workflow Model

Before touching the editor, you need to understand the data model. Every workflow is a **workflow definition** stored in MongoDB. It contains:

- **Nodes** — individual processing steps (source, AI, action, conditional, code, destination)
- **Edges** — connections that define data flow between nodes
- **Trigger configuration** — what starts the workflow (webhook, schedule, or event)

Execution follows topological sort. A node only runs when all its upstream dependencies have completed. This guarantees that data flows predictably through the graph, even when branches run in parallel.

```json
{
  "name": "Lead Qualification Pipeline",
  "nodes": [
    { "id": "source-1", "type": "source", "config": { ... } },
    { "id": "ai-1", "type": "ai", "config": { ... } },
    { "id": "cond-1", "type": "conditional", "config": { ... } },
    { "id": "action-1", "type": "action", "config": { ... } }
  ],
  "edges": [
    { "source": "source-1", "target": "ai-1" },
    { "source": "ai-1", "target": "cond-1" },
    { "source": "cond-1", "target": "action-1" }
  ]
}
```

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The execution engine uses Redis for fast inter-node state and MongoDB's <code>workflow_runs</code> collection for persistent records. Each node's output is stored in Redis during execution so downstream nodes can read it with near-zero latency. After the run completes, the full state is flushed to MongoDB for audit and replay.</p>
</div>

## Step 1: Create a New Workflow

Navigate to **Workflows > New Workflow** in the Outrun dashboard. You'll land in the visual editor — a canvas where you drag, connect, and configure nodes.

Give your workflow a descriptive name. Good naming follows the pattern **[Trigger] [Action] [Target]**:

- "New Lead Email Qualification"
- "GitHub Issue Auto-Triage"
- "Daily CRM Sync Pipeline"

### Choose a Trigger Type

Every workflow starts with a trigger. Select one from the trigger panel:

| Trigger | Use Case | Example |
|---|---|---|
| **Webhook** | External systems push data in | Stripe sends a payment event |
| **Schedule** | Run on a cron interval | Daily CRM deduplication at 6am |
| **Event** | React to internal Outrun events | New record synced from Salesforce |
| **Manual** | On-demand testing and one-off runs | Ad hoc data enrichment |

For this walkthrough, select **Webhook** — it's the most common trigger type and the easiest to test with a cURL command.

## Step 2: Add a Source Node

Drag a **Source** node onto the canvas. This is where data enters your workflow. Configure it to define what data the webhook expects:

```json
{
  "type": "source",
  "config": {
    "provider": "webhook",
    "schema": {
      "email": "string",
      "company": "string",
      "message": "string"
    }
  }
}
```

The schema defines the shape of incoming data. Downstream nodes reference these fields using dot-notation paths like `source-1.email` or `source-1.company`.

Connect the trigger to the source node by drawing an edge from the trigger output to the source input.

## Step 3: Add an AI Node

Drag an **AI** node onto the canvas and connect it to the source. AI nodes send data to Claude for processing — classification, extraction, summarisation, or any reasoning task.

Configure the AI node with a prompt template and an output schema:

{% raw %}
```json
{
  "type": "ai",
  "config": {
    "model": "claude",
    "prompt": "You are a lead qualification assistant. Given the following inbound message from {{source-1.email}} at {{source-1.company}}:\n\n{{source-1.message}}\n\nClassify this lead as 'hot', 'warm', or 'cold'. Extract the key intent and any mentioned timeline. Return your analysis as JSON.",
    "outputSchema": {
      "classification": "string",
      "intent": "string",
      "timeline": "string",
      "confidence": "number"
    }
  }
}
```
{% endraw %}

The double-brace syntax pulls data from upstream nodes at runtime. The AI node's output is then available to downstream nodes by referencing the node ID and field name.

## Step 4: Add a Conditional Node

Not every lead should follow the same path. Drag a **Conditional** node onto the canvas and connect it to the AI node. Conditionals let you branch your workflow based on data values:

```json
{
  "type": "conditional",
  "config": {
    "conditions": [
      {
        "name": "is_hot_lead",
        "expression": "ai-1.classification == 'hot'"
      },
      {
        "name": "is_warm_lead",
        "expression": "ai-1.classification == 'warm'"
      }
    ],
    "defaultBranch": "cold_path"
  }
}
```

Each condition creates a named output branch. Only the first matching branch executes — similar to an if/else chain. Nodes connected to a skipped branch are also skipped.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Conditional nodes evaluate branches using the <code>skippedBranches</code> mechanism. A downstream node only executes if at least one of its upstream parents was <strong>not</strong> skipped. Nodes reachable from both skipped and non-skipped parents will still execute — the engine checks for any live parent, not all parents.</p>
</div>

## Step 5: Add Action Nodes

Now add the nodes that actually do something. Drag **Action** nodes onto each branch of the conditional.

For the hot lead path, configure an action that creates a task in your CRM:

{% raw %}
```json
{
  "type": "action",
  "config": {
    "provider": "salesforce",
    "action": "salesforce.create_task",
    "params": {
      "subject": "Hot Lead: {{source-1.company}}",
      "description": "Intent: {{ai-1.intent}}\nTimeline: {{ai-1.timeline}}",
      "priority": "High",
      "assignTo": "sales-team"
    }
  }
}
```
{% endraw %}

For the warm lead path, you might send a nurture email. For the cold path, log the lead for later batch review. Each action node specifies a `provider` and `action` in dot-notation — the execution engine splits this into the app and the specific operation to perform.

## Step 6: Add a Destination Node (Optional)

If you want the workflow's output sent to an external system or stored for reporting, add a **Destination** node at the end:

{% raw %}
```json
{
  "type": "destination",
  "config": {
    "provider": "webhook",
    "url": "https://your-analytics.example.com/api/leads",
    "method": "POST",
    "payload": {
      "email": "{{source-1.email}}",
      "classification": "{{ai-1.classification}}",
      "action_taken": "{{action-1.result}}"
    }
  }
}
```
{% endraw %}

Destination nodes are always terminal — they have no outgoing edges.

## Step 7: Test the Workflow

Before deploying, test with a manual trigger. Click **Test Run** in the editor toolbar or use cURL to send a test payload to the webhook URL:

```bash
curl -X POST https://your-workspace.outrun.dev/api/v1/webhook/wf_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@acme.com",
    "company": "Acme Corp",
    "message": "We need a solution for our 50-person sales team. Looking to deploy within the next 6 weeks. Can you send pricing?"
  }'
```

Watch the execution in real time from the **Run History** panel. Each node shows its status (pending, running, completed, failed), the input it received, the output it produced, and the execution duration.

### Common Test Failures

| Symptom | Likely Cause | Fix |
|---|---|---|
| Node stuck on "pending" | Missing upstream edge | Check all connections in the editor |
| AI node returns empty | Prompt template has bad variable reference | Verify variable reference paths match actual node IDs |
| Conditional skips all branches | No condition matched and no default branch | Add a `defaultBranch` to catch unmatched cases |
| Action node auth error | Missing or expired credentials | Re-authenticate the provider in **Settings > Connections** |

## Step 8: Deploy

Once your test run succeeds, toggle the workflow to **Active**. It will now execute automatically whenever the trigger fires.

Monitor the first few live runs from the **Run History** panel. Pay attention to:

- **Execution time** — is it within your latency requirements?
- **AI node costs** — each AI node call has a token cost; monitor for prompt bloat
- **Error rates** — set up alerts for failed runs so you catch issues early

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>The <a href="/features/ai-workflow-builder">AI Workflow Builder</a> includes pre-built templates for lead qualification, email triage, and CRM sync. Start from a template to skip the initial setup and go straight to customisation. Every run is logged in the <a href="/features/comprehensive-audit-trails">audit trail</a> for full traceability.</p>
</div>

## Workflow Design Patterns

As you build more workflows, these patterns will save you time:

### Fan-Out Pattern
A single source fans out to multiple parallel action nodes. Use this when one event triggers independent actions — e.g., a new deal creates a CRM task, sends a Slack notification, and updates a spreadsheet simultaneously.

### Enrichment Chain
Source > AI > AI > Action. Chain multiple AI nodes in sequence when you need multi-step reasoning — first classify, then extract, then summarise. Each AI node gets the output of the previous one.

### Guard Pattern
Source > Conditional > Action. Place a conditional immediately after the source to filter out irrelevant events early. This saves AI node costs by only processing data that meets your criteria.

## What's Next

You've built a complete workflow with data ingestion, AI processing, conditional branching, and automated actions. In the next guide, we'll go deeper into one of the most powerful node types: **AI Agents** — autonomous processes that monitor your tools and take action without a trigger.
