---
title: "MCP for Sales Intelligence"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "7 min"
permalink: /learn/apply/mcp-for-sales-teams/
metaTitle: "MCP for Sales Intelligence - AI-Powered CRM Access from Your Tools"
metaDescription: "How sales teams use the Model Context Protocol to query CRM data, review pipelines, and prep for calls — all from Claude Desktop, their IDE, or any MCP client."
author: "Outrun"
date: 2026-03-08
learnings:
  - "How MCP bridges AI tools and live business data"
  - "Five real-world use cases for MCP in sales workflows"
  - "How scoping controls keep data access secure and focused"
  - "When to use MCP queries vs full workflow automation"
prevArticle:
  title: "AI Audit Trails at Scale"
  url: /learn/apply/ai-audit-trails-scale/
nextArticle:
---

Your CRM has the data. Your AI tools have the reasoning. But they can't talk to each other — so you end up copy-pasting between browser tabs, exporting CSVs, and manually feeding context into Claude before every meeting.

MCP fixes this. With a single connection, your AI assistant can query your CRM data, check workflow statuses, and surface insights from your sales pipeline — all without leaving the tool you're already working in.

This guide covers practical use cases for MCP in sales operations, from quick lookups to complex cross-source analysis.

## The Gap MCP Closes

Most sales teams use Claude (or similar AI tools) for writing emails, summarising notes, and brainstorming strategy. But when you ask "What's the latest activity on the Acme deal?", Claude has no idea — it can't see your CRM.

The usual workarounds:

- Copy-paste the deal record into the chat
- Export a CSV from your CRM and upload it
- Manually describe the context before every question

All of these are slow, error-prone, and out of date the moment you paste them. MCP eliminates this friction. Once connected, your AI tool queries live data directly.

## Use Case 1: Pre-Call Prep

Before a sales call, ask Claude Desktop:

```
Give me a summary of all activity with Acme Corp in the last 30 days.
Include any open deals, recent emails, and the last person we spoke with.
```

Behind the scenes, Claude calls MCP tools to:
1. Query people records associated with Acme Corp (`list-objects` with org filter)
2. Pull recent activities — emails, calls, meetings (`execute-query`)
3. Check open deal status and pipeline stage (`execute-query`)

The result is a synthesised prep document — names, context, deal status, recent touchpoints — assembled from live data in seconds.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>MCP queries return live data, not a stale export. If someone updated the deal record five minutes ago, your prep document reflects that. This is fundamentally different from uploading a CSV or pasting notes.</p>
</div>

## Use Case 2: Pipeline Review

Weekly pipeline reviews usually involve opening your CRM dashboard, filtering by stage, sorting by last activity, and manually identifying stale deals. With MCP, ask conversationally:

```
Which deals in the negotiation stage haven't had any activity in the past 14 days?
```

Claude queries your deal records, filters by stage and activity date, and returns a focused list of at-risk opportunities. You can follow up:

```
For each of those, who's the primary contact and when was our last email exchange?
```

Claude chains additional tool calls to pull contact and activity data, building a complete picture without you navigating a single CRM screen.

## Use Case 3: Cross-Source Intelligence

If you have multiple data sources connected to Outrun — HubSpot for marketing, Salesforce for sales, Zendesk for support — MCP queries span all of them through Outrun's standardised data model.

```
Show me all interactions with Globex Corp across sales, marketing, and support
in the last quarter.
```

Because Outrun normalises data from all connected sources into a single object model (people, organizations, activities, relationships), this query works even when the data originates from three different systems. The AI model doesn't need to know which CRM each record came from.

## Use Case 4: Workflow Monitoring

Outrun workflows automate multi-step sales processes — lead qualification, email follow-ups, data enrichment. MCP lets you check on these without opening the Outrun dashboard:

```
What's the status of the lead qualification workflow? Show me the last 5 runs.
```

Claude calls `list-workflows` to find the workflow, then queries the run history. You can dig into failures:

```
The run that failed yesterday — what node failed and what was the error?
```

This is particularly useful for ops teams who manage workflows but spend most of their time in other tools. You get workflow visibility from wherever you already are.

## Use Case 5: Ad-Hoc Analysis

Sometimes you just need a quick number. MCP turns these into one-shot questions:

- "How many new contacts were added this week?"
- "What's the total deal value in the proposal stage?"
- "Which sources synced in the last 24 hours?"

Each of these triggers a single MCP tool call and returns in seconds. No dashboard navigation, no report building, no waiting for exports.

## Controlling Access with Scopes

MCP access isn't all-or-nothing. The OAuth consent screen lets you control exactly what the AI tool can see:

**Restrict by capability** — grant `action:query` for read-only access without `action:workflows` or `action:agents`. The AI can look up data but can't trigger workflows or create agents.

**Restrict by source** — if you have 5 integrations connected but only want the AI to see HubSpot data, select only the HubSpot source during consent.

**Restrict by object type** — grant access to `people` and `organizations` but not `activities`. Useful when you want account-level data without exposing email content or meeting notes.

These restrictions are enforced server-side. The AI tool never sees data outside its granted scopes, even if you ask for it explicitly.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Scope enforcement happens at two levels. Action scopes filter which tools are registered on the MCP server — restricted tools never appear in the client's tool list. Source and object scopes filter query results at runtime — the query executes normally, but results are filtered before being returned to the client. This means even a maliciously crafted GraphQL query can't bypass the scope restrictions.</p>
</div>

## MCP vs Workflow Automation

MCP and workflows solve different problems:

| | MCP | Workflows |
|---|---|---|
| **Trigger** | You ask a question | Event, schedule, or webhook |
| **Execution** | On-demand, conversational | Automated, continuous |
| **Use case** | Lookup, analysis, exploration | Processing, routing, action |
| **Example** | "What deals are at risk?" | Auto-qualify every new lead |

They complement each other. Use MCP for ad-hoc intelligence and investigation. Use workflows for repeatable, automated processes. Use both together: ask Claude via MCP to check on a workflow's performance, then use the insights to tune the workflow's logic.

## Getting Started

The setup takes about two minutes:

1. Add the MCP server URL to your AI client's configuration (see the [setup guide](/learn/build/setting-up-mcp/))
2. Approve the scopes you want on the OAuth consent screen
3. Start asking questions

No API keys to generate, no tokens to copy, no packages to install.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Connect Claude Desktop to your Outrun workspace and try one of the queries above. If you don't have data yet, connect a CRM source first — the MCP server works with any data that's been synced into your workspace. See the <a href="/docs/ai/model-context-protocol/">MCP documentation</a> for the full tool reference.</p>
</div>
