---
layout: layouts/docs.liquid
title: Pipedrive Integration
description: Migrate to or from Pipedrive CRM. Sync deals, contacts, organizations and activities with complete data preservation.
metaTitle: Pipedrive Integration - Outrun CRM Migration & Sync
metaDescription: Complete guide to migrating to/from Pipedrive CRM via Outrun. Bi-directional sync, field mappings, and 15-minute sync cycles.
permalink: /docs/destinations/pipedrive/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Integrations
    url: /docs/destinations/
  - title: Pipedrive
    url: /docs/destinations/pipedrive/
---

# Pipedrive Integration

Complete bi-directional sync and migration support for Pipedrive CRM. Perfect for teams migrating to Pipedrive or synchronizing with other CRM systems.

<div class="bg-green-500 bg-opacity-10 border border-green-500  p-6 my-6">
  <h3 class="text-green-400 text-lg font-semibold mb-3">🚀 Full Migration Support</h3>
  <p class="text-gray-300">Migrate from any CRM to Pipedrive or from Pipedrive to another system with zero data loss. Keep both systems running during transition.</p>
</div>

## Supported Pipedrive Objects

We support comprehensive data synchronization for all core Pipedrive objects:

### 🤝 Deals
- **Pipeline stages preserved**: Complete pipeline and stage mapping
- **Custom fields**: All custom deal fields supported
- **Activities**: Full activity history maintained
- **Products**: Product line items and pricing

### 👥 Persons (Contacts)
- **Contact details**: Email, phone, address
- **Custom fields**: All custom person fields
- **Organizations**: Linked organization relationships
- **Activities**: Meeting, call, and email history

### 🏢 Organizations
- **Company information**: All standard and custom fields
- **Relationships**: Person and deal associations
- **Address data**: Multiple addresses supported
- **Custom fields**: Industry-specific fields preserved

### 📋 Activities
- **Types**: Calls, meetings, emails, tasks
- **Due dates**: Timeline preservation
- **Participants**: All linked contacts maintained
- **Notes**: Complete activity notes and outcomes

## Data Mapping

Our intelligent mapping engine automatically handles Pipedrive's unique structure:

```
Outrun Standard Model → Pipedrive Objects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
People               → Persons
Organizations        → Organizations
Opportunities        → Deals
Activities          → Activities
Products            → Products
```

## Sync Features

### ⚡ 15-Minute Sync Cycles
- Near real-time data synchronization
- Bi-directional updates
- Conflict resolution
- Change detection

### 🔄 Migration Mode
- Keep Pipedrive running during migration
- Test new CRM while maintaining Pipedrive
- Gradual transition support
- Rollback capability

## Getting Started

### Step 1: Connect Pipedrive
1. Navigate to the [Outrun Dashboard](https://app.getoutrun.com)
2. Click "Add Integration"
3. Select Pipedrive
4. Authorize with your Pipedrive API token

### Step 2: Configure Sync
- Select sync direction (one-way or bi-directional)
- Map custom fields
- Set sync frequency
- Configure conflict resolution

### Step 3: Start Syncing
- Initial data import
- Ongoing 15-minute sync cycles
- Monitor sync status in dashboard
- Review sync logs

## API Configuration

Pipedrive integration uses API token authentication:

1. **API Token**: Found in Pipedrive Settings → Personal → API
2. **Permissions**: Requires read/write access to all objects
3. **Rate Limits**: Automatically managed by Outrun
4. **Webhook Support**: Real-time updates via webhooks

## Field Mapping

### Standard Field Mappings

| Outrun Field | Pipedrive Field | Notes |
|-------------|-----------------|-------|
| person.email | person.email | Primary email |
| person.firstName | person.first_name | Given name |
| person.lastName | person.last_name | Family name |
| org.name | organization.name | Company name |
| org.domain | organization.address | Website URL |
| opportunity.amount | deal.value | Deal value |
| opportunity.stage | deal.stage_id | Pipeline stage |

### Custom Fields
- All custom fields automatically detected
- Intelligent type matching
- Custom field creation in target system
- Dropdown/picklist value mapping

## Use Cases

### 🔄 CRM Migration
Moving from another CRM to Pipedrive? We handle:
- Complete historical data transfer
- Pipeline and stage mapping
- Custom field migration
- Activity history preservation

### 🤝 Multi-CRM Sync
Using Pipedrive for sales and another CRM for marketing?
- Keep both systems in perfect sync
- Unified customer view
- No duplicate data entry
- Automatic conflict resolution

### 📊 Data Backup
- Continuous backup of Pipedrive data
- Point-in-time recovery
- Data archival
- Compliance requirements

## Best Practices

1. **Start with a test sync**: Use a sandbox or test data first
2. **Map custom fields carefully**: Review all field mappings
3. **Monitor initial sync**: Check first sync cycle results
4. **Set up notifications**: Configure alerts for sync issues
5. **Regular validation**: Periodically verify data accuracy

## Support

Need help with your Pipedrive integration?

- 📧 Email: support@getoutrun.com
- 📖 Documentation: [Full API Docs](/docs/)
- 💬 Chat: Available in dashboard
- 🎯 Priority Support: For enterprise customers

## Next Steps

<div class="flex gap-4 mt-8">
  <a href="https://app.getoutrun.com" class="bg-yellow-400 text-dark px-6 py-3 font-mono font-bold hover:bg-yellow-300">
    Connect Pipedrive →
  </a>
  <a href="/docs/destinations/" class="border border-light text-light px-6 py-3 font-mono hover:bg-dark">
    View All Integrations
  </a>
</div>