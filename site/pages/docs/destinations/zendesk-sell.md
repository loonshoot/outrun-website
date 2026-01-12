---
layout: layouts/docs.liquid
title: Zendesk Sell Integration
description: Complete Zendesk Sell integration with bidirectional sync. Full source and destination support for seamless migration while keeping your CRM operational.
metaTitle: Zendesk Sell Integration - Outrun CRM Migration Platform
metaDescription: Migrate from Zendesk Sell with zero downtime. Bidirectional sync keeps your CRM operational while you transition your team to a new platform.
permalink: /docs/destinations/zendesk-sell/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Destinations
    url: /docs/destinations/
  - title: Zendesk Sell
    url: /docs/destinations/zendesk-sell/
---

# Zendesk Sell Integration

<div class="bg-green-500 bg-opacity-10 border border-green-500  p-6 my-6">
  <h3 class="text-green-400 text-lg font-semibold mb-3">🔄 Bidirectional Sync</h3>
  <p class="text-gray-300">Zendesk Sell is fully supported as both a source and destination, enabling complete bidirectional synchronization with your other CRM platforms.</p>
</div>

<div class="bg-pink-600 bg-opacity-10 border border-pink-600  p-6 my-6">
  <h3 class="text-pink-400 text-lg font-semibold mb-3">⚠️ Zendesk Sell Discontinuation Notice</h3>
  <p class="text-gray-300">Zendesk has announced the discontinuation of Zendesk Sell. Outrun provides the perfect migration path to transition your data to a new CRM platform without disruption. Keep Zendesk Sell running while you evaluate and transition your team and processes to your new system.</p>
</div>

## Why Choose Outrun for Zendesk Sell Migration?

### ✅ Zero Downtime
Continue using Zendesk Sell while we prepare your new CRM. No rush, no pressure, no business disruption.

### 🔄 Complete Data Transfer
Every lead, contact, deal, and activity. Custom fields, tags, and complete history preserved.

### 🎯 Choose Your Destination
Migrate to any of our supported CRMs:
- **HubSpot**: All-in-one growth platform
- **Pipedrive**: Sales-focused simplicity
- **Zoho CRM**: Comprehensive suite

### 🚀 Fast Implementation
Get started in minutes, complete migration in days, not months.

## Supported Zendesk Sell Data

We migrate ALL your Zendesk Sell data:

### 👥 Contacts
- **Person records**: All contact information
- **Company records**: Organization data
- **Custom fields**: Every custom field preserved
- **Tags**: Complete tag structure
- **Contact roles**: Relationships maintained

### 💼 Deals
- **Pipeline stages**: Complete pipeline mapping
- **Deal values**: Revenue and probability
- **Custom fields**: All deal-specific fields
- **Deal contacts**: Associated contacts
- **Products**: Line items and pricing
- **Deal history**: Complete audit trail

### 📧 Activities
- **Emails**: Full email history
- **Calls**: Call logs and recordings links
- **Meetings**: Calendar events
- **Tasks**: To-dos and reminders
- **Notes**: All notes preserved
- **SMS**: Text message history

### 🎯 Leads
- **Lead sources**: Attribution data
- **Lead status**: Qualification stages
- **Lead scoring**: Score preservation
- **Conversion history**: Lead to deal tracking
- **Custom fields**: All lead fields

## Migration Process

### Step 1: Initial Assessment
```
1. Connect Zendesk Sell (read-only access)
2. Analyze your data structure
3. Review custom fields and pipelines
4. Get migration timeline estimate
```

### Step 2: Choose Target CRM
Select your new CRM platform and we'll:
- Map all standard fields automatically
- Identify custom field requirements
- Propose pipeline stage mapping
- Highlight any data considerations

### Step 3: Test Migration
- Run test migration with sample data
- Validate field mappings
- Review data in target CRM
- Adjust mappings as needed

### Step 4: Full Migration
- Schedule migration window
- Complete initial data sync
- Enable 15-minute incremental syncs
- Keep both systems synchronized

### Step 5: Transition
- Train team on new CRM
- Run both systems in parallel
- Gradually transition workflows
- Decommission Zendesk Sell when ready

## Data Mapping Examples

### To HubSpot
```
Zendesk Sell → HubSpot
━━━━━━━━━━━━━━━━━━━━━━
Contacts     → Contacts
Companies    → Companies
Deals        → Deals
Leads        → Contacts (lifecycle stage)
Activities   → Activities
```

### To Pipedrive
```
Zendesk Sell → Pipedrive
━━━━━━━━━━━━━━━━━━━━━━━━
Contacts     → Persons
Companies    → Organizations
Deals        → Deals
Leads        → Leads
Activities   → Activities
```

## Authentication

Zendesk Sell integration uses OAuth 2.0:

1. **OAuth Authorization**: Secure token-based access
2. **API Scope**: Read and write permissions
3. **Webhook Support**: Real-time updates during migration
4. **Rate Limits**: Automatically managed

## Custom Field Handling

### Automatic Mapping
- Text fields → Text fields
- Number fields → Number fields
- Date fields → Date fields
- Dropdowns → Picklists
- Multi-select → Multi-select

### Custom Field Creation
We can automatically create custom fields in your target CRM:
- Matching field types
- Preserving field names
- Maintaining dropdown values
- Keeping field relationships

## Common Migration Scenarios

### 📊 Sales Team Migration
Moving your sales team to a new platform?
- Preserve all pipeline stages
- Maintain deal probabilities
- Keep activity history
- Transfer team hierarchies

### 🤝 CRM Consolidation
Merging Zendesk Sell with another CRM?
- Deduplicate records intelligently
- Merge activity histories
- Combine custom fields
- Unify data model

### 🔄 Gradual Transition
Need time to transition?
- Keep Zendesk Sell running
- Sync changes bi-directionally
- Train team gradually
- Switch when ready

## Best Practices

### Before Migration
1. **Audit your data**: Clean up duplicates
2. **Document processes**: Note workflows to recreate
3. **Map users**: Ensure user accounts in new CRM
4. **Backup data**: Export Zendesk Sell backup

### During Migration
1. **Communicate timeline**: Keep team informed
2. **Test thoroughly**: Validate sample data first
3. **Monitor sync**: Check initial results
4. **Document issues**: Track any concerns

### After Migration
1. **Verify data**: Spot-check migrated records
2. **Train users**: Ensure team adoption
3. **Monitor adoption**: Track usage metrics
4. **Optimize workflows**: Improve processes

## Timeline Estimates

| Data Volume | Initial Sync | Testing | Go-Live |
|------------|--------------|---------|---------|
| < 10K records | 2-4 hours | 1 day | 2-3 days |
| 10K-50K records | 4-8 hours | 2 days | 3-5 days |
| 50K-200K records | 8-24 hours | 3 days | 5-7 days |
| > 200K records | 1-3 days | 5 days | 7-14 days |

## Pricing

Special pricing for Zendesk Sell migrations:
- **Free assessment**: Data analysis and migration plan
- **Flexible pricing**: Based on record count
- **No lock-in**: Month-to-month after migration
- **Support included**: Priority migration support

## Frequently Asked Questions

### Can I keep using Zendesk Sell during migration?
Yes! Keep Zendesk Sell running throughout the migration. We sync changes continuously.

### What about custom integrations?
We'll help identify integration requirements and can assist with recreating them in your new CRM.

### How long do I have to migrate?
While Zendesk hasn't announced a hard deadline, we recommend starting soon to ensure a smooth transition.

### Can I migrate to multiple CRMs?
Yes, you can sync Zendesk Sell data to multiple CRMs simultaneously.

### What about historical data?
We preserve complete historical data including all activities, notes, and communication history.

## Get Started Today

Don't wait for Zendesk Sell discontinuation to disrupt your business. Start your migration today:

<div class="bg-yellow-400 text-dark p-6 my-8">
  <h3 class="text-2xl font-bold mb-4">🚀 Special Offer for Zendesk Sell Users</h3>
  <ul class="mb-6">
    <li>✓ Free migration assessment</li>
    <li>✓ Priority onboarding</li>
    <li>✓ Dedicated migration specialist</li>
    <li>✓ 30-day money-back guarantee</li>
  </ul>
  <a href="https://app.getoutrun.com" class="inline-block bg-dark text-light px-8 py-3 font-mono font-bold hover:bg-gray-800">
    Start Free Migration Assessment →
  </a>
</div>

## Support

Our team is here to help with your Zendesk Sell migration:

- 📧 Email: zendesk-migration@getoutrun.com
- 💬 Priority Chat: For Zendesk Sell users
- 📞 Phone Support: Migration consultation
- 📖 Resources: [Migration Guide](/docs/migrations/)
- 🎯 Success Manager: For volume migrations

## Next Steps

<div class="flex gap-4 mt-8">
  <a href="https://app.getoutrun.com" class="bg-yellow-400 text-dark px-6 py-3 font-mono font-bold hover:bg-yellow-300">
    Start Migration →
  </a>
  <a href="/docs/destinations/" class="border border-light text-light px-6 py-3 font-mono hover:bg-dark">
    Compare CRM Options
  </a>
</div>