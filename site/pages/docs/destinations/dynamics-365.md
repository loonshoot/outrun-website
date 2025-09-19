---
layout: layouts/docs.liquid
title: Microsoft Dynamics 365 Integration
description: Complete integration for Dynamics 365 Sales, Marketing, and Customer Service. Migrate, synchronize, and unify your Microsoft CRM data.
metaTitle: Dynamics 365 Integration - Outrun CRM Migration & Sync
metaDescription: Comprehensive guide to Dynamics 365 CRM integration via Outrun. Support for Sales, Marketing, and Service clouds with full data preservation.
permalink: /docs/destinations/dynamics-365/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Integrations
    url: /docs/destinations/
  - title: Dynamics 365
    url: /docs/destinations/dynamics-365/
---

# Microsoft Dynamics 365 Integration

Enterprise-grade integration for all Dynamics 365 CRM modules including Sales, Marketing, and Customer Service. Perfect for organizations migrating to or from Dynamics 365 or synchronizing with other CRM systems.

<div class="bg-blue-500 bg-opacity-10 border border-blue-500  p-6 my-6">
  <h3 class="text-blue-400 text-lg font-semibold mb-3">🏢 Enterprise Platform Support</h3>
  <p class="text-gray-300">Full support for Dynamics 365 Sales, Marketing, and Customer Service clouds. On-premise and cloud deployments supported.</p>
</div>

## Supported Dynamics 365 Modules

### 💼 Dynamics 365 Sales
Complete sales automation data synchronization:

- **Leads**: Full lead lifecycle management
- **Opportunities**: Pipeline and forecast data
- **Accounts**: Company hierarchies and relationships
- **Contacts**: Complete contact management
- **Quotes**: Quote to cash process
- **Orders**: Order management integration
- **Products**: Product catalog sync

### 📢 Dynamics 365 Marketing
Marketing automation and campaign data:

- **Marketing Lists**: Segmentation and targeting
- **Campaigns**: Campaign performance data
- **Customer Journeys**: Automation workflows
- **Email Marketing**: Template and send history
- **Events**: Event management data
- **Forms**: Lead capture forms
- **Landing Pages**: Page performance metrics

### 🎧 Dynamics 365 Customer Service
Complete service desk integration:

- **Cases**: Ticket and case management
- **Knowledge Base**: Article synchronization
- **SLAs**: Service level agreements
- **Entitlements**: Customer entitlements
- **Queues**: Work distribution
- **Routing Rules**: Automatic assignment

## Data Mapping

Our platform handles Dynamics 365's complex data model:

```
Outrun Standard Model → Dynamics 365 Entities
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
People               → Contacts
Organizations        → Accounts
Opportunities        → Opportunities
Leads               → Leads
Activities          → Activities
Cases               → Incidents
Products            → Products
```

## Advanced Features

### 🔐 Security & Compliance
- **Role-based access**: Full security role support
- **Field-level security**: Granular permissions
- **Business units**: Organizational structure
- **Teams**: Collaborative access control
- **Audit logs**: Complete audit trail

### 🔄 Data Synchronization
- **15-minute sync cycles**: Near real-time updates
- **Bi-directional sync**: Two-way data flow
- **Custom entities**: Support for custom objects
- **Relationships**: Complex relationship preservation
- **Attachments**: File and document sync

### 🎯 Business Logic
- **Workflows**: Process automation support
- **Business rules**: Validation and defaults
- **Plugins**: Custom logic compatibility
- **Duplicate detection**: Intelligent deduplication

## Getting Started

### Step 1: Connect Dynamics 365
1. Access the [Outrun Dashboard](https://app.getoutrun.com)
2. Select "Add Integration"
3. Choose Microsoft Dynamics 365
4. Select your deployment type (Cloud/On-Premise)
5. Authenticate with Azure AD

### Step 2: Select Modules
- Choose Sales, Marketing, Service, or all
- Configure module-specific settings
- Map custom entities
- Set synchronization rules

### Step 3: Configure Sync
- Define sync direction
- Map custom fields
- Set conflict resolution
- Configure security mappings

## Authentication Methods

### Cloud Deployment (Dynamics 365 Online)
- **Azure AD OAuth**: Modern authentication
- **Application ID**: Service principal support
- **Delegated permissions**: User context sync
- **Certificate auth**: Enhanced security

### On-Premise Deployment
- **Windows Authentication**: Domain credentials
- **Claims-based**: ADFS support
- **IFD Configuration**: Internet-facing deployment
- **SSL/TLS**: Encrypted connections

## Field Mapping

### Standard Field Mappings

| Outrun Field | Dynamics 365 Field | Entity |
|-------------|-------------------|--------|
| person.email | emailaddress1 | contact |
| person.firstName | firstname | contact |
| person.lastName | lastname | contact |
| org.name | name | account |
| org.website | websiteurl | account |
| opportunity.value | estimatedvalue | opportunity |
| opportunity.closeDate | estimatedclosedate | opportunity |

### Custom Fields
- **Option sets**: Automatic value mapping
- **Lookups**: Relationship preservation
- **Multi-select**: Array field support
- **Calculated fields**: Read-only sync
- **Rollup fields**: Aggregate data support

## Migration Scenarios

### 🚀 Moving to Dynamics 365
Migrating from another CRM? We handle:
- Complete data migration
- Historical activity preservation
- Custom field creation
- Security role mapping
- Business process flows

### 🔄 Moving from Dynamics 365
Transitioning to another platform?
- Full data export
- Relationship preservation
- Attachment migration
- Audit history export
- Metadata documentation

### 🤝 Multi-CRM Synchronization
Using Dynamics 365 alongside other CRMs?
- Real-time synchronization
- Unified data model
- Conflict resolution
- Cross-system workflows

## Use Cases

### Global Enterprises
- Multi-subsidiary synchronization
- Regional CRM consolidation
- M&A integrations
- Global reporting

### Sales & Marketing Alignment
- Lead to opportunity flow
- Marketing qualified leads
- Campaign ROI tracking
- Account-based marketing

### Service Integration
- Case escalation to sales
- Customer 360 view
- Service history in sales
- Upsell opportunities

## Best Practices

1. **Security first**: Configure security roles before sync
2. **Test thoroughly**: Use sandbox environment first
3. **Map carefully**: Review all entity mappings
4. **Monitor performance**: Check sync metrics regularly
5. **Document customizations**: Track custom field mappings
6. **Plan rollout**: Phased approach for large datasets

## Performance Optimization

- **Batch processing**: Efficient bulk operations
- **Delta sync**: Only changed records
- **Parallel processing**: Multi-threaded sync
- **Rate limit management**: Automatic throttling
- **Error recovery**: Automatic retry logic

## Support

Need assistance with Dynamics 365 integration?

- 📧 Email: enterprise@getoutrun.com
- 📖 Documentation: [API Reference](/docs/)
- 💬 Priority Chat: For enterprise customers
- 📞 Phone Support: Available for Enterprise tier
- 🎯 Dedicated Success Manager: Enterprise accounts

## Compliance & Certifications

- **ISO 27001**: Information security
- **SOC 2 Type II**: Security & availability
- **GDPR**: Data privacy compliance
- **HIPAA**: Healthcare compliance available
- **Microsoft Partner**: Certified integration

## Next Steps

<div class="flex gap-4 mt-8">
  <a href="https://app.getoutrun.com" class="bg-yellow-400 text-dark px-6 py-3 font-mono font-bold hover:bg-yellow-300">
    Connect Dynamics 365 →
  </a>
  <a href="/docs/destinations/" class="border border-light text-light px-6 py-3 font-mono hover:bg-dark">
    View All Integrations
  </a>
</div>