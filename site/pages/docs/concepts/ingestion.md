---
layout: layouts/docs.liquid
title: Ingestion
description: Learn how Outrun collects and stores raw data from your sources using real-time streams or batch jobs with complete data preservation.
metaTitle: Data Ingestion - Outrun Core Concepts
metaDescription: Complete guide to Outrun's data ingestion process including real-time streams, batch jobs, stream storage, and metadata enrichment.
permalink: /docs/concepts/ingestion/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Core Concepts
    url: /docs/concepts/
  - title: Ingestion
    url: /docs/concepts/ingestion/
---

# Ingestion

Ingestion is the first step in Outrun's data synchronization process. After adding a source, Outrun begins collecting and storing raw data from your systems using the most appropriate method for each source type.

<div class="bg-blue-500 bg-opacity-10 border border-blue-500  p-6 my-6">
  <h3 class="text-blue-400 text-lg font-semibold mb-3">📥 Data Collection Strategy</h3>
  <p class="text-gray-300">Outrun automatically selects the optimal ingestion method for each source - real-time streams when available, or intelligent batch jobs for comprehensive data collection.</p>
</div>

## Ingestion Methods

Outrun uses two primary methods for data ingestion, automatically selecting the best approach for each source:

### Real-Time Streams
When a source supports real-time data streams, Outrun leverages these for immediate data collection:

- **Instant Collection**: Data is ingested as soon as it's available
- **Event-Driven**: Triggered by actual data changes in the source system
- **Continuous Flow**: Maintains persistent connection for ongoing data flow
- **Examples**: Salesforce PubSub, webhook-enabled systems

### Batch Jobs
For sources without real-time capabilities, Outrun runs periodic batch jobs:

- **Scheduled Collection**: Jobs run at configured intervals
- **Comprehensive Sweep**: Aims to import all available data
- **Configurable Timing**: Frequency depends on your settings and source capabilities
- **Incremental Updates**: Only collects changed data after initial sync

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-green-400 text-lg font-semibold mb-3">⚡ Real-Time Streams</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>Salesforce PubSub</strong> - Enterprise/Unlimited editions</li>
      <li>• <strong>Webhook Systems</strong> - Event-driven notifications</li>
      <li>• <strong>Change Streams</strong> - Database change logs</li>
      <li>• <strong>Event APIs</strong> - Real-time event feeds</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-blue-400 text-lg font-semibold mb-3">🔄 Batch Jobs</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>HubSpot</strong> - 60-minute polling intervals</li>
      <li>• <strong>Zoho CRM</strong> - Conservative rate-limited batches</li>
      <li>• <strong>Confluence</strong> - Content change detection</li>
      <li>• <strong>Google Search Console</strong> - Daily analytics collection</li>
    </ul>
  </div>
</div>

## Stream Storage Architecture

All ingested data is stored in dedicated stream collections that preserve the original format while adding essential metadata.

### Stream Collection Naming
```
[sourceId]_stream
```

Each source gets its own dedicated stream collection:
- `hubspot_abc123_stream` - HubSpot source data
- `salesforce_def456_stream` - Salesforce source data
- `zoho_ghi789_stream` - Zoho CRM source data

### Data Storage Principles

#### First-In, First-Out (FIFO)
- **Chronological Order**: Data stored in the order it was received
- **Temporal Integrity**: Maintains timeline of data changes
- **Audit Trail**: Complete history of all data ingestion
- **Processing Order**: Ensures consistent processing sequence

#### Original Format Preservation
- **Minimal Transformation**: Data stored as close to API response format as possible
- **Native Structure**: Preserves source system's data structure and relationships
- **Field Names**: Original field names and data types maintained
- **Nested Objects**: Complex object structures preserved intact

#### Metadata Enrichment
Outrun appends system metadata without altering source data:

```json
{
  // Original source data (unchanged)
  "id": "12345",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  
  // Outrun metadata (appended)
  "_outrun": {
    "sourceId": "hubspot_abc123",
    "sourceType": "hubspot",
    "ingestedAt": "2024-01-15T10:30:00Z",
    "apiEndpoint": "/contacts/v1/contact/12345",
    "processed": false,
    "processingAttempts": 0,
    "lastModified": "2024-01-15T09:45:00Z"
  }
}
```

## Metadata Fields

Outrun adds comprehensive metadata to track data lineage and processing:

### Source Information
- **`sourceId`**: Unique identifier for the source instance
- **`sourceType`**: Type of source system (hubspot, salesforce, etc.)
- **`apiEndpoint`**: Specific API endpoint used for data collection
- **`objectType`**: Native object type from source system

### Timing Information
- **`ingestedAt`**: When Outrun received the data
- **`lastModified`**: When the data was last modified in source system
- **`syncJobId`**: Identifier for the sync job that collected this data
- **`batchId`**: Batch identifier for grouped operations

### Processing Status
- **`processed`**: Whether data has been processed into standardized objects
- **`processingAttempts`**: Number of processing attempts
- **`processingErrors`**: Any errors encountered during processing
- **`consolidatedAt`**: When data was moved to consolidation stage

### Data Quality
- **`dataQuality`**: Quality score and validation results
- **`duplicateOf`**: Reference to original record if duplicate detected
- **`validationErrors`**: Field-level validation issues
- **`enrichmentStatus`**: Status of any data enrichment processes

## Value-Added Services

The metadata-enriched stream data enables powerful value-added services:

### Data Lineage Tracking
- **Complete History**: Track data from source to destination
- **Change Attribution**: Identify what caused data changes
- **Impact Analysis**: Understand downstream effects of changes
- **Compliance Auditing**: Meet regulatory audit requirements

### Data Quality Monitoring
- **Quality Metrics**: Track data quality scores over time
- **Validation Reporting**: Identify common data quality issues
- **Trend Analysis**: Monitor data quality improvements
- **Alert Systems**: Notify of significant quality degradation

### Performance Analytics
- **Ingestion Rates**: Monitor data collection performance
- **Processing Times**: Track how long data takes to process
- **Error Rates**: Identify and resolve ingestion issues
- **Capacity Planning**: Plan for scaling data operations

### Advanced Processing
- **Machine Learning**: Use historical data for predictive analytics
- **Data Enrichment**: Enhance data with external sources
- **Anomaly Detection**: Identify unusual data patterns
- **Custom Transformations**: Apply business-specific data rules

## Ingestion Configuration

### Batch Job Settings
Configure how often batch jobs run based on your needs:

- **Polling Interval**: How frequently to check for new data
- **Backfill Period**: How far back to collect historical data
- **Rate Limiting**: Respect source system API limits
- **Error Handling**: Retry logic and failure recovery

### Real-Time Stream Settings
Configure real-time data collection parameters:

- **Event Filtering**: Which events to capture
- **Buffer Settings**: How to handle high-volume streams
- **Failover Logic**: Fallback to batch jobs if stream fails
- **Monitoring**: Health checks and performance metrics

## Best Practices

### Initial Setup
1. **Start Small**: Begin with recent data to test ingestion
2. **Monitor Performance**: Watch for rate limit issues
3. **Validate Data**: Ensure data quality meets expectations
4. **Gradual Expansion**: Increase scope after successful testing

### Ongoing Management
1. **Regular Monitoring**: Check ingestion health and performance
2. **Error Review**: Address ingestion errors promptly
3. **Capacity Planning**: Monitor storage and processing needs
4. **Performance Optimization**: Adjust settings based on usage patterns

### Data Quality
1. **Source Validation**: Ensure source data quality before ingestion
2. **Metadata Review**: Use metadata for data quality insights
3. **Error Analysis**: Investigate and resolve recurring issues
4. **Continuous Improvement**: Refine ingestion based on learnings

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔄 Learn About Standardization</h3>
    <p class="text-gray-300 mb-4">Discover how raw ingested data transforms into standardized objects.</p>
    <a href="/docs/concepts/standardization/" class="text-yellow hover:text-yellow-light transition-colors">Standardization Process →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📚 Explore Sources</h3>
    <p class="text-gray-300 mb-4">See specific ingestion methods for each supported source.</p>
    <a href="/docs/sources/" class="text-yellow hover:text-yellow-light transition-colors">View Sources →</a>
  </div>
</div>

---

*Ingestion is the foundation of reliable data synchronization. Understanding this process helps you optimize your data collection strategy.* 