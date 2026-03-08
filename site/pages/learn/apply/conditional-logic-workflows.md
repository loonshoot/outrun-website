---
title: "Conditional Logic in Workflows"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "8 min"
permalink: /learn/apply/conditional-logic-workflows/
metaTitle: "Conditional Logic in Workflows - Technical Guide"
metaDescription: "Master conditional branching in AI workflows, from simple if/else routing to complex multi-path logic with fallbacks and default handling."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How to structure conditional nodes for AI-driven decisions"
  - "Patterns for handling uncertain or unexpected AI outputs"
  - "Strategies for multi-path branching with convergence"
  - "How to test and debug conditional workflows before deployment"
crossTrackUrl: /learn/apply/5-processes-to-automate/
crossTrackTitle: "5 Processes to Automate with AI"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "AI Workflow Patterns"
  url: /learn/apply/ai-workflow-patterns/
nextArticle:
  title: "How Agents Triage and Route"
  url: /learn/apply/agents-triage-route/
---

Conditional logic is where AI workflows become genuinely useful. Without branching, you have a straight pipe. With it, you have a system that makes decisions, routes work, and handles edge cases — the same things a human operator would do, but at machine speed.

This guide covers how to implement conditional logic in AI workflows, from simple binary branches to complex multi-path routing with fallback handling.

## The Anatomy of a Conditional Node

A conditional node sits between an upstream decision (usually an AI node) and multiple downstream paths. It evaluates a condition against the output of a previous node and routes execution accordingly.

{% raw %}
```json
{
  "id": "route-by-intent",
  "type": "conditional",
  "config": {
    "input": "{{classify-email.output.intent}}",
    "conditions": [
      {
        "operator": "equals",
        "value": "purchase_inquiry",
        "targetNode": "sales-fast-track"
      },
      {
        "operator": "equals",
        "value": "support_request",
        "targetNode": "support-queue"
      },
      {
        "operator": "equals",
        "value": "partnership",
        "targetNode": "partnerships-review"
      }
    ],
    "defaultTarget": "general-inbox"
  }
}
```
{% endraw %}

The structure is deliberate: explicit conditions with a mandatory default. The default target is not optional — it is the most important part of the node.

## Why Defaults Are Non-Negotiable

AI outputs are probabilistic. When you ask an LLM to classify an email into four categories, it might return a fifth category you didn't anticipate. It might return a misspelled category. It might return a full sentence instead of a single word.

Without a default branch, that unexpected output causes a dead end. The workflow stops, the email sits unprocessed, and nobody knows until someone notices the queue backing up.

**Rule of thumb:** Design your default branch to handle the case gracefully, not just catch errors. Route to a human review queue, log the unexpected output for analysis, or apply a safe fallback action.

{% raw %}
```yaml
defaultTarget: human-review
defaultAction:
  - log:
      level: warn
      message: "Unexpected classification output: {{classify-email.output.intent}}"
  - notify:
      channel: ops-alerts
      message: "Manual review needed for email {{source.id}}"
```
{% endraw %}

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Every conditional node needs a default branch. In AI-powered workflows, unexpected outputs are not edge cases — they are guaranteed to happen. Your default path should handle them gracefully, not just log and drop.</p>
</div>

## Condition Types

Beyond simple equality checks, workflow engines support several condition operators. Here are the ones you will use most:

| Operator | Use Case | Example |
|----------|----------|---------|
| `equals` | Exact match on classification | `intent == "purchase"` |
| `contains` | Partial match on text output | `summary contains "urgent"` |
| `greater_than` | Numeric thresholds | `score > 80` |
| `in` | Match against a set | `category in ["hot", "warm"]` |
| `matches` | Regex pattern matching | `output matches "^(yes\|no)$"` |
| `exists` | Check if a field is present | `enrichment.company exists` |

### Combining Conditions

For complex routing, you can combine conditions with AND/OR logic:

```json
{
  "conditions": [
    {
      "all": [
        { "field": "score", "operator": "greater_than", "value": 75 },
        { "field": "company_size", "operator": "greater_than", "value": 50 }
      ],
      "targetNode": "enterprise-fast-track"
    },
    {
      "any": [
        { "field": "intent", "operator": "equals", "value": "demo_request" },
        { "field": "intent", "operator": "equals", "value": "pricing_inquiry" }
      ],
      "targetNode": "sales-response"
    }
  ]
}
```

Conditions are evaluated top-to-bottom. The first match wins. This ordering matters — place your most specific conditions first and your broadest conditions last.

## Structuring AI Outputs for Reliable Branching

The reliability of your conditional logic depends entirely on how well you structure the AI node upstream. Vague prompts produce vague outputs, which make branching fragile.

### Bad: Open-Ended Classification

```
Classify this email.
```

The AI might return "This appears to be a sales inquiry from a mid-market company" — useful for a human, useless for a conditional node.

### Good: Constrained Output

```
Classify this email into exactly one of these categories:
- purchase_inquiry
- support_request
- partnership
- internal
- spam

Return ONLY the category name, nothing else.
```

### Better: Structured JSON Output

```
Analyse this email and return a JSON object:
{
  "intent": "purchase_inquiry | support_request | partnership | internal | spam",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation"
}
```

The structured output gives you the classification for branching, a confidence score for threshold-based routing, and a reasoning field for audit trails.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>When using structured JSON output from AI nodes, parse the JSON in a code node immediately after the AI node. This isolates parsing failures from classification failures. If the AI returns malformed JSON, the code node catches it and routes to the default branch — rather than crashing the conditional node downstream.</p>
</div>

## Multi-Path Branching with Convergence

Not every branch needs to stay separate forever. Often, multiple paths converge back to a common step — like sending a confirmation email or updating an audit log regardless of which branch was taken.

```
                ┌── [Sales Fast Track] ──┐
[Classify] ────├── [Support Queue]      ├──── [Log to Audit Trail]
                └── [General Inbox]  ────┘
```

The convergence node (Log to Audit Trail) waits for whichever branch executed. In a DAG engine, this is handled by marking the convergence node as dependent on all possible upstream paths. The engine tracks which path was actually taken and fires the convergence node once that path completes.

**Important subtlety:** If a branch is skipped (because the condition didn't match), the convergence node needs to know. The engine must distinguish between "this parent hasn't finished yet" and "this parent was skipped." Otherwise, convergence nodes wait forever for branches that will never execute.

## Confidence-Based Routing

One of the most powerful patterns combines AI confidence scores with conditional thresholds:

```yaml
conditions:
  - when: "confidence >= 0.9"
    action: auto-process
    # High confidence: take action automatically

  - when: "confidence >= 0.6 AND confidence < 0.9"
    action: suggest-and-wait
    # Medium confidence: suggest action, wait for human approval

  - when: "confidence < 0.6"
    action: human-review
    # Low confidence: route to human entirely
```

This creates a graduated automation model. High-confidence decisions are fully automated. Medium-confidence decisions get AI suggestions with human oversight. Low-confidence decisions go to humans directly. Over time, as your prompts improve and your training data grows, more decisions move into the high-confidence tier.

## Testing Conditional Workflows

Conditional logic multiplies your test surface. Each branch is a separate code path that needs validation. Here is a practical testing approach:

1. **Map every path.** Draw out every possible route through your conditional nodes, including the default branch.
2. **Create test inputs for each path.** For an email classifier with 4 categories plus a default, you need at minimum 5 test inputs.
3. **Test the boundary cases.** What happens when confidence is exactly 0.6? When the AI returns an empty string? When the upstream node times out?
4. **Run in dry-run mode.** Execute the workflow with logging enabled but actions disabled. Verify the routing decisions without actually sending emails or updating CRMs.

```javascript
// Example test harness for conditional node
const testCases = [
  { input: { intent: "purchase_inquiry" }, expectedTarget: "sales-fast-track" },
  { input: { intent: "support_request" }, expectedTarget: "support-queue" },
  { input: { intent: "PURCHASE_INQUIRY" }, expectedTarget: "general-inbox" }, // case sensitivity!
  { input: { intent: "" }, expectedTarget: "general-inbox" },
  { input: {}, expectedTarget: "general-inbox" }, // missing field
];
```

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <a href="/features/ai-workflow-builder">AI Workflow Builder</a> includes conditional nodes with visual branch mapping. You can see every path in the workflow graph, test individual branches with sample data, and inspect the decision log to understand why each routing decision was made. The execution engine handles skipped-branch propagation and convergence automatically.</p>
</div>

## Common Mistakes

**Overlapping conditions.** If two conditions can both match the same input, the first one wins. Make sure this is intentional, not accidental.

**Case sensitivity.** AI outputs might return "Purchase" or "purchase" or "PURCHASE." Normalise the output in a code node before branching.

**Missing null checks.** If the upstream AI node fails or times out, the conditional node receives null. Your conditions should handle this explicitly rather than falling through to an unexpected branch.

**Too many branches.** If your conditional node has more than 5-6 paths, consider restructuring. Use nested conditionals or a lookup table pattern instead.

## What's Next

Conditional logic lets workflows make decisions. The next guide explores how **AI agents** use triage and routing patterns to handle complex, multi-step decision-making autonomously — going beyond simple branch logic to contextual reasoning.
