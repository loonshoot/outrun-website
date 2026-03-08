---
layout: layouts/docs.liquid
title: Model Context Protocol (MCP)
description: Connect AI tools directly to your Outrun workspace through the Model Context Protocol. Query data, manage workflows, and run agents from Claude Desktop, Claude Code, or any MCP client.
metaTitle: Model Context Protocol - Outrun Documentation
metaDescription: Connect Claude Desktop, Claude Code, and other AI tools to your Outrun workspace via MCP. OAuth authentication, granular scopes, and 18 available tools.
permalink: /docs/ai/model-context-protocol/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: AI
    url: /docs/ai/
  - title: Model Context Protocol
    url: /docs/ai/model-context-protocol/
---

Outrun's MCP server gives AI tools live access to your workspace — contacts, organizations, workflows, agents, knowledge bases, and more. It uses Streamable HTTP transport with OAuth 2.0 authentication, so connecting is as simple as adding a URL.

<div class="bg-purple-500 bg-opacity-10 border border-purple-500 p-6 my-6">
  <h3 class="text-purple-400 text-lg font-semibold mb-3">Quick Start</h3>
  <p class="text-gray-300">Add <code>https://api.outrun.dev/mcp</code> to your AI client's MCP configuration. On first use, your browser opens for OAuth consent — choose which data and tools to grant access to. No API keys to create or manage.</p>
</div>

## Connecting

### Claude Desktop

Edit `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "outrun": {
      "url": "https://api.outrun.dev/mcp"
    }
  }
}
```

Restart Claude Desktop. On your next conversation, a browser window opens for OAuth consent.

### Claude Code

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "outrun": {
      "type": "url",
      "url": "https://api.outrun.dev/mcp"
    }
  }
}
```

### Cursor / Other MCP Clients

Any client that supports Streamable HTTP transport can connect using the URL `https://api.outrun.dev/mcp`.

## Authentication

Outrun's MCP server uses OAuth 2.0 with the authorization code grant. The entire flow is handled automatically by your MCP client:

1. **Discovery** — client fetches `/.well-known/oauth-authorization-server` from the API gateway
2. **Registration** — client registers itself via Dynamic Client Registration (RFC 7591)
3. **Consent** — your browser opens showing the Outrun consent screen with scope options
4. **Token exchange** — client exchanges the authorization code for a bearer token
5. **Connection** — all subsequent MCP requests use the bearer token

You only interact with step 3 — choosing which scopes to approve. The token is stored locally by your MCP client and reused across sessions.

### Token Revocation

To revoke a connected client's access, go to **Settings > API Keys** in your Outrun workspace and delete the OAuth-issued key. The client will need to re-authenticate on next use.

## Scopes

The consent screen lets you control exactly what the MCP client can access. Scopes fall into three categories:

### Action Scopes

Control which MCP tools the client can use:

| Scope | Description | Tools Granted |
|---|---|---|
| `action:discover` | Browse capabilities | `get-capabilities`, `get-node-types`, `get-workflow-templates` |
| `action:query` | Query data (read-only) | `execute-query`, `list-objects`, `get-object-count`, `list-sources`, `create-source` |
| `action:workflows` | Manage workflows | `list-workflows`, `create-workflow`, `start-workflow`, `build-workflow` |
| `action:agents` | Manage AI agents | `list-agents`, `create-agent`, `run-agent` |
| `action:segments` | View segments | `list-segments` |
| `action:destinations` | View destinations | `list-destinations` |
| `action:knowledge` | View knowledge bases | `list-knowledge-bases` |

### Source Scopes

Restrict which connected integrations are visible. Format: `source:<source-uuid>`.

When set, only data from the selected sources appears in query results and the `list-sources` tool. If no source scopes are selected, all sources are visible.

### Object Type Scopes

Restrict which object types are accessible:

| Scope | Objects |
|---|---|
| `object:people` | Contacts, leads, individuals |
| `object:organizations` | Companies, accounts |
| `object:activities` | Emails, calls, meetings, tasks |
| `object:relationships` | Links between people and organizations |

When set, tools like `list-objects` and `execute-query` filter results to only include the selected types. If no object type scopes are selected, all types are accessible.

## Available Tools

Tools only appear if the token has the required action scope. A client granted `action:query` and `action:discover` sees 7 tools; a client with all scopes sees all 18.

### Discovery Tools

| Tool | Description |
|---|---|
| `get-capabilities` | List all available tools, node types, and features |
| `get-node-types` | List workflow node types (source, AI, action, conditional, code, destination) |
| `get-workflow-templates` | List pre-built workflow templates |

### Query Tools

| Tool | Description |
|---|---|
| `execute-query` | Execute a read-only GraphQL query against workspace data |
| `list-objects` | List objects with optional type and limit filters |
| `get-object-count` | Count objects, optionally filtered by type |
| `list-sources` | List connected integrations |
| `create-source` | Connect a new integration |

### Workflow Tools

| Tool | Description |
|---|---|
| `list-workflows` | List workflow definitions with status |
| `create-workflow` | Create a new workflow definition |
| `start-workflow` | Trigger a workflow execution |
| `build-workflow` | Generate a workflow from a natural language description |

### Agent Tools

| Tool | Description |
|---|---|
| `list-agents` | List AI agent configurations |
| `create-agent` | Create a new AI agent |
| `run-agent` | Trigger an agent execution |

### Other Tools

| Tool | Description |
|---|---|
| `list-segments` | List audience segments |
| `list-destinations` | List configured destinations |
| `list-knowledge-bases` | List knowledge bases and their contents |

## Resources

The MCP server exposes two resources for AI model context:

| Resource | Description |
|---|---|
| `workspace://schema` | Full GraphQL schema for introspection — helps AI models understand available queries and data types |
| `workspace://info` | Workspace metadata including name, plan, and configuration |

## Security

**Workspace isolation** — each token is scoped to a single workspace. A client cannot access data from other workspaces.

**Granular enforcement** — tools are filtered at registration time based on action scopes. Query results are filtered at runtime based on source and object type scopes. The client never sees restricted data.

**Read-only core** — the `execute-query` tool blocks all GraphQL mutations. Only purpose-built tools (like `create-workflow` or `run-agent`) can perform write operations.

**Rate limiting** — inherits from the API gateway at 200 requests per minute per token.

**Audit logging** — all MCP operations are logged and visible in your workspace's audit trail.

## Example Queries

Once connected, you can ask your AI tool questions that require workspace data:

- "How many people records do I have?" — uses `get-object-count`
- "Show me my active workflows" — uses `list-workflows`
- "What integrations are connected?" — uses `list-sources`
- "Create a workflow that qualifies new leads from HubSpot" — uses `build-workflow`
- "Run the email triage agent" — uses `run-agent`

The AI model discovers available tools automatically and calls the right ones based on your question.

## Troubleshooting

**Browser never opens for consent** — ensure the URL is correct (`https://api.outrun.dev/mcp`) and your client supports Streamable HTTP transport. Older MCP clients may only support stdio transport.

**Tools are missing** — check which scopes you granted during consent. Tools outside your action scopes don't appear. To change scopes, revoke the token in Settings and reconnect.

**"Not permitted by current access scope"** — the tool exists but the request involves data outside your source or object type scopes. Reconnect with broader scopes if needed.

**Query returns no results** — check source scopes. If you restricted to specific sources, only data from those sources appears in results.

**Rate limit errors** — the API gateway limits requests to 200 per minute per token. If you're hitting this in automated workflows, consider batching queries.

**Connection drops** — Streamable HTTP connections may be interrupted by network changes. Most MCP clients reconnect automatically.
