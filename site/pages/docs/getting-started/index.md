---
layout: layouts/docs.liquid
title: Getting Started
description: Get started with Outrun in under 10 minutes. Create your account, connect your first source, and set up data synchronization.
metaTitle: Getting Started with Outrun - Quick Start Guide
metaDescription: Step-by-step quick start guide for Outrun. Create account, connect sources, authenticate, and start syncing data in minutes.
permalink: /docs/getting-started/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Getting Started
    url: /docs/getting-started/
---

# Getting Started with Outrun

Get your first data sync running in under 10 minutes. This guide will walk you through creating an account, connecting your first source, and setting up a destination.

## Step 1: Create Your Account

Your Outrun account is personal to you and designed for security and simplicity.

<div class="bg-dark-light border border-gray-600 rounded-lg p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">🔐 Why Magic Links?</h3>
  <p class="text-gray-300">We use magic links instead of passwords because we don't want to store your passwords. This approach also sets us up perfectly for the SSO features we have planned for later.</p>
</div>

1. **Visit** [app.getoutrun.com](https://app.getoutrun.com)
2. **Enter your email** address
3. **Check your inbox** for the magic link
4. **Click the link** to access your account

That's it! You're now logged into Outrun.

## Step 2: Create Your First Source

Sources are where your data comes from. We currently support **{{ sources.count }}** different sources.

1. **Navigate to Sources** in the left sidebar
2. **Click "Add Source"** 
3. **Select your source type** - for this guide, we'll use **HubSpot**

<div class="bg-yellow bg-opacity-10 border border-yellow rounded-lg p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">💡 Pro Tip</h3>
  <p class="text-gray-300">Start with a source that has data you're familiar with. HubSpot is great for testing because it has clear contact and company structures.</p>
</div>

## Step 3: Authenticate Your Source

Next, you'll need to connect Outrun to your HubSpot account.

1. **Select your token type** - you can have multiple tokens, but add one to get started
2. **Click "Authenticate with OAuth"** 
3. **Complete the OAuth flow** in the popup window
4. **Grant permissions** when prompted

<div class="bg-dark-light border border-gray-600 rounded-lg p-6 my-6">
  <h4 class="text-light font-semibold mb-3">🔒 What We Store</h4>
  <ul class="text-gray-300 space-y-2">
    <li>• Your OAuth access token (encrypted)</li>
    <li>• A refresh token so we can pull data continuously</li>
    <li>• Permission scopes you've granted</li>
  </ul>
  <p class="text-gray-300 mt-3">This allows us to keep your data in sync automatically without you having to re-authenticate.</p>
</div>

## Step 4: Name Your Source

We allow you to name your sources because some organizations have multiple instances of the same application.

1. **Enter a descriptive name** (e.g., "HubSpot Production", "HubSpot EMEA", "Main HubSpot")
2. **Add a description** (optional but recommended)
3. **Click "Save Source"**

## Step 5: Complete Your Integration

Your source will start syncing immediately after setup.

<div class="bg-dark-light border border-gray-600 rounded-lg p-6 my-6">
  <h4 class="text-light font-semibold mb-3">⚡ Rate Limiting</h4>
  <p class="text-gray-300">Outrun uses standard rate limiting to manage requests at a volume the service can handle. If you have higher API limits, let us know—we're interested in how this feature might offer some customization options.</p>
</div>

**What happens during sync:**

1. **Initial data pull** - We fetch all existing data from your source
2. **Stream creation** - Raw data goes into a `_stream` (all data we ever receive)
3. **Consolidation** - Data gets merged and cleaned into `_consolidate` 
4. **Standardization** - Data transforms into standardized objects:
   - **Facts** - Events and activities
   - **Organizations** - Companies and accounts  
   - **People** - Contacts and users
   - **Relationships** - Connections between entities

## Step 6: Wait for Initial Sync

**⏱️ Be patient!** Depending on your company size, initial syncs can take time. Systems with lots of data need more time to process.

<div class="bg-yellow bg-opacity-10 border border-yellow rounded-lg p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚠️ Important</h3>
  <p class="text-gray-300">We recommend waiting for your initial sync to complete before adding your first destination. This ensures clean, complete data transfer.</p>
</div>

**You can monitor progress in:**
- The Sources dashboard
- Sync logs and status indicators
- Real-time sync statistics

## Step 7: Add Your First Destination

Once your source sync is complete, add where you want the data to go.

1. **Navigate to Destinations** in the sidebar
2. **Click "Add Destination"**
3. **Select your destination type** (Salesforce, data warehouse, etc.)
4. **Follow the same authentication process** as with sources
5. **Name your destination** descriptively
6. **Configure field mappings** (optional - we provide smart defaults)

## Step 8: Automatic Sync Begins

🎉 **You're done!** Outrun now listens for changes to your standardized facts, organizations, people, and relationships, then alerts your destination system to changes automatically.

**What happens next:**
- Real-time change detection
- Automatic data transformation
- Continuous sync between systems
- Conflict resolution and deduplication

## Monitoring Your Sync

Track your data synchronization through:

- **Dashboard overview** - High-level sync statistics
- **Sync logs** - Detailed operation history  
- **Error alerts** - Immediate notification of issues
- **Data lineage** - Track data flow between systems

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📚 Core Concepts</h3>
    <p class="text-gray-300 mb-4">Learn about standardized objects, data transformation, and Outrun's philosophy.</p>
    <a href="/docs/concepts/" class="text-yellow hover:text-yellow-light transition-colors">Learn More →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔌 Browse Integrations</h3>
    <p class="text-gray-300 mb-4">Explore all supported sources and destinations for your data ecosystem.</p>
    <a href="/docs/integrations/" class="text-yellow hover:text-yellow-light transition-colors">View All →</a>
  </div>
</div>

## Need Help?

- **Discord Community**: [Join our Discord](https://discord.gg/outrun) for real-time support
- **Email Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Documentation**: Browse our [full documentation](/docs/)

---

*🚀 Congratulations! You've successfully set up your first data sync with Outrun.* 