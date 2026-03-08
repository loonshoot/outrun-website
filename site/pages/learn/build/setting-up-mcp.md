---
title: "Setting Up an MCP Server"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "8 min"
permalink: /learn/build/setting-up-mcp/
metaTitle: "Setting Up an MCP Server - Connect AI Tools to Your Data"
metaDescription: "How to connect Claude Desktop, Claude Code, Cursor, and other AI tools to any MCP server. Covers transport types, OAuth authentication, and scoping — with Outrun as a worked example."
author: "Outrun"
date: 2026-03-08
learnings:
  - "How MCP servers connect to AI clients (transport types)"
  - "How to configure Claude Desktop, Claude Code, and Cursor"
  - "How OAuth authentication works for remote MCP servers"
  - "How scopes control what an MCP client can access"
prevArticle:
  title: "GitHub Automation with AI"
  url: /learn/build/github-automation-ai/
nextArticle:
  title: "Workflow Debugging"
  url: /learn/build/workflow-debugging/
---

MCP servers give AI tools access to external data — your CRM, your codebase, your internal tools. But the setup process varies depending on the server type, the AI client you're using, and the authentication method.

This guide covers the general pattern for connecting any MCP server to any MCP client. We'll use Outrun's MCP server as a worked example throughout, but the concepts apply to any MCP server you encounter.

## Two Transport Types

MCP servers communicate with AI clients over one of two transport types. Understanding which one your server uses determines how you configure it.

### Local (stdio) Servers

The AI client spawns the MCP server as a child process on your machine. Communication happens over stdin/stdout. This is common for servers that wrap local tools — file systems, databases, CLI utilities.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}
```

The client starts the process, sends JSON-RPC messages to its stdin, and reads responses from its stdout. No network involved.

### Remote (Streamable HTTP) Servers

The MCP server runs on a remote host. The client connects over HTTPS and communicates via Streamable HTTP — a transport that supports both request-response and server-initiated events over a single HTTP connection.

```json
{
  "mcpServers": {
    "my-saas-tool": {
      "url": "https://api.example.com/mcp"
    }
  }
}
```

Remote servers almost always require authentication. Most use OAuth 2.0, which the MCP protocol has built-in support for.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p><strong>Local servers</strong> use <code>command</code> + <code>args</code> in config. <strong>Remote servers</strong> use <code>url</code>. If a server's documentation gives you a URL, it's remote. If it gives you an <code>npx</code> or CLI command, it's local.</p>
</div>

## Configuring AI Clients

Each AI client stores MCP server configuration in a different location. The format is nearly identical across clients — the main difference is the file path.

### Claude Desktop

Config file location:
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

Restart Claude Desktop after editing. The server appears in the MCP tools panel.

### Claude Code

Create `.mcp.json` in your project root (or home directory for global access):

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

Claude Code picks this up automatically — no restart needed.

### Cursor

Cursor uses the same `.mcp.json` format. Create it in your project root:

```json
{
  "mcpServers": {
    "outrun": {
      "url": "https://api.outrun.dev/mcp"
    }
  }
}
```

### Multiple Servers

You can connect to multiple MCP servers simultaneously. Each gets a unique key:

```json
{
  "mcpServers": {
    "outrun": {
      "url": "https://api.outrun.dev/mcp"
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./docs"]
    }
  }
}
```

The AI model sees tools from all connected servers and can use them together in a single conversation.

## OAuth Authentication

Remote MCP servers typically use OAuth 2.0. The MCP protocol standardises how this works so you don't need to configure tokens manually.

### How It Works

When you first connect to a remote MCP server, the following happens automatically:

```
1. Client discovers the server's OAuth endpoints
   GET /.well-known/oauth-authorization-server

2. Client registers itself (if needed)
   POST /oauth/register

3. Client opens your browser for consent
   GET /oauth/authorize → you see a consent screen

4. You approve the requested permissions
   The server creates an authorization code

5. Client exchanges the code for a token
   POST /oauth/token → bearer token stored locally

6. All future requests use this token
   Authorization: Bearer <token>
```

You don't write any of this. The MCP client handles the entire flow. You just see a browser window asking you to approve access.

### The Consent Screen

The consent screen shows you exactly what the MCP client is requesting access to. For example, when Claude Desktop connects to Outrun's MCP server:

- Which **capabilities** (tools) the client wants — querying data, managing workflows, running agents
- Which **data sources** it can see — all sources, or specific integrations you select
- Which **object types** it can access — people, organizations, activities, relationships

You choose what to grant. The resulting token is scoped to exactly those permissions — nothing more.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>OAuth for MCP uses the standard authorization code grant (RFC 6749) with dynamic client registration (RFC 7591). The server publishes its capabilities at <code>/.well-known/oauth-authorization-server</code> — the same discovery mechanism used by OpenID Connect. Clients that support PKCE (Proof Key for Code Exchange) use S256 code challenges for additional security.</p>
</div>

## Scopes and Permissions

Scopes define what an MCP client can do with your data. Different servers have different scope systems, but the pattern is universal: the server defines the scopes, and you choose which to grant during consent.

### Outrun's Scope System

Outrun uses three scope types:

**Action scopes** control which MCP tools are available:

| Scope | What It Grants |
|---|---|
| `action:discover` | Browse available tools, node types, workflow templates |
| `action:query` | Query objects, list records, count data |
| `action:workflows` | List, create, start, and build workflows |
| `action:agents` | List, create, and run AI agents |
| `action:segments` | View audience segments |
| `action:destinations` | View configured destinations |
| `action:knowledge` | View knowledge bases |

**Source scopes** restrict which connected integrations are visible. If you grant `source:hubspot-uuid` but not `source:salesforce-uuid`, the client only sees HubSpot data.

**Object type scopes** restrict which data types are accessible: `object:people`, `object:organizations`, `object:activities`, `object:relationships`.

If you don't restrict sources or object types, the client sees everything in your workspace. This is fine for trusted tools — but for third-party integrations, narrowing the scope is good practice.

## Available Tools (Outrun Example)

Once connected, the AI client sees the tools your scopes allow. Here's what Outrun's MCP server exposes:

| Tool | Description | Scope Required |
|---|---|---|
| `execute-query` | Run read-only GraphQL queries | `action:query` |
| `list-objects` | List objects with optional type filter | `action:query` |
| `get-object-count` | Count objects by type | `action:query` |
| `list-sources` | View connected integrations | `action:query` |
| `list-workflows` | View workflow definitions | `action:workflows` |
| `create-workflow` | Create a new workflow | `action:workflows` |
| `start-workflow` | Trigger a workflow execution | `action:workflows` |
| `build-workflow` | Build a workflow from a description | `action:workflows` |
| `list-agents` | View AI agent configurations | `action:agents` |
| `create-agent` | Create a new AI agent | `action:agents` |
| `run-agent` | Trigger an agent execution | `action:agents` |
| `get-capabilities` | Discover available tools and features | `action:discover` |
| `get-node-types` | List workflow node types | `action:discover` |
| `get-workflow-templates` | List pre-built templates | `action:discover` |
| `list-segments` | View audience segments | `action:segments` |
| `list-destinations` | View destinations | `action:destinations` |
| `list-knowledge-bases` | View knowledge bases | `action:knowledge` |

Tools outside your granted scopes don't appear at all — the client never sees them.

## Verify the Connection

After connecting, test by asking your AI tool something that requires MCP data:

```
How many people records are in my Outrun workspace?
```

If the connection is working, the AI tool calls the `get-object-count` tool via MCP and returns a live count from your workspace. If it fails, check:

1. **Server URL** — is the URL correct and reachable?
2. **OAuth consent** — did the browser window appear and did you approve?
3. **Scopes** — did you grant the scopes needed for the tools you're trying to use?
4. **Network** — can the client reach the server (firewalls, VPN, proxy)?

## Security Best Practices

### Principle of Least Privilege

Grant only the scopes each client needs. Your IDE assistant probably needs `action:query` to look up records, but doesn't need `action:agents` to create AI agents.

### Review Connected Apps

Periodically review which MCP clients have access to your workspace. Revoke tokens for tools you no longer use.

### Workspace Isolation

Each MCP token is scoped to one workspace. A client connected to your "Production" workspace cannot access your "Staging" workspace, even with the same user account.

### Audit Trail

Every MCP operation is logged. Review access patterns if you see unexpected data queries or high request volumes.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Connect Claude Desktop or Claude Code to your Outrun workspace in under two minutes. Just add the URL to your config file, open a conversation, and approve the consent screen when your browser opens. Full setup instructions are in the <a href="/docs/ai/model-context-protocol/">MCP documentation</a>.</p>
</div>

## What's Next

With MCP connected, your AI tools have live access to your workspace data. But what happens when a workflow doesn't behave as expected? The next guide covers **workflow debugging** — how to trace execution, identify failures, and fix issues using Outrun's built-in debugging tools.
