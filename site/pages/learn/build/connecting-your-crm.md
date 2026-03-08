---
title: "Connecting Your CRM"
layout: layouts/learn.liquid
track: business-leaders
tier: build
readTime: "5 min"
permalink: /learn/build/connecting-your-crm
metaTitle: "Connecting Your CRM - Getting Started Guide"
metaDescription: "How to connect your CRM to an AI automation platform in minutes, with step-by-step instructions for Salesforce, HubSpot, and Pipedrive."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How CRM integrations work at a high level"
  - "Step-by-step process for connecting your CRM"
  - "What data flows between your CRM and AI workflows"
  - "How to verify your connection is working correctly"
crossTrackUrl: /learn/build/configuring-ai-agents/
crossTrackTitle: "Configuring AI Agents"
crossTrackLabel: "Want the technical walkthrough?"
prevArticle:
  title: "Your First AI Workflow"
  url: /learn/build/first-ai-workflow/
nextArticle:
  title: "Deploying an Email Agent"
  url: /learn/build/deploying-email-agent/
---

Your CRM is the centre of gravity for your sales team. Every deal, every contact, every interaction lives there. For AI workflows to be truly useful, they need to read from and write to your CRM. The good news: connecting it takes about five minutes.

This guide walks you through connecting your CRM to an AI automation platform, regardless of whether you use Salesforce, HubSpot, Pipedrive, or another tool.

## How CRM Integrations Work

Before you click anything, here is what happens under the hood -- in plain terms:

1. **Authentication.** You grant the automation platform permission to access your CRM. This uses OAuth, the same secure flow you use when you "Sign in with Google." You never share your password.

2. **Data sync.** The platform pulls your CRM's schema -- the names of your fields, objects, and relationships. It does not copy all your data. It learns the *structure* so workflows can reference the right fields.

3. **Read and write access.** Once connected, workflows can read records (look up a contact, check a deal stage) and write records (update a field, create a task, log an activity). You control which permissions to grant.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>CRM integrations use the same secure OAuth flow as every other app you connect. You are granting scoped permissions, not handing over the keys. You can revoke access at any time from your CRM's settings.</p>
</div>

## Step-by-Step: Connect Your CRM

### 1. Navigate to Integrations

In your automation platform, find the integrations or sources page. This is where you manage all your connected apps.

### 2. Select Your CRM

Choose your CRM from the list of available integrations. The most common options:

| CRM | Auth Method | Setup Time |
|-----|-------------|------------|
| **Salesforce** | OAuth 2.0 | ~2 minutes |
| **HubSpot** | OAuth 2.0 | ~2 minutes |
| **Pipedrive** | OAuth 2.0 | ~2 minutes |
| **Zoho CRM** | OAuth 2.0 | ~3 minutes |

### 3. Authorize Access

Click **Connect** and you will be redirected to your CRM's login page. Sign in with your CRM credentials and approve the permissions the platform is requesting. Typical permissions include:

- **Read contacts and companies** -- so workflows can look up records
- **Read and write deals/opportunities** -- so workflows can update deal stages and fields
- **Read and write activities** -- so workflows can log calls, emails, and tasks
- **Read custom fields** -- so workflows can access your team's custom data

### 4. Verify the Connection

Once you approve, you are redirected back to the automation platform. You should see a confirmation that the connection is active. Most platforms will show:

- A green status indicator
- The name of the CRM account connected
- The date and time of the last successful sync
- The objects and fields available

### 5. Test It

The best way to verify is to create a simple test. Open a workflow, add a CRM lookup node, and try to fetch a contact by email address. If the record comes back with the right data, your connection is working.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun supports one-click connections to Salesforce, HubSpot, Pipedrive, and Zoho. Navigate to your workspace's <strong>Sources</strong> page and click <strong>Add Source</strong>. Your CRM data becomes available across all workflows and the <a href="/features/data-browser-analytics">Data Browser</a> immediately after connecting.</p>
</div>

## What Data Flows Where

Once your CRM is connected, here is what becomes available to your AI workflows:

**Your workflows can read:**
- Contact and company records
- Deal/opportunity details and stage history
- Activity logs (emails, calls, meetings, tasks)
- Custom fields and picklist values
- Notes and attachments metadata

**Your workflows can write:**
- Update existing fields on any record
- Create new contacts, companies, deals, or activities
- Log activities (calls, emails, tasks)
- Move deals between stages
- Add notes and tags

**Your workflows cannot:**
- Delete records (by default -- this is a safety guardrail)
- Change your CRM's schema or field definitions
- Access data outside the permissions you granted
- Share your data with other tenants or workspaces

## Keeping Your Data Secure

CRM data is sensitive. Here are the guardrails that protect it:

- **Encrypted in transit and at rest.** All data moving between your CRM and the platform is encrypted using TLS. Stored data is encrypted with AES-256.
- **Workspace isolation.** Your CRM data lives in a dedicated workspace database. No other customer can access it.
- **Audit trail.** Every read and write to your CRM is logged. You can see exactly what your workflows did, when, and why.
- **Revocable at any time.** Disconnect your CRM from the platform settings, or revoke access from inside your CRM's connected apps page.

<div class="learn-callout learn-callout--why-it-matters">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
Why This Matters
</div>
<p>Your CRM connection is the foundation for every sales automation workflow you will build. A clean, verified connection means your AI workflows can look up contacts, update deals, and log activities in real time -- turning your CRM from a database you manually maintain into one that maintains itself.</p>
</div>

## Troubleshooting Common Issues

**Connection fails during OAuth.** Make sure you are signing in with an account that has admin or API access in your CRM. Standard user accounts may not have permission to authorize third-party apps.

**Missing fields after connection.** If custom fields are not showing up, check that your CRM user has visibility permissions on those fields. Some CRMs restrict field visibility by role.

**Sync appears stale.** Most platforms sync CRM schema periodically. If you just added a custom field in your CRM, trigger a manual resync from the integration settings.

With your CRM connected, your workflows now have access to the richest data source in your sales stack. Next, we will put that data to work by deploying an AI agent that handles your email triage automatically.
