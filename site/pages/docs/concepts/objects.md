---
layout: layouts/docs.liquid
title: Objects
description: Learn about Outrun's four standardized object types - People, Organizations, Facts, and Relationships - and how they interact with source and destination systems.
metaTitle: Standardized Objects - Outrun Core Concepts
metaDescription: Complete guide to Outrun's standardized object types including People, Organizations, Facts, and Relationships with source and destination mappings.
permalink: /docs/concepts/objects/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Core Concepts
    url: /docs/concepts/
  - title: Objects
    url: /docs/concepts/objects/
---

# Objects

Outrun standardizes all data into four universal object types that represent the fundamental building blocks of business data. These objects enable seamless data synchronization across different systems regardless of their native data formats.

<div class="bg-purple-500 bg-opacity-10 border border-purple-500  p-6 my-6">
  <h3 class="text-purple-400 text-lg font-semibold mb-3">🧩 Universal Data Model</h3>
  <p class="text-gray-300">Rather than forcing complex custom mappings, Outrun uses four standardized objects that represent how businesses naturally think about their data - making integration intuitive and reliable.</p>
</div>

## The Four Object Types

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-blue-500  p-6">
    <h3 class="text-blue-400 text-lg font-semibold mb-3">👤 People</h3>
    <p class="text-gray-300 text-sm mb-3">Individual humans in your business ecosystem</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Contacts, Leads, Users</li>
      <li>• Customers, Prospects</li>
      <li>• Team Members, Authors</li>
      <li>• Anyone with personal identity</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-green-500  p-6">
    <h3 class="text-green-400 text-lg font-semibold mb-3">🏢 Organizations</h3>
    <p class="text-gray-300 text-sm mb-3">Companies and business entities</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Companies, Accounts</li>
      <li>• Customers, Prospects</li>
      <li>• Partners, Vendors</li>
      <li>• Any business entity</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-yellow-500  p-6">
    <h3 class="text-yellow-400 text-lg font-semibold mb-3">📊 Facts</h3>
    <p class="text-gray-300 text-sm mb-3">Measurable data points and metrics</p>
    <ul class="text-gray-300 space-y-1 text-sm">
      <li>• Analytics data, KPIs</li>
      <li>• Performance metrics</li>
      <li>• Search console data</li>
      <li>• Quantifiable measurements</li>
    </ul>
  </div>

  <div class="bg-dark-light border border-purple-500  p-6">
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

## People Objects

People represent individual humans across all your systems, providing a unified view of contacts, leads, users, and team members.

### Core Schema
```json
{
  "type": "Person",
  "email": "john@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "phone": "+1-555-0123",
  "jobTitle": "Marketing Manager",
  "company": "Acme Corp",
  "department": "Marketing",
  "location": "San Francisco, CA",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "twitterHandle": "@johndoe",
  "website": "https://johndoe.com",
  "tags": ["customer", "enterprise"],
  "customFields": {
    "leadScore": 85,
    "industry": "Technology"
  },
  "sourceId": "hubspot_abc123",
  "sourceObjectId": "12345",
  "sourceObjectType": "contact",
  "qualityScore": 0.95,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:22:00Z"
}
```

### Source System Mappings

#### HubSpot → People
```json
// HubSpot Contact
{
  "vid": 12345,
  "properties": {
    "email": "john@acme.com",
    "firstname": "John",
    "lastname": "Doe",
    "jobtitle": "Marketing Manager",
    "company": "Acme Corp",
    "phone": "+1-555-0123"
  }
}

// Becomes Person Object
{
  "type": "Person",
  "email": "john@acme.com",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Marketing Manager",
  "company": "Acme Corp",
  "phone": "+1-555-0123"
}
```

#### Pipedrive → People
```json
// Pipedrive Person
{
  "id": 123456,
  "primary_email": "jane@startup.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "org_name": "Startup Inc",
  "job_title": "CEO"
}

// Becomes Person Object
{
  "type": "Person",
  "email": "jane@startup.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "company": "Startup Inc",
  "jobTitle": "CEO"
}
```

#### Zoho CRM → People
```json
// Zoho Contact
{
  "Email": "mike@enterprise.com",
  "First_Name": "Mike",
  "Last_Name": "Johnson",
  "Account_Name": "Enterprise Solutions",
  "Title": "VP Sales"
}

// Becomes Person Object
{
  "type": "Person",
  "email": "mike@enterprise.com",
  "firstName": "Mike",
  "lastName": "Johnson",
  "company": "Enterprise Solutions",
  "jobTitle": "VP Sales"
}
```

### Destination System Mappings

#### People → HubSpot Contacts
```json
// Person Object
{
  "type": "Person",
  "email": "sarah@newco.com",
  "firstName": "Sarah",
  "lastName": "Wilson",
  "jobTitle": "Product Manager"
}

// Becomes HubSpot Contact
{
  "properties": {
    "email": "sarah@newco.com",
    "firstname": "Sarah",
    "lastname": "Wilson",
    "jobtitle": "Product Manager",
    "hs_lead_status": "NEW",
    "lifecyclestage": "lead"
  }
}
```

#### People → Pipedrive Persons
```json
// Person Object (New Lead)
{
  "type": "Person",
  "email": "alex@prospect.com",
  "firstName": "Alex",
  "lastName": "Chen",
  "company": "Prospect Corp"
}

// Becomes Pipedrive Person
{
  "name": "Alex Chen",
  "email": [{"value": "alex@prospect.com", "primary": true}],
  "org_id": null,
  "visible_to": "3",
  "label": "New Lead"
}
```

## Organizations Objects

Organizations represent companies, accounts, and business entities across all your systems.

### Core Schema
```json
{
  "type": "Organization",
  "name": "Acme Corporation",
  "domain": "acme.com",
  "website": "https://acme.com",
  "industry": "Technology",
  "size": "500-1000 employees",
  "revenue": 50000000,
  "location": "San Francisco, CA",
  "address": {
    "street": "123 Market Street",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105",
    "country": "United States"
  },
  "phone": "+1-555-0456",
  "description": "Leading technology solutions provider",
  "foundedYear": 2010,
  "tags": ["enterprise", "technology"],
  "customFields": {
    "accountTier": "Enterprise",
    "contractValue": 250000
  },
  "sourceId": "pipedrive_def456",
  "sourceObjectId": "234567",
  "sourceObjectType": "organization",
  "qualityScore": 0.92,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T16:45:00Z"
}
```

### Source System Mappings

#### HubSpot → Organizations
```json
// HubSpot Company
{
  "companyId": 67890,
  "properties": {
    "name": "Tech Innovations Ltd",
    "domain": "techinnovations.com",
    "industry": "Software",
    "numberofemployees": "250",
    "annualrevenue": "25000000"
  }
}

// Becomes Organization Object
{
  "type": "Organization",
  "name": "Tech Innovations Ltd",
  "domain": "techinnovations.com",
  "industry": "Software",
  "size": "250",
  "revenue": 25000000
}
```

#### Pipedrive → Organizations
```json
// Pipedrive Organization
{
  "id": 345678,
  "name": "Global Enterprises Inc",
  "address": "123 Industrial Blvd",
  "people_count": 5000
}

// Becomes Organization Object
{
  "type": "Organization",
  "name": "Global Enterprises Inc",
  "address": "123 Industrial Blvd",
  "size": "5000"
}
```

### Destination System Mappings

#### Organizations → Pipedrive Organizations
```json
// Organization Object
{
  "type": "Organization",
  "name": "Future Systems Corp",
  "website": "https://futuresystems.com",
  "industry": "Technology",
  "revenue": 75000000
}

// Becomes Pipedrive Organization
{
  "name": "Future Systems Corp",
  "visible_to": "3",
  "custom_fields": {
    "website": "https://futuresystems.com",
    "industry": "Technology"
  }
}
```

## Facts Objects

Facts represent measurable data points, metrics, and analytics from various systems.

### Core Schema
```json
{
  "type": "Facts",
  "metric": "organic_clicks",
  "value": 1250,
  "unit": "clicks",
  "dimension": {
    "query": "data synchronization",
    "page": "/products/data-sync",
    "country": "United States",
    "device": "desktop"
  },
  "timestamp": "2024-01-15T00:00:00Z",
  "period": "daily",
  "source": "Google Search Console",
  "category": "search_performance",
  "tags": ["organic", "search", "traffic"],
  "metadata": {
    "position": 3.2,
    "impressions": 5420,
    "ctr": 0.23
  },
  "sourceId": "gsc_ghi789",
  "sourceObjectId": "query_12345",
  "sourceObjectType": "search_analytics",
  "createdAt": "2024-01-15T06:00:00Z"
}
```

### Source System Mappings

#### Google Search Console → Facts
```json
// GSC Search Analytics
{
  "keys": ["data synchronization"],
  "clicks": 1250,
  "impressions": 5420,
  "ctr": 0.23,
  "position": 3.2,
  "date": "2024-01-15"
}

// Becomes Multiple Facts Objects
[
  {
    "type": "Facts",
    "metric": "organic_clicks",
    "value": 1250,
    "dimension": {"query": "data synchronization"},
    "timestamp": "2024-01-15T00:00:00Z"
  },
  {
    "type": "Facts",
    "metric": "organic_impressions", 
    "value": 5420,
    "dimension": {"query": "data synchronization"},
    "timestamp": "2024-01-15T00:00:00Z"
  }
]
```

#### HubSpot → Facts (Analytics)
```json
// HubSpot Deal
{
  "dealId": 98765,
  "properties": {
    "amount": 50000,
    "dealstage": "closedwon",
    "closedate": "2024-01-15",
    "dealtype": "New Business"
  }
}

// Becomes Facts Object
{
  "type": "Facts",
  "metric": "deal_value",
  "value": 50000,
  "unit": "USD",
  "dimension": {
    "stage": "closedwon",
    "type": "New Business"
  },
  "timestamp": "2024-01-15T00:00:00Z",
  "category": "sales_performance"
}
```

### Destination System Mappings

Facts are typically used for analytics and reporting rather than being written back to operational systems. However, they can be delivered to:

- **Analytics Platforms**: Tableau, Power BI, Looker
- **Data Warehouses**: Snowflake, BigQuery, Redshift
- **Business Intelligence Tools**: Custom dashboards and reports

## Relationships Objects

Relationships represent connections between People and Organizations, maintaining the context of how entities are related.

### Core Schema
```json
{
  "type": "Relationships",
  "fromType": "Person",
  "fromId": "john@acme.com",
  "toType": "Organization", 
  "toId": "acme.com",
  "relationshipType": "employee",
  "strength": 0.95,
  "verified": true,
  "startDate": "2022-03-15T00:00:00Z",
  "endDate": null,
  "metadata": {
    "department": "Marketing",
    "role": "Manager",
    "reportingStructure": "direct"
  },
  "sourceId": "hubspot_abc123",
  "sourceObjectId": "association_456789",
  "sourceObjectType": "contact_to_company",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Source System Mappings

#### HubSpot → Relationships
```json
// HubSpot Contact-Company Association
{
  "contactId": 12345,
  "companyId": 67890,
  "associationType": "CONTACT_TO_COMPANY"
}

// Plus Contact Data
{
  "email": "john@acme.com",
  "jobtitle": "Marketing Manager"
}

// Plus Company Data  
{
  "domain": "acme.com",
  "name": "Acme Corp"
}

// Becomes Relationship Object
{
  "type": "Relationships",
  "fromType": "Person",
  "fromId": "john@acme.com",
  "toType": "Organization",
  "toId": "acme.com", 
  "relationshipType": "employee",
  "metadata": {
    "jobTitle": "Marketing Manager"
  }
}
```

#### Pipedrive → Relationships
```json
// Pipedrive Person with Organization
{
  "Person": {
    "id": 123456,
    "primary_email": "sarah@enterprise.com",
    "org_id": 234567
  },
  "Organization": {
    "id": 234567,
    "name": "Enterprise Solutions"
  }
}

// Becomes Relationship Object
{
  "type": "Relationships",
  "fromType": "Person",
  "fromId": "sarah@enterprise.com",
  "toType": "Organization",
  "toId": "enterprise.com",
  "relationshipType": "contact",
  "verified": true
}
```

### Relationship Types

#### Common Relationship Types
- **employee**: Person works for Organization
- **contact**: Person is a contact at Organization
- **customer**: Person/Organization is a customer
- **prospect**: Person/Organization is a potential customer
- **partner**: Business partnership relationship
- **vendor**: Supplier relationship
- **consultant**: Professional services relationship

#### Relationship Strength
Relationships include a strength score (0-1) indicating confidence:
- **1.0**: Explicitly defined in source system
- **0.8-0.9**: Strong indicators (email domain match, explicit association)
- **0.6-0.7**: Moderate indicators (inferred from data patterns)
- **0.3-0.5**: Weak indicators (possible connection)
- **0.0-0.2**: Very uncertain connection

## Object Interactions

### Cross-Object Dependencies

#### People ↔ Organizations
```json
// Person references Organization
{
  "type": "Person",
  "email": "john@acme.com",
  "company": "Acme Corp"  // References Organization
}

// Organization contains People
{
  "type": "Organization", 
  "domain": "acme.com",
  "employees": ["john@acme.com", "jane@acme.com"]  // References People
}

// Explicit Relationship
{
  "type": "Relationships",
  "fromType": "Person",
  "fromId": "john@acme.com",
  "toType": "Organization",
  "toId": "acme.com",
  "relationshipType": "employee"
}
```

#### Facts → People/Organizations
```json
// Facts can reference People or Organizations
{
  "type": "Facts",
  "metric": "deal_value",
  "value": 50000,
  "dimension": {
    "person": "john@acme.com",      // References Person
    "organization": "acme.com",     // References Organization
    "dealStage": "closed-won"
  }
}
```

### Data Flow Examples

#### Complete Customer Record
```json
// 1. Person Object
{
  "type": "Person",
  "email": "ceo@startup.com",
  "firstName": "Alex",
  "lastName": "Chen",
  "jobTitle": "CEO"
}

// 2. Organization Object
{
  "type": "Organization",
  "name": "Startup Inc",
  "domain": "startup.com",
  "industry": "Technology"
}

// 3. Relationship Object
{
  "type": "Relationships",
  "fromType": "Person",
  "fromId": "ceo@startup.com",
  "toType": "Organization", 
  "toId": "startup.com",
  "relationshipType": "employee"
}

// 4. Facts Objects
[
  {
    "type": "Facts",
    "metric": "deal_value",
    "value": 100000,
    "dimension": {
      "person": "ceo@startup.com",
      "organization": "startup.com"
    }
  },
  {
    "type": "Facts",
    "metric": "website_visits",
    "value": 1250,
    "dimension": {
      "organization": "startup.com",
      "source": "organic"
    }
  }
]
```

## Object Validation & Quality

### Data Quality Checks
- **Email Validation**: Valid email format for People
- **Domain Validation**: Valid domain format for Organizations
- **Relationship Consistency**: Valid references between objects
- **Metric Validation**: Appropriate data types for Facts values

### Quality Scoring Factors
- **Completeness**: Percentage of required fields populated
- **Accuracy**: Validation against known patterns
- **Consistency**: Agreement across multiple sources
- **Freshness**: How recently the data was updated

### Duplicate Detection
- **People**: Email-based deduplication with name similarity
- **Organizations**: Domain-based with name fuzzy matching
- **Facts**: Metric + dimension + timestamp uniqueness
- **Relationships**: From/To object pair uniqueness

## Best Practices

### Object Design
1. **Use Standard Fields**: Leverage common fields for better compatibility
2. **Custom Fields**: Use customFields object for source-specific data
3. **Consistent Naming**: Follow naming conventions across objects
4. **Quality Metadata**: Include quality scores and validation results

### Relationship Management
1. **Explicit Relationships**: Create Relationship objects for important connections
2. **Strength Scoring**: Use appropriate strength scores for confidence levels
3. **Bidirectional Links**: Maintain references in both directions when needed
4. **Lifecycle Management**: Track relationship start/end dates

### Performance Optimization
1. **Indexing Strategy**: Index on primary identifiers (email, domain)
2. **Batch Processing**: Process related objects together
3. **Caching**: Cache frequently accessed object relationships
4. **Incremental Updates**: Only sync changed objects

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔄 Learn About Standardization</h3>
    <p class="text-gray-300 mb-4">Understand how raw data transforms into these standardized objects.</p>
    <a href="/docs/concepts/standardization/" class="text-yellow hover:text-yellow-light transition-colors">Standardization Process →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📚 Explore Sources</h3>
    <p class="text-gray-300 mb-4">See how different sources map to these object types.</p>
    <a href="/docs/sources/" class="text-yellow hover:text-yellow-light transition-colors">View Sources →</a>
  </div>
</div>

---

*Understanding these four object types is key to leveraging Outrun's standardization power - they provide the universal language that enables seamless data synchronization across any system.* 