---
layout: layouts/docs.liquid
title: Zoho CRM Source
description: Connect Zoho CRM to Outrun. Sync Leads, Contacts, Accounts, and related records with comprehensive field mappings and bi-directional capabilities.
metaTitle: Zoho CRM Integration - Outrun Source Documentation
metaDescription: Complete guide to integrating Zoho CRM with Outrun. Object mappings, Related Records API, rate limits, and bi-directional sync capabilities.
permalink: /docs/sources/zoho-crm/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: Zoho CRM
    url: /docs/sources/zoho-crm/
---

# Zoho CRM Source

Connect your Zoho CRM to Outrun for comprehensive business data synchronization. Zoho CRM offers a unique data structure with both Leads and Contacts mapping to People, plus powerful Related Records capabilities.

<div class="bg-red-500 bg-opacity-10 border border-red-500  p-6 my-6">
  <h3 class="text-red-400 text-lg font-semibold mb-3">🔴 Zoho CRM Integration</h3>
  <p class="text-gray-300">Zoho CRM has a unique data structure where both Leads and Contacts represent people. This source includes advanced Related Records API integration for comprehensive relationship mapping.</p>
</div>

## Supported Objects

Zoho CRM maps to the following standardized objects:

### 👥 People (from Multiple Objects)
- **Leads**: Prospective contacts and potential customers
- **Contacts**: Established contacts linked to accounts
- **Primary ID**: Zoho record ID
- **Key Fields**: Email, name, phone, company, lead status, account association

### 🏢 Organizations (from Accounts)
- **Source Object**: `Accounts`
- **Primary ID**: Account ID  
- **Key Fields**: Account name, website, industry, revenue, billing/shipping addresses

### 🔗 Relationships (Enhanced)
- **Contact ↔ Account**: Standard employment relationships
- **Lead ↔ Company**: Prospective business relationships
- **Related Records**: Notes, Tasks, Events, Calls linked to any record
- **Cross-Module**: Comprehensive relationship tracking via Related Records API

## Authentication

Zoho CRM uses OAuth 2.0 with Zoho-specific requirements:

1. **OAuth Flow**: Zoho OAuth 2.0 with refresh tokens
2. **Zoho Console**: Requires app registration in Zoho Developer Console
3. **Scopes Required**:
   - `ZohoCRM.modules.ALL` - Access to all CRM modules
   - `ZohoCRM.users.READ` - User information access
   - `offline_access` - Refresh token capability
4. **Data Centers**: Supports multiple Zoho data centers (US, EU, IN, AU, JP)
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### People (Leads)

| Outrun Field | Zoho CRM Field | Type | Description |
|--------------|----------------|------|-------------|
| `emailAddress` | `Email` | String | Primary email address |
| `firstName` | `First_Name` | String | Lead's first name |
| `lastName` | `Last_Name` | String | Lead's last name |
| `phoneNumbers[].number` | `Phone` | String | Primary phone number |
| `phoneNumbers[].number` | `Mobile` | String | Mobile phone number |
| `addresses[].street` | `Street` | String | Street address |
| `addresses[].city` | `City` | String | City |
| `addresses[].state` | `State` | String | State/province |
| `addresses[].country` | `Country` | String | Country |
| `addresses[].postalCode` | `Zip_Code` | String | Postal code |
| `associations[].id` | `Company` | String | Company name/association |
| `associations[].role` | `Designation` | String | Job title/designation |

### People (Contacts)

| Outrun Field | Zoho CRM Field | Type | Description |
|--------------|----------------|------|-------------|
| `emailAddress` | `Email` | String | Primary email address |
| `firstName` | `First_Name` | String | Contact's first name |
| `lastName` | `Last_Name` | String | Contact's last name |
| `phoneNumbers[].number` | `Phone` | String | Primary phone number |
| `phoneNumbers[].number` | `Mobile` | String | Mobile phone number |
| `addresses[].street` | `Mailing_Street` | String | Mailing street address |
| `addresses[].city` | `Mailing_City` | String | Mailing city |
| `addresses[].state` | `Mailing_State` | String | Mailing state/province |
| `addresses[].country` | `Mailing_Country` | String | Mailing country |
| `addresses[].postalCode` | `Mailing_Zip` | String | Mailing postal code |
| `associations[].id` | `Account_Name.id` | String | Associated account ID |
| `associations[].role` | `Title` | String | Job title at account |

### Organizations (Accounts)

| Outrun Field | Zoho CRM Field | Type | Description |
|--------------|----------------|------|-------------|
| `companyName` | `Account_Name` | String | Account name |
| `website` | `Website` | String | Company website URL |
| `phoneNumbers[].number` | `Phone` | String | Primary phone number |
| `phoneNumbers[].number` | `Fax` | String | Fax number |
| `addresses[].street` | `Billing_Street` | String | Billing street address |
| `addresses[].city` | `Billing_City` | String | Billing city |
| `addresses[].state` | `Billing_State` | String | Billing state/province |
| `addresses[].country` | `Billing_Country` | String | Billing country |
| `addresses[].postalCode` | `Billing_Code` | String | Billing postal code |
| `industry` | `Industry` | String | Industry classification |
| `numberOfEmployees` | `Employees` | Number | Employee count |
| `annualRevenue` | `Annual_Revenue` | Currency | Annual revenue |

## Rate Limits

Zoho CRM has conservative rate limits that Outrun carefully manages:

- **Default Operations**: 5 requests per 10 seconds
- **Metadata Operations**: 3 requests per 10 seconds
- **Read Operations**: 8 requests per 10 seconds
- **Bulk Read**: 2 requests per 10 seconds
- **Search Operations**: 3 requests per 10 seconds
- **Write Operations**: 3 requests per 10 seconds
- **Bulk Write**: 2 requests per 10 seconds

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚠️ Rate Limit Management</h3>
  <p class="text-gray-300">Zoho CRM has the most restrictive rate limits among our sources. Outrun automatically manages these limits with intelligent batching and retry logic to ensure reliable sync performance.</p>
</div>

## Related Records API

Zoho CRM's Related Records API provides comprehensive relationship tracking:

### Supported Modules
- **Accounts**: Organization-related records
- **Contacts**: Contact-related records  
- **Leads**: Lead-related records

### Related Record Types
- **Notes**: Text notes and comments
- **Tasks**: Action items and to-dos
- **Events**: Calendar events and meetings
- **Calls**: Phone call logs and records

### Relationship Mapping
- **has_note**: Entity has associated notes
- **has_task**: Entity has associated tasks
- **has_event**: Entity has associated events
- **has_call**: Entity has associated call records

## Sync Behavior

### Initial Sync
- **Backfill Period**: 30 days by default
- **Polling Interval**: 60 minutes
- **Data Processing**:
  1. Raw data → `_stream` collection
  2. Merged data → `_consolidate` collection
  3. Standardized objects → People, Organizations, Relationships
  4. Related records → Additional relationship objects

### Continuous Sync
- **Change Detection**: Modified_Time-based queries
- **Update Frequency**: Every 60 minutes
- **Incremental Updates**: Only changed records processed
- **Related Records**: Automatic sync of associated records

## Destination Capabilities

Zoho CRM supports bi-directional sync with flexible object targeting:

### People Destinations
**Target Objects**: Contacts (default) or Leads

#### Contacts Destination
- **Required Fields**: Last_Name
- **Available Fields**: Email, names, phone numbers, addresses, account association
- **Use Case**: Established contacts with account relationships

#### Leads Destination  
- **Required Fields**: Last_Name, Company
- **Available Fields**: Email, names, phone numbers, addresses, company, lead status
- **Use Case**: New prospects and potential customers

### Organizations Destination
**Target Object**: Accounts
- **Required Fields**: Account_Name
- **Available Fields**: Website, phone, addresses, industry, revenue, employee count

## System Nuances

### Zoho CRM-Specific Considerations

1. **Dual People Objects**: Both Leads and Contacts represent people with different contexts
2. **Account Linking**: Contacts link to Accounts; Leads have Company text field
3. **Related Records**: Comprehensive activity tracking via Related Records API
4. **Field API Names**: Zoho uses underscore naming (First_Name, Last_Name)
5. **Lookup Fields**: Account_Name is a lookup field returning both ID and name
6. **Owner Fields**: All records have Owner with email and name subfields

### Data Quality Notes

- **Required Fields**: Zoho enforces required field validation
- **Picklist Values**: Picklist constraints are respected
- **Date Formats**: ISO 8601 date format handling
- **Currency Fields**: Multi-currency support with proper conversion
- **Duplicate Detection**: Zoho's native duplicate rules are respected

### Performance Considerations

- **Bulk Operations**: Used for large data sets within rate limits
- **Related Records**: Separate API calls for comprehensive relationship data
- **Field Selection**: Only necessary fields retrieved to optimize performance
- **Pagination**: Proper pagination handling for large result sets

## Best Practices

### Setup Recommendations

1. **Zoho Console**: Create dedicated app in Zoho Developer Console
2. **Permissions**: Ensure user has access to required modules
3. **Data Center**: Confirm correct Zoho data center selection
4. **Custom Fields**: Document custom fields needed for sync
5. **Lead vs Contact**: Define criteria for Lead vs Contact classification

### Performance Optimization

1. **Rate Limit Awareness**: Plan sync schedules around conservative limits
2. **Selective Sync**: Configure specific modules and fields
3. **Related Records**: Enable only needed related record types
4. **Monitoring**: Watch for rate limit warnings in sync logs
5. **Bulk Operations**: Use bulk APIs for initial large syncs

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Zoho Console app configuration
- Check OAuth scopes and permissions
- Ensure correct data center selection
- Confirm user account access to required modules

**Rate Limit Errors**
- Monitor API usage in Zoho CRM
- Reduce sync frequency if needed
- Check for other integrations consuming API calls
- Contact support for optimization strategies

**Data Sync Issues**
- Verify required fields are populated
- Check picklist value constraints
- Confirm lookup field relationships
- Review duplicate detection rules

**Related Records Issues**
- Ensure Related Records API is enabled
- Check permissions for Notes, Tasks, Events, Calls
- Verify parent record relationships
- Monitor Related Records sync logs

### Support Resources

- **Zoho CRM API Documentation**: [www.zoho.com/crm/developer/docs/](https://www.zoho.com/crm/developer/docs/)
- **Zoho Developer Console**: [accounts.zoho.com/developerconsole](https://accounts.zoho.com/developerconsole)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

---

*Ready to connect Zoho CRM? Follow our [Getting Started guide](/docs/getting-started/) to set up your first sync.* 