---
layout: layouts/docs.liquid
title: Documentation Overview
description: Complete documentation for Outrun's data synchronization platform. Learn how to integrate, configure, and manage your data pipelines.
metaTitle: Outrun Documentation - Data Sync Platform Guide
metaDescription: Comprehensive documentation for Outrun's data synchronization platform. Integration guides, API reference, and best practices.
permalink: /docs/
breadcrumbs:
  - title: Documentation
    url: /docs/
---

## What is Outrun?

Outrun is an application that automatically imports your data, standardizes and cleans it, then pushes it to your destinations. This is essential for organizations that want to use data as a competitive advantage—it lets them keep their systems in sync, improving worker productivity, pushing data to systems that enable automated business processes and customer communications, and creating unified reporting on data that lives in disparate systems.

In the age of AI, getting access to clean, standardized data is becoming the biggest blocker to creating next-generation systems. Outrun solves this fundamental challenge.

### Our Philosophy: Standardization Over Customization

Philosophically, Outrun focuses on creating standardized approaches to everything—from standard objects to data cleaning processes. While there are many tools available to create custom data flows, they require intricate system knowledge and significant engineering overhead.

Our approach is different. You add HubSpot as a source, add Zoho CRM as a destination, and when a contact is updated in HubSpot (by a user or workflow), the same lead is automatically updated in Zoho. No understanding of system mechanics required.

**The Trade-off We Make**

By not offering heavy customization, we allow teams to avoid spending time understanding how systems should be integrated or how their data model should be structured. Instead, we offer an opinionated set of tools that lets your team focus on what actually matters: attracting customers, delivering great experiences, growing accounts, and generating actionable insights.

**This means Outrun isn't for everyone.** If you're using tools in ways the vendor doesn't expect—like using HubSpot's deal objects for order processing—this tool isn't for you. There are many other great tools to help you build fully customized solutions.

**Our Vision**

Our ambition extends beyond data synchronization. After establishing this standardization foundation, we plan to add a workflow builder with AI agents that will allow you to automate large portions of your business with a single tool. This will enable rapid adoption of best-in-class capabilities from specialized tools as they come to market, all with the full support of a team of experts in data models and integrations working alongside your team.

---

## Quick Start

New to Outrun? Start with these essential guides:

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="docs-card">
    <h3 class="text-lg font-semibold mb-3">🚀 Quick Start</h3>
    <p class="mb-4">Get up and running with Outrun in minutes. Create your first sync and see your data flow.</p>
    <a href="/docs/getting-started/">Get Started →</a>
  </div>

  <div class="docs-card">
    <h3 class="text-lg font-semibold mb-3">📚 Core Concepts</h3>
    <p class="mb-4">Understand how Outrun standardizes data and creates seamless integrations.</p>
    <a href="/docs/concepts/">Learn More →</a>
  </div>

  <div class="docs-card">
    <h3 class="text-lg font-semibold mb-3">🔌 Integrations</h3>
    <p class="mb-4">Browse our supported sources and destinations to plan your data flows.</p>
    <a href="/docs/integrations/">View All →</a>
  </div>
</div>

## Core Concepts

Understanding these fundamental concepts will help you make the most of Outrun:

- **[Data Syncing](/docs/concepts/data-syncing/)** - How Outrun moves and transforms your data
- **[Providers](/docs/concepts/providers/)** - Source systems where your data originates
- **[Destinations](/docs/concepts/destinations/)** - Target systems where your data goes
- **[Rate Limiting](/docs/concepts/rate-limiting/)** - How we manage API quotas and performance

## Popular Integrations

Connect your most-used tools and services:

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
  <a href="/docs/sources/hubspot/" class="docs-card flex items-center space-x-3 p-4">
    <div class="w-8 h-8 flex items-center justify-center font-bold text-sm docs-avatar-yellow">HS</div>
    <span>HubSpot</span>
  </a>

  <a href="/docs/sources/zoho-crm/" class="docs-card flex items-center space-x-3 p-4">
    <div class="w-8 h-8 flex items-center justify-center font-bold text-sm docs-avatar-pink">Z</div>
    <span>Zoho CRM</span>
  </a>

  <a href="/docs/sources/google-search-console/" class="docs-card flex items-center space-x-3 p-4">
    <div class="w-8 h-8 flex items-center justify-center font-bold text-sm docs-avatar-cyan">G</div>
    <span>Google SC</span>
  </a>

  <a href="/docs/sources/confluence/" class="docs-card flex items-center space-x-3 p-4">
    <div class="w-8 h-8 flex items-center justify-center font-bold text-sm docs-avatar-purple">C</div>
    <span>Confluence</span>
  </a>
</div>

## API Reference

Build custom integrations with our comprehensive API:

- **[Authentication](/docs/api/authentication/)** - Secure API access and authentication methods
- **[Workspaces](/docs/api/workspaces/)** - Manage your organization and team settings
- **[Connections](/docs/api/connections/)** - Create and manage data source connections
- **[Sync Jobs](/docs/api/sync-jobs/)** - Control and monitor your data synchronization jobs
- **[Webhooks](/docs/api/webhooks/)** - Real-time notifications and event handling

## Need Help?

We're here to support you every step of the way:

<div class="docs-card p-6 my-8 border-accent-yellow-subtle">
  <h3 class="text-lg font-semibold mb-3">💬 Get Support</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <h4 class="font-medium mb-2">Community</h4>
      <ul class="space-y-1">
        <li><a href="/docs/support/faq/">FAQ</a></li>
        <li><a href="/docs/support/troubleshooting/">Troubleshooting</a></li>
        <li><a href="/docs/support/changelog/">Changelog</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-medium mb-2">Direct Support</h4>
      <ul class="space-y-1">
        <li><a href="mailto:support@getoutrun.com">Email Support</a></li>
        <li><a href="https://discord.gg/outrun">Discord Community</a></li>
        <li><a href="https://github.com/outrun/outrun">GitHub Issues</a></li>
      </ul>
    </div>
  </div>
</div>

*Last updated: {{ "now" | date: "%B %d, %Y" }}*
