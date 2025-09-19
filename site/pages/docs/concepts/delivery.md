---
layout: layouts/docs.liquid
title: Delivery
description: Learn how Outrun transforms standardized objects and delivers them to your destination systems with intelligent mapping and rate limiting.
metaTitle: Data Delivery - Outrun Core Concepts
metaDescription: Complete guide to Outrun's delivery process including destination mapping, rate limiting, bi-directional sync, and error handling.
permalink: /docs/concepts/delivery/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Core Concepts
    url: /docs/concepts/
  - title: Delivery
    url: /docs/concepts/delivery/
---

# Delivery

Delivery is the final stage of Outrun's data synchronization process, where standardized objects are transformed and delivered to your destination systems. This process ensures data reaches its intended targets in the correct format while respecting system limitations and business rules.

<div class="bg-green-500 bg-opacity-10 border border-green-500  p-6 my-6">
  <h3 class="text-green-400 text-lg font-semibold mb-3">📤 Intelligent Delivery</h3>
  <p class="text-gray-300">Outrun automatically handles destination-specific formatting, rate limiting, and error recovery to ensure reliable data delivery across all your systems.</p>
</div>

## The Delivery Process

Delivery transforms standardized objects through a multi-stage process tailored to each destination:

### 1. Destination Mapping
Standardized objects are transformed to match destination system requirements:

- **Field Mapping**: Standardized fields mapped to destination-specific fields
- **Format Conversion**: Data types converted to destination requirements
- **Validation**: Ensures data meets destination system constraints
- **Enrichment**: Adds destination-specific required fields

### 2. Rate Limiting & Queuing
Delivery respects each destination's API limitations:

- **Rate Limit Management**: Automatically throttles requests to stay within limits
- **Intelligent Queuing**: Prioritizes and batches requests for optimal performance
- **Retry Logic**: Handles temporary failures with exponential backoff
- **Load Balancing**: Distributes requests across available API capacity

### 3. Delivery Execution
Data is delivered using the most appropriate method for each destination:

- **Real-Time Sync**: Immediate delivery for time-sensitive data
- **Batch Processing**: Efficient bulk operations for large datasets
- **Incremental Updates**: Only sends changed data to minimize API usage
- **Conflict Resolution**: Handles data conflicts intelligently

### 4. Verification & Monitoring
Ensures successful delivery and tracks performance:

- **Delivery Confirmation**: Verifies successful data delivery
- **Error Tracking**: Monitors and reports delivery failures
- **Performance Metrics**: Tracks delivery speed and success rates
- **Data Integrity**: Validates delivered data matches source

## Destination-Specific Delivery

Each destination system has unique requirements that Outrun handles automatically:

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-blue-500  p-6">
    <h3 class="text-blue-400 text-lg font-semibold mb-3">🔄 HubSpot Destination</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>Rate Limit</strong>: 10 requests/second for writes</li>
      <li>• <strong>Batch Size</strong>: Up to 100 records per batch</li>
      <li>• <strong>Objects</strong>: Contacts, Companies, Deals</li>
      <li>• <strong>Bi-directional</strong>: Full read/write capabilities</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-green-500  p-6">
    <h3 class="text-green-400 text-lg font-semibold mb-3">⚡ Salesforce Destination</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>Rate Limit</strong>: 100 requests/10 seconds</li>
      <li>• <strong>Bulk API</strong>: Large dataset optimization</li>
      <li>• <strong>Objects</strong>: Leads, Contacts, Accounts</li>
      <li>• <strong>Enterprise</strong>: Advanced validation rules</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-purple-500  p-6">
    <h3 class="text-purple-400 text-lg font-semibold mb-3">🎯 Zoho CRM Destination</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>Rate Limit</strong>: 3 requests/10 seconds (writes)</li>
      <li>• <strong>Flexible Routing</strong>: People → Contacts or Leads</li>
      <li>• <strong>Validation</strong>: Strict field requirements</li>
      <li>• <strong>Custom Fields</strong>: Extensive customization</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-yellow-500  p-6">
    <h3 class="text-yellow-400 text-lg font-semibold mb-3">📊 Analytics Destinations</h3>
    <ul class="text-gray-300 space-y-2 text-sm">
      <li>• <strong>Facts Objects</strong>: Metrics and KPIs</li>
      <li>• <strong>Time Series</strong>: Temporal data handling</li>
      <li>• <strong>Aggregation</strong>: Pre-computed summaries</li>
      <li>• <strong>Real-time</strong>: Streaming data delivery</li>
    </ul>
  </div>
</div>

## Object Transformation Examples

### Person → HubSpot Contact

```json
// Standardized Person Object
{
  "type": "Person",
  "email": "john@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Marketing Manager",
  "company": "Acme Corp",
  "phone": "+1-555-0123"
}

// HubSpot Contact Format
{
  "properties": {
    "email": "john@acme.com",
    "firstname": "John",
    "lastname": "Doe",
    "jobtitle": "Marketing Manager",
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "hs_lead_status": "NEW",
    "lifecyclestage": "lead"
  }
}
```

### Organization → Salesforce Account

```json
// Standardized Organization Object
{
  "type": "Organization",
  "name": "Enterprise Solutions Ltd",
  "website": "enterprise.com",
  "industry": "Financial Services",
  "size": "500-1000 employees",
  "phone": "+1-555-0456"
}

// Salesforce Account Format
{
  "Name": "Enterprise Solutions Ltd",
  "Website": "https://enterprise.com",
  "Industry": "Financial Services",
  "NumberOfEmployees": 750,
  "Phone": "+1-555-0456",
  "Type": "Prospect",
  "AccountSource": "Outrun"
}
```

### Person → Zoho CRM Contact/Lead

```json
// Standardized Person Object
{
  "type": "Person",
  "email": "jane@startup.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "company": "Startup Inc",
  "jobTitle": "CEO"
}

// Zoho CRM Contact Format (Existing Customer)
{
  "Email": "jane@startup.com",
  "First_Name": "Jane",
  "Last_Name": "Smith",
  "Account_Name": "Startup Inc",
  "Title": "CEO",
  "Lead_Source": "Outrun",
  "Contact_Type": "Customer"
}

// OR Zoho CRM Lead Format (New Prospect)
{
  "Email": "jane@startup.com",
  "First_Name": "Jane",
  "Last_Name": "Smith",
  "Company": "Startup Inc",
  "Designation": "CEO",
  "Lead_Source": "Outrun",
  "Lead_Status": "Not Contacted"
}
```

## Rate Limiting & Performance

Outrun automatically manages API rate limits for optimal performance:

### Rate Limit Strategies

#### Conservative Approach
- **Safety Margin**: Operates at 80% of published limits
- **Burst Protection**: Prevents accidental limit violations
- **Graceful Degradation**: Slows down when approaching limits
- **Error Recovery**: Handles rate limit errors automatically

#### Intelligent Queuing
- **Priority Queues**: Critical updates processed first
- **Batch Optimization**: Groups similar operations
- **Load Distribution**: Spreads requests across time windows
- **Adaptive Timing**: Adjusts based on API response times

### Performance Optimization

#### Batch Processing
```json
// Individual Requests (Inefficient)
POST /contacts - Contact 1
POST /contacts - Contact 2
POST /contacts - Contact 3

// Batch Request (Efficient)
POST /contacts/batch
{
  "inputs": [
    { /* Contact 1 */ },
    { /* Contact 2 */ },
    { /* Contact 3 */ }
  ]
}
```

#### Incremental Updates
- **Change Detection**: Only sync modified records
- **Delta Sync**: Transmit only changed fields
- **Timestamp Tracking**: Use modification dates for efficiency
- **Checksum Validation**: Verify data integrity without full comparison

## Bi-Directional Synchronization

Many destinations also function as sources, enabling bi-directional data flow:

### Supported Bi-Directional Systems
- **HubSpot**: Full read/write capabilities
- **Salesforce**: Enterprise-grade bi-directional sync
- **Zoho CRM**: Complete CRM data synchronization

### Conflict Resolution
When the same system serves as both source and destination:

1. **Source of Truth**: Designate authoritative system for each field
2. **Last Writer Wins**: Most recent update takes precedence
3. **Field-Level Priority**: Different fields can have different authorities
4. **Manual Review**: Flag complex conflicts for human decision
5. **Audit Trail**: Track all changes for compliance

### Loop Prevention
- **Change Attribution**: Track which system initiated each change
- **Sync Markers**: Identify Outrun-generated updates
- **Timestamp Comparison**: Prevent circular updates
- **Cooldown Periods**: Temporary sync pauses after updates

## Error Handling & Recovery

Robust error handling ensures reliable data delivery:

### Error Types & Responses

#### Temporary Errors
- **Rate Limits**: Automatic retry with exponential backoff
- **Network Issues**: Retry with increasing delays
- **Service Unavailable**: Queue for later delivery
- **Timeout**: Retry with shorter timeout periods

#### Permanent Errors
- **Invalid Data**: Log error and skip record
- **Authentication**: Alert administrators immediately
- **Permission Denied**: Route to manual review queue
- **Schema Mismatch**: Update mapping configuration

#### Retry Logic
```javascript
// Exponential Backoff Strategy
const retryDelays = [1, 2, 4, 8, 16, 32]; // seconds
const maxRetries = 6;

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    await deliverData(record);
    break; // Success
  } catch (error) {
    if (isPermanentError(error)) {
      logPermanentError(record, error);
      break;
    }
    
    if (attempt < maxRetries - 1) {
      await sleep(retryDelays[attempt] * 1000);
    } else {
      logMaxRetriesExceeded(record, error);
    }
  }
}
```

## Delivery Monitoring

Comprehensive monitoring ensures delivery reliability:

### Key Metrics
- **Delivery Success Rate**: Percentage of successful deliveries
- **Average Delivery Time**: Time from standardization to delivery
- **Error Rate by Type**: Breakdown of error categories
- **API Usage**: Rate limit utilization across destinations
- **Queue Depth**: Number of pending delivery operations

### Alerting & Notifications
- **High Error Rates**: Alert when error rates exceed thresholds
- **Rate Limit Warnings**: Notify when approaching API limits
- **Queue Backlog**: Alert on delivery queue buildup
- **System Outages**: Immediate notification of destination unavailability

### Performance Dashboards
- **Real-time Status**: Current delivery performance
- **Historical Trends**: Long-term delivery patterns
- **Destination Health**: Per-destination performance metrics
- **Data Volume**: Delivery volume trends and forecasting

## Best Practices

### Configuration
1. **Rate Limit Buffer**: Configure conservative rate limits
2. **Batch Sizing**: Optimize batch sizes for each destination
3. **Priority Settings**: Set appropriate delivery priorities
4. **Error Thresholds**: Configure meaningful alert thresholds

### Monitoring
1. **Regular Review**: Monitor delivery performance regularly
2. **Error Analysis**: Investigate recurring delivery errors
3. **Capacity Planning**: Plan for delivery volume growth
4. **Performance Tuning**: Optimize based on usage patterns

### Data Quality
1. **Pre-delivery Validation**: Ensure data quality before delivery
2. **Destination Requirements**: Understand each system's constraints
3. **Field Mapping Review**: Regularly review and update mappings
4. **Test Deliveries**: Test with sample data before full deployment

## Advanced Features

### Custom Transformations
- **Business Rules**: Apply custom logic during transformation
- **Data Enrichment**: Add computed fields for destinations
- **Conditional Routing**: Route data based on business conditions
- **Custom Validation**: Implement destination-specific validation

### Workflow Integration
- **Approval Workflows**: Route sensitive data through approval processes
- **Notification Systems**: Alert stakeholders of important deliveries
- **Audit Logging**: Comprehensive delivery audit trails
- **Compliance Reporting**: Generate compliance reports automatically

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🎯 Explore Destinations</h3>
    <p class="text-gray-300 mb-4">Learn about specific destination configurations and capabilities.</p>
    <a href="/docs/destinations/" class="text-yellow hover:text-yellow-light transition-colors">View Destinations →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🚀 Get Started</h3>
    <p class="text-gray-300 mb-4">Set up your first data synchronization workflow.</p>
    <a href="/docs/getting-started/quick-start/" class="text-yellow hover:text-yellow-light transition-colors">Quick Start Guide →</a>
  </div>
</div>

---

*Delivery completes the data synchronization journey - ensuring your standardized data reaches its destination reliably, efficiently, and accurately.* 