---
layout: layouts/docs.liquid
title: Salesforce Destination
description: Send standardized data to Salesforce CRM. Write People to Contacts and Organizations to Accounts with enterprise-grade validation and processing.
metaTitle: Salesforce Destination - Outrun Integration Documentation
metaDescription: Complete guide to sending data to Salesforce CRM via Outrun. Field mappings, validation rules, and enterprise features for destination sync.
permalink: /docs/destinations/salesforce/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Destinations
    url: /docs/destinations/
  - title: Salesforce
    url: /docs/destinations/salesforce/
---

# Salesforce Destination

Send your standardized People and Organizations data to Salesforce CRM. Salesforce destination provides enterprise-grade data delivery with comprehensive validation and Salesforce-specific features.

<div class="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-6 my-6">
  <h3 class="text-blue-400 text-lg font-semibold mb-3">⚡ Enterprise Destination</h3>
  <p class="text-gray-300">Salesforce destination includes enterprise features like validation rule compliance, trigger compatibility, and comprehensive field-level security support.</p>
</div>

## Supported Object Mappings

Salesforce destination accepts the following standardized objects:

### 👥 People → Contacts
- **Target Object**: Salesforce Contacts
- **Required Fields**: Email address
- **Default Fields**: Email, first name, last name
- **Key Features**: Account association, validation rule compliance, trigger compatibility

### 🏢 Organizations → Accounts
- **Target Object**: Salesforce Accounts
- **Required Fields**: Account name
- **Default Fields**: Account name, domain
- **Key Features**: Hierarchy support, territory management, validation compliance

## Authentication

Salesforce destination uses OAuth 2.0 with Connected App requirements:

1. **OAuth Flow**: Salesforce OAuth 2.0 with refresh tokens
2. **Connected App**: Requires dedicated Connected App configuration
3. **Scopes Required**:
   - `api` - Access to Salesforce APIs
   - `refresh_token` - Offline access
   - `id` - User identity information
4. **Security**: IP restrictions and session policies respected
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### People → Contacts

| Outrun Field | Salesforce Field | Required | Type | Description |
|--------------|------------------|----------|------|-------------|
| `emailAddress` | `Email` | ✅ | String | Primary email address (required) |
| `firstName` | `FirstName` | ❌ | String | Contact's first name |
| `lastName` | `LastName` | ❌ | String | Contact's last name |
| `phoneNumbers[].number` | `Phone` | ❌ | String | Primary phone number |
| `phoneNumbers[].number` | `MobilePhone` | ❌ | String | Mobile phone number |
| `addresses[].street` | `MailingStreet` | ❌ | String | Mailing street address |
| `addresses[].city` | `MailingCity` | ❌ | String | Mailing city |
| `addresses[].state` | `MailingState` | ❌ | String | Mailing state/province |
| `addresses[].country` | `MailingCountry` | ❌ | String | Mailing country |
| `addresses[].postalCode` | `MailingPostalCode` | ❌ | String | Mailing postal code |
| `associations[].role` | `Title` | ❌ | String | Job title |
| `associations[].id` | `AccountId` | ❌ | String | Associated account ID |

### Organizations → Accounts

| Outrun Field | Salesforce Field | Required | Type | Description |
|--------------|------------------|----------|------|-------------|
| `companyName` | `Name` | ✅ | String | Account name (required) |
| `website` | `Website` | ❌ | String | Company website URL |
| `phoneNumbers[].number` | `Phone` | ❌ | String | Primary phone number |
| `addresses[].street` | `BillingStreet` | ❌ | String | Billing street address |
| `addresses[].city` | `BillingCity` | ❌ | String | Billing city |
| `addresses[].state` | `BillingState` | ❌ | String | Billing state/province |
| `addresses[].country` | `BillingCountry` | ❌ | String | Billing country |
| `addresses[].postalCode` | `BillingPostalCode` | ❌ | String | Billing postal code |
| `industry` | `Industry` | ❌ | Picklist | Industry classification |
| `description` | `Description` | ❌ | String | Account description |
| `numberOfEmployees` | `NumberOfEmployees` | ❌ | Number | Employee count |
| `annualRevenue` | `AnnualRevenue` | ❌ | Currency | Annual revenue |

## Rate Limits & Performance

Salesforce destination has enterprise-grade rate limiting:

- **Destination Writes**: 10 requests per second
- **Bulk API**: Used for large data operations
- **Governor Limits**: All Salesforce limits respected
- **Retry Logic**: Intelligent retry with exponential backoff

<div class="bg-yellow bg-opacity-10 border border-yellow rounded-lg p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">🏢 Enterprise Performance</h3>
  <p class="text-gray-300">Salesforce destination leverages Bulk API for large operations and respects all governor limits while providing enterprise-grade performance and reliability.</p>
</div>

## Data Validation & Processing

### Salesforce Validation Rules
- **Custom Validation**: All custom validation rules are respected
- **Required Fields**: Salesforce required fields enforced
- **Field Dependencies**: Dependent picklist values handled
- **Formula Fields**: Read-only formula fields skipped appropriately

### Data Type Handling
- **Picklist Values**: Validation against valid picklist options
- **Currency Fields**: Proper currency handling with org settings
- **Date/DateTime**: Timezone-aware date handling
- **Lookup Fields**: Proper relationship handling and validation

### Deduplication Strategy
- **Email-Based**: Contacts deduplicated by email address
- **Name-Based**: Accounts deduplicated by name when domain unavailable
- **Custom Logic**: Support for custom deduplication rules
- **Merge Behavior**: Configurable merge vs update behavior

## Salesforce-Specific Features

### Record Types
- **Support**: Full record type support for Contacts and Accounts
- **Assignment**: Automatic record type assignment based on rules
- **Validation**: Record type-specific validation rules respected
- **Flexibility**: Configurable record type mapping

### Triggers and Workflows
- **Trigger Execution**: Salesforce triggers fire normally during writes
- **Workflow Rules**: Process Builder and Flow compatibility
- **Automation**: Integration with Salesforce automation tools
- **Event Handling**: Proper event generation for downstream processes

### Territory Management
- **Territory Assignment**: Automatic territory assignment for accounts
- **Sharing Rules**: Salesforce sharing model respected
- **Visibility**: Field-level security and record access honored
- **Compliance**: Full compliance with Salesforce security model

### Custom Fields
- **Standard Support**: All standard fields mapped automatically
- **Custom Fields**: Custom field mapping configurable
- **Field Types**: Support for all Salesforce field types
- **Validation**: Custom field validation rules respected

## Sync Behavior

### Write Operations
- **Upsert Logic**: Intelligent create-or-update behavior
- **Bulk Processing**: Efficient bulk operations for large datasets
- **Transaction Handling**: Proper transaction management
- **Error Recovery**: Comprehensive error handling and recovery

### Salesforce Integration
- **API Versions**: Latest Salesforce API version support
- **Feature Compatibility**: Support for latest Salesforce features
- **Edition Support**: Works with all Salesforce editions
- **Sandbox Support**: Full sandbox environment support

### Performance Optimization
- **Bulk API**: Automatic use of Bulk API for large operations
- **Selective Updates**: Only changed fields are updated
- **Batch Optimization**: Intelligent batching for optimal performance
- **Governor Limit Management**: Proactive governor limit monitoring

## Best Practices

### Setup Recommendations
1. **Connected App**: Create dedicated Connected App for Outrun
2. **User Permissions**: Use integration user with appropriate permissions
3. **Field Mapping**: Review and test field mappings thoroughly
4. **Validation Rules**: Understand and plan for validation rules

### Data Quality
1. **Required Fields**: Ensure all Salesforce required fields are populated
2. **Picklist Values**: Validate picklist values against Salesforce org
3. **Data Types**: Ensure proper data type formatting
4. **Relationships**: Plan Account-Contact relationship strategy

### Performance Optimization
1. **Bulk Operations**: Use bulk operations for large data sets
2. **Selective Sync**: Only sync necessary fields and records
3. **Governor Limits**: Monitor API usage and governor limits
4. **Timing**: Schedule large syncs during off-peak hours

### Security & Compliance
1. **Field-Level Security**: Review field-level security settings
2. **Sharing Rules**: Understand sharing model implications
3. **IP Restrictions**: Configure appropriate IP restrictions
4. **Audit Trail**: Enable field history tracking as needed

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Connected App configuration and permissions
- Check OAuth scopes and user permissions
- Ensure IP restrictions allow Outrun access
- Confirm user account is active and not locked

**Validation Errors**
- Review Salesforce validation rules and requirements
- Check required field mappings and data
- Verify picklist values against org configuration
- Confirm field-level security permissions

**Governor Limit Issues**
- Monitor API usage in Salesforce Setup
- Check for other integrations consuming limits
- Consider bulk operations for large data sets
- Review and optimize sync frequency

**Data Quality Issues**
- Verify field mappings match Salesforce schema
- Check data type compatibility and formatting
- Review duplicate handling and merge logic
- Confirm relationship field mappings

### Performance Issues

**Slow Sync Performance**
- Enable Bulk API for large operations
- Optimize field selection and filtering
- Review batch sizes and timing
- Check for complex validation rules or triggers

**Rate Limit Errors**
- Monitor concurrent API usage
- Adjust sync frequency and batch sizes
- Consider upgrading Salesforce edition
- Implement intelligent retry logic

### Support Resources

- **Salesforce Developer Documentation**: [developer.salesforce.com](https://developer.salesforce.com)
- **Trailhead**: [trailhead.salesforce.com](https://trailhead.salesforce.com)
- **Salesforce Help**: [help.salesforce.com](https://help.salesforce.com)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

## Use Cases

### Enterprise CRM Consolidation
- **Multi-Org Sync**: Consolidate data across multiple Salesforce orgs
- **System Migration**: Migrate data from legacy systems to Salesforce
- **Data Standardization**: Standardize data across business units

### Sales Operations
- **Lead Enrichment**: Enrich Salesforce leads with external data
- **Account Intelligence**: Enhance account records with comprehensive data
- **Territory Management**: Support complex territory assignment rules

### Marketing Integration
- **Campaign Data**: Sync marketing data into Salesforce campaigns
- **Lead Scoring**: Integrate lead scoring data from external systems
- **Attribution**: Track marketing attribution across multiple touchpoints

---

*Ready to configure Salesforce as a destination? Follow our [Getting Started guide](/docs/getting-started/) to set up your first destination sync.* 