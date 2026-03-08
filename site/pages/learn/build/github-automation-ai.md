---
title: "GitHub Automation with AI"
layout: layouts/learn.liquid
track: process-builders
tier: build
readTime: "11 min"
permalink: /learn/build/github-automation-ai
metaTitle: "GitHub Automation with AI - Technical Walkthrough"
metaDescription: "Configure Outrun's GitHub AI agent to automatically triage issues, write code, create pull requests, and manage your development workflow."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How to install and configure the Outrun GitHub App"
  - "How the GitHub agent processes issues and creates PRs"
  - "How to configure agent permissions and repository scope"
  - "How to set up the full issue-to-PR automation pipeline"
crossTrackUrl: /learn/build/deploying-email-agent/
crossTrackTitle: "Deploying an Email Agent"
crossTrackLabel: "Want the business overview?"
prevArticle:
  title: "Configuring AI Agents"
  url: /learn/build/configuring-ai-agents/
nextArticle:
  title: "Setting Up the MCP Server"
  url: /learn/build/setting-up-mcp/
---

Outrun's GitHub integration goes beyond simple webhooks. It installs as a GitHub App on your organisation, receives real-time events, and powers AI agents that can read issues, understand codebases, write code in sandboxed containers, and create pull requests — all autonomously.

This guide walks you through the full setup: installing the GitHub App, configuring an AI agent for your repositories, and deploying the issue-to-PR pipeline.

## Architecture Overview

Here's how the pieces fit together:

```
GitHub Event (issue opened)
    ↓
Stream Service (validates webhook signature)
    ↓
Agent Lookup (checks active agents matching event)
    ↓
Bot Job Created (workspace DB)
    ↓
Dispatcher (provisions execution environment)
    ↓
Docker Container (Claude Code runs, reads repo, writes code)
    ↓
GitHub PR Created (via GitHub API)
    ↓
Notification (agent reports back)
```

The stream service receives webhooks from GitHub, validates the HMAC signature using your webhook secret, and routes events to matching agents. The dispatcher provisions a Docker container where Claude Code runs with full access to the repository — reading files, understanding context, writing changes, and committing them.

## Step 1: Install the GitHub App

Navigate to **Settings > Integrations > GitHub** in your Outrun workspace. Click **Install GitHub App** — this redirects to GitHub where you select which organisation and repositories to grant access.

### Required Permissions

The GitHub App needs these permissions at the organisation level:

| Permission | Access | Purpose |
|---|---|---|
| **Contents** | Read & Write | Clone repos, read files, push commits |
| **Issues** | Read & Write | Read issue details, post comments |
| **Pull Requests** | Read & Write | Create PRs, post review comments |
| **Metadata** | Read | List repos, branches, collaborators |
| **Statuses** | Read & Write | Report check statuses on commits |

After installing the app, you need to **accept the permissions** in your GitHub organisation settings. This is a common gotcha — the app installs successfully but permissions remain pending until an org admin explicitly accepts them.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>App-level permissions and installation-level permissions are separate. After you update the App's required permissions, each organisation must accept the update. Look for a banner in your GitHub App installation settings — if permissions are pending, the agent won't have the access it needs.</p>
</div>

### Verify Installation

Back in Outrun, the GitHub integration page should show your connected organisation and the repositories you granted access to. If a repo is missing, check that it was selected during installation or update the installation settings on GitHub.

## Step 2: Create a GitHub Agent

Navigate to **AI > New Agent** and select the **GitHub** agent type. The configuration ties the agent to your GitHub App installation:

```json
{
  "name": "AI Developer",
  "agentType": "github",
  "config": {
    "repositories": ["acme/api", "acme/frontend"],
    "triggers": [
      {
        "triggerType": "github",
        "events": ["issues.opened", "issues.labeled"],
        "filters": {
          "labels": ["ai-task", "bug"]
        }
      }
    ]
  }
}
```

### Event Types

The agent can respond to various GitHub events:

| Event | Description |
|---|---|
| `issues.opened` | New issue created |
| `issues.labeled` | Label added to an issue |
| `issues.assigned` | Issue assigned to a user |
| `issue_comment.created` | New comment on an issue |
| `pull_request.opened` | New PR created |
| `pull_request.review_requested` | Review requested on a PR |

Start with `issues.opened` and `issues.labeled` — these give you control over when the agent activates. You can create an `ai-task` label and only apply it to issues you want the agent to work on.

## Step 3: Configure the Agent Pipeline

The GitHub agent follows a multi-stage pipeline for each event:

### Stage 1: Acknowledge

The agent immediately comments on the issue to confirm it's been picked up:

```markdown
🤖 I'm looking into this. I'll create a pull request with a fix shortly.
```

This gives the team visibility that automation is running.

### Stage 2: Triage

The agent reads the issue title, body, labels, and any linked context. It uses Claude to classify the work:

- **Code change required** — proceed to code stage
- **Question / discussion** — post a helpful response and stop
- **Insufficient context** — ask for clarification and stop

### Stage 3: Code

For code changes, the dispatcher provisions a Docker container with:

- The repository cloned and checked out
- All input context (issue details, linked PRs, relevant files) mounted at `/tmp/io/input/`
- Claude Code running with access to the full repository

Claude Code reads the codebase, understands the problem, writes the fix, and commits changes. The result is written to `/tmp/io/output/result.json`:

```json
{
  "status": "success",
  "branch": "fix/issue-42-null-check",
  "commits": [
    {
      "sha": "a1b2c3d",
      "message": "fix: add null check for user preferences"
    }
  ],
  "filesChanged": ["src/services/preferences.ts"],
  "summary": "Added null check for user preferences object to prevent crash when preferences haven't been set yet."
}
```

### Stage 4: Create Pull Request

If the code stage succeeds, the agent creates a pull request:

```json
{
  "title": "fix: add null check for user preferences (#42)",
  "body": "## Summary\nAdded null check for user preferences...\n\nCloses #42",
  "base": "main",
  "head": "fix/issue-42-null-check",
  "labels": ["ai-generated"],
  "reviewers": ["team-lead"]
}
```

The PR references the original issue, includes a summary of changes, and requests review from configured team members.

### Stage 5: Notify

The agent updates the original issue with a link to the PR and a summary of what was done.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The code execution stage runs in an isolated Docker container. Input is mounted read-only at <code>/tmp/io/input/</code> and output is written to <code>/tmp/io/output/result.json</code>. The container runs as a non-root user (UID 1001) for security. Claude Code operates with <code>--dangerously-skip-permissions</code> inside the container so it can commit changes via its Bash tool. The agent checks <code>git log --oneline origin/main..HEAD</code> to detect changes (not just <code>git status</code>, which only shows uncommitted files).</p>
</div>

## Step 4: Set Agent Guardrails

GitHub agents need specific guardrails beyond the standard set:

```json
{
  "guardrails": {
    "maxFilesPerPR": 10,
    "blockedPaths": [
      ".env*",
      "secrets/",
      "*.key",
      "*.pem"
    ],
    "requireReview": true,
    "allowedBranches": {
      "base": ["main", "develop"],
      "create": "fix/*"
    },
    "maxConcurrentJobs": 2
  }
}
```

**Max files per PR** — prevents the agent from making sweeping changes. If a fix requires more than N files, it escalates to a human instead.

**Blocked paths** — files the agent must never read or modify. Always include secret files, environment configs, and sensitive credentials.

**Require review** — ensures every AI-generated PR requires human approval before merge. Never let AI agents merge their own PRs.

**Allowed branches** — restricts which branches the agent can target (base) and create (head). Use prefixed branch names like `fix/*` or `ai/*` to make AI-generated branches easy to identify.

## Step 5: Test with a Real Issue

Create a test issue in one of the configured repositories:

```markdown
Title: Add input validation to the /api/users endpoint

Body:
The POST /api/users endpoint currently accepts any payload without validation.
Add Zod schema validation for the request body, requiring:
- email (valid email format)
- name (string, 1-100 characters)
- role (enum: admin, member, viewer)

Return 400 with validation errors if the payload doesn't match.
```

Add the `ai-task` label. Watch the agent:

1. Comment on the issue acknowledging the task
2. Read the repository structure
3. Write validation code
4. Create a pull request with the changes
5. Comment back on the issue with the PR link

Review the PR carefully. Check the code quality, test coverage, and whether it follows your team's conventions. Use this feedback to refine the agent's prompt — add instructions about your coding standards, test expectations, and preferred libraries.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>The <a href="/features/ai-code-automation">AI Code Automation</a> feature page has a full walkthrough of the GitHub agent, including pre-built templates for bug fixes, feature scaffolding, and code review. The agent works with any GitHub repository your App has access to.</p>
</div>

## Best Practices for GitHub Agents

### Write Detailed Issues

The quality of the agent's output is directly proportional to the quality of the issue description. Include:

- **What** needs to change
- **Where** in the codebase (file paths, function names)
- **Why** (context the agent wouldn't infer from code alone)
- **Acceptance criteria** (specific conditions for a correct fix)

### Use Labels for Control

Create a labelling system that gives you fine-grained control:

- `ai-task` — agent should attempt this
- `ai-review` — agent should review only, not code
- `ai-blocked` — agent should skip this issue
- `priority/high` — agent should process before other issues

### Monitor Token Usage

Code generation is token-intensive. Monitor your agent's token consumption per issue to identify prompt optimisations. Common savings: limiting the number of files the agent reads, providing explicit file paths in issues, and using a focused system prompt instead of a generic one.

## What's Next

Now that your GitHub agent is running, you might want to interact with Outrun data from other AI tools. The next guide covers setting up the **MCP server** — a protocol that lets Claude Desktop, IDE extensions, and other AI clients query and manipulate your Outrun workspace directly.
