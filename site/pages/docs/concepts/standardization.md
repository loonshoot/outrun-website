---
layout: layouts/docs.liquid
title: Standardization
description: Learn how Outrun transforms raw data from different sources into standardized People, Organizations, Facts, and Relationships objects.
metaTitle: Data Standardization - Outrun Core Concepts
metaDescription: Complete guide to Outrun's standardization process including consolidation, object mapping, and the four core standardized object types.
permalink: /docs/concepts/standardization/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Core Concepts
    url: /docs/concepts/
  - title: Standardization
    url: /docs/concepts/standardization/
---

# Standardization

Standardization is the core transformation process that converts raw data from various sources into consistent, unified objects. This enables seamless data synchronization across different systems regardless of their native data formats.

<div class="bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg p-6 my-6">
  <h3 class="text-purple-400 text-lg font-semibold mb-3">🔄 Transformation Philosophy</h3>
  <p class="text-gray-300">Rather than forcing complex custom mappings, Outrun standardizes data into four universal object types that represent how businesses naturally think about their data.</p>
</div>

## The Standardization Process

Standardization transforms raw stream data through a multi-stage process:

### 1. Stream Processing
Raw data from `[sourceId]_stream` collections is processed using source-specific mapping rules:

- **Field Mapping**: Native fields mapped to standardized equivalents
- **Data Type Conversion**: Ensures consistent data types across sources
- **Validation**: Checks data quality and completeness
- **Enrichment**: Adds computed fields and metadata

### 2. Consolidation
Processed data moves to `[sourceId]_consolidate` collections for merging and deduplication:

- **Duplicate Detection**: Identifies potential duplicate records
- **Record Merging**: Combines duplicate records intelligently
- **Conflict Resolution**: Handles conflicting data from multiple sources
- **Quality Scoring**: Assigns quality scores to consolidated records

### 3. Object Creation
Consolidated data transforms into standardized objects ready for destination sync:

- **Object Classification**: Determines which standardized object type to create
- **Relationship Mapping**: Establishes connections between objects
- **Metadata Preservation**: Maintains source lineage and processing history
- **Validation**: Final quality checks before destination sync

## The Four Standardized Objects

Outrun standardizes all data into four universal object types that represent the fundamental building blocks of business data:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-blue-500 rounded-lg p-6">
    <h3 class="text-blue-400 text-lg font-semibold mb-3">👤 People</h3>
    <p class="text-gray-300 text-sm mb-3">Individual humans in your business ecosystem</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Contacts, Leads, Users</li>
      <li>• Customers, Prospects</li>
      <li>• Team Members, Authors</li>
      <li>• Anyone with personal identity</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-green-500 rounded-lg p-6">
    <h3 class="text-green-400 text-lg font-semibold mb-3">🏢 Organizations</h3>
    <p class="text-gray-300 text-sm mb-3">Companies and business entities</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Companies, Accounts</li>
      <li>• Customers, Prospects</li>
      <li>• Partners, Vendors</li>
      <li>• Any business entity</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-yellow-500 rounded-lg p-6">
    <h3 class="text-yellow-400 text-lg font-semibold mb-3">📊 Facts</h3>
    <p class="text-gray-300 text-sm mb-3">Measurable data points and metrics</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Analytics data, KPIs</li>
      <li>• Performance metrics</li>
      <li>• Search console data</li>
      <li>• Quantifiable measurements</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-purple-500 rounded-lg p-6">
    <h3 class="text-purple-400 text-lg font-semibold mb-3">🔗 Relationships</h3>
    <p class="text-gray-300 text-sm mb-3">Connections between other objects</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Person-to-Organization links</li>
      <li>• Hierarchical structures</li>
      <li>• Business relationships</li>
      <li>• Association mappings</li>
    </ul>
  </div>
</div>

## Object Mapping Examples

### HubSpot → Standardized Objects

```json
// HubSpot Contact → Person
{
  "sourceData": {
    "vid": 12345,
    "properties": {
      "email": "john@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "jobtitle": "Marketing Manager"
    }
  },
  "standardizedObject": {
    "type": "Person",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Marketing Manager",
    "sourceId": "hubspot_abc123",
    "sourceObjectId": "12345",
    "sourceObjectType": "contact"
  }
}

// HubSpot Company → Organization
{
  "sourceData": {
    "companyId": 67890,
    "properties": {
      "name": "Acme Corp",
      "domain": "acme.com",
      "industry": "Technology"
    }
  },
  "standardizedObject": {
    "type": "Organization",
    "name": "Acme Corp",
    "domain": "acme.com",
    "industry": "Technology",
    "sourceId": "hubspot_abc123",
    "sourceObjectId": "67890",
    "sourceObjectType": "company"
  }
}
```

### Salesforce → Standardized Objects

```json
// Salesforce Lead → Person
{
  "sourceData": {
    "Id": "00Q000000123456",
    "Email": "jane@startup.com",
    "FirstName": "Jane",
    "LastName": "Smith",
    "Company": "Startup Inc"
  },
  "standardizedObject": {
    "type": "Person",
    "email": "jane@startup.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "company": "Startup Inc",
    "sourceId": "salesforce_def456",
    "sourceObjectId": "00Q000000123456",
    "sourceObjectType": "Lead"
  }
}

// Salesforce Account → Organization
{
  "sourceData": {
    "Id": "001000000234567",
    "Name": "Enterprise Solutions Ltd",
    "Website": "enterprise.com",
    "Industry": "Financial Services"
  },
  "standardizedObject": {
    "type": "Organization",
    "name": "Enterprise Solutions Ltd",
    "website": "enterprise.com",
    "industry": "Financial Services",
    "sourceId": "salesforce_def456",
    "sourceObjectId": "001000000234567",
    "sourceObjectType": "Account"
  }
}
```

## Consolidation Process

The consolidation stage merges and deduplicates data from multiple sources:

### Duplicate Detection
Outrun uses multiple strategies to identify potential duplicates:

- **Email Matching**: Primary identifier for People objects
- **Domain Matching**: Primary identifier for Organizations
- **Name Similarity**: Fuzzy matching for similar names
- **Phone Numbers**: Secondary matching criteria
- **Custom Rules**: Source-specific matching logic

### Record Merging
When duplicates are detected, Outrun intelligently merges records:

```json
// Before Consolidation (Two Sources)
{
  "hubspot_record": {
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": null,
    "jobTitle": "Manager"
  },
  "salesforce_record": {
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123",
    "jobTitle": "Marketing Manager"
  }
}

// After Consolidation (Merged)
{
  "consolidated_record": {
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123",        // Filled from Salesforce
    "jobTitle": "Marketing Manager", // More specific from Salesforce
    "sources": ["hubspot_abc123", "salesforce_def456"],
    "qualityScore": 0.95,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### Conflict Resolution
When sources provide conflicting data, Outrun applies resolution rules:

1. **Most Recent Wins**: Newer data takes precedence
2. **Most Complete Wins**: Records with more fields preferred
3. **Source Priority**: Configurable source ranking
4. **Field-Level Rules**: Specific rules for individual fields
5. **Manual Review**: Flag complex conflicts for human review

## Standardized Object Schema

### Person Object
```json
{
  "type": "Person",
  "email": "string (primary key)",
  "firstName": "string",
  "lastName": "string",
  "fullName": "string (computed)",
  "phone": "string",
  "jobTitle": "string",
  "company": "string",
  "department": "string",
  "location": "string",
  "linkedInUrl": "string",
  "twitterHandle": "string",
  "website": "string",
  "tags": ["array of strings"],
  "customFields": "object",
  "sourceId": "string",
  "sourceObjectId": "string",
  "sourceObjectType": "string",
  "qualityScore": "number (0-1)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Organization Object
```json
{
  "type": "Organization",
  "name": "string (primary key)",
  "domain": "string",
  "website": "string",
  "industry": "string",
  "size": "string",
  "revenue": "number",
  "location": "string",
  "address": "object",
  "phone": "string",
  "description": "string",
  "foundedYear": "number",
  "tags": ["array of strings"],
  "customFields": "object",
  "sourceId": "string",
  "sourceObjectId": "string",
  "sourceObjectType": "string",
  "qualityScore": "number (0-1)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Facts Object
```json
{
  "type": "Facts",
  "metric": "string",
  "value": "number",
  "unit": "string",
  "dimension": "object",
  "timestamp": "datetime",
  "period": "string",
  "source": "string",
  "category": "string",
  "tags": ["array of strings"],
  "metadata": "object",
  "sourceId": "string",
  "sourceObjectId": "string",
  "sourceObjectType": "string",
  "createdAt": "datetime"
}
```

### Relationships Object
```json
{
  "type": "Relationships",
  "fromType": "string (Person|Organization)",
  "fromId": "string",
  "toType": "string (Person|Organization)",
  "toId": "string",
  "relationshipType": "string",
  "strength": "number (0-1)",
  "verified": "boolean",
  "startDate": "datetime",
  "endDate": "datetime",
  "metadata": "object",
  "sourceId": "string",
  "sourceObjectId": "string",
  "sourceObjectType": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Quality Scoring

Outrun assigns quality scores to help prioritize and validate data:

### Scoring Factors
- **Completeness**: Percentage of fields populated
- **Accuracy**: Validation against known patterns
- **Consistency**: Agreement across multiple sources
- **Freshness**: How recently the data was updated
- **Source Reliability**: Historical accuracy of the source

### Quality Thresholds
- **0.9-1.0**: Excellent quality, ready for immediate use
- **0.7-0.9**: Good quality, minor issues possible
- **0.5-0.7**: Fair quality, review recommended
- **0.0-0.5**: Poor quality, manual review required

## Benefits of Standardization

### Simplified Integration
- **Universal Format**: Same object structure regardless of source
- **Consistent APIs**: Standardized access patterns
- **Reduced Complexity**: No need to understand each source's schema
- **Faster Development**: Accelerated integration projects

### Enhanced Data Quality
- **Deduplication**: Eliminates duplicate records across sources
- **Enrichment**: Combines data from multiple sources
- **Validation**: Consistent quality checks
- **Monitoring**: Unified data quality metrics

### Business Intelligence
- **Cross-Source Analytics**: Analyze data across all systems
- **Complete Customer View**: 360-degree customer profiles
- **Relationship Mapping**: Understand connections between entities
- **Trend Analysis**: Track changes over time

## Best Practices

### Mapping Configuration
1. **Review Default Mappings**: Understand how fields map to standardized objects
2. **Custom Field Handling**: Plan for source-specific custom fields
3. **Data Type Consistency**: Ensure compatible data types across sources
4. **Validation Rules**: Set up appropriate validation for your data

### Quality Management
1. **Monitor Quality Scores**: Track data quality trends over time
2. **Review Low-Quality Records**: Investigate and improve poor-quality data
3. **Source Data Hygiene**: Maintain clean data in source systems
4. **Regular Audits**: Periodically review standardization accuracy

### Performance Optimization
1. **Batch Processing**: Configure appropriate batch sizes
2. **Resource Allocation**: Monitor processing resource usage
3. **Error Handling**: Set up alerts for processing failures
4. **Capacity Planning**: Plan for data volume growth

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📤 Learn About Delivery</h3>
    <p class="text-gray-300 mb-4">Discover how standardized objects sync to your destinations.</p>
    <a href="/docs/concepts/delivery/" class="text-yellow hover:text-yellow-light transition-colors">Delivery Process →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600 rounded-lg p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🎯 Explore Destinations</h3>
    <p class="text-gray-300 mb-4">See how standardized objects map to destination systems.</p>
    <a href="/docs/destinations/" class="text-yellow hover:text-yellow-light transition-colors">View Destinations →</a>
  </div>
</div>

---

*Standardization is the key to Outrun's power - transforming chaos into consistency, enabling seamless data synchronization across any system.* 