---
title: "Data Integration for AI"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "8 min"
permalink: /learn/apply/data-integration-ai/
metaTitle: "Data Integration for AI - Technical Guide"
metaDescription: "Learn how to build data integration pipelines that feed clean, normalised data into AI workflows across CRMs, tools, and custom sources."
author: "Outrun"
date: 2026-02-15
learnings:
  - "Why data integration is the foundation of reliable AI automation"
  - "Standardisation patterns for multi-CRM and multi-tool environments"
  - "How object mapping and field normalisation work in practice"
  - "Strategies for keeping AI workflows fed with fresh, consistent data"
crossTrackUrl: /learn/apply/vendor-change-tracking/
crossTrackTitle: "Vendor Change Tracking with AI"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "Building Reliable AI Pipelines"
  url: /learn/apply/reliable-ai-pipelines/
nextArticle:
  title: "Multi-Tenant AI Patterns"
  url: /learn/apply/multi-tenant-ai/
---

AI workflows are only as good as the data they receive. Feed an LLM inconsistent field names, mixed formats, and stale records, and the output is unreliable no matter how good the prompt is. Data integration — getting clean, normalised data from your tools into your AI pipelines — is the foundation that everything else depends on.

## The Data Problem in AI Workflows

Most businesses use multiple tools that describe the same concepts differently:

| Concept | Salesforce | HubSpot | Pipedrive | Zoho |
|---------|------------|---------|-----------|------|
| A person | Contact | Contact | Person | Contact |
| A company | Account | Company | Organization | Account |
| A deal | Opportunity | Deal | Deal | Potential |
| A note | Activity | Note | Note | Note |
| Deal stage | StageName | dealstage | stage_id | Stage |

When your AI workflow processes a deal update, the prompt needs to understand the data structure. If the workflow connects to Salesforce, the deal stage field is `StageName`. For HubSpot, it's `dealstage`. For Pipedrive, it's `stage_id` — and it's a numeric ID that maps to a label through a separate API call.

Without a normalisation layer, every AI prompt must be provider-specific. You end up maintaining four versions of every workflow, or worse, a tangle of if/else conditions in every node.

## Standardised Object Models

The solution is a standardisation layer that maps provider-specific schemas to a common object model:

```json
{
  "standardObject": "Deal",
  "standardFields": {
    "id": { "type": "string", "required": true },
    "title": { "type": "string", "required": true },
    "value": { "type": "number", "required": false },
    "currency": { "type": "string", "default": "USD" },
    "stage": { "type": "string", "required": true },
    "owner": { "type": "string", "required": false },
    "company": { "type": "string", "required": false },
    "contacts": { "type": "array", "items": "string" },
    "createdAt": { "type": "datetime", "required": true },
    "updatedAt": { "type": "datetime", "required": true }
  }
}
```

Each provider gets a mapping configuration that transforms its native format to the standard model:

```json
{
  "provider": "salesforce",
  "object": "Opportunity",
  "fieldMappings": {
    "id": "Id",
    "title": "Name",
    "value": "Amount",
    "currency": "CurrencyIsoCode",
    "stage": "StageName",
    "owner": "OwnerId",
    "company": "AccountId",
    "contacts": "ContactRoles[].ContactId",
    "createdAt": "CreatedDate",
    "updatedAt": "LastModifiedDate"
  }
}
```

With this mapping in place, your AI workflow works with the standard `Deal` object regardless of which CRM is connected. The prompt references `deal.stage` and `deal.value` — never `StageName` or `Amount`.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>A standardised object model decouples your AI workflows from specific tool implementations. Write your prompts and conditions against the standard model once, and the mapping layer handles provider-specific translation. This means you can swap CRMs, add new tools, or support multiple tools simultaneously without rewriting any workflow logic.</p>
</div>

## The Ingestion Pipeline

Data flows from source tools into your standardised model through an ingestion pipeline:

```
[Source API] → [Extract] → [Transform] → [Validate] → [Store] → [Available for AI]
```

### Extract

Pull data from the source tool via API. Two strategies:

**Webhook-driven (real-time).** The source tool pushes change events as they happen. You receive a webhook payload, identify the changed object, and process it immediately.

```json
{
  "event": "deal.updated",
  "provider": "hubspot",
  "payload": {
    "dealId": "12345",
    "properties": {
      "dealstage": "closedwon",
      "amount": "50000"
    }
  }
}
```

**Poll-based (batch).** Periodically query the source API for changes since the last sync. This is simpler but introduces latency.

```javascript
const lastSync = await getLastSyncTimestamp(provider, object);
const changes = await provider.getModifiedSince(object, lastSync);
```

Webhook-driven is preferred for AI workflows because the AI needs current data to make good decisions. A lead classification based on data that is 15 minutes stale might miss a critical update.

### Transform

Apply the field mappings to convert the source-specific payload to the standard model:

```javascript
function transformToStandard(payload, mappings) {
  const standardObject = {};

  for (const [standardField, sourceField] of Object.entries(mappings)) {
    if (sourceField.includes('[].')) {
      // Handle array fields (e.g., "ContactRoles[].ContactId")
      const [arrayField, subField] = sourceField.split('[].');
      standardObject[standardField] = (payload[arrayField] || [])
        .map(item => item[subField]);
    } else {
      standardObject[standardField] = payload[sourceField];
    }
  }

  return standardObject;
}
```

### Validate

Check the transformed object against the standard schema. Missing required fields, type mismatches, and out-of-range values are caught here — not downstream in the AI node.

```javascript
function validate(standardObject, schema) {
  const errors = [];

  for (const [field, spec] of Object.entries(schema.standardFields)) {
    if (spec.required && !standardObject[field]) {
      errors.push(`Missing required field: ${field}`);
    }
    if (standardObject[field] && typeof standardObject[field] !== spec.type) {
      errors.push(`Type mismatch on ${field}: expected ${spec.type}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Relationship consolidation is one of the trickiest parts of data integration. A "Contact" in Salesforce may be linked to an "Account" via an AccountId field, while the same relationship in HubSpot uses an association API. The standardisation layer needs to map both into a consistent <code>contact.company</code> reference. This often requires additional API calls during the transform stage to resolve foreign keys into meaningful references.</p>
</div>

## Feeding Data to AI Nodes

Once data is standardised, AI nodes consume it through template references:

{% raw %}
```yaml
- id: analyse-deal
  type: ai
  config:
    prompt: |
      Analyse this deal and assess the likelihood of closing:

      Deal: {{deal.title}}
      Value: {{deal.value}} {{deal.currency}}
      Stage: {{deal.stage}}
      Owner: {{deal.owner.name}}
      Company: {{deal.company.name}}
      Days in current stage: {{deal.daysInStage}}

      Recent activity:
      {{#each deal.recentActivities}}
      - {{this.date}}: {{this.type}} — {{this.summary}}
      {{/each}}
```
{% endraw %}

The AI node doesn't know or care whether this deal came from Salesforce, HubSpot, or Pipedrive. The standardised model provides a consistent interface.

### Context Enrichment

AI makes better decisions with more context. Beyond the primary object, enrich the prompt with related data:

{% raw %}
```yaml
context:
  - source: deals
    filter: "company == {{deal.company.id}} AND status == 'open'"
    label: "Other open deals with this company"

  - source: activities
    filter: "contact in {{deal.contacts}} AND date > now-30d"
    label: "Recent touchpoints with deal contacts"

  - source: emails
    filter: "related_deal == {{deal.id}}"
    label: "Email thread history"
```
{% endraw %}

This context assembly step happens before the AI node executes. The workflow engine queries the standardised data store, assembles the context, and passes it as part of the prompt.

## Bidirectional Sync

AI workflows don't just read data — they write it back. When an AI node classifies a lead, that classification needs to flow back to the CRM. The same standardisation layer handles reverse mapping:

```javascript
// AI output: update deal stage to "negotiation"
const standardUpdate = {
  object: "Deal",
  id: "deal_123",
  fields: { stage: "negotiation" }
};

// Reverse mapping for Salesforce
const salesforceUpdate = reverseTransform(standardUpdate, salesforceMappings);
// Result: { object: "Opportunity", id: "006xxx", fields: { StageName: "Negotiation" } }
```

Bidirectional sync requires conflict resolution. If the AI updates a deal stage at the same moment a rep updates it in the CRM, which update wins? Common strategies include last-write-wins, source-of-truth priority, or flagging conflicts for human resolution.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun handles data integration natively through its <a href="/features/standardised-data-models">standardised data models</a>. Connect any supported CRM or tool, and Outrun maps your data to a common schema automatically. AI workflow nodes reference standard fields — so your workflows work across any connected tool without modification. The <a href="/features/model-context-protocol">MCP server</a> provides tool-agnostic data access for custom integrations.</p>
</div>

## Data Freshness and Caching

AI workflows need current data, but not every data point needs to be fetched in real-time. Implement a tiered freshness strategy:

| Data Type | Freshness Requirement | Strategy |
|-----------|----------------------|----------|
| Trigger data | Real-time | Webhook-driven |
| Primary object fields | < 1 minute | Cache with short TTL |
| Related objects | < 5 minutes | Cache with medium TTL |
| Historical context | < 1 hour | Cache with long TTL |
| Reference data (stages, owners) | < 24 hours | Daily sync |

Cache standardised objects in your fast data store. When an AI workflow needs deal data, check the cache first. If the cache is fresh, use it. If stale, fetch from source, transform, validate, cache, and then pass to the AI node.

## What's Next

When you serve multiple customers or teams from the same platform, data integration becomes more complex. The next guide covers **multi-tenant AI patterns** — how to keep data isolated while sharing workflow logic across tenants.
