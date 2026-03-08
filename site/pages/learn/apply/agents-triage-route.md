---
title: "How Agents Triage and Route"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "9 min"
permalink: /learn/apply/agents-triage-route/
metaTitle: "How Agents Triage and Route - Technical Guide"
metaDescription: "Understand how AI agents triage inbound work, classify intent, and route tasks to the right destination using structured decision frameworks."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How AI agents differ from simple workflow conditionals"
  - "The triage-classify-route pattern for inbound work processing"
  - "Designing routing rules that balance automation with human oversight"
  - "How to structure agent prompts for reliable triage decisions"
crossTrackUrl: /learn/apply/ai-email-triage/
crossTrackTitle: "AI Email Triage"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "Conditional Logic in Workflows"
  url: /learn/apply/conditional-logic-workflows/
nextArticle:
  title: "Building Reliable AI Pipelines"
  url: /learn/apply/reliable-ai-pipelines/
---

Simple conditional nodes route based on rules you define in advance. AI agents do something fundamentally different: they reason about context, weigh multiple factors, and make routing decisions that you couldn't have hard-coded. This guide covers the architecture behind agent-based triage and routing, with patterns you can implement in production.

## Agents vs. Conditional Nodes

A conditional node evaluates fixed rules against a known output: if the score is above 80, go left; otherwise, go right. The rules are explicit and deterministic.

An agent applies reasoning to unstructured input. Given an email, a GitHub issue, or a Slack message, the agent reads the content, considers the context (who sent it, what's the history, what's the urgency), and decides what to do — potentially choosing from actions that weren't pre-defined in a branching tree.

| Capability | Conditional Node | AI Agent |
|------------|-----------------|----------|
| Input type | Structured (JSON fields) | Unstructured (text, mixed) |
| Decision logic | Pre-defined rules | Contextual reasoning |
| Output flexibility | Fixed set of branches | Dynamic action selection |
| Learning | Static until edited | Adapts with prompt refinement |
| Auditability | Rule trace | Reasoning trace |

The tradeoff is control vs. flexibility. Conditional nodes are predictable but rigid. Agents are flexible but require more careful design to keep reliable.

## The Triage-Classify-Route Pattern

The foundational pattern for agent-based inbound processing has three stages:

### Stage 1: Triage

The agent receives raw input and performs initial assessment. Is this actionable? Is it urgent? Is it something we handle?

{% raw %}
```yaml
triage:
  prompt: |
    You are an inbound work triage agent. Assess this incoming item:

    Source: {{source.type}}
    From: {{source.sender}}
    Content: {{source.body}}

    Determine:
    1. Is this actionable? (yes/no)
    2. Urgency: critical / high / normal / low
    3. Is this within scope of our automated handling? (yes/no)

    Return JSON:
    {
      "actionable": true/false,
      "urgency": "critical|high|normal|low",
      "in_scope": true/false,
      "summary": "one-line summary"
    }
```
{% endraw %}

The triage stage is a filter. It reduces the volume of items that need deeper processing. Non-actionable items (out-of-office replies, spam, marketing emails) are logged and dismissed early.

### Stage 2: Classify

Items that pass triage get deeper analysis. The agent classifies the intent, identifies entities, and extracts structured data.

{% raw %}
```yaml
classify:
  prompt: |
    Classify this inbound item in detail.

    Context:
    - Triage summary: {{triage.output.summary}}
    - Full content: {{source.body}}
    - Sender history: {{lookup.sender_history}}

    Return JSON:
    {
      "intent": "purchase_inquiry|support_issue|feature_request|partnership|escalation|other",
      "entities": {
        "company": "extracted company name or null",
        "product": "mentioned product or null",
        "deal_id": "referenced deal or null"
      },
      "sentiment": "positive|neutral|negative|urgent",
      "requires_human": true/false,
      "classification_confidence": 0.0-1.0
    }
```
{% endraw %}

Notice the classification stage uses context from the triage stage. It also pulls in external data — sender history from the CRM — to make a more informed decision. This is what separates agent reasoning from simple rule evaluation.

### Stage 3: Route

Based on the classification, the agent routes the item to the appropriate handler. This can be a workflow, a team, a specific person, or another agent.

{% raw %}
```yaml
route:
  rules:
    - condition: "intent == 'purchase_inquiry' AND urgency in ['critical', 'high']"
      action: assign_to_senior_rep
      notify: sales-urgent channel

    - condition: "intent == 'support_issue' AND requires_human == true"
      action: create_support_ticket
      priority: "{{urgency}}"

    - condition: "intent == 'feature_request'"
      action: log_to_product_board
      notify: product-team channel

    - condition: "classification_confidence < 0.7"
      action: route_to_human_review
      include_reasoning: true

    - default:
      action: standard_processing_queue
```
{% endraw %}

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The triage-classify-route pattern maps to a three-node sequence in a DAG: the triage node runs first, passes its output to the classify node, which passes its structured output to a conditional routing node. The key architectural decision is whether the classify node makes a single AI call or fans out to multiple specialised classifiers. For high-volume systems, a lightweight triage model filters first, and only items that pass triage go through the more expensive classification step.</p>
</div>

## Designing Agent Prompts for Triage

The quality of triage depends on prompt design. Here are the principles that make triage prompts reliable:

### Be Explicit About the Output Contract

Never let the agent decide what format to use. Specify the exact JSON schema, field names, and allowed values. If the agent returns free-text where you expected an enum, your downstream routing breaks.

### Provide Decision Criteria, Not Just Categories

Bad: "Classify this as urgent or not urgent."

Good: "Classify urgency based on these criteria:
- **Critical:** Revenue at risk, customer threatening to churn, SLA breach imminent
- **High:** Active deal with timeline pressure, executive-level communication
- **Normal:** Standard inquiry, no time pressure mentioned
- **Low:** Informational only, no action expected"

### Include Examples

Few-shot examples in the prompt dramatically improve consistency:

```
Example 1:
Input: "We need to finalize the contract by Friday or we're going with CompetitorX"
Output: { "urgency": "critical", "intent": "purchase_inquiry", "sentiment": "urgent" }

Example 2:
Input: "Just checking in on the status of our integration request"
Output: { "urgency": "normal", "intent": "support_issue", "sentiment": "neutral" }
```

### Define the Boundary of Autonomy

Tell the agent exactly what it can and cannot decide autonomously:

```
You may automatically route to:
- Standard processing queue
- Feature request log
- Spam filter

You must route to human review when:
- The sender is a C-level executive
- The item involves legal or compliance topics
- Your confidence in classification is below 0.7
- The item references an active deal worth more than $50,000
```

## Routing Architecture

At scale, routing is not just "send to the right queue." It involves several sub-decisions:

### Priority Assignment

The agent assigns priority based on urgency, sender importance, deal value, and SLA requirements. This priority determines queue position and response time targets.

### Load Balancing

If multiple reps or teams can handle the item, the routing layer considers current workload, expertise match, and availability. A round-robin assignment is simple but suboptimal — skill-based routing produces better outcomes.

### Escalation Paths

Every routing decision needs an escalation path. If the assigned handler doesn't act within the SLA window, the item escalates automatically. Define these paths explicitly:

```yaml
escalation:
  - after: 30m
    action: notify_handler
    message: "Pending item requires attention"
  - after: 2h
    action: reassign_to_team_lead
  - after: 4h
    action: escalate_to_manager
    priority: critical
```

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <a href="/features/ai-agents">AI Agents</a> implement the triage-classify-route pattern natively. Agents monitor your connected tools — email, GitHub, CRM — and process inbound items through configurable triage rules. Pair agents with the <a href="/features/ai-workflow-builder">AI Workflow Builder</a> to define routing rules visually and connect to any downstream action.</p>
</div>

## Handling Ambiguity

Real-world input is messy. An email might contain both a support question and a purchase inquiry. A GitHub issue might be a bug report, a feature request, and a complaint simultaneously.

Agents handle ambiguity through several strategies:

**Multi-label classification.** Instead of picking one intent, the agent returns multiple intents with confidence scores. The routing layer processes the highest-confidence intent or triggers parallel paths for each.

**Decomposition.** The agent splits a complex item into sub-items, each routed independently. A single email becomes two tickets: one for support, one for the sales follow-up.

**Clarification routing.** When the agent cannot confidently classify, it routes to a human with specific questions: "This appears to be about both a billing issue and a feature request. Which should we prioritise?"

## Measuring Triage Quality

Track these metrics to evaluate and improve your triage agent:

| Metric | Target | Description |
|--------|--------|-------------|
| **Accuracy** | >90% | Percentage of items classified correctly |
| **Default rate** | <10% | Percentage of items hitting the default branch |
| **Human escalation rate** | <20% | Percentage requiring human intervention |
| **Processing time** | <5s | Time from receipt to routing decision |
| **False urgent rate** | <5% | Items marked critical that weren't |

Review items that hit the default branch weekly. Each one is a signal that your classification categories or prompt need refinement.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>The triage-classify-route pattern gives AI agents a structured framework for handling inbound work. Triage filters noise, classification extracts intent and context, and routing delivers items to the right handler with the right priority. The key to reliability is constraining the agent's output format, providing explicit decision criteria, and always defining what triggers human escalation.</p>
</div>

## What's Next

Triage and routing get work to the right place. The next guide covers how to make the entire pipeline **reliable** — handling failures, retries, timeouts, and the operational patterns that keep AI workflows running in production.
