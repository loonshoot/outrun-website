---
title: "Workflow Debugging"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "9 min"
permalink: /learn/build/workflow-debugging
metaTitle: "Workflow Debugging - Technical Walkthrough"
metaDescription: "Learn how to trace, diagnose, and fix workflow failures in Outrun using run history, node-level inspection, and execution replay."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How to read run history and identify failure points"
  - "How to inspect node-level input, output, and execution state"
  - "How to diagnose common failure patterns"
  - "How to use replay and test runs for iterative debugging"
crossTrackUrl: /learn/build/monitoring-ai-workflows/
crossTrackTitle: "Monitoring AI Workflows"
crossTrackLabel: "Want the business overview?"
prevArticle:
  title: "Setting Up the MCP Server"
  url: /learn/build/setting-up-mcp/
nextArticle:
  title: "Writing Custom Code Nodes"
  url: /learn/build/custom-code-nodes/
---

Workflows fail. Nodes time out, AI returns unexpected output, conditional branches take the wrong path, actions hit rate limits. The question isn't whether your workflows will break — it's how fast you can find and fix the problem.

Outrun provides deep execution visibility at every level: run history, node-level inspection, input/output tracing, and execution replay. This guide covers how to use each tool to debug workflows efficiently.

## Understanding Execution State

Every workflow run produces a **run record** in MongoDB's `workflow_runs` collection. Each run contains:

- **Run ID** — unique identifier
- **Status** — `pending`, `running`, `completed`, `failed`, `partial`
- **Trigger data** — the input that started the run
- **Node states** — per-node status, input, output, timing, and errors
- **Execution timeline** — ordered log of every state transition

During execution, node state is held in Redis for fast access. After the run completes (success or failure), the full state is flushed to MongoDB for permanent storage.

### Run Statuses

| Status | Meaning |
|---|---|
| `completed` | All nodes executed successfully |
| `failed` | At least one node threw an unrecoverable error |
| `partial` | Some branches completed but others failed or timed out |
| `running` | Execution is still in progress |
| `pending` | Queued but not yet started |

A `partial` status is common in workflows with conditional branches — it means skipped branches are recorded as "skipped" (not failed), and the active path completed.

## Step 1: Find the Failed Run

Navigate to **Workflows > [Your Workflow] > Run History**. The run list shows all recent executions with their status, trigger time, and duration.

Filter by status to find failures:

- **Failed** — hard errors that stopped execution
- **Partial** — soft failures where some nodes succeeded
- **Completed** (with warnings) — runs that finished but with unexpected outputs

Click a run to open the detailed inspection view.

## Step 2: Inspect the Run Graph

The run detail view shows your workflow graph with each node colour-coded by status:

- **Green** — completed successfully
- **Red** — failed with error
- **Grey** — skipped (conditional branch not taken)
- **Yellow** — completed with warnings
- **Blue outline** — currently executing (for live runs)

Follow the edges from the trigger to find where the failure occurred. The first red node is usually your starting point, but sometimes a node shows green despite producing bad output — causing a downstream failure.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Don't just look at the red node. Trace backwards to examine the <strong>output of every upstream node</strong>. A "successful" AI node that returns malformed output will show green, but every downstream node consuming that output will fail. The root cause is often one or two nodes before the visible failure.</p>
</div>

## Step 3: Node-Level Inspection

Click any node in the run graph to inspect its execution details:

### Input Panel

Shows exactly what data the node received:

```json
{
  "email": "sarah@acme.com",
  "company": "Acme Corp",
  "message": "We need a solution for our 50-person sales team..."
}
```

Verify that the input matches what you expected. Common issues:

- **Null or undefined fields** — the upstream node didn't produce the expected output
- **Wrong data type** — a string where you expected a number, or a single value where you expected an array
- **Stale data** — the source node fetched old data due to caching

### Output Panel

Shows what the node produced:

```json
{
  "classification": "hot",
  "intent": "purchasing",
  "timeline": "6 weeks",
  "confidence": 0.92
}
```

Check that output field names match what downstream nodes expect. A common bug: the AI node returns `"category"` but the conditional checks `ai-1.classification`.

### Error Panel

For failed nodes, this panel shows the full error:

```json
{
  "error": "ProviderAuthError",
  "message": "Salesforce token expired. Re-authenticate in Settings > Connections.",
  "timestamp": "2026-02-15T14:32:01Z",
  "retryable": true
}
```

Error types fall into categories:

| Error Type | Cause | Resolution |
|---|---|---|
| `ProviderAuthError` | Expired or invalid credentials | Re-authenticate the provider |
| `ProviderRateLimitError` | Too many API calls | Wait or increase rate limit |
| `AIResponseError` | Claude returned invalid output | Fix prompt or output schema |
| `ValidationError` | Node input doesn't match expected schema | Fix upstream node output |
| `TimeoutError` | Node exceeded execution time limit | Optimise the node or increase timeout |
| `CodeExecutionError` | Custom code node threw an exception | Debug the code (see [Custom Code Nodes](/learn/build/custom-code-nodes)) |

### Timing Panel

Shows execution duration for the node:

```
Queue time:     12ms
Execution time: 2,340ms
Total:          2,352ms
```

Long queue times indicate backpressure — too many workflow runs competing for execution slots. Long execution times point to slow API calls, complex AI prompts, or heavy code execution.

## Step 4: Diagnose Common Patterns

### Pattern: Conditional Skips Everything

**Symptom:** All action nodes show grey (skipped). No branch executed.

**Cause:** The conditional node's conditions didn't match the input, and no `defaultBranch` was configured.

**Fix:** Add a `defaultBranch` to catch unmatched cases, or review the conditional expressions. Open the conditional node's input panel to see the actual values being evaluated:

```json
// Expected: ai-1.classification == 'hot'
// Actual input:
{ "classification": "Hot" }  // Case mismatch!
```

### Pattern: AI Node Returns Unexpected Structure

**Symptom:** AI node shows green, but downstream nodes fail with validation errors.

**Cause:** Claude returned a valid response that doesn't match the expected `outputSchema`. This happens when the prompt is ambiguous or the output schema is too strict.

**Fix:** Open the AI node's output panel and compare against the expected schema. Then either:
1. Adjust the prompt to be more specific about output format
2. Relax the output schema to handle variations
3. Add a code node after the AI node to normalise the output

### Pattern: Race Condition in Parallel Branches

**Symptom:** Intermittent failures when two action nodes hit the same external API.

**Cause:** Parallel branches execute simultaneously. If both try to update the same CRM record, one may fail due to a conflict.

**Fix:** Serialise the conflicting actions by chaining them (A > B instead of A + B in parallel), or add retry logic to the action configuration.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The execution engine uses a <code>skippedBranches</code> set that propagates downstream. When a conditional skips a branch, all nodes reachable exclusively from that branch are marked as skipped. However, nodes reachable from <strong>both</strong> a skipped and a non-skipped parent will still execute — the engine checks if the node has any live (non-skipped, executed) parent before adding it to the skip set. This prevents false skips at convergent points in the graph.</p>
</div>

## Step 5: Replay and Test

### Replay a Failed Run

Click **Replay** on any failed run to re-execute it with the same input. This is useful after you've fixed the root cause — you can verify the fix against the exact data that triggered the failure.

Replay creates a new run record linked to the original, so you can compare the two side by side.

### Test with Modified Input

Click **Test Run** in the workflow editor to trigger a manual run with custom input:

```json
{
  "email": "test@example.com",
  "company": "Test Corp",
  "message": "I'd like to see a demo of your enterprise plan."
}
```

Use test runs to:

- Verify conditional branch logic with different classification values
- Test edge cases (empty fields, long strings, special characters)
- Validate error handling by intentionally sending malformed data

### Dry Run Mode

Toggle **Dry Run** to execute the workflow without side effects. All nodes run normally, but action and destination nodes log what they *would* do instead of executing. This is essential for testing workflows that send emails, create CRM records, or trigger external systems.

## Step 6: Set Up Alerts

Don't wait to discover failures manually. Configure alerts in **Workflows > [Your Workflow] > Settings > Alerts**:

```json
{
  "alerts": [
    {
      "condition": "run.status == 'failed'",
      "channel": "email",
      "recipients": ["ops-team@company.com"]
    },
    {
      "condition": "run.duration > 30000",
      "channel": "slack",
      "webhook": "https://hooks.slack.com/services/..."
    },
    {
      "condition": "node.ai-1.confidence < 0.7",
      "channel": "email",
      "recipients": ["workflow-owner@company.com"]
    }
  ]
}
```

Alert on failures, slow runs, and low-confidence AI decisions. The third alert is particularly useful — it catches cases where the AI is uncertain but doesn't fail, allowing you to review edge cases before they become patterns.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Every workflow run in Outrun is fully inspectable from the <a href="/features/ai-workflow-builder">Workflow Builder</a> dashboard. Node-level input/output, execution timing, and error details are available for every run. The <a href="/features/comprehensive-audit-trails">audit trail</a> captures the complete history for compliance and post-incident review.</p>
</div>

## Debugging Checklist

When a workflow fails, work through this checklist:

1. **Find the run** — filter Run History by status
2. **Identify the red node** — which node failed?
3. **Check the input** — did the node receive the right data?
4. **Check the upstream output** — is the previous node's output what you expect?
5. **Read the error** — what type? Is it retryable?
6. **Check credentials** — are provider connections still valid?
7. **Replay** — does it fail again with the same input?
8. **Test** — does it work with known-good input?
9. **Fix and verify** — make the change and replay the original failure

## What's Next

Many debugging sessions end with realising you need more custom logic than standard nodes provide. The next guide covers **custom code nodes** — sandboxed Docker containers where you can run arbitrary code as part of your workflow, from data transformation to complex API orchestration.
