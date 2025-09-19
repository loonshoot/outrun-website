---
layout: layouts/docs.liquid
title: Sources
description: Connect your data sources to Outrun. Learn about supported systems, object mappings, and configuration options.
metaTitle: Outrun Sources - Supported Data Sources and Integrations
metaDescription: Complete guide to Outrun's supported data sources including HubSpot, Salesforce, Zoho CRM, Confluence, and Google Search Console.
permalink: /docs/sources/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
---

# Sources

Sources are where your data originates. Outrun connects to your existing systems, extracts data using their APIs, and transforms it into standardized objects that can flow seamlessly to any destination.

## How Sources Work

When you connect a source to Outrun:

1. **Authentication** - We securely connect using OAuth or API keys
2. **Initial Sync** - We pull all existing data from your system
3. **Standardization** - Raw data transforms into Facts, Organizations, People, and Relationships
4. **Continuous Sync** - We monitor for changes and keep data current

## Supported Sources

We currently support **{{ sources.count }}** different source systems:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <a href="/docs/sources/hubspot/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-orange-500  flex items-center justify-center text-white font-bold text-lg">HS</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">HubSpot</h3>
        <p class="text-gray-400 text-sm">CRM & Marketing Platform</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Contacts, Companies, and relationship data from your HubSpot CRM.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">People</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Organizations</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Relationships</span>
    </div>
  </a>

  <a href="/docs/sources/salesforce/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-blue-500  flex items-center justify-center text-white font-bold text-lg">SF</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">Salesforce</h3>
        <p class="text-gray-400 text-sm">Enterprise CRM Platform</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Contacts, Accounts, Leads, and Products from your Salesforce org.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">People</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Organizations</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Products</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Relationships</span>
    </div>
  </a>

  <a href="/docs/sources/zoho-crm/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-red-500  flex items-center justify-center text-white font-bold text-lg">Z</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">Zoho CRM</h3>
        <p class="text-gray-400 text-sm">Business CRM Suite</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Leads, Contacts, Accounts, and related records from Zoho CRM.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">People</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Organizations</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Relationships</span>
    </div>
  </a>

  <a href="/docs/sources/confluence/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-blue-600  flex items-center justify-center text-white font-bold text-lg">C</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">Confluence</h3>
        <p class="text-gray-400 text-sm">Team Collaboration</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Pages, blog posts, and document relationships from Confluence.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Documents</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Relationships</span>
    </div>
  </a>

  <a href="/docs/sources/google-search-console/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-green-500  flex items-center justify-center text-white font-bold text-lg">G</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">Google Search Console</h3>
        <p class="text-gray-400 text-sm">SEO Analytics</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Search analytics, clicks, impressions, and performance data.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Facts</span>
    </div>
  </a>
</div>

## Standardized Objects

All sources transform their native data into these standardized objects:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">👥 People</h3>
    <p class="text-gray-300 mb-3">Contacts, leads, users, and individuals from any system.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Email addresses and phone numbers</li>
      <li>• Names and job titles</li>
      <li>• Addresses and social profiles</li>
      <li>• Company associations</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🏢 Organizations</h3>
    <p class="text-gray-300 mb-3">Companies, accounts, and business entities.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Company names and domains</li>
      <li>• Industry and size information</li>
      <li>• Contact details and addresses</li>
      <li>• Revenue and employee data</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔗 Relationships</h3>
    <p class="text-gray-300 mb-3">Connections between people and organizations.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Person-to-organization employment</li>
      <li>• Organization-to-organization partnerships</li>
      <li>• Person-to-person connections</li>
      <li>• Custom relationship types</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📊 Facts</h3>
    <p class="text-gray-300 mb-3">Events, activities, and measurable data points.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Analytics and performance metrics</li>
      <li>• User activities and interactions</li>
      <li>• Time-series data</li>
      <li>• Custom events and measurements</li>
    </ul>
  </div>
</div>

## Rate Limiting & Performance

Each source has carefully tuned rate limits to respect API quotas while maximizing sync speed:

- **HubSpot**: 110 requests per 10 seconds (default), 5 per second (search)
- **Salesforce**: 100 requests per 10 seconds, with PubSub support for real-time updates
- **Zoho CRM**: 5-8 requests per 10 seconds depending on operation type
- **Confluence**: 50 requests per 10 seconds (default), 3 per second (search)
- **Google Search Console**: 2000 requests per minute

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🚀 Add Your First Source</h3>
    <p class="text-gray-300 mb-4">Follow our step-by-step guide to connect your first data source.</p>
    <a href="/docs/getting-started/" class="text-yellow hover:text-yellow-light transition-colors">Get Started →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🎯 Browse Destinations</h3>
    <p class="text-gray-300 mb-4">See where you can send your standardized data.</p>
    <a href="/docs/destinations/" class="text-yellow hover:text-yellow-light transition-colors">View Destinations →</a>
  </div>
</div>

---

*Need a source that's not listed? [Contact us](mailto:support@getoutrun.com) to discuss custom integrations.* 