---
title: "AI Workflow Patterns"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "10 min"
permalink: /learn/apply/ai-workflow-patterns/
metaTitle: "AI Workflow Patterns - Technical Guide"
metaDescription: "Learn the core architectural patterns for building AI-powered workflows, from sequential pipelines to fan-out DAGs and event-driven automation."
author: "Outrun"
date: 2026-02-15
learnings:
  - "The four foundational AI workflow patterns and when to use each"
  - "How DAG-based execution enables complex multi-step automation"
  - "Strategies for combining patterns into production-grade pipelines"
  - "How to model real sales processes as executable workflow graphs"
crossTrackUrl: /learn/apply/ai-transforming-sales/
crossTrackTitle: "How AI is Transforming Sales"
crossTrackLabel: "Want the business perspective?"
prevArticle:
nextArticle:
  title: "Conditional Logic in Workflows"
  url: /learn/apply/conditional-logic-workflows/
---

When you move past simple automations — "if this, then that" — you need structured patterns to keep AI workflows maintainable, debuggable, and reliable. This guide covers the four foundational patterns you'll use to build production AI automation, with concrete examples from sales and operations contexts.

## Why Patterns Matter for AI Workflows

AI introduces non-determinism into your pipelines. A traditional automation always produces the same output for the same input. An AI node might classify the same email differently depending on context, phrasing, or model updates. That means your workflow architecture needs to account for variability, retries, and branching logic from the start.

Without patterns, you end up with spaghetti: a tangle of one-off automations that break silently and can't be reasoned about. Patterns give you composable building blocks.

## Pattern 1: Sequential Pipeline

The simplest pattern. Data flows through a series of nodes in order, each transforming or enriching the output before passing it downstream.

{% raw %}
```yaml
nodes:
  - id: source-email
    type: source
    config:
      provider: gmail
      trigger: new_email

  - id: classify
    type: ai
    config:
      prompt: "Classify this email as: lead, support, vendor, internal"
      input: "{{source-email.body}}"

  - id: enrich
    type: action
    config:
      provider: clearbit
      action: enrich_company
      input: "{{source-email.from_domain}}"

  - id: update-crm
    type: destination
    config:
      provider: salesforce
      object: Lead
      mapping:
        email: "{{source-email.from}}"
        category: "{{classify.output}}"
        company_data: "{{enrich.output}}"
```
{% endraw %}

**When to use it:** Linear processes where each step depends on the previous one. Email processing, data enrichment pipelines, sequential approval flows.

**Watch out for:** Long chains create latency. If step 5 of 8 fails, you need to decide whether to retry the whole chain or resume from the failure point.

## Pattern 2: Fan-Out / Fan-In

A single input triggers multiple parallel operations, and the results are collected before proceeding. This is the pattern for when you need to do several things at once.

```
                    ┌── [Enrich Company] ──┐
[New Lead] ────────├── [Score Lead]       ├──── [Route to Rep]
                    └── [Check Duplicates] ──┘
```

The source node emits a new lead. Three nodes execute in parallel: company enrichment, lead scoring, and duplicate detection. Once all three complete, the routing node has full context to make its decision.

**When to use it:** When multiple independent operations need to happen before a decision point. Lead processing, multi-source data aggregation, parallel API calls.

**Implementation detail:** The execution engine uses topological sorting to determine which nodes can run concurrently. Nodes with no dependency between them are scheduled in parallel, and a convergence node waits for all upstream parents to complete before executing.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>In a DAG-based engine, fan-in is handled by tracking parent completion counts. A convergence node stores <code>waitingFor: [parentA, parentB, parentC]</code>. Each time a parent completes, it decrements the counter. When the counter hits zero, the convergence node fires. This is stored in Redis for speed, with MongoDB as the durable backing store.</p>
</div>

## Pattern 3: Conditional Branching

AI decisions create branches. Based on the output of a classification or scoring node, the workflow takes different paths.

{% raw %}
```yaml
nodes:
  - id: triage
    type: ai
    config:
      prompt: "Classify this inbound message. Return one of: hot_lead, warm_lead, support_request, spam"

  - id: branch
    type: conditional
    config:
      conditions:
        - when: "{{triage.output}} == 'hot_lead'"
          goto: fast-track
        - when: "{{triage.output}} == 'support_request'"
          goto: route-support
        - default: standard-nurture
```
{% endraw %}

**When to use it:** Anywhere AI makes a decision that affects downstream behaviour. Email triage, lead scoring thresholds, approval routing, anomaly detection.

**Key consideration:** Always define a default branch. AI outputs can be unpredictable — a classification prompt might return a value you didn't anticipate. The default branch is your safety net.

## Pattern 4: Event-Driven Reactive

Instead of a linear trigger, the workflow listens for events and reacts. Multiple entry points, potentially overlapping execution windows, and state that persists across events.

```
[GitHub Issue Created] ──► [Triage Agent] ──► [Route + Assign]
[GitHub PR Opened]     ──► [Review Agent] ──► [Comment + Label]
[Slack Message]        ──► [Parse Intent] ──► [Create Issue / Update PR]
```

Each event type triggers its own sub-workflow, but they share context through a common data store. An issue creation might trigger triage, which creates a branch, which triggers the PR review workflow when the PR is opened.

**When to use it:** Multi-channel automation where actions in one system cascade to others. Developer operations, customer support across channels, multi-tool sales processes.

## Composing Patterns

Real workflows combine these patterns. A typical sales automation might look like:

1. **Event-driven trigger** — new email arrives
2. **Sequential pipeline** — extract sender, parse body, check history
3. **Conditional branch** — AI classifies intent
4. **Fan-out** — parallel enrichment (company data, contact history, deal stage)
5. **Fan-in** — merge enriched data
6. **Conditional branch** — route based on combined score
7. **Sequential pipeline** — execute the chosen action (create lead, update deal, draft reply)

This composition is what makes DAG-based workflow engines powerful. Each node is a discrete unit with defined inputs and outputs. The graph structure handles ordering, parallelism, and branching.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <a href="/features/ai-workflow-builder">AI Workflow Builder</a> lets you visually compose these patterns using drag-and-drop nodes. Source, AI, Action, Conditional, Code, and Destination nodes map directly to the patterns above. The execution engine handles topological sorting, parallel scheduling, and state management automatically.</p>
</div>

## Modelling Real Processes as Graphs

When translating a business process into a workflow graph, follow this approach:

1. **Identify the trigger.** What event starts this process? An email, a webhook, a schedule, a CRM change?
2. **Map the decisions.** Where does a human (or AI) currently make a choice? Each decision becomes a conditional node.
3. **Find the parallelism.** Which steps are truly independent? These become fan-out branches.
4. **Define the outputs.** What actions need to happen at the end? CRM updates, email sends, Slack notifications, API calls?
5. **Add the safety nets.** Error handling, default branches, timeout policies, retry limits.

### Example: Inbound Lead Processing

Here is a real-world example modelled as a workflow graph:

| Step | Node Type | Description |
|------|-----------|-------------|
| 1 | Source | New form submission webhook |
| 2 | AI | Classify lead quality (hot/warm/cold) |
| 3 | Action | Enrich with company data |
| 4 | Action | Check CRM for existing contact |
| 5 | Conditional | Branch on quality + existing contact |
| 6a | Action | Hot + new: Create lead, assign to senior rep, send alert |
| 6b | Action | Hot + existing: Update deal, notify account owner |
| 6c | Destination | Warm: Add to nurture sequence |
| 6d | Action | Cold: Log and archive |

Steps 3 and 4 run in parallel (fan-out). Step 5 waits for both (fan-in) before branching.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>The four patterns — sequential pipeline, fan-out/fan-in, conditional branching, and event-driven reactive — are composable building blocks. Master them individually, then combine them to model any business process as an executable graph. Start with the simplest pattern that fits your use case and add complexity only when the process demands it.</p>
</div>

## What's Next

Now that you understand the core workflow patterns, the next guide dives into **conditional logic** — how to write branching rules, handle edge cases, and make AI-driven decisions reliable inside your workflows.
