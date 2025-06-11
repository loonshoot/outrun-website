---
layout: layouts/docs.liquid
title: Getting Started
description: Quick start guide for Outrun data synchronization platform. Learn the basics and create your first sync in minutes.
metaTitle: Getting Started with Outrun - Quick Start Guide
metaDescription: Get started with Outrun's data synchronization platform. Step-by-step guide to setup, configuration, and your first data sync.
permalink: /docs/getting-started/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Getting Started
    url: /docs/getting-started/
---

# Getting Started with Outrun

Welcome to Outrun! This guide will help you get up and running with our data synchronization platform quickly and efficiently.

## What is Outrun?

Outrun is a powerful data synchronization platform that automates the movement and transformation of data between your favorite tools and services. Whether you're syncing CRM data to your analytics platform or keeping multiple databases in sync, Outrun makes it simple and reliable.

## Prerequisites

Before you begin, ensure you have:

- Access to the data sources you want to sync
- API credentials or authentication details for your services
- A clear understanding of what data you want to move and where

## Learning Path

Follow this recommended learning path to master Outrun:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-bold text-sm mr-3">1</div>
      <h3 class="text-yellow text-lg font-semibold">Quick Start</h3>
    </div>
    <p class="text-gray-300 mb-4">Get your first sync running in under 5 minutes. Perfect for testing and evaluation.</p>
    <a href="/docs/getting-started/quick-start/" class="text-yellow hover:text-yellow-light transition-colors">Start Now →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-bold text-sm mr-3">2</div>
      <h3 class="text-yellow text-lg font-semibold">Full Installation</h3>
    </div>
    <p class="text-gray-300 mb-4">Complete setup guide for production environments with security best practices.</p>
    <a href="/docs/getting-started/installation/" class="text-yellow hover:text-yellow-light transition-colors">Install →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-bold text-sm mr-3">3</div>
      <h3 class="text-yellow text-lg font-semibold">Configuration</h3>
    </div>
    <p class="text-gray-300 mb-4">Learn how to configure Outrun for your specific environment and requirements.</p>
    <a href="/docs/getting-started/configuration/" class="text-yellow hover:text-yellow-light transition-colors">Configure →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-bold text-sm mr-3">4</div>
      <h3 class="text-yellow text-lg font-semibold">First Sync</h3>
    </div>
    <p class="text-gray-300 mb-4">Step-by-step walkthrough of creating and managing your first data synchronization.</p>
    <a href="/docs/guides/first-sync/" class="text-yellow hover:text-yellow-light transition-colors">Create Sync →</a>
  </div>
</div>

## Key Concepts

Before diving in, familiarize yourself with these fundamental concepts:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h4 class="text-yellow text-lg font-semibold mb-3">🔌 Providers</h4>
    <p class="text-gray-300">Source systems where your data originates (Salesforce, HubSpot, databases, APIs, etc.)</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h4 class="text-yellow text-lg font-semibold mb-3">🎯 Destinations</h4>
    <p class="text-gray-300">Target systems where your data will be delivered (data warehouses, analytics platforms, etc.)</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h4 class="text-yellow text-lg font-semibold mb-3">🔄 Data Syncing</h4>
    <p class="text-gray-300">The process of moving and transforming data between providers and destinations</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h4 class="text-yellow text-lg font-semibold mb-3">⚡ Rate Limiting</h4>
    <p class="text-gray-300">Smart throttling to respect API limits and ensure reliable data transfer</p>
  </div>
</div>

## Common Use Cases

Here are some popular ways teams use Outrun:

### CRM to Analytics
```bash
# Sync Salesforce opportunities to your data warehouse
outrun sync salesforce:opportunities → bigquery:sales_data
```

### Marketing Attribution
```bash
# Combine ad spend and conversion data
outrun sync google-ads:campaigns → mixpanel:events
outrun sync facebook-ads:insights → mixpanel:events
```

### Customer Support
```bash
# Keep support tickets in sync with your CRM
outrun sync zendesk:tickets → hubspot:deals
```

### E-commerce Analytics
```bash
# Track order data across platforms
outrun sync shopify:orders → amplitude:events
```

## Next Steps

Ready to get started? Choose your path:

<div class="flex flex-col sm:flex-row gap-4 my-8">
  <a href="/docs/getting-started/quick-start/" class="flex-1 bg-yellow text-dark text-center py-3 px-6 rounded-lg font-semibold hover:bg-yellow-light transition-colors">
    🚀 Quick Start (5 minutes)
  </a>
  <a href="/docs/getting-started/installation/" class="flex-1 bg-dark-light border border-yellow text-yellow text-center py-3 px-6 rounded-lg font-semibold hover:bg-yellow hover:text-dark transition-colors">
    📚 Full Installation Guide
  </a>
</div>

## Need Help?

- **Community Support**: Join our [Discord community](https://discord.gg/outrun) for real-time help
- **Documentation**: Browse our comprehensive [API documentation](/docs/api/)
- **Email Support**: Reach out to [support@getoutrun.com](mailto:support@getoutrun.com)

---

*Ready to sync your data? Let's get started!* 