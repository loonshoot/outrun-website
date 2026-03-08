---
layout: layouts/docs.liquid
title: Destinations
description: Send your standardized data to destinations. Learn about supported systems, field mappings, and bi-directional sync capabilities.
metaTitle: Outrun Destinations - Supported Data Destinations and Integrations
metaDescription: Complete guide to Outrun's supported data destinations including HubSpot and Zoho CRM for bi-directional data sync.
permalink: /docs/destinations/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Destinations
    url: /docs/destinations/
---

# Destinations

Destinations are where your standardized data goes. Outrun takes the clean, standardized objects from your sources and delivers them to your chosen destinations, enabling powerful bi-directional sync scenarios.

## How Destinations Work

When you configure a destination in Outrun:

1. **Data Reception** - Standardized objects (People, Organizations, Relationships) arrive from sources
2. **Field Mapping** - Outrun maps standardized fields to destination-specific fields
3. **Validation** - Data is validated against destination requirements and constraints
4. **Delivery** - Clean data is written to your destination system via APIs

## Supported Destinations

We currently support **2** destination systems that also function as sources:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <a href="/docs/destinations/hubspot/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-orange-500  flex items-center justify-center text-white font-bold text-lg">HS</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">HubSpot</h3>
        <p class="text-gray-400 text-sm">CRM & Marketing Platform</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Send People and Organizations to HubSpot Contacts and Companies.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">People → Contacts</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Organizations → Companies</span>
    </div>
  </a>

  <a href="/docs/destinations/zoho-crm/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-red-500  flex items-center justify-center text-white font-bold text-lg">Z</div>
      <div>
        <h3 class="text-yellow text-lg font-semibold">Zoho CRM</h3>
        <p class="text-gray-400 text-sm">Business CRM Suite</p>
      </div>
    </div>
    <p class="text-gray-300 text-sm mb-3">Send People to Contacts or Leads, Organizations to Accounts.</p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">People → Contacts/Leads</span>
      <span class="px-2 py-1 bg-yellow bg-opacity-20 text-yellow text-xs ">Organizations → Accounts</span>
    </div>
  </a>
</div>

## Bi-Directional Sync

All our destination systems also function as sources, enabling powerful bi-directional sync scenarios:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔄 Two-Way Sync</h3>
    <p class="text-gray-300 mb-3">Configure the same system as both source and destination for true bi-directional synchronization.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Changes in either system sync to the other</li>
      <li>• Conflict resolution and deduplication</li>
      <li>• Maintains data consistency across platforms</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🌐 Multi-System Sync</h3>
    <p class="text-gray-300 mb-3">Use multiple sources feeding into multiple destinations for comprehensive data distribution.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Central data hub with multiple endpoints</li>
      <li>• Standardized data across all systems</li>
      <li>• Single source of truth maintenance</li>
    </ul>
  </div>
</div>

## Destination Capabilities

### Field Mapping
- **Automatic Mapping**: Smart defaults for common field mappings
- **Custom Mapping**: Configure specific field transformations
- **Required Fields**: Automatic validation of destination requirements
- **Data Types**: Proper type conversion and validation

### Data Validation
- **Schema Validation**: Ensure data meets destination requirements
- **Constraint Checking**: Validate against picklists, formats, and rules
- **Error Handling**: Graceful handling of validation failures
- **Retry Logic**: Automatic retry for transient failures

### Performance Optimization
- **Batch Processing**: Efficient bulk operations where supported
- **Rate Limiting**: Respect destination API limits
- **Incremental Updates**: Only send changed data
- **Conflict Resolution**: Handle duplicate and conflicting data

## Common Use Cases

### CRM Synchronization
```
HubSpot (Source) → Outrun → Zoho CRM (Destination)
```
Keep your CRM systems in sync with standardized contact and company data.

### Data Consolidation
```
Multiple Sources → Outrun → Single CRM (Destination)
```
Consolidate data from multiple systems into a single CRM for unified management.

### Backup and Migration
```
Primary CRM (Source) → Outrun → Backup CRM (Destination)
```
Maintain backup systems or migrate between CRM platforms.

### Multi-Regional Sync
```
Regional CRM (Source) → Outrun → Global CRM (Destination)
```
Sync regional data to global systems while maintaining local operations.

## Rate Limiting & Performance

Each destination has specific rate limits that Outrun respects:

- **HubSpot**: 10 requests per second for destination writes
- **Zoho CRM**: 3 requests per 10 seconds for write operations

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">⚡ Performance Optimization</h3>
  <p class="text-gray-300">Outrun automatically optimizes destination writes with intelligent batching, retry logic, and rate limit management to ensure reliable data delivery.</p>
</div>

## Data Quality & Validation

### Required Fields
Each destination has specific required fields that must be populated:
- **HubSpot**: Email (People), Company Name (Organizations)
- **Zoho CRM**: Last Name (People), Account Name (Organizations)

### Data Transformation
- **Field Mapping**: Automatic mapping between standardized and native fields
- **Type Conversion**: Proper data type handling (strings, numbers, dates)
- **Format Validation**: Email, phone, URL format validation
- **Constraint Checking**: Picklist values, field length limits

### Error Handling
- **Validation Errors**: Clear reporting of field validation failures
- **Retry Logic**: Automatic retry for transient API failures
- **Conflict Resolution**: Handle duplicate records and data conflicts
- **Monitoring**: Real-time sync status and error reporting

## Best Practices

### Setup Recommendations
1. **Authentication**: Use dedicated service accounts for destinations
2. **Field Mapping**: Review and customize field mappings for your use case
3. **Required Fields**: Ensure source data includes all required destination fields
4. **Testing**: Start with small data sets to verify mappings and behavior

### Performance Optimization
1. **Batch Size**: Configure appropriate batch sizes for your data volume
2. **Sync Frequency**: Balance real-time needs with API rate limits
3. **Selective Sync**: Only sync necessary objects and fields
4. **Monitoring**: Set up alerts for sync failures and performance issues

### Data Quality
1. **Source Validation**: Ensure clean data at the source level
2. **Mapping Validation**: Test field mappings with sample data
3. **Duplicate Handling**: Configure appropriate deduplication strategies
4. **Error Monitoring**: Regularly review sync errors and data quality issues

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🚀 Add Your First Destination</h3>
    <p class="text-gray-300 mb-4">Follow our step-by-step guide to configure your first data destination.</p>
    <a href="/docs/getting-started/" class="text-yellow hover:text-yellow-light transition-colors">Get Started →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📥 Browse Sources</h3>
    <p class="text-gray-300 mb-4">See where you can get your data from to feed into destinations.</p>
    <a href="/docs/sources/" class="text-yellow hover:text-yellow-light transition-colors">View Sources →</a>
  </div>
</div>

---

*Need a destination that's not listed? [Contact us](mailto:support@getoutrun.com) to discuss custom integrations.* 