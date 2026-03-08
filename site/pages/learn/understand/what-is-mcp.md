---
title: "What is MCP?"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "8 min"
permalink: /learn/understand/what-is-mcp/
metaTitle: "What is MCP? Model Context Protocol - Technical Guide"
metaDescription: "Understand the Model Context Protocol (MCP), the open standard that gives AI models a structured way to interact with external tools, data sources, and APIs."
author: "Outrun"
date: 2026-02-15
learnings:
  - "What MCP is and the problem it solves"
  - "The client-server architecture of MCP"
  - "How tools, resources, and prompts work in the protocol"
  - "Why MCP matters for building production AI systems"
prevArticle:
  title: "Neural Networks Explained"
  url: /learn/understand/neural-networks/
nextArticle:
  title: "Prompt Engineering Patterns"
  url: /learn/understand/prompt-engineering/
---

An LLM on its own can reason about text. But to be genuinely useful in production, it needs to interact with the outside world -- read from databases, call APIs, trigger workflows, access files. The Model Context Protocol (MCP) is an open standard that provides a structured way for AI models to do exactly that.

Think of MCP as the USB-C of AI integrations. Before USB-C, every device had its own proprietary connector. MCP provides a single, standardised protocol for connecting AI models to any external system.

## The Problem MCP Solves

Without MCP, every AI integration is custom-built. If your LLM needs to read from Salesforce, you build a Salesforce connector. If it needs to query your database, you build a database connector. Each connector has its own authentication, data format, error handling, and security model.

This creates an N x M integration problem:

```
Without MCP:                     With MCP:

Model A ──→ Tool 1               Model A ─┐
Model A ──→ Tool 2                         │
Model A ──→ Tool 3               Model B ─┼──→ MCP Protocol ──→ MCP Server ──→ Tools
Model B ──→ Tool 1                         │
Model B ──→ Tool 2               Model C ─┘
Model B ──→ Tool 3
Model C ──→ Tool 1               (3 + 1 connections instead of 9)
Model C ──→ Tool 2
Model C ──→ Tool 3

(9 custom integrations)
```

MCP collapses this into a standard protocol. Any MCP-compatible model can talk to any MCP server, and any MCP server can expose any set of tools. Build once, connect everywhere.

## Architecture

MCP follows a client-server architecture:

```
┌────────────────────┐         ┌────────────────────┐
│  MCP Client         │         │  MCP Server         │
│  (inside the AI     │  JSON-  │  (exposes tools,    │
│   application)      │◄──────►│   resources, and    │
│                     │  RPC    │   prompts)          │
│  - Discovers tools  │         │                     │
│  - Sends requests   │         │  - Handles auth     │
│  - Handles results  │         │  - Executes actions │
└────────────────────┘         │  - Returns results  │
                               └────────────────────┘
```

**MCP Client** -- Lives inside the AI application (like an IDE, chatbot, or workflow engine). It discovers available tools, sends invocation requests, and processes results.

**MCP Server** -- Exposes capabilities to clients. It defines what tools are available, handles incoming requests, executes the underlying actions, and returns structured results.

Communication uses JSON-RPC 2.0 over standard transports (stdio, HTTP with SSE). The protocol is stateful -- a session is established, capabilities are negotiated, and the connection persists for the duration of the interaction.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>MCP separates the "what can I do" (tool definitions) from the "how do I do it" (implementation). The AI model sees a clean interface -- tool names, parameter schemas, descriptions -- and the MCP server handles all the complexity of actually interacting with external systems.</p>
</div>

## The Three Primitives

MCP defines three core primitives that servers can expose:

### 1. Tools

Tools are functions the model can call. Each tool has a name, a description (which the LLM reads to decide when to use it), and a JSON Schema defining its parameters.

```json
{
  "name": "search_contacts",
  "description": "Search CRM contacts by name, email, or company. Returns matching contact records with recent activity.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query (name, email, or company)"
      },
      "limit": {
        "type": "number",
        "description": "Max results to return (default: 10)"
      }
    },
    "required": ["query"]
  }
}
```

When an LLM decides it needs to search contacts, it generates a tool call with the appropriate parameters. The MCP client sends this to the server, the server executes the search against the CRM, and returns the results for the LLM to reason over.

### 2. Resources

Resources are data the model can read. Unlike tools (which perform actions), resources provide context -- files, database records, API responses, configuration. They're identified by URIs:

```
contacts://recent        → recently updated contacts
deals://pipeline/q1      → Q1 pipeline deals
docs://policies/refund   → refund policy document
```

Resources can be static (read once) or dynamic (change over time). The client can subscribe to resource updates for real-time awareness.

### 3. Prompts

Prompts are reusable templates that servers can expose. They provide structured ways to invoke common workflows -- standardising how certain tasks are requested across different client applications.

```json
{
  "name": "triage_email",
  "description": "Analyse an email and produce a triage decision",
  "arguments": [
    {
      "name": "email_content",
      "description": "The raw email content to triage",
      "required": true
    }
  ]
}
```

## The Interaction Flow

Here's how a typical MCP interaction works end-to-end:

```
1. Initialisation
   Client ──→ Server: "What tools/resources do you offer?"
   Server ──→ Client: [list of tools, resources, prompts]

2. User Request
   User: "What's the latest activity on the Acme Corp deal?"

3. LLM Reasoning
   LLM sees available tools, decides to call search_contacts
   LLM: call search_contacts(query: "Acme Corp")

4. Tool Execution
   Client ──→ Server: execute search_contacts(query: "Acme Corp")
   Server ──→ CRM API: search("Acme Corp")
   CRM API ──→ Server: [results]
   Server ──→ Client: [formatted results]

5. LLM Continuation
   LLM receives results, may call additional tools
   LLM: call get_deal_activity(deal_id: "deal_123")

6. Final Response
   LLM synthesises all retrieved information into a response
```

The model might chain multiple tool calls -- searching for a contact, then fetching their deal history, then checking recent emails. This multi-step reasoning is what makes MCP-connected models genuinely agentic.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>MCP includes a capability negotiation phase during initialisation. Clients and servers declare which protocol features they support (tools, resources, prompts, logging, sampling). This allows the protocol to evolve without breaking backward compatibility. A server can expose new primitives without requiring all clients to understand them immediately.</p>
</div>

## Security and Governance

MCP addresses security concerns that are critical for production deployments:

**Authentication** -- MCP servers handle auth with external systems (OAuth tokens, API keys, service accounts). The AI model never sees raw credentials. It calls tools, and the server authenticates on its behalf.

**Scoping** -- Servers define exactly which tools are available and what parameters they accept. You can expose a "read contacts" tool without exposing a "delete contacts" tool.

**Audit trails** -- Every tool invocation can be logged with full context: who requested it, what parameters were provided, what was returned. This is essential for compliance and debugging.

**Rate limiting and quotas** -- Servers can enforce limits on how frequently tools are called, preventing runaway costs or API abuse.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun provides its own <strong>MCP server</strong> that exposes your workspace data -- contacts, deals, activities, workflows -- to any MCP-compatible AI client. This means your AI coding assistant (like Claude Code or Cursor) can query your CRM data, check workflow status, and understand your sales pipeline directly from the IDE. Explore the setup on the <a href="/features/model-context-protocol">MCP feature page</a>.</p>
</div>

## Why MCP Matters for Builders

If you're building AI-powered features, MCP changes your architecture in several important ways:

**Composability** -- Build one MCP server for your system, and any AI client can use it. You don't rebuild integrations for each new AI tool or model.

**Model portability** -- Switch between LLM providers without rewriting your tool layer. The MCP interface stays the same whether you're using Claude, GPT, or an open-source model.

**Separation of concerns** -- The AI model handles reasoning and language. The MCP server handles system interactions. Clean boundaries make both easier to develop, test, and maintain.

**Ecosystem effects** -- As more tools expose MCP servers and more AI clients support MCP, the integration surface grows exponentially. A new tool that ships an MCP server is immediately usable by every MCP client.

## What's Next

MCP gives AI models the ability to act in the world. But the quality of those actions depends entirely on how well you communicate with the model.

In **Prompt Engineering Patterns**, you'll learn the systematic techniques for writing prompts that produce reliable, high-quality outputs -- the skill that determines whether your AI integrations actually work in production.
