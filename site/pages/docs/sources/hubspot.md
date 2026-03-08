---
layout: layouts/docs.liquid
title: HubSpot Source
description: Connect HubSpot CRM to Outrun. Sync contacts, companies, and relationships with comprehensive field mappings and OAuth authentication.
metaTitle: HubSpot Integration - Outrun Source Documentation
metaDescription: Complete guide to integrating HubSpot CRM with Outrun. Object mappings, rate limits, authentication, and best practices.
permalink: /docs/sources/hubspot/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: HubSpot
    url: /docs/sources/hubspot/
---

# HubSpot Source

Connect your HubSpot CRM to Outrun for seamless data synchronization. HubSpot is one of our most popular sources, offering comprehensive contact and company data with rich relationship mapping.

<div class="bg-orange-500 bg-opacity-10 border border-orange-500  p-6 my-6">
  <h3 class="text-orange-400 text-lg font-semibold mb-3">🔶 HubSpot Integration</h3>
  <p class="text-gray-300">This source supports both data extraction and destination capabilities, making it perfect for bi-directional sync scenarios.</p>
</div>

## Supported Objects

HubSpot maps to the following standardized objects:

### 👥 People (from Contacts)
- **Source Object**: `contacts`
- **Primary ID**: Contact ID
- **Key Fields**: Email, name, phone, job title, company association

### 🏢 Organizations (from Companies) 
- **Source Object**: `companies`
- **Primary ID**: Company ID
- **Key Fields**: Company name, domain, website, industry, revenue

### 🔗 Relationships
- **Contact ↔ Organization**: Employment relationships
- **Contact ↔ Contact**: Person-to-person connections
- **Organization ↔ Organization**: Company partnerships
- **Organization ↔ Contact**: Reverse employment relationships

## Authentication

HubSpot uses OAuth 2.0 for secure authentication:

1. **OAuth Flow**: Standard OAuth 2.0 with refresh tokens
2. **Scopes Required**: 
   - `contacts` - Read contact data
   - `companies` - Read company data
   - `crm.objects.contacts.read` - Access contact objects
   - `crm.objects.companies.read` - Access company objects
3. **Token Storage**: Encrypted access and refresh tokens
4. **Auto-Refresh**: Automatic token renewal for continuous sync

## Field Mappings

### People (Contacts)

| Outrun Field | HubSpot Property | Type | Description |
|--------------|------------------|------|-------------|
| `emailAddress` | `email` | String | Primary email address |
| `firstName` | `firstname` | String | Contact's first name |
| `lastName` | `lastname` | String | Contact's last name |
| `phoneNumbers[].number` | `phone` | String | Primary phone number |
| `phoneNumbers[].number` | `work_phone` | String | Work phone number |
| `addresses[].street` | `address` | String | Street address |
| `addresses[].city` | `city` | String | City |
| `addresses[].state` | `state` | String | State/province |
| `addresses[].country` | `country` | String | Country |
| `addresses[].postalCode` | `zip` | String | Postal code |
| `socialProfiles[].url` | `linkedin_url` | String | LinkedIn profile URL |
| `socialProfiles[].handle` | `twitter_username` | String | Twitter username |
| `associations[].id` | `associatedcompanyid` | String | Associated company ID |
| `associations[].role` | `jobtitle` | String | Job title at company |

### Organizations (Companies)

| Outrun Field | HubSpot Property | Type | Description |
|--------------|------------------|------|-------------|
| `companyName` | `name` | String | Company name |
| `domain` | `domain` | String | Company domain |
| `website` | `website` | String | Company website URL |
| `phoneNumbers[].number` | `phone` | String | Company phone number |
| `addresses[].street` | `address` | String | Company address |
| `addresses[].city` | `city` | String | City |
| `addresses[].state` | `state` | String | State/province |
| `addresses[].country` | `country` | String | Country |
| `addresses[].postalCode` | `zip` | String | Postal code |
| `industry` | `industry` | String | Industry classification |
| `description` | `description` | String | Company description |
| `numberOfEmployees` | `numberofemployees` | Number | Employee count |
| `annualRevenue` | `annualrevenue` | Number | Annual revenue |

## Rate Limits

HubSpot has specific rate limits that Outrun respects:

- **Default Operations**: 110 requests per 10 seconds
- **Search Operations**: 5 requests per second
- **Destination Writes**: 10 requests per second

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚡ Rate Limit Optimization</h3>
  <p class="text-gray-300">If your HubSpot account has higher API limits, contact us. We can customize rate limiting to match your specific quotas for faster sync performance.</p>
</div>

## Sync Behavior

### Initial Sync
- **Backfill Period**: 30 days by default
- **Polling Interval**: 60 minutes
- **Data Processing**: 
  1. Raw data → `stream_data` table
  2. Merged data → `consolidated_data` table
  3. Standardized objects → `people`, `organizations`, `relationships` tables

### Continuous Sync
- **Change Detection**: Polling-based monitoring
- **Update Frequency**: Every 60 minutes
- **Incremental Updates**: Only changed records are processed
- **Relationship Sync**: Automatic detection of association changes

## Destination Capabilities

HubSpot also supports receiving data from Outrun:

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

### HubSpot-Specific Considerations

1. **Object IDs**: HubSpot uses both `id` and `hs_object_id` - we track both for reliability
2. **Associated Companies**: Contact-company relationships are automatically detected via `associatedcompanyid`
3. **Custom Properties**: Standard properties are mapped; custom properties require configuration
4. **Deleted Records**: HubSpot soft-deletes are handled appropriately
5. **Duplicate Handling**: HubSpot's native deduplication is respected

### Data Quality Notes

- **Email Validation**: HubSpot enforces email format validation
- **Phone Formatting**: Phone numbers are stored as provided by HubSpot
- **Address Parsing**: Address components are mapped individually when available
- **Social Profiles**: LinkedIn and Twitter profiles are extracted when present

## Best Practices

### Setup Recommendations

1. **Permissions**: Ensure your HubSpot user has read access to contacts and companies
2. **Custom Properties**: Document any custom properties you want to sync
3. **Data Cleanup**: Consider cleaning HubSpot data before initial sync
4. **Testing**: Start with a small data set to verify mappings

### Performance Optimization

1. **Selective Sync**: Configure specific object types if you don't need everything
2. **Backfill Period**: Adjust backfill days based on your data volume
3. **Monitoring**: Watch sync logs for any rate limit warnings
4. **Incremental**: Let continuous sync handle ongoing changes

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify OAuth scopes include required permissions
- Check if HubSpot user account is active
- Ensure API access is enabled for your HubSpot tier

**Missing Data**
- Confirm objects exist in HubSpot with expected properties
- Check if custom properties are properly configured
- Verify date ranges for backfill period

**Rate Limit Errors**
- Monitor API usage in HubSpot settings
- Consider adjusting sync frequency
- Contact support for custom rate limit configuration

### Support Resources

- **HubSpot API Documentation**: [developers.hubspot.com](https://developers.hubspot.com)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

---

*Ready to connect HubSpot? Follow our [Getting Started guide](/docs/getting-started/) to set up your first sync.* 