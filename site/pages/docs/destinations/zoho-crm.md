---
layout: layouts/docs.liquid
title: Zoho CRM Destination
description: Send standardized data to Zoho CRM. Write People to Contacts or Leads and Organizations to Accounts with flexible object targeting and validation.
metaTitle: Zoho CRM Destination - Outrun Integration Documentation
metaDescription: Complete guide to sending data to Zoho CRM via Outrun. Flexible object mappings, dual People destinations, and comprehensive field validation.
permalink: /docs/destinations/zoho-crm/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Destinations
    url: /docs/destinations/
  - title: Zoho CRM
    url: /docs/destinations/zoho-crm/
---

# Zoho CRM Destination

Send your standardized People and Organizations data to Zoho CRM. Zoho CRM destination offers unique flexibility with People mapping to either Contacts or Leads based on your business needs.

<div class="bg-red-500 bg-opacity-10 border border-red-500  p-6 my-6">
  <h3 class="text-red-400 text-lg font-semibold mb-3">🔴 Flexible Destination Mapping</h3>
  <p class="text-gray-300">Zoho CRM destination uniquely supports mapping People to either Contacts or Leads, allowing you to route prospects and established contacts appropriately.</p>
</div>

## Supported Object Mappings

Zoho CRM destination accepts the following standardized objects:

### 👥 People → Contacts (Default)
- **Target Object**: Zoho CRM Contacts
- **Required Fields**: Last Name
- **Default Fields**: Email, Last Name, First Name
- **Use Case**: Established contacts with account relationships

### 👥 People → Leads (Alternative)
- **Target Object**: Zoho CRM Leads
- **Required Fields**: Last Name, Company
- **Default Fields**: Email, Last Name, Company
- **Use Case**: New prospects and potential customers

### 🏢 Organizations → Accounts
- **Target Object**: Zoho CRM Accounts
- **Required Fields**: Account Name
- **Default Fields**: Account Name, Website, Phone
- **Key Features**: Billing/shipping addresses, industry classification

## Authentication

Zoho CRM destination uses OAuth 2.0 with Zoho-specific requirements:

1. **OAuth Flow**: Zoho OAuth 2.0 with refresh tokens
2. **Zoho Console**: Requires app registration in Zoho Developer Console
3. **Scopes Required**:
   - `ZohoCRM.modules.ALL` - Access to all CRM modules
   - `ZohoCRM.users.READ` - User information access
   - `offline_access` - Refresh token capability
4. **Data Centers**: Supports multiple Zoho data centers (US, EU, IN, AU, JP)
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### People → Contacts

| Outrun Field | Zoho CRM Field | Required | Type | Description |
|--------------|----------------|----------|------|-------------|
| `emailAddress` | `Email` | ❌ | String | Primary email address |
| `firstName` | `First_Name` | ❌ | String | Contact's first name |
| `lastName` | `Last_Name` | ✅ | String | Contact's last name (required) |
| `phoneNumbers[].number` | `Phone` | ❌ | String | Primary phone number |
| `phoneNumbers[].number` | `Mobile` | ❌ | String | Mobile phone number |
| `addresses[].street` | `Mailing_Street` | ❌ | String | Mailing street address |
| `addresses[].city` | `Mailing_City` | ❌ | String | Mailing city |
| `addresses[].state` | `Mailing_State` | ❌ | String | Mailing state/province |
| `addresses[].country` | `Mailing_Country` | ❌ | String | Mailing country |
| `addresses[].postalCode` | `Mailing_Zip` | ❌ | String | Mailing postal code |
| `associations[].role` | `Title` | ❌ | String | Job title |
| `associations[].id` | `Account_Name` | ❌ | Lookup | Associated account |

### People → Leads

| Outrun Field | Zoho CRM Field | Required | Type | Description |
|--------------|----------------|----------|------|-------------|
| `emailAddress` | `Email` | ❌ | String | Primary email address |
| `firstName` | `First_Name` | ❌ | String | Lead's first name |
| `lastName` | `Last_Name` | ✅ | String | Lead's last name (required) |
| `associations[].companyName` | `Company` | ✅ | String | Company name (required) |
| `phoneNumbers[].number` | `Phone` | ❌ | String | Primary phone number |
| `phoneNumbers[].number` | `Mobile` | ❌ | String | Mobile phone number |
| `addresses[].street` | `Street` | ❌ | String | Street address |
| `addresses[].city` | `City` | ❌ | String | City |
| `addresses[].state` | `State` | ❌ | String | State/province |
| `addresses[].country` | `Country` | ❌ | String | Country |
| `addresses[].postalCode` | `Zip_Code` | ❌ | String | Postal code |
| `associations[].role` | `Designation` | ❌ | String | Job title/designation |

### Organizations → Accounts

| Outrun Field | Zoho CRM Field | Required | Type | Description |
|--------------|----------------|----------|------|-------------|
| `companyName` | `Account_Name` | ✅ | String | Account name (required) |
| `website` | `Website` | ❌ | String | Company website URL |
| `phoneNumbers[].number` | `Phone` | ❌ | String | Primary phone number |
| `phoneNumbers[].number` | `Fax` | ❌ | String | Fax number |
| `addresses[].street` | `Billing_Street` | ❌ | String | Billing street address |
| `addresses[].city` | `Billing_City` | ❌ | String | Billing city |
| `addresses[].state` | `Billing_State` | ❌ | String | Billing state/province |
| `addresses[].country` | `Billing_Country` | ❌ | String | Billing country |
| `addresses[].postalCode` | `Billing_Code` | ❌ | String | Billing postal code |
| `industry` | `Industry` | ❌ | Picklist | Industry classification |
| `numberOfEmployees` | `Employees` | ❌ | Number | Employee count |
| `annualRevenue` | `Annual_Revenue` | ❌ | Currency | Annual revenue |

## Rate Limits & Performance

Zoho CRM destination has conservative rate limits that require careful management:

- **Write Operations**: 3 requests per 10 seconds
- **Bulk Write**: 2 requests per 10 seconds
- **Retry Logic**: Intelligent retry with exponential backoff
- **Batch Processing**: Optimized batching within rate limits

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚠️ Rate Limit Management</h3>
  <p class="text-gray-300">Zoho CRM has the most restrictive rate limits among our destinations. Outrun automatically manages these with intelligent batching and retry logic to ensure reliable data delivery.</p>
</div>

## Destination Configuration

### People Destination Selection

Choose between Contacts and Leads based on your business process:

#### Contacts Destination
- **Best For**: Established contacts with account relationships
- **Required**: Last Name
- **Features**: Account linking, full contact management
- **Use Case**: Existing customers, established business relationships

#### Leads Destination
- **Best For**: New prospects and potential customers
- **Required**: Last Name, Company
- **Features**: Lead scoring, conversion tracking
- **Use Case**: Marketing qualified leads, sales prospects

### Automatic Object Selection
- **Default Target**: Contacts (configurable)
- **Rule-Based**: Configure rules to route People to Contacts vs Leads
- **Field-Based**: Route based on data completeness or specific field values
- **Status-Based**: Route based on lead status or qualification level

## Data Validation & Processing

### Zoho CRM Validation Rules
- **Required Fields**: Zoho CRM required fields enforced
- **Picklist Values**: Validation against valid picklist options
- **Field Dependencies**: Dependent field relationships handled
- **Custom Validation**: Custom validation rules respected

### Data Type Handling
- **Lookup Fields**: Proper relationship handling (Account_Name lookup)
- **Currency Fields**: Multi-currency support with proper conversion
- **Date Fields**: ISO 8601 date format handling
- **Picklist Fields**: Validation against configured options

### Deduplication Strategy
- **Email-Based**: Contacts/Leads deduplicated by email when available
- **Name-Based**: Fallback to name-based deduplication
- **Account Linking**: Automatic account association for Contacts
- **Merge Behavior**: Configurable update vs create behavior

## Zoho CRM-Specific Features

### Module Relationships
- **Contact-Account**: Automatic account linking for Contacts
- **Lead-Company**: Company field for Lead qualification
- **Owner Assignment**: Automatic owner assignment based on rules
- **Territory Management**: Support for Zoho territory assignment

### Lead Management
- **Lead Status**: Configurable lead status assignment
- **Lead Source**: Track lead source information
- **Conversion**: Support for lead-to-contact conversion
- **Scoring**: Integration with Zoho lead scoring

### Custom Fields
- **Standard Support**: All standard Zoho fields supported
- **Custom Fields**: Custom field mapping configurable
- **Field Types**: Support for all Zoho field types
- **Validation**: Custom field validation rules respected

### Multi-Currency
- **Currency Support**: Full multi-currency support
- **Exchange Rates**: Automatic exchange rate handling
- **Base Currency**: Respect for org base currency settings
- **Conversion**: Proper currency conversion for revenue fields

## Sync Behavior

### Write Operations
- **Upsert Logic**: Intelligent create-or-update behavior
- **Batch Processing**: Efficient batching within rate limits
- **Error Handling**: Comprehensive error handling and retry
- **Transaction Safety**: Proper transaction management

### Performance Optimization
- **Rate Limit Compliance**: Automatic rate limit management
- **Batch Optimization**: Intelligent batching for optimal throughput
- **Selective Updates**: Only changed fields are updated
- **Retry Logic**: Smart retry with exponential backoff

### Data Quality
- **Validation**: Pre-write validation against Zoho requirements
- **Cleansing**: Automatic data cleansing and formatting
- **Enrichment**: Optional data enrichment capabilities
- **Monitoring**: Real-time sync status and quality monitoring

## Best Practices

### Setup Recommendations
1. **Destination Strategy**: Choose Contacts vs Leads based on business process
2. **Required Fields**: Ensure source data includes all required fields
3. **Field Mapping**: Review and test field mappings thoroughly
4. **Data Center**: Confirm correct Zoho data center selection

### Data Quality
1. **Required Fields**: Ensure Last Name (People) and Account Name (Organizations)
2. **Company Field**: For Leads, ensure Company field is populated
3. **Email Validation**: Provide valid email addresses for deduplication
4. **Picklist Values**: Validate picklist values against Zoho org

### Performance Optimization
1. **Rate Limit Awareness**: Plan sync schedules around conservative limits
2. **Batch Size**: Use appropriate batch sizes for your data volume
3. **Selective Sync**: Only sync necessary fields and records
4. **Monitoring**: Set up alerts for sync failures and performance issues

### Business Process Integration
1. **Lead Qualification**: Plan lead-to-contact conversion process
2. **Owner Assignment**: Configure automatic owner assignment rules
3. **Workflow Integration**: Plan integration with Zoho workflows
4. **Reporting**: Leverage Zoho reporting with standardized data

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Zoho Console app configuration and permissions
- Check OAuth scopes and data center selection
- Ensure user has access to required modules
- Confirm correct Zoho data center endpoint

**Validation Errors**
- Verify required fields (Last Name, Company for Leads)
- Check picklist values against Zoho org configuration
- Confirm field length limits and data types
- Review custom field validation rules

**Rate Limit Errors**
- Monitor API usage in Zoho CRM
- Reduce sync frequency if needed
- Check for other integrations consuming API calls
- Contact support for optimization strategies

**Data Quality Issues**
- Verify field mappings match Zoho schema
- Check lookup field relationships (Account_Name)
- Review duplicate handling logic
- Confirm data type compatibility

### Performance Issues

**Slow Sync Performance**
- Optimize batch sizes within rate limits
- Review field selection and filtering
- Check for complex validation rules
- Monitor rate limit compliance

**Destination Selection Issues**
- Review Contacts vs Leads routing logic
- Check required field availability for each destination
- Verify business process alignment
- Test with sample data first

### Support Resources

- **Zoho CRM API Documentation**: [www.zoho.com/crm/developer/docs/](https://www.zoho.com/crm/developer/docs/)
- **Zoho Developer Console**: [accounts.zoho.com/developerconsole](https://accounts.zoho.com/developerconsole)
- **Zoho Help**: [help.zoho.com/portal/en/community/crm](https://help.zoho.com/portal/en/community/crm)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

## Use Cases

### Lead Management
- **Lead Qualification**: Route prospects to Leads, qualified contacts to Contacts
- **Lead Nurturing**: Sync marketing qualified leads for sales follow-up
- **Conversion Tracking**: Track lead-to-customer conversion rates

### Customer Management
- **Contact Consolidation**: Consolidate contacts from multiple sources
- **Account Intelligence**: Enrich account records with external data
- **Relationship Mapping**: Maintain contact-account relationships

### Sales Operations
- **Pipeline Management**: Support complex sales pipeline processes
- **Territory Assignment**: Automatic territory and owner assignment
- **Performance Tracking**: Track sales performance across multiple sources

---

*Ready to configure Zoho CRM as a destination? Follow our [Getting Started guide](/docs/getting-started/) to set up your first destination sync.* 