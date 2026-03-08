---
title: "Setting Up the MCP Server"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "8 min"
permalink: /learn/build/setting-up-mcp
metaTitle: "Setting Up the MCP Server - Technical Walkthrough"
metaDescription: "Configure Outrun's MCP server to connect Claude Desktop, IDE extensions, and other AI tools directly to your workspace data."
author: "Outrun"
date: 2026-02-15
learnings:
  - "What MCP is and how it extends AI tool capabilities"
  - "How to configure the Outrun MCP server"
  - "How to connect Claude Desktop and other MCP clients"
  - "How to secure and scope MCP access per workspace"
prevArticle:
  title: "GitHub Automation with AI"
  url: /learn/build/github-automation-ai/
nextArticle:
  title: "Workflow Debugging"
  url: /learn/build/workflow-debugging/
---

Model Context Protocol (MCP) is an open standard that lets AI applications interact with external data sources and tools. Outrun ships an MCP server that exposes your workspace data — contacts, deals, activities, workflows, and more — to any MCP-compatible client.

This means Claude Desktop, IDE extensions, and other AI tools can read your CRM data, trigger workflows, and query audit logs without you building custom integrations. This guide covers the full setup.

## What MCP Does

Without MCP, AI tools are isolated. Claude Desktop can read files on your machine but can't see your CRM. An IDE extension can help you write code but can't check your workflow run history. Each tool is an island.

MCP bridges these islands. It provides a standard protocol for AI clients to:

- **Discover** what data sources and tools are available
- **Read** structured data from those sources
- **Execute** operations against those tools
- **Subscribe** to real-time updates

The Outrun MCP server implements this protocol against your workspace data. Any MCP client can connect and get live access to your Outrun environment.

## Step 1: Generate an MCP API Key

Navigate to **Settings > API > MCP Access** in your Outrun workspace. Click **Generate Key** and configure the scope:

```json
{
  "name": "Claude Desktop - Local Dev",
  "scopes": [
    "contacts:read",
    "deals:read",
    "deals:write",
    "activities:read",
    "workflows:read",
    "workflows:execute",
    "audit:read"
  ],
  "expiresAt": "2026-08-15T00:00:00Z"
}
```

Scopes control what the MCP client can access. Follow the principle of least privilege — only grant the scopes the client actually needs.

### Available Scopes

| Scope | Access |
|---|---|
| `contacts:read` | List and search contacts |
| `contacts:write` | Create and update contacts |
| `deals:read` | List and search deals |
| `deals:write` | Create and update deals |
| `activities:read` | Read activity feed and timelines |
| `workflows:read` | List workflows and run history |
| `workflows:execute` | Trigger manual workflow runs |
| `audit:read` | Query comprehensive audit logs |
| `sources:read` | List connected data sources |

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>MCP API keys are workspace-scoped. Each key only accesses data within the workspace that generated it. Multi-tenant isolation is enforced at the server level — even a misconfigured client cannot access data from another workspace.</p>
</div>

## Step 2: Configure Claude Desktop

Claude Desktop supports MCP natively. Add the Outrun server to your Claude Desktop configuration file.

On macOS, edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "outrun": {
      "command": "npx",
      "args": [
        "@outrun/mcp-server",
        "--workspace", "your-workspace-slug",
        "--key", "mcp_key_abc123..."
      ]
    }
  }
}
```

On Windows, the config file is at `%APPDATA%\Claude\claude_desktop_config.json`.

Restart Claude Desktop after saving the config. You should see **Outrun** listed as a connected tool in the MCP panel.

### Verify the Connection

Ask Claude Desktop a question that requires Outrun data:

```
What deals closed last month in my Outrun workspace?
```

If the connection is working, Claude will query your Outrun workspace via MCP and return live data. If it fails, check:

1. The API key is valid and not expired
2. The workspace slug matches your Outrun workspace
3. Network access to the Outrun API is available
4. The `@outrun/mcp-server` package is accessible via npx

## Step 3: Configure for IDE Extensions

If your IDE supports MCP (VS Code with compatible extensions, Cursor, etc.), you can add the Outrun server to your project configuration.

Create or edit `.mcp.json` in your project root:

```json
{
  "servers": {
    "outrun": {
      "command": "npx",
      "args": [
        "@outrun/mcp-server",
        "--workspace", "your-workspace-slug",
        "--key", "mcp_key_abc123..."
      ]
    }
  }
}
```

This gives your IDE's AI assistant access to your Outrun data while you code. You can ask it to check workflow run statuses, look up contact records, or query audit logs — all without leaving your editor.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The MCP server communicates over stdio by default (the AI client spawns it as a child process). Each request is authenticated against your API key, scoped to your workspace, and executed against your workspace's isolated database. All MCP interactions are logged in the <a href="/features/comprehensive-audit-trails">audit trail</a> so you can track exactly what any AI tool accessed and when.</p>
</div>

## Step 4: Expose MCP Tools

The Outrun MCP server exposes **tools** — operations that AI clients can call. Review and customise which tools are available:

### Default Tools

| Tool | Description | Required Scope |
|---|---|---|
| `search_contacts` | Full-text search across contacts | `contacts:read` |
| `get_contact` | Retrieve a specific contact by ID | `contacts:read` |
| `search_deals` | Search deals by stage, value, owner | `deals:read` |
| `update_deal` | Update deal fields | `deals:write` |
| `list_activities` | Get recent activities for a contact or deal | `activities:read` |
| `list_workflows` | List workflow definitions and status | `workflows:read` |
| `get_run_history` | Get execution history for a workflow | `workflows:read` |
| `trigger_workflow` | Manually trigger a workflow run | `workflows:execute` |
| `query_audit_log` | Search audit log entries | `audit:read` |

### Custom Tools

You can extend the MCP server with custom tools that map to your specific workflows:

{% raw %}
```json
{
  "customTools": [
    {
      "name": "qualify_lead",
      "description": "Run the lead qualification workflow on a specific contact",
      "workflowId": "wf_lead_qual_123",
      "inputMapping": {
        "contactId": "{{args.contact_id}}"
      }
    }
  ]
}
```
{% endraw %}

Custom tools appear alongside the default tools in any MCP client. This lets you expose complex multi-step workflows as simple one-call operations.

## Security Considerations

### Key Rotation

Rotate MCP API keys regularly. Set expiration dates when generating keys and create new ones before the old ones expire. Old keys can be revoked immediately from the API settings page.

### Network Restrictions

If your workspace handles sensitive data, restrict MCP access to specific IP ranges or require VPN connectivity. Configure this in **Settings > Security > API Access**.

### Audit Everything

Every MCP operation is logged. Review the audit trail periodically to ensure AI tools are only accessing data they should. Look for:

- Unexpected data access patterns
- High-volume queries that might indicate misuse
- Failed authentication attempts

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>The <a href="/features/model-context-protocol">MCP feature page</a> shows the full list of available tools and example queries. If you're already using Claude Desktop, you can be connected in under five minutes. The MCP server works alongside all other Outrun features — <a href="/features/ai-agents">AI Agents</a>, <a href="/features/ai-workflow-builder">workflows</a>, and <a href="/features/comprehensive-audit-trails">audit trails</a>.</p>
</div>

## Common Use Cases

### Sales Prep

Before a call, ask Claude Desktop: "Give me a summary of all activity with Acme Corp in the last 30 days." The MCP server queries contacts, deals, activities, and email history — and Claude synthesises it into a prep document.

### Pipeline Review

Ask your IDE assistant: "Which deals in the negotiation stage haven't had activity in the past 2 weeks?" The MCP server queries live deal data and returns stale opportunities for follow-up.

### Debugging Workflows

While debugging a workflow issue, ask: "Show me the last 5 runs of the lead qualification workflow and their node-level execution details." The MCP server returns full run history including input/output for each node.

## What's Next

With MCP connected, your AI tools have live access to your Outrun workspace. But what happens when a workflow doesn't behave as expected? The next guide covers **workflow debugging** — how to trace execution, identify failures, and fix issues using Outrun's built-in debugging tools.
