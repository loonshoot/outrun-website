---
title: "Foundation Models and RAG"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "10 min"
permalink: /learn/understand/foundation-models-rag/
metaTitle: "Foundation Models and RAG - Technical Guide"
metaDescription: "Understand foundation models, retrieval-augmented generation, and the architectures that make LLMs production-ready by grounding them in your data."
author: "Outrun"
date: 2026-02-15
learnings:
  - "What foundation models are and why they changed AI development"
  - "How RAG architectures work end-to-end"
  - "The trade-offs between RAG, fine-tuning, and prompt engineering"
  - "Vector databases, embedding search, and chunking strategies"
crossTrackUrl: /learn/understand/what-is-generative-ai/
crossTrackTitle: "What is Generative AI?"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "How LLMs Actually Work"
  url: /learn/understand/how-llms-work/
nextArticle:
  title: "Neural Networks Explained"
  url: /learn/understand/neural-networks/
---

Foundation models changed the economics of AI. Instead of training a model from scratch for every task, you start with a pre-trained model that already understands language and adapt it to your needs. But foundation models have a critical limitation -- they only know what was in their training data. Retrieval-augmented generation (RAG) solves this by connecting LLMs to your live data at inference time.

This guide covers both concepts and the architecture patterns you need to build production systems.

## Foundation Models: The Base Layer

A foundation model is a large model trained on broad data that can be adapted to many downstream tasks. GPT-4, Claude, Llama, and Gemini are all foundation models.

The key insight is transfer learning at scale. Instead of this:

```
Task A → Train Model A from scratch (months, $$$)
Task B → Train Model B from scratch (months, $$$)
Task C → Train Model C from scratch (months, $$$)
```

You get this:

```
Foundation Model (trained once, $$$$$)
    ├── Task A → Adapt (hours, $)
    ├── Task B → Adapt (hours, $)
    └── Task C → Adapt (hours, $)
```

### Adaptation Strategies

There are three main ways to adapt a foundation model to your use case, each with different trade-offs:

| Strategy | Cost | Complexity | Best For |
|---|---|---|---|
| **Prompt Engineering** | None | Low | Most use cases; quick iteration |
| **RAG** | Low-Medium | Medium | Knowledge-grounded tasks; live data |
| **Fine-Tuning** | Medium-High | High | Specialised behaviour, tone, format |

**Prompt engineering** is where you start. Design the right instructions and examples in the prompt, and the foundation model handles the rest. No infrastructure changes needed.

**RAG** adds external knowledge retrieval. The model receives relevant documents alongside the prompt, grounding its responses in your actual data.

**Fine-tuning** adjusts the model's weights on your data. Use this when you need consistent stylistic changes (brand voice, domain terminology) or when prompt engineering consistently falls short on specialised tasks.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Start with prompt engineering. Add RAG when the model needs access to data it wasn't trained on. Fine-tune only when you've exhausted the other two approaches. This order minimises cost, complexity, and iteration time.</p>
</div>

## RAG: Retrieval-Augmented Generation

RAG is an architecture pattern that retrieves relevant information from a knowledge base and includes it in the LLM's context at inference time. Instead of relying on the model's parametric memory (what it learned during training), you provide explicit evidence.

### The RAG Pipeline

```
User Query
    ↓
┌─────────────────┐    ┌──────────────────────┐
│  Query Embedding │───→│  Vector Database      │
│  (embed query)   │    │  (similarity search)  │
└─────────────────┘    └──────────┬───────────┘
                                  ↓
                        Top-K Relevant Chunks
                                  ↓
                    ┌──────────────────────────┐
                    │  Prompt Construction      │
                    │  System prompt            │
                    │  + Retrieved context      │
                    │  + User query             │
                    └──────────┬───────────────┘
                               ↓
                    ┌──────────────────────────┐
                    │  LLM Generation           │
                    │  (grounded in context)     │
                    └──────────────────────────┘
                               ↓
                        Grounded Response
```

### Step-by-Step Breakdown

**1. Indexing (offline, done once per data update)**

Your documents are split into chunks, each chunk is converted to an embedding vector, and the vectors are stored in a vector database.

```
Document → Chunking → Embedding → Vector DB

"Our refund policy allows returns within 30 days..."
    ↓
Chunk: "Refund policy: returns accepted within 30 days
        of purchase. Items must be unused..."
    ↓
Embedding: [0.12, -0.34, 0.89, ..., 0.23]  (1536-dim)
    ↓
Stored in vector DB with metadata (source, date, category)
```

**2. Retrieval (at query time)**

The user's query is embedded using the same embedding model. A similarity search (cosine similarity or approximate nearest neighbours) finds the most relevant chunks.

**3. Generation**

The retrieved chunks are inserted into the LLM prompt as context. The model generates its answer based on the provided evidence, reducing hallucination.

### Chunking Strategies

How you split documents into chunks materially affects RAG quality:

- **Fixed-size chunks** (e.g., 500 tokens with 50-token overlap) -- Simple, predictable, but may split mid-sentence or mid-concept.
- **Semantic chunking** -- Split at paragraph or section boundaries. Preserves meaning better, but produces variable-length chunks.
- **Hierarchical chunking** -- Create summaries of larger sections, then detailed chunks within them. Retrieve at the appropriate granularity.

The overlap between chunks prevents edge cases where the answer spans two chunk boundaries.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Embedding models and LLMs are different models with different training objectives. Embedding models (like <code>text-embedding-3-large</code> or sentence-transformers) are optimised for semantic similarity -- they map similar meanings to nearby vectors. LLMs are optimised for generation. Using the right embedding model for retrieval is just as important as choosing the right LLM for generation.</p>
</div>

## Vector Databases

Vector databases are purpose-built for storing and querying embedding vectors. They support approximate nearest-neighbour (ANN) search, which trades a small amount of accuracy for orders-of-magnitude speed improvement over brute-force comparison.

Common options include:

| Database | Type | Key Strength |
|---|---|---|
| **Pinecone** | Managed | Ease of use, serverless scaling |
| **Weaviate** | Self-hosted / managed | Hybrid search (vector + keyword) |
| **Qdrant** | Self-hosted / managed | Performance, filtering |
| **pgvector** | Postgres extension | Leverage existing Postgres infrastructure |
| **Chroma** | Lightweight | Prototyping, local development |

For most production use cases, the choice depends on your existing infrastructure. If you already run Postgres, pgvector may be the simplest path.

## RAG vs Fine-Tuning: The Decision Framework

This is one of the most common architectural decisions in production AI:

| Dimension | RAG | Fine-Tuning |
|---|---|---|
| **Knowledge freshness** | Real-time (re-index as data changes) | Stale (frozen at training time) |
| **Traceability** | High (can cite source documents) | Low (knowledge baked into weights) |
| **Cost to update** | Low (re-embed new docs) | High (re-train or LoRA) |
| **Behavioural changes** | Limited (doesn't change model behaviour) | Strong (changes tone, format, reasoning) |
| **Latency** | Higher (retrieval step adds time) | Lower (no retrieval needed) |
| **Hallucination control** | Strong (grounded in retrieved text) | Weaker (model may still hallucinate) |

In practice, RAG and fine-tuning are complementary, not competing. Fine-tune for behaviour (response format, domain terminology, reasoning style), and use RAG for knowledge (company data, product information, policies).

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <strong>AI Agents</strong> use a RAG-like approach when they process your data. When an agent triages an email or evaluates a CRM record, it retrieves the relevant context from your connected tools -- recent interactions, deal history, contact details -- and reasons over that live data. No stale training data, no hallucinated facts. See how it works on the <a href="/features/ai-agents">AI Agents</a> feature page.</p>
</div>

## Advanced RAG Patterns

Production RAG systems often extend the basic pipeline:

**Re-ranking** -- After retrieving the top-K chunks by embedding similarity, use a cross-encoder model to re-rank them by relevance. This catches cases where embedding similarity misses nuanced relevance.

**Query transformation** -- Rewrite the user's query before embedding it. Break complex questions into sub-queries, expand abbreviations, or reformulate for better retrieval.

**Hybrid search** -- Combine vector similarity search with traditional keyword search (BM25). Keyword search excels at exact matches (product IDs, error codes) that embeddings sometimes miss.

**Contextual compression** -- After retrieval, use an LLM to extract only the relevant portions of each chunk before passing them to the generation step. Reduces noise and token cost.

## What's Next

RAG and foundation models are the production layer -- they make LLMs useful on your data. But to truly understand what's happening inside these systems, you need to go deeper into the building blocks.

In **Neural Networks Explained**, you'll learn the fundamental architecture underneath all of this -- neurons, layers, activation functions, backpropagation, and how networks learn from data.
