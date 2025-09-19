---
layout: layouts/docs.liquid
title: Core Concepts
description: Understand the fundamental concepts behind Outrun's data synchronization platform. Learn about ingestion, standardization, and data flow.
metaTitle: Outrun Core Concepts - How Data Synchronization Works
metaDescription: Complete guide to Outrun's core concepts including data ingestion, standardization, transformation, and synchronization processes.
permalink: /docs/concepts/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Core Concepts
    url: /docs/concepts/
---

# Core Concepts

Understanding these fundamental concepts will help you make the most of Outrun's data synchronization platform. These concepts form the foundation of how Outrun ingests, processes, and delivers your data.

## The Outrun Data Flow

Outrun follows a systematic approach to data synchronization:

<div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
  <div class="bg-dark-light border border-gray-600  p-4 text-center">
    <div class="w-12 h-12 bg-blue-500  flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">1</div>
    <h3 class="text-yellow text-sm font-semibold mb-2">Ingestion</h3>
    <p class="text-gray-400 text-xs">Raw data collected from sources</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-4 text-center">
    <div class="w-12 h-12 bg-green-500  flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">2</div>
    <h3 class="text-yellow text-sm font-semibold mb-2">Consolidation</h3>
    <p class="text-gray-400 text-xs">Data merged and cleaned</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-4 text-center">
    <div class="w-12 h-12 bg-purple-500  flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">3</div>
    <h3 class="text-yellow text-sm font-semibold mb-2">Standardization</h3>
    <p class="text-gray-400 text-xs">Transformed into standard objects</p>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-4 text-center">
    <div class="w-12 h-12 bg-orange-500  flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">4</div>
    <h3 class="text-yellow text-sm font-semibold mb-2">Delivery</h3>
    <p class="text-gray-400 text-xs">Sent to destinations</p>
  </div>
</div>

## Key Concepts

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <a href="/docs/concepts/objects/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🧩 Objects</h3>
    <p class="text-gray-300 mb-3">The four standardized object types that represent all business data: People, Organizations, Facts, and Relationships.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Universal data model</li>
      <li>• Source and destination mappings</li>
      <li>• Cross-object relationships</li>
    </ul>
  </a>

  <a href="/docs/concepts/ingestion/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">📥 Ingestion</h3>
    <p class="text-gray-300 mb-3">How Outrun collects and stores raw data from your sources using real-time streams or batch jobs.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Real-time vs batch collection</li>
      <li>• Raw data preservation</li>
      <li>• Stream storage and metadata</li>
    </ul>
  </a>

  <a href="/docs/concepts/standardization/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔄 Standardization</h3>
    <p class="text-gray-300 mb-3">How raw data transforms into standardized People, Organizations, Facts, and Relationships.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Standard object types</li>
      <li>• Field mapping and transformation</li>
      <li>• Cross-system compatibility</li>
    </ul>
  </a>

  <a href="/docs/concepts/delivery/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">📤 Delivery</h3>
    <p class="text-gray-300 mb-3">How standardized data is delivered to your target systems with intelligent mapping and rate limiting.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Destination-specific transformation</li>
      <li>• Rate limiting and performance</li>
      <li>• Error handling and retry logic</li>
    </ul>
  </a>

  <a href="/docs/concepts/storage/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🏗️ Storage</h3>
    <p class="text-gray-300 mb-3">Multi-region storage architecture with intelligent regional data placement for optimal compliance.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Multi-region replication</li>
      <li>• Regional data centers</li>
      <li>• Intelligent data placement</li>
    </ul>
  </a>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <a href="/docs/concepts/security/" class="bg-dark-light border border-gray-600  p-6 hover:border-yellow transition-colors">
    <h3 class="text-yellow text-lg font-semibold mb-3">🔒 Security & Compliance</h3>
    <p class="text-gray-300 mb-3">Comprehensive security measures, SOC 2 compliance, and data ownership policies.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• SOC 2 compliance framework</li>
      <li>• Data encryption and access controls</li>
      <li>• Regional compliance strategies</li>
    </ul>
  </a>

  <div class="bg-dark-light border border-gray-600  p-6 opacity-60">
    <h3 class="text-gray-400 text-lg font-semibold mb-3">🔗 Data Relationships</h3>
    <p class="text-gray-300 mb-3">How Outrun maintains connections between data objects across different systems.</p>
    <ul class="text-gray-400 text-sm space-y-1">
      <li>• Cross-system relationships</li>
      <li>• Relationship mapping</li>
      <li>• Connection maintenance</li>
    </ul>
    <span class="text-gray-500 text-sm">Coming Soon</span>
  </div>
</div>

## Data Storage Architecture

Understanding how Outrun stores and processes your data:

### Stream Collections
- **`[sourceId]_stream`**: Raw data as received from APIs
- **First-in, first-out**: Chronological data storage
- **Metadata enriched**: System metadata for processing tracking
- **Original format**: Data preserved as close to source format as possible

### Consolidated Collections
- **`[sourceId]_consolidate`**: Merged and cleaned data
- **Deduplication**: Duplicate records identified and merged
- **Data quality**: Validation and cleansing applied
- **Relationship mapping**: Cross-record relationships established

### Standardized Objects
- **People**: Contacts, leads, users from any system
- **Organizations**: Companies, accounts, business entities
- **Facts**: Events, activities, metrics, analytics data
- **Relationships**: Connections between people and organizations

## The Outrun Philosophy

### Standardization Over Customization
Outrun focuses on creating standardized approaches rather than custom integrations:

- **Opinionated Mappings**: Pre-built field mappings for common use cases
- **Standard Objects**: Universal data models that work across systems
- **Best Practices**: Built-in data quality and validation rules
- **Simplified Setup**: Minimal configuration required

### Data Preservation
We maintain data integrity throughout the process:

- **Original Format**: Raw data stored as received from APIs
- **Audit Trail**: Complete history of data transformations
- **Metadata Enrichment**: System information without altering source data
- **Reversible Process**: Ability to trace back to original data

### Performance & Reliability
Built for enterprise-scale data synchronization:

- **Rate Limit Management**: Intelligent API quota management
- **Error Handling**: Comprehensive retry and recovery logic
- **Monitoring**: Real-time sync status and performance metrics
- **Scalability**: Designed to handle large data volumes

## Next Steps

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">🚀 Start with Ingestion</h3>
    <p class="text-gray-300 mb-4">Learn how Outrun collects and stores data from your sources.</p>
    <a href="/docs/concepts/ingestion/" class="text-yellow hover:text-yellow-light transition-colors">Learn About Ingestion →</a>
  </div>
  
  <div class="bg-dark-light border border-gray-600  p-6">
    <h3 class="text-yellow text-lg font-semibold mb-3">📚 Browse Sources</h3>
    <p class="text-gray-300 mb-4">See what data sources Outrun can connect to.</p>
    <a href="/docs/sources/" class="text-yellow hover:text-yellow-light transition-colors">View Sources →</a>
  </div>
</div>

---

*Understanding these concepts will help you design effective data synchronization strategies with Outrun.* 