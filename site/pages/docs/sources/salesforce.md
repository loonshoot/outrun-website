---
layout: layouts/docs.liquid
title: Salesforce Source
description: Connect Salesforce CRM to Outrun. Sync Contacts, Accounts, Leads, and Products with real-time PubSub support and enterprise features.
metaTitle: Salesforce Integration - Outrun Source Documentation  
metaDescription: Complete guide to integrating Salesforce CRM with Outrun. Object mappings, PubSub real-time sync, rate limits, and enterprise features.
permalink: /docs/sources/salesforce/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: Salesforce
    url: /docs/sources/salesforce/
---

# Salesforce Source

Connect your Salesforce org to Outrun for enterprise-grade data synchronization. Salesforce offers the most comprehensive object support with real-time capabilities through PubSub integration.

<div class="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-6 my-6">
  <h3 class="text-blue-400 text-lg font-semibold mb-3">⚡ Enterprise Features</h3>
  <p class="text-gray-300">Salesforce integration includes PubSub real-time sync for Enterprise, Unlimited, and Performance editions, with automatic fallback to polling for other editions.</p>
</div>

## Supported Objects

Salesforce maps to the following standardized objects:

### 👥 People (from Multiple Objects)
- **Contact**: Primary contact records
- **Lead**: Prospective contacts  
- **User**: Internal Salesforce users
- **Primary ID**: Salesforce ID
- **Key Fields**: Email, name, phone, title, account association

### 🏢 Organizations (from Accounts)
- **Source Object**: `Account`
- **Primary ID**: Account ID
- **Key Fields**: Account name, website, industry, revenue, billing address

### 📦 Products (from Product Objects)
- **PricebookEntry**: Product pricing information
- **Product2**: Product catalog items
- **Primary ID**: Product ID
- **Key Fields**: Name, price, product ID, pricebook association

### 🔗 Relationships
- **Contact ↔ Account**: Employment and business relationships
- **Contact ↔ Contact**: Person-to-person connections
- **Account ↔ Account**: Company partnerships and hierarchies
- **Account ↔ Contact**: Reverse business relationships

## Real-Time Sync (PubSub)

Salesforce offers real-time data synchronization through Platform Events:

### Supported Editions
- ✅ **Enterprise Edition**
- ✅ **Unlimited Edition** 
- ✅ **Performance Edition**
- ❌ Professional Edition (polling fallback)
- ❌ Essentials Edition (polling fallback)

### PubSub Channels
- `/data/ChangeEvents` - Generic change events
- `/event/AccountChangeEvent` - Account changes
- `/event/ContactChangeEvent` - Contact changes
- `/event/OpportunityChangeEvent` - Opportunity changes
- `/event/LeadChangeEvent` - Lead changes
- `/event/CaseChangeEvent` - Case changes

### Fallback Behavior
- **Auto-Detection**: Outrun automatically detects PubSub availability
- **Graceful Fallback**: Falls back to 15-minute polling if PubSub unavailable
- **No Configuration**: Seamless operation regardless of Salesforce edition

## Authentication

Salesforce uses OAuth 2.0 with additional security features:

1. **OAuth Flow**: Standard OAuth 2.0 with refresh tokens
2. **Connected App**: Requires Salesforce Connected App configuration
3. **Scopes Required**:
   - `api` - Access to Salesforce APIs
   - `refresh_token` - Offline access
   - `id` - User identity information
4. **Security**: IP restrictions and session policies respected
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### People (Contacts)

| Outrun Field | Salesforce Field | Type | Description |
|--------------|------------------|------|-------------|
| `emailAddress` | `Email` | String | Primary email address |
| `firstName` | `FirstName` | String | Contact's first name |
| `lastName` | `LastName` | String | Contact's last name |
| `phoneNumbers[].number` | `Phone` | String | Primary phone number |
| `phoneNumbers[].number` | `MobilePhone` | String | Mobile phone number |
| `addresses[].street` | `MailingStreet` | String | Mailing street address |
| `addresses[].city` | `MailingCity` | String | Mailing city |
| `addresses[].state` | `MailingState` | String | Mailing state/province |
| `addresses[].country` | `MailingCountry` | String | Mailing country |
| `addresses[].postalCode` | `MailingPostalCode` | String | Mailing postal code |
| `associations[].id` | `AccountId` | String | Associated account ID |
| `associations[].displayName` | `Name` | String | Account name |

### Organizations (Accounts)

| Outrun Field | Salesforce Field | Type | Description |
|--------------|------------------|------|-------------|
| `companyName` | `Name` | String | Account name |
| `website` | `Website` | String | Company website URL |
| `phoneNumbers[].number` | `Phone` | String | Primary phone number |
| `addresses[].street` | `BillingStreet` | String | Billing street address |
| `addresses[].city` | `BillingCity` | String | Billing city |
| `addresses[].state` | `BillingState` | String | Billing state/province |
| `addresses[].country` | `BillingCountry` | String | Billing country |
| `addresses[].postalCode` | `BillingPostalCode` | String | Billing postal code |
| `industry` | `Industry` | String | Industry classification |
| `description` | `Description` | String | Account description |
| `numberOfEmployees` | `NumberOfEmployees` | Number | Employee count |
| `annualRevenue` | `AnnualRevenue` | Currency | Annual revenue |

### Products (PricebookEntry)

| Outrun Field | Salesforce Field | Type | Description |
|--------------|------------------|------|-------------|
| `name` | `Name` | String | Product name |
| `price` | `UnitPrice` | Currency | Unit price |
| `isActive` | `IsActive` | Boolean | Active status |
| `productId` | `Product2Id` | String | Related product ID |
| `pricebookId` | `Pricebook2Id` | String | Pricebook ID |

## Rate Limits

Salesforce has sophisticated rate limiting that Outrun optimizes:

- **Default Operations**: 100 requests per 10 seconds
- **Search Operations**: 5 requests per second  
- **Destination Writes**: 10 requests per second
- **PubSub Events**: Real-time (no polling limits)

<div class="bg-yellow bg-opacity-10 border border-yellow rounded-lg p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">🏢 Enterprise Optimization</h3>
  <p class="text-gray-300">Enterprise orgs often have higher API limits. Contact us to configure custom rate limits that match your Salesforce API allocation for maximum performance.</p>
</div>

## Sync Behavior

### Initial Sync
- **Backfill Period**: 30 days by default
- **Polling Interval**: 60 minutes (when not using PubSub)
- **Data Processing**:
  1. Raw data → `_stream` collection
  2. Merged data → `_consolidate` collection
  3. Standardized objects → People, Organizations, Products, Relationships

### Real-Time Sync (PubSub)
- **Event Detection**: Instant notification of changes
- **Supported Objects**: Account, Contact, Opportunity, Lead, Case
- **Change Types**: Create, Update, Delete, Undelete
- **Reliability**: Automatic retry and error handling
- **Fallback**: Seamless switch to polling if PubSub fails

### Continuous Sync (Polling)
- **Change Detection**: LastModifiedDate-based queries
- **Update Frequency**: Every 60 minutes
- **Incremental Updates**: Only changed records processed
- **Bulk Operations**: Efficient batch processing for large datasets

## Destination Capabilities

Salesforce also supports receiving data from Outrun:

### Available Fields for People
- Email address (required)
- First and last name
- Phone numbers
- Job title
- Company association

### Available Fields for Organizations
- Company name (required)
- Domain
- Website
- Country
- Industry
- Description

## System Nuances

### Salesforce-Specific Considerations

1. **Record Types**: Different record types are handled appropriately
2. **Custom Fields**: Standard fields mapped; custom fields require configuration
3. **Sharing Rules**: Respects Salesforce sharing and visibility rules
4. **Field-Level Security**: Honors field-level permissions
5. **Validation Rules**: Salesforce validation rules are respected during writes
6. **Triggers**: Salesforce triggers fire normally during data operations

### Data Quality Notes

- **Required Fields**: Salesforce required fields are enforced
- **Picklist Values**: Picklist constraints are respected
- **Data Types**: Proper type conversion (Currency, Date, DateTime)
- **Relationships**: Lookup and master-detail relationships preserved
- **Deleted Records**: Salesforce Recycle Bin items are handled appropriately

### Performance Considerations

- **Bulk API**: Used for large data operations
- **Selective Queries**: Only necessary fields are retrieved
- **Index Optimization**: Queries optimized for Salesforce indexes
- **Governor Limits**: All Salesforce governor limits are respected

## Best Practices

### Setup Recommendations

1. **Connected App**: Create a dedicated Connected App for Outrun
2. **User Permissions**: Use a dedicated integration user with appropriate permissions
3. **IP Restrictions**: Configure IP restrictions for enhanced security
4. **Custom Fields**: Document custom fields needed for sync
5. **Record Types**: Identify which record types to include/exclude

### Performance Optimization

1. **PubSub Enablement**: Ensure PubSub is available for real-time sync
2. **Selective Sync**: Configure specific objects and fields
3. **Bulk Operations**: Use bulk operations for large initial syncs
4. **Monitoring**: Monitor API usage in Salesforce Setup
5. **Indexing**: Ensure proper indexing on frequently queried fields

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Connected App configuration
- Check OAuth scopes and permissions
- Ensure user account is active and not locked
- Verify IP restrictions allow Outrun's IPs

**PubSub Issues**
- Confirm Salesforce edition supports PubSub
- Check Platform Event permissions
- Verify Change Data Capture is enabled
- Monitor event delivery in Salesforce

**Rate Limit Errors**
- Monitor API usage in Salesforce Setup
- Check for other integrations consuming API calls
- Consider upgrading Salesforce edition for higher limits
- Contact support for custom rate limit configuration

**Data Sync Issues**
- Verify field-level security permissions
- Check sharing rules and record access
- Confirm validation rules aren't blocking updates
- Review trigger behavior for conflicts

### Support Resources

- **Salesforce Developer Documentation**: [developer.salesforce.com](https://developer.salesforce.com)
- **Trailhead**: [trailhead.salesforce.com](https://trailhead.salesforce.com)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

---

*Ready to connect Salesforce? Follow our [Getting Started guide](/docs/getting-started/) to set up your first sync.* 