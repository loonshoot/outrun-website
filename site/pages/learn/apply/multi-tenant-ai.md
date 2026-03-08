---
title: "Multi-Tenant AI Patterns"
layout: layouts/learn.liquid
track: process-builders
tier: apply
readTime: "9 min"
permalink: /learn/apply/multi-tenant-ai/
metaTitle: "Multi-Tenant AI Patterns - Technical Guide"
metaDescription: "Learn how to architect multi-tenant AI systems with proper data isolation, shared workflow logic, and tenant-scoped execution."
author: "Outrun"
date: 2026-02-15
learnings:
  - "Why multi-tenancy requires special consideration for AI workloads"
  - "Database-per-tenant isolation and its implications for AI pipelines"
  - "Patterns for sharing workflow logic while isolating tenant data"
  - "How to handle tenant-scoped credentials, rate limits, and audit trails"
prevArticle:
  title: "Data Integration for AI"
  url: /learn/apply/data-integration-ai/
nextArticle:
  title: "AI Audit Trails at Scale"
  url: /learn/apply/ai-audit-trails-scale/
---

When your AI platform serves multiple customers or teams, every piece of data, every API credential, and every execution context must be scoped to the right tenant. A misrouted email, a leaked deal record, or a crossed credential is not just a bug — it is a security incident. This guide covers the architectural patterns for building multi-tenant AI systems that are isolated by design.

## Why Multi-Tenancy Is Hard for AI

Traditional multi-tenant systems deal with structured data in databases. The isolation boundary is clear: tenant A's rows don't appear in tenant B's queries. Filter by tenant ID and you're done.

AI workloads complicate this in several ways:

**Prompt context leakage.** If AI node outputs are cached or shared across tenants, one tenant's data might appear in another tenant's prompt context.

**Credential scoping.** Each tenant connects their own Salesforce instance, their own GitHub org, their own email accounts. The workflow logic is the same, but the credentials are completely different.

**Model context.** If you fine-tune or use few-shot examples from one tenant's data, that training data must not influence outputs for other tenants.

**Execution isolation.** When tenant A's workflow triggers a code execution, it must not be able to access tenant B's file system, environment variables, or network resources.

## Database-Per-Tenant Architecture

The strongest isolation pattern is a separate database per tenant. Shared platform data (authentication, billing, webhook routing) lives in a common database, while all tenant-specific data gets its own:

```
Platform DB (shared)
├── users
├── billing
├── webhook_routes
└── workspace_metadata

Workspace DB: workspace_abc (Tenant A)
├── contacts
├── deals
├── workflows
├── workflow_runs
├── tokens (encrypted)
└── audit_logs

Workspace DB: workspace_xyz (Tenant B)
├── contacts
├── deals
├── workflows
├── workflow_runs
├── tokens (encrypted)
└── audit_logs
```

Every database operation requires a workspace context. The application never opens a connection without first resolving which tenant database to use:

```javascript
function getWorkspaceDb(workspaceId) {
  const dbName = `workspace_${workspaceId}`;
  return mongoClient.db(dbName);
}

// Every query is tenant-scoped by construction
async function getDeals(workspaceId) {
  const db = getWorkspaceDb(workspaceId);
  return db.collection('deals').find({}).toArray();
}
```

This is stronger than row-level filtering (where a missing `WHERE workspace_id = ?` clause leaks data) because the isolation is structural. There is no query you can write against `workspace_abc` that returns data from `workspace_xyz`.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Database-per-tenant isolation eliminates an entire class of data leakage bugs. When isolation is structural rather than logical, you do not have to trust every query to include the right filter. The architecture enforces correctness by default.</p>
</div>

## Tenant-Scoped Workflow Execution

Workflow definitions can be shared (as templates) or tenant-specific (as customised instances). The execution engine must maintain tenant context throughout the entire run:

```javascript
async function executeWorkflow(workflowId, workspaceId, triggerData) {
  const wsDb = getWorkspaceDb(workspaceId);

  // Load workflow from tenant's database
  const workflow = await wsDb.collection('workflows').findOne({ _id: workflowId });

  // Create run record in tenant's database
  const runId = crypto.randomUUID();
  await wsDb.collection('workflow_runs').insertOne({
    _id: runId,
    workflowId,
    status: 'running',
    startedAt: new Date(),
    nodes: {}
  });

  // Execute with tenant context threaded through
  const context = {
    workspaceId,
    wsDb,
    runId,
    credentials: await resolveCredentials(wsDb),
    rateLimiter: getTenantRateLimiter(workspaceId)
  };

  for (const node of topologicalSort(workflow.nodes)) {
    await executeNode(node, context);
  }
}
```

The `context` object is the tenant boundary. Every node receives it and uses it for all data access, credential resolution, and logging. There is no global state that could accidentally cross tenants.

## Credential Isolation

Each tenant's API credentials (OAuth tokens, API keys) are stored encrypted in their workspace database:

```javascript
async function resolveToken(wsDb, service) {
  const tokenDoc = await wsDb.collection('tokens').findOne({ service });

  if (!tokenDoc) throw new Error(`No ${service} token configured`);

  // Decrypt using application-level encryption key
  const decrypted = decrypt(
    tokenDoc.encryptedAuthToken,
    tokenDoc.encryptedAuthTokenIV
  );

  // Check expiry and refresh if needed
  if (tokenDoc.expiryTime < Date.now() / 1000) {
    return await refreshToken(wsDb, service, tokenDoc);
  }

  return decrypted;
}
```

Critical details:

- Tokens are encrypted at rest with AES-256-CBC
- Each token has its own initialisation vector (IV)
- Token refresh happens within the tenant context
- Expired tokens are refreshed automatically, but the refresh token is also tenant-scoped
- The encryption key is an application secret, not stored in any tenant database

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>When comparing tenant identifiers (like workspace IDs), always use explicit string conversion: <code>String(workspaceId)</code>. In MongoDB-backed systems, ObjectId comparison with <code>===</code> or <code>!==</code> fails silently because two ObjectId instances with the same value are different JavaScript objects. This is a common source of cross-tenant bugs where a query matches the wrong workspace because the comparison returned an unexpected result.</p>
</div>

## Tenant-Scoped Rate Limiting

Different tenants have different rate limits based on their plan tier. The rate limiter must be tenant-aware:

```javascript
const rateLimitTiers = {
  starter: { aiCalls: 100, apiCalls: 1000, concurrent: 2 },
  professional: { aiCalls: 500, apiCalls: 5000, concurrent: 5 },
  enterprise: { aiCalls: 2000, apiCalls: 20000, concurrent: 10 }
};

class TenantRateLimiter {
  constructor(workspaceId, tier) {
    this.prefix = `ratelimit:${workspaceId}`;
    this.limits = rateLimitTiers[tier];
  }

  async checkAndIncrement(operation) {
    const key = `${this.prefix}:${operation}`;
    const window = 3600; // 1 hour window

    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, window);

    if (current > this.limits[operation]) {
      throw new RateLimitError(
        `Tenant ${this.workspaceId} exceeded ${operation} limit`
      );
    }
  }
}
```

Rate limiting applies to AI model calls (which have real cost), external API calls (which have provider-imposed limits), and concurrent workflow executions (which consume compute resources).

## Shared Workflow Templates

While data is isolated, workflow logic can be shared as templates. A template defines the structure — node types, connections, conditional logic — while tenant-specific configuration fills in the details:

```yaml
# Shared template (platform-level)
template:
  name: "Inbound Lead Triage"
  nodes:
    - id: source
      type: source
      config_required: [provider, trigger_event]
    - id: classify
      type: ai
      config:
        prompt: "..."  # Standard prompt
    - id: route
      type: conditional
      config_required: [routing_rules]

# Tenant instance (workspace-level)
instance:
  template: "inbound-lead-triage"
  workspace: "workspace_abc"
  config:
    source:
      provider: salesforce       # Tenant A uses Salesforce
      trigger_event: new_lead
    route:
      routing_rules:
        - hot_lead: assign_to_team_alpha
        - warm_lead: nurture_sequence_7
```

The template is versioned and maintained centrally. Tenants create instances that bind their specific configuration — which CRM, which teams, which routing rules. When the template is updated, tenants can opt in to the new version.

## AI Context Isolation

When AI nodes execute, the prompt context must contain only the current tenant's data. This seems obvious but has subtle failure modes:

**Caching.** If AI responses are cached by prompt hash, two tenants with similar data could receive each other's cached responses. Cache keys must include the workspace ID.

```javascript
const cacheKey = `ai:${workspaceId}:${hashPrompt(prompt)}`;
```

**Few-shot examples.** If your prompts include examples drawn from historical data, those examples must come from the current tenant's data only.

**Shared model context.** If you're using a model with conversation history or fine-tuning, ensure that history is tenant-scoped. One tenant's conversation history must not influence another tenant's responses.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun uses <a href="/features/multi-tenant-isolation">database-per-workspace isolation</a> as its core tenancy model. Every workspace gets a separate database, scoped credentials, and isolated execution context. Shared workflow templates let you standardise automation patterns while each workspace maintains complete data sovereignty.</p>
</div>

## Data Residency

For tenants in regulated industries or specific geographic regions, data residency adds another dimension to multi-tenancy. The tenant's data must physically reside in a specific region:

| Requirement | Implementation |
|-------------|----------------|
| Data at rest | Tenant database hosted in specified region |
| Data in transit | AI API calls routed through regional endpoints |
| Execution locality | Workflow containers run in tenant's region |
| Audit log storage | Logs stored in same region as tenant data |

This means the execution engine must be region-aware. When scheduling a workflow run for a tenant with EU data residency, the container runs in an EU region, the AI API calls go through an EU endpoint, and all intermediate state stays within EU boundaries.

## Testing Multi-Tenant Isolation

Multi-tenant isolation must be tested explicitly. Automated tests should verify:

1. **Cross-tenant data access.** Attempt to query tenant B's data from tenant A's context. It must fail.
2. **Credential isolation.** Attempt to resolve tenant B's tokens from tenant A's workflow. It must fail.
3. **Cache isolation.** Execute identical workflows for two tenants. Verify cached results are tenant-scoped.
4. **Rate limit independence.** Exhaust tenant A's rate limit. Verify tenant B is unaffected.
5. **Audit trail segregation.** Verify that tenant A's audit log contains only tenant A's events.

## What's Next

Multi-tenant isolation protects data boundaries. The next guide covers **audit trails at scale** — how to capture, store, and query the complete execution history of AI workflows across all tenants without compromising performance.
