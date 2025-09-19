---
layout: layouts/docs.liquid
title: HubSpot Destination
description: Send standardized data to HubSpot CRM. Write People to Contacts and Organizations to Companies with comprehensive field mappings and validation.
metaTitle: HubSpot Destination - Outrun Integration Documentation
metaDescription: Complete guide to sending data to HubSpot CRM via Outrun. Field mappings, validation rules, and best practices for destination sync.
permalink: /docs/destinations/hubspot/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Destinations
    url: /docs/destinations/
  - title: HubSpot
    url: /docs/destinations/hubspot/
---

# HubSpot Destination

Send your standardized People and Organizations data to HubSpot CRM. HubSpot destination provides reliable data delivery with automatic field mapping and validation.

<div class="bg-orange-500 bg-opacity-10 border border-orange-500  p-6 my-6">
  <h3 class="text-orange-400 text-lg font-semibold mb-3">🔶 HubSpot Destination</h3>
  <p class="text-gray-300">HubSpot destination supports both People → Contacts and Organizations → Companies with comprehensive field validation and automatic deduplication.</p>
</div>

## Supported Object Mappings

HubSpot destination accepts the following standardized objects:

### 👥 People → Contacts
- **Target Object**: HubSpot Contacts
- **Required Fields**: Email address
- **Default Fields**: Email, first name, last name
- **Key Features**: Automatic deduplication by email, company association

### 🏢 Organizations → Companies
- **Target Object**: HubSpot Companies
- **Required Fields**: Company name
- **Default Fields**: Company name, domain
- **Key Features**: Domain-based deduplication, contact association

## Authentication

HubSpot destination uses the same OAuth 2.0 authentication as the source:

1. **OAuth Flow**: Standard OAuth 2.0 with refresh tokens
2. **Scopes Required**:
   - `contacts` - Write contact data
   - `companies` - Write company data
   - `crm.objects.contacts.write` - Create/update contact objects
   - `crm.objects.companies.write` - Create/update company objects
3. **Token Storage**: Encrypted access and refresh tokens
4. **Auto-Refresh**: Automatic token renewal for continuous sync

## Field Mappings

### People → Contacts

| Outrun Field | HubSpot Property | Required | Type | Description |
|--------------|------------------|----------|------|-------------|
| `emailAddress` | `email` | ✅ | String | Primary email address (required) |
| `firstName` | `firstname` | ❌ | String | Contact's first name |
| `lastName` | `lastname` | ❌ | String | Contact's last name |
| `phoneNumbers[].number` | `phone` | ❌ | String | Primary phone number |
| `phoneNumbers[].number` | `work_phone` | ❌ | String | Work phone number |
| `addresses[].street` | `address` | ❌ | String | Street address |
| `addresses[].city` | `city` | ❌ | String | City |
| `addresses[].state` | `state` | ❌ | String | State/province |
| `addresses[].country` | `country` | ❌ | String | Country |
| `addresses[].postalCode` | `zip` | ❌ | String | Postal code |
| `socialProfiles[].url` | `linkedin_url` | ❌ | String | LinkedIn profile URL |
| `socialProfiles[].handle` | `twitter_username` | ❌ | String | Twitter username |
| `associations[].role` | `jobtitle` | ❌ | String | Job title |
| `associations[].id` | `associatedcompanyid` | ❌ | String | Associated company ID |

### Organizations → Companies

| Outrun Field | HubSpot Property | Required | Type | Description |
|--------------|------------------|----------|------|-------------|
| `companyName` | `name` | ✅ | String | Company name (required) |
| `domain` | `domain` | ❌ | String | Company domain |
| `website` | `website` | ❌ | String | Company website URL |
| `phoneNumbers[].number` | `phone` | ❌ | String | Company phone number |
| `addresses[].street` | `address` | ❌ | String | Company address |
| `addresses[].city` | `city` | ❌ | String | City |
| `addresses[].state` | `state` | ❌ | String | State/province |
| `addresses[].country` | `country` | ❌ | String | Country |
| `addresses[].postalCode` | `zip` | ❌ | String | Postal code |
| `industry` | `industry` | ❌ | String | Industry classification |
| `description` | `description` | ❌ | String | Company description |
| `numberOfEmployees` | `numberofemployees` | ❌ | Number | Employee count |
| `annualRevenue` | `annualrevenue` | ❌ | Number | Annual revenue |

## Rate Limits & Performance

HubSpot destination has specific rate limits for write operations:

- **Destination Writes**: 10 requests per second
- **Batch Operations**: Efficient bulk processing where possible
- **Retry Logic**: Automatic retry for transient failures

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚡ Write Optimization</h3>
  <p class="text-gray-300">Outrun optimizes HubSpot writes with intelligent batching and deduplication to minimize API calls while ensuring data accuracy.</p>
</div>

## Data Validation & Processing

### Required Field Validation
- **People**: Email address must be provided and valid
- **Organizations**: Company name must be provided and non-empty
- **Format Validation**: Email format, URL format validation
- **Length Limits**: Respect HubSpot field length constraints

### Deduplication Strategy
- **Contacts**: Deduplicated by email address
- **Companies**: Deduplicated by domain when available, otherwise by name
- **Update Behavior**: Existing records are updated with new data
- **Conflict Resolution**: Latest data takes precedence

### Data Transformation
- **Phone Numbers**: Multiple phone numbers mapped to primary and work phone
- **Addresses**: Address components mapped to individual HubSpot fields
- **Social Profiles**: LinkedIn and Twitter profiles extracted
- **Associations**: Company associations maintained via `associatedcompanyid`

## Sync Behavior

### Write Operations
- **Create**: New records created when no match found
- **Update**: Existing records updated when duplicates detected
- **Upsert**: Automatic create-or-update behavior
- **Validation**: Pre-write validation against HubSpot requirements

### Error Handling
- **Validation Errors**: Clear reporting of field validation failures
- **Rate Limit Handling**: Automatic backoff and retry
- **Duplicate Handling**: Intelligent merge and update logic
- **Monitoring**: Real-time sync status and error reporting

### Performance Features
- **Batch Processing**: Multiple records processed in single API calls
- **Incremental Sync**: Only changed data is sent
- **Smart Retry**: Exponential backoff for failed operations
- **Monitoring**: Comprehensive logging and error tracking

## HubSpot-Specific Features

### Contact-Company Associations
- **Automatic Linking**: Contacts automatically associated with companies
- **Company Creation**: Companies created automatically when referenced
- **Relationship Maintenance**: Associations maintained across updates
- **Hierarchy Respect**: HubSpot's contact-company hierarchy preserved

### Custom Properties
- **Standard Properties**: All standard HubSpot properties supported
- **Custom Property Support**: Custom properties can be configured
- **Property Types**: String, number, date, enumeration support
- **Validation**: Custom property validation rules respected

### HubSpot Workflows
- **Trigger Compatibility**: Destination writes trigger HubSpot workflows
- **Enrollment**: New contacts/companies can enroll in workflows
- **Property Updates**: Property changes trigger workflow actions
- **Integration**: Seamless integration with HubSpot automation

## Best Practices

### Setup Recommendations
1. **Required Fields**: Ensure source data includes email (People) and company name (Organizations)
2. **Field Mapping**: Review and customize field mappings for your use case
3. **Deduplication**: Understand HubSpot's deduplication rules
4. **Testing**: Test with small data sets before full sync

### Data Quality
1. **Email Validation**: Ensure valid email addresses in source data
2. **Company Names**: Use consistent company naming conventions
3. **Phone Formatting**: Standardize phone number formats
4. **Address Data**: Provide complete address information when available

### Performance Optimization
1. **Batch Size**: Configure appropriate batch sizes for your data volume
2. **Sync Frequency**: Balance real-time needs with rate limits
3. **Selective Fields**: Only sync necessary fields to reduce API calls
4. **Monitoring**: Set up alerts for sync failures and performance issues

### Integration Strategy
1. **Workflow Planning**: Plan HubSpot workflow interactions
2. **Custom Properties**: Map custom properties as needed
3. **Segmentation**: Use HubSpot lists and segmentation with synced data
4. **Reporting**: Leverage HubSpot reporting with standardized data

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify OAuth scopes include write permissions
- Check if HubSpot user has appropriate access levels
- Ensure API access is enabled for your HubSpot tier
- Confirm token refresh is working properly

**Validation Errors**
- Verify required fields (email, company name) are provided
- Check email format validation
- Confirm field length limits are respected
- Review custom property constraints

**Duplicate Handling Issues**
- Understand HubSpot's deduplication rules
- Check email/domain matching logic
- Review merge behavior for existing records
- Monitor for unexpected record creation

**Rate Limit Errors**
- Monitor API usage in HubSpot settings
- Check for other integrations consuming API calls
- Consider adjusting sync frequency
- Contact support for rate limit optimization

### Data Quality Issues

**Missing Associations**
- Verify company data is synced before contacts
- Check `associatedcompanyid` field mapping
- Ensure company creation is enabled
- Review association logic in sync logs

**Field Mapping Problems**
- Verify field mappings match HubSpot property names
- Check for custom property configuration
- Confirm data type compatibility
- Test with sample data first

### Support Resources

- **HubSpot API Documentation**: [developers.hubspot.com](https://developers.hubspot.com)
- **HubSpot Knowledge Base**: [knowledge.hubspot.com](https://knowledge.hubspot.com)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

## Use Cases

### CRM Consolidation
- **Multi-Source Sync**: Consolidate contacts from multiple systems into HubSpot
- **Data Standardization**: Clean and standardize contact data across sources
- **Deduplication**: Automatic deduplication across multiple data sources

### Marketing Automation
- **Lead Enrichment**: Enrich HubSpot contacts with data from other systems
- **Segmentation**: Create targeted segments with standardized data
- **Workflow Triggers**: Use synced data to trigger HubSpot workflows

### Sales Enablement
- **Contact Enrichment**: Provide sales team with comprehensive contact data
- **Company Intelligence**: Enrich company records with external data
- **Activity Tracking**: Sync activities and interactions from other systems

---

*Ready to configure HubSpot as a destination? Follow our [Getting Started guide](/docs/getting-started/) to set up your first destination sync.* 