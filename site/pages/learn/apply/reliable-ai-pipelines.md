---
title: "Building Reliable AI Pipelines"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "11 min"
permalink: /learn/apply/reliable-ai-pipelines/
metaTitle: "Building Reliable AI Pipelines - Technical Guide"
metaDescription: "Learn the engineering patterns for building AI pipelines that handle failures gracefully, from retry strategies to circuit breakers and state management."
author: "Outrun"
date: 2026-02-15
learnings:
  - "Why AI pipelines fail differently than traditional automation"
  - "Retry strategies, circuit breakers, and timeout patterns for AI nodes"
  - "State management patterns using Redis and persistent storage"
  - "How to build observability into AI workflows from day one"
crossTrackUrl: /learn/apply/ai-automation-roi/
crossTrackTitle: "AI Automation ROI"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "How Agents Triage and Route"
  url: /learn/apply/agents-triage-route/
nextArticle:
  title: "Data Integration for AI"
  url: /learn/apply/data-integration-ai/
---

An AI workflow that works in testing will fail in production. Not might fail — will fail. API rate limits, model timeouts, malformed outputs, upstream service outages, and unexpected input all conspire to break your pipelines. This guide covers the engineering patterns that keep AI workflows running reliably at scale.

## Why AI Pipelines Fail Differently

Traditional automations fail in predictable ways. An API returns a 500, a field is missing, a timeout occurs. You can enumerate the failure modes and handle each one.

AI pipelines introduce a new category: **semantic failure**. The pipeline completes successfully — no errors, no timeouts — but the AI output is wrong. The classification is incorrect. The summary misses the key point. The generated response is inappropriate.

This means reliability for AI pipelines has two dimensions:

1. **Infrastructure reliability** — the pipeline runs to completion
2. **Output reliability** — the pipeline produces correct results

You need engineering patterns for both.

## Retry Strategies

Not all failures deserve the same retry behaviour. Match the strategy to the failure type:

### Transient Failures: Exponential Backoff

API rate limits, temporary network issues, and model service hiccups are transient. Retry with exponential backoff:

```javascript
const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000,     // 1 second
  maxDelay: 30000,     // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: [429, 500, 502, 503, 504]
};

// Retry delays: 1s, 2s, 4s
// With jitter:  0.8s, 1.6s, 3.2s (random 0.5-1.0x)
```

**Always add jitter.** Without it, multiple concurrent workflows that hit a rate limit will all retry at the exact same moment, causing another rate limit. Random jitter spreads the retries across a window.

### Semantic Failures: Retry with Variation

If the AI produces malformed output (invalid JSON, out-of-range values), retrying the exact same request might produce the exact same result. Instead, retry with prompt variation:

```yaml
retry_strategy: semantic
max_retries: 2
on_retry:
  - append_to_prompt: "Your previous response was not valid JSON. Return ONLY a JSON object with no additional text."
  - adjust_temperature: -0.1
```

### Permanent Failures: Fail Fast

Some failures are not retryable. The input is malformed beyond repair, the target API returns a 404 (resource doesn't exist), or the authentication token is expired. Detect these and fail fast:

```javascript
const nonRetryableErrors = [400, 401, 403, 404, 422];
// 400: Bad request — input won't change on retry
// 401/403: Auth issue — retry won't fix credentials
// 404: Resource missing — retrying is pointless
// 422: Validation error — input is structurally wrong
```

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Implement retries at the node level, not the workflow level. If node 5 of 8 fails, you should retry node 5 — not re-execute nodes 1 through 4. This requires each node to be idempotent: running it twice with the same input produces the same side effects. For nodes that create records (CRM entries, emails), use idempotency keys to prevent duplicates on retry.</p>
</div>

## Circuit Breakers

When a downstream service is down, retrying every request wastes resources and can make the outage worse. A circuit breaker detects sustained failures and stops making requests until the service recovers.

```
States:
  CLOSED  → Normal operation, requests pass through
  OPEN    → Service is down, requests fail immediately
  HALF    → Testing recovery, limited requests pass through

Transitions:
  CLOSED → OPEN:    When failure count exceeds threshold (e.g., 5 failures in 60s)
  OPEN → HALF:      After cooldown period (e.g., 30 seconds)
  HALF → CLOSED:    When test requests succeed
  HALF → OPEN:      When test requests fail
```

For AI pipelines, you might have separate circuit breakers per service: one for the LLM API, one for Salesforce, one for your enrichment provider. When the Salesforce circuit opens, workflows that need CRM updates queue their actions for later, but the AI classification and routing steps continue unaffected.

```javascript
const circuitBreakers = {
  "openai": { threshold: 5, cooldown: 30000, state: "CLOSED" },
  "salesforce": { threshold: 3, cooldown: 60000, state: "CLOSED" },
  "clearbit": { threshold: 3, cooldown: 120000, state: "CLOSED" }
};
```

## Timeout Management

AI model calls are the most variable-latency component in your pipeline. A simple classification might take 500ms. A complex summarisation might take 15 seconds. Set timeouts per node, not per workflow:

```yaml
nodes:
  - id: classify
    type: ai
    timeout: 10000  # 10 seconds — classification should be fast

  - id: generate-response
    type: ai
    timeout: 30000  # 30 seconds — generation is slower

  - id: update-crm
    type: action
    timeout: 5000   # 5 seconds — API calls should be quick
```

**What to do on timeout:** Don't retry immediately. A timeout usually means the service is under load, so immediate retry adds to the problem. Wait for the backoff period, then retry. If the AI node times out consistently, consider whether the prompt is too complex — longer prompts with more context take longer to process.

## State Management

In a multi-node workflow, you need a strategy for passing state between nodes and recovering from mid-workflow failures.

### Hot State: Redis

Node outputs need to be available immediately for downstream nodes. Redis provides the speed:

```javascript
// After node completes
await redis.set(
  `workflow:${runId}:node:${nodeId}:output`,
  JSON.stringify(nodeOutput),
  'EX', 3600  // TTL: 1 hour
);

// Downstream node reads upstream output
const upstreamOutput = JSON.parse(
  await redis.get(`workflow:${runId}:node:${upstreamId}:output`)
);
```

### Cold State: MongoDB

For durability and post-run analysis, persist the full execution record:

```javascript
await workflowRuns.updateOne(
  { runId },
  {
    $set: {
      [`nodes.${nodeId}`]: {
        status: "completed",
        output: nodeOutput,
        startedAt: startTime,
        completedAt: Date.now(),
        duration: Date.now() - startTime,
        retryCount: retries
      }
    }
  }
);
```

### Checkpoint and Resume

For long-running workflows, implement checkpointing. After each node completes, save the workflow state. If the workflow fails, resume from the last checkpoint rather than starting over:

```javascript
async function executeWorkflow(definition, runId) {
  const checkpoint = await loadCheckpoint(runId);
  const startNode = checkpoint ? checkpoint.lastCompletedNode : null;

  const executionOrder = topologicalSort(definition.nodes);
  const resumeIndex = startNode
    ? executionOrder.indexOf(startNode) + 1
    : 0;

  for (let i = resumeIndex; i < executionOrder.length; i++) {
    const node = executionOrder[i];
    await executeNode(node, runId);
    await saveCheckpoint(runId, node.id);
  }
}
```

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Use Redis for hot state (node outputs during execution) and a persistent store for cold state (complete run records for audit and debugging). Implement checkpoint-and-resume for workflows with more than 3-4 nodes to avoid expensive re-execution on failure.</p>
</div>

## Idempotency

When a node retries, it must not create duplicate side effects. This requires idempotency at two levels:

**Read operations** are naturally idempotent. Querying a CRM twice returns the same data.

**Write operations** need idempotency keys. When creating a CRM record, include a unique key derived from the workflow run and node:

```javascript
const idempotencyKey = `${runId}:${nodeId}:create-lead`;

// Salesforce API
await salesforce.create('Lead', {
  ...leadData,
  External_Id__c: idempotencyKey
});
```

If the node retries after a timeout (where the first attempt may have succeeded), the idempotency key prevents a duplicate record.

## Observability

You cannot fix what you cannot see. Build observability into your AI pipelines from day one:

### Structured Logging

Every node execution should produce a structured log entry:

```json
{
  "timestamp": "2026-02-15T10:30:00Z",
  "workflowId": "wf_lead_triage",
  "runId": "run_abc123",
  "nodeId": "classify",
  "nodeType": "ai",
  "status": "completed",
  "duration_ms": 1250,
  "retryCount": 0,
  "input_tokens": 450,
  "output_tokens": 85,
  "output_summary": "intent=purchase_inquiry, confidence=0.92"
}
```

### Metrics to Track

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Node success rate** | Percentage of node executions that complete | < 95% |
| **Workflow completion rate** | Percentage of workflows that finish all nodes | < 90% |
| **P95 latency** | 95th percentile execution time per node | 2x expected |
| **Retry rate** | Percentage of nodes that need retries | > 15% |
| **Default branch rate** | Percentage of conditionals hitting default | > 10% |
| **AI output parse failure** | Percentage of AI outputs that fail to parse | > 5% |

### Dead Letter Queues

When a workflow fails all retries, don't drop it silently. Send the failed execution to a dead letter queue for manual review:

```yaml
deadLetterQueue:
  enabled: true
  maxAge: 7d
  alertOn:
    - count > 10 in 1h
    - same_error > 5 in 30m
  includeContext:
    - workflow_definition
    - node_outputs
    - error_stack
    - input_data
```

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's execution engine implements these patterns natively. Each workflow run is tracked with full node-level state in Redis for speed and MongoDB for persistence. The <a href="/features/comprehensive-audit-trails">audit trail</a> captures every decision, retry, and routing event — so when something goes wrong, you can trace the exact sequence that led to the failure.</p>
</div>

## Graceful Degradation

When a component is unavailable, the workflow should degrade gracefully rather than fail entirely:

- **AI node down:** Fall back to rule-based classification using keyword matching. It's less accurate but keeps the pipeline moving.
- **Enrichment API down:** Skip enrichment and route with available data. Flag the item for re-enrichment when the service recovers.
- **CRM unavailable:** Queue the CRM update and proceed with other actions (notifications, email responses). Process the queue when the CRM is back.

The principle: don't let one broken component stop everything. Decouple where possible, queue what you can, and always prefer partial success over total failure.

## What's Next

With reliable pipelines in place, the next guide explores a specific type of AI automation: **AI code automation** — using agents to write, review, and deploy code changes within governed workflows.
