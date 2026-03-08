---
title: "Configuring AI Agents"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "10 min"
permalink: /learn/build/configuring-ai-agents
metaTitle: "Configuring AI Agents - Technical Walkthrough"
metaDescription: "Learn how to configure autonomous AI agents in Outrun — from agent types and triggers to guardrails, escalation rules, and production deployment."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How AI agents differ from workflows"
  - "How to configure agent types, triggers, and actions"
  - "How to set guardrails and escalation rules"
  - "How to deploy agents to production with monitoring"
crossTrackUrl: /learn/build/connecting-your-crm/
crossTrackTitle: "Connecting Your CRM"
crossTrackLabel: "Want the business overview?"
prevArticle:
  title: "Building Your First Workflow"
  url: /learn/build/building-first-workflow/
nextArticle:
  title: "GitHub Automation with AI"
  url: /learn/build/github-automation-ai/
---

Workflows execute when triggered. Agents are different — they run continuously, monitoring your connected tools and deciding when and how to act. An agent watches for events, triages them, and takes autonomous action based on rules you define.

This guide covers the full configuration process: creating an agent, defining its scope, wiring up triggers and actions, setting guardrails, and deploying it to production.

## Agents vs Workflows

Before diving into configuration, understand when to use each:

| | Workflow | Agent |
|---|---|---|
| **Activation** | Triggered by webhook, schedule, or event | Always running, monitors for events |
| **Logic** | Fixed DAG — same path every time | Dynamic — AI decides the path |
| **Best for** | Predictable, repeatable processes | Triage, routing, and context-dependent decisions |
| **Example** | "When a form is submitted, enrich and route" | "Watch all inbound emails and decide what to do with each one" |

Agents use Claude under the hood to make decisions. They read context, reason about it, and choose from a set of actions you define. The AI doesn't go rogue — it operates within boundaries you configure.

## Step 1: Create an Agent

Navigate to **AI > New Agent** in your workspace. You'll configure four sections:

1. **Identity** — name, description, agent type
2. **Triggers** — what events the agent monitors
3. **Actions** — what the agent can do
4. **Guardrails** — limits and escalation rules

### Agent Identity

```json
{
  "name": "Inbound Email Triage",
  "description": "Monitors incoming emails, classifies intent, and routes to the appropriate team or workflow.",
  "agentType": "email"
}
```

The `agentType` determines which event streams the agent monitors. Available types:

| Agent Type | Monitors | Events |
|---|---|---|
| `email` | Connected email accounts | New emails, replies, forwards |
| `github` | GitHub App installations | Issues, PRs, comments, pushes |
| `crm` | CRM webhooks | Record changes, deal updates |
| `custom` | Custom webhook endpoints | Any JSON payload |

## Step 2: Configure Triggers

Triggers define which events the agent pays attention to. Not every event is relevant — filters narrow the stream.

```json
{
  "triggers": [
    {
      "type": "email",
      "filters": {
        "direction": "inbound",
        "excludeSenders": ["noreply@*", "newsletter@*"],
        "includeMailboxes": ["sales@", "support@"]
      }
    }
  ]
}
```

Trigger filters run *before* the AI processes the event — they're cheap, deterministic checks. Use them aggressively to avoid burning AI tokens on irrelevant events.

### GitHub Agent Triggers

For a GitHub agent, triggers look different:

```json
{
  "triggers": [
    {
      "triggerType": "github",
      "filters": {
        "events": ["issues.opened", "issues.labeled"],
        "repositories": ["acme/api", "acme/frontend"],
        "labels": ["bug", "enhancement"]
      }
    }
  ]
}
```

The agent only activates for matching events. The `triggerType` field maps to the webhook event categories the GitHub App receives.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Agent trigger events flow through the <strong>stream service</strong>, which validates incoming webhooks (e.g., HMAC signature verification for GitHub), checks the <code>agents</code> collection for active agents matching the event, and creates a <code>botJobs</code> document in the workspace database. The dispatcher then provisions execution — either in a Docker container for code-heavy agents or inline for lightweight triage.</p>
</div>

## Step 3: Define Available Actions

Actions are what the agent *can* do. You define the full set — the AI chooses which actions to take for each event based on context.

```json
{
  "actions": [
    {
      "name": "route_to_sales",
      "description": "Forward to the sales team with a summary",
      "provider": "email",
      "operation": "forward",
      "params": {
        "to": "sales-team@company.com",
        "addSummary": true
      }
    },
    {
      "name": "create_crm_lead",
      "description": "Create a new lead in Salesforce from the email",
      "provider": "salesforce",
      "operation": "salesforce.create_lead"
    },
    {
      "name": "auto_reply",
      "description": "Send an acknowledgement with estimated response time",
      "provider": "email",
      "operation": "reply",
      "params": {
        "template": "auto_acknowledge"
      }
    },
    {
      "name": "escalate",
      "description": "Flag for immediate human review",
      "provider": "internal",
      "operation": "escalate"
    }
  ]
}
```

Each action has a `name` (referenced in guardrails), a human-readable `description` (which Claude reads to understand when to use it), and the provider/operation configuration for execution.

### Writing Good Action Descriptions

The `description` field is critical — it's part of the prompt that Claude sees when deciding what to do. Write clear, specific descriptions:

- **Good:** "Create a high-priority support ticket when the customer reports a service outage"
- **Bad:** "Create ticket"

The more context you give the AI about *when* to use an action, the better its decisions will be.

## Step 4: Set Guardrails

Guardrails are non-negotiable constraints. They override AI decisions to prevent unwanted outcomes.

```json
{
  "guardrails": {
    "maxActionsPerEvent": 3,
    "requireApproval": {
      "actions": ["auto_reply"],
      "threshold": "low_confidence"
    },
    "blockedPatterns": [
      "never forward emails from @competitor.com",
      "never create leads for existing customers"
    ],
    "escalationRules": [
      {
        "condition": "sentiment == 'angry' && customer_tier == 'enterprise'",
        "action": "escalate",
        "notify": ["account-manager@company.com"]
      }
    ],
    "rateLimits": {
      "auto_reply": {
        "max": 50,
        "window": "1h"
      }
    }
  }
}
```

### Guardrail Types

**Max actions per event** — prevents the agent from chaining too many actions on a single event. Start with 2-3 and increase as you build confidence.

**Approval gates** — require human approval before certain actions execute. Set a confidence threshold so high-confidence decisions go through automatically while uncertain ones pause for review.

**Blocked patterns** — hard rules that override AI judgement. Use plain English — the AI evaluates these as additional constraints.

**Escalation rules** — conditions that always route to a human. Combine data fields with operators for deterministic escalation.

**Rate limits** — cap how often an action can fire within a time window. Essential for actions that send external communications.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Start restrictive and loosen over time. Deploy agents with <code>requireApproval</code> on all external actions, monitor for a week, then selectively remove approval gates on actions the agent consistently gets right. This is the fastest path to trust without risk.</p>
</div>

## Step 5: Configure the Agent Prompt

Every agent has a system prompt that defines its persona and decision-making framework. This is separate from individual action descriptions — it sets the overall behaviour:

```text
You are an email triage agent for a B2B SaaS company.

Your job is to read every inbound email and take the appropriate action:
- Sales inquiries → route to sales team and create a CRM lead
- Support issues → create a support ticket with severity classification
- Partner/vendor outreach → route to partnerships team
- Spam or irrelevant → archive with no action

Always include a one-sentence summary of the email's intent when routing.
Never reply to emails from domains you don't recognise.
When in doubt, escalate rather than guess.
```

Keep the prompt focused on decision-making logic, not technical implementation. The agent knows how to execute actions — it needs guidance on *when* to choose each one.

## Step 6: Deploy and Monitor

Toggle the agent to **Active**. It will immediately begin monitoring the configured event streams.

### Monitoring Checklist

In the first 48 hours, check these daily:

1. **Decision log** — review what the agent decided for each event and why. Every decision is recorded with the AI's reasoning, the action taken, and the confidence score.

2. **Approval queue** — if you configured approval gates, check the queue regularly. Stale approvals block the agent from completing work.

3. **Error rate** — watch for action failures (auth errors, rate limits, invalid data). A spike usually indicates a configuration issue, not an AI issue.

4. **False positive rate** — how often does the agent take an action that a human would not have? If it's above 5%, tighten your guardrails or improve your prompt.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun ships with pre-built agent templates for <a href="/features/ai-email-intelligence">email triage</a>, <a href="/features/ai-code-automation">GitHub automation</a>, and vendor monitoring. Each template comes with sensible guardrails that you can customise for your team. Visit the <a href="/features/ai-agents">AI Agents</a> feature page to see the full template library.</p>
</div>

## Production Patterns

### Shadow Mode

Before going fully autonomous, run the agent in **shadow mode**: it processes every event and logs what it *would* do, but doesn't execute any actions. Review the shadow log after a few days to validate decisions before enabling execution.

### Gradual Rollout

Start with a narrow scope (one mailbox, one repository) and expand after validating. It's far easier to debug an agent that handles 20 events per day than one that handles 2,000.

### Feedback Loops

When a human overrides an agent decision, that override is logged. Periodically review overrides to identify patterns — they reveal gaps in your prompt or guardrails that you can address with configuration changes rather than hoping the AI "learns."

## What's Next

You now know how to build and deploy autonomous AI agents. The next guide focuses on a specific, high-impact agent type: **GitHub automation with AI** — agents that read issues, write code, create pull requests, and manage your development workflow.
