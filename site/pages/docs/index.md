---
layout: layouts/docs.liquid
title: Documentation
description: Complete documentation for Outrun's data synchronization platform. Learn how to integrate, configure, and manage your data pipelines.
metaTitle: Outrun Documentation - Data Sync Platform Guide
metaDescription: Comprehensive documentation for Outrun's data synchronization platform. Integration guides, API reference, and best practices.
permalink: /docs/
breadcrumbs:
  - title: Documentation
    url: /docs/
---

# Welcome to Outrun Documentation

Outrun is a powerful data synchronization platform that helps you seamlessly sync data between your favorite tools and services. This documentation will guide you through everything you need to know to get started and make the most of Outrun.

## Quick Start

New to Outrun? Start with these essential guides:

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🚀 Quick Start</h3>
    <p class="text-gray-300 mb-4">Get up and running with Outrun in minutes. Create your first sync and see your data flow.</p>
    <a href="/docs/getting-started/quick-start/" class="text-yellow hover:text-yellow-light transition-colors">Get Started →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">⚙️ Installation</h3>
    <p class="text-gray-300 mb-4">Learn how to install and configure Outrun for your specific environment and needs.</p>
    <a href="/docs/getting-started/installation/" class="text-yellow hover:text-yellow-light transition-colors">Install Now →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔌 Your First Sync</h3>
    <p class="text-gray-300 mb-4">Step-by-step guide to creating your first data synchronization between services.</p>
    <a href="/docs/guides/first-sync/" class="text-yellow hover:text-yellow-light transition-colors">Create Sync →</a>
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
  <a href="/docs/providers/salesforce/" class="flex items-center space-x-3 p-4 bg-dark-light border border-gray-600 rounded-lg hover:border-yellow transition-colors">
    <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">SF</div>
    <span class="text-light">Salesforce</span>
  </a>
  
  <a href="/docs/providers/hubspot/" class="flex items-center space-x-3 p-4 bg-dark-light border border-gray-600 rounded-lg hover:border-yellow transition-colors">
    <div class="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">HS</div>
    <span class="text-light">HubSpot</span>
  </a>
  
  <a href="/docs/providers/google-search-console/" class="flex items-center space-x-3 p-4 bg-dark-light border border-gray-600 rounded-lg hover:border-yellow transition-colors">
    <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">G</div>
    <span class="text-light">Google SC</span>
  </a>
  
  <a href="/docs/providers/confluence/" class="flex items-center space-x-3 p-4 bg-dark-light border border-gray-600 rounded-lg hover:border-yellow transition-colors">
    <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">C</div>
    <span class="text-light">Confluence</span>
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

<div class="bg-yellow bg-opacity-10 border border-yellow rounded-lg p-6 my-8">
  <h3 class="text-yellow text-lg font-semibold mb-3">💬 Get Support</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <h4 class="font-medium text-light mb-2">Community</h4>
      <ul class="space-y-1 text-gray-300">
        <li><a href="/docs/support/faq/" class="hover:text-yellow transition-colors">FAQ</a></li>
        <li><a href="/docs/support/troubleshooting/" class="hover:text-yellow transition-colors">Troubleshooting</a></li>
        <li><a href="/docs/support/changelog/" class="hover:text-yellow transition-colors">Changelog</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-medium text-light mb-2">Direct Support</h4>
      <ul class="space-y-1 text-gray-300">
        <li><a href="mailto:support@getoutrun.com" class="hover:text-yellow transition-colors">Email Support</a></li>
        <li><a href="https://discord.gg/outrun" class="hover:text-yellow transition-colors">Discord Community</a></li>
        <li><a href="https://github.com/outrun/outrun" class="hover:text-yellow transition-colors">GitHub Issues</a></li>
      </ul>
    </div>
  </div>
</div>

---

*Last updated: {{ "now" | date: "%B %d, %Y" }}* 