---
title: "AI vs ML vs Deep Learning: A Technical Map"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "10 min"
permalink: /learn/understand/ai-vs-ml-deep-learning/
metaTitle: "AI vs ML vs Deep Learning - Technical Guide"
metaDescription: "Understand the precise technical relationships between artificial intelligence, machine learning, and deep learning, with architecture diagrams and practical examples."
author: "Outrun"
date: 2026-02-15
learnings:
  - "The precise technical boundaries between AI, ML, and deep learning"
  - "Which algorithms and architectures live in each category"
  - "How transformers changed the deep learning landscape"
  - "When to use classical ML vs deep learning in production systems"
crossTrackUrl: /learn/understand/what-is-ai/
crossTrackTitle: "What is Artificial Intelligence?"
crossTrackLabel: "Want the business perspective?"
prevArticle:
nextArticle:
  title: "How LLMs Actually Work"
  url: /learn/understand/how-llms-work/
---

If you work in tech, you've seen "AI," "ML," and "deep learning" used interchangeably in marketing copy, job descriptions, and architecture docs. They're not the same thing. Understanding the precise boundaries between them will make you a better engineer, a better evaluator of tools, and a better communicator with stakeholders.

This guide draws the technical map.

## The Nested Relationship

These three terms form a strict hierarchy -- each is a subset of the one above it:

```
┌─────────────────────────────────────────────────┐
│  Artificial Intelligence                        │
│  Any system that exhibits intelligent behaviour  │
│                                                 │
│   ┌──────────────────────────────────────────┐  │
│   │  Machine Learning                        │  │
│   │  Systems that learn from data            │  │
│   │                                          │  │
│   │   ┌───────────────────────────────────┐  │  │
│   │   │  Deep Learning                    │  │  │
│   │   │  Multi-layer neural networks      │  │  │
│   │   │                                   │  │  │
│   │   │   Transformers, CNNs, RNNs, GANs  │  │  │
│   │   └───────────────────────────────────┘  │  │
│   │                                          │  │
│   │   Decision Trees, SVMs, k-NN, Bayes     │  │
│   └──────────────────────────────────────────┘  │
│                                                 │
│   Expert Systems, Search Algorithms, Logic      │
└─────────────────────────────────────────────────┘
```

All deep learning is machine learning. All machine learning is AI. But not all AI is machine learning, and not all machine learning is deep learning. This distinction matters when you're choosing the right tool for a problem.

## Artificial Intelligence: The Full Scope

AI is the broadest category. It covers *any* system that performs tasks requiring what we'd call intelligence -- reasoning, planning, perception, language understanding, decision-making.

This includes approaches that have nothing to do with learning from data:

- **Expert systems** -- Rule-based engines where human experts encode decision logic. Still widely used in healthcare diagnostics and financial compliance.
- **Search and planning algorithms** -- A* pathfinding, game tree search (think chess engines before neural nets), constraint solvers.
- **Symbolic reasoning** -- Formal logic systems, knowledge graphs, ontologies.

These are legitimate AI systems, but none of them *learn*. They're programmed with explicit rules. If the world changes, a human has to update the rules.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>AI is a goal (make machines behave intelligently), not a technique. Machine learning is one technique for achieving that goal -- the most powerful one we have today, but not the only one.</p>
</div>

## Machine Learning: Systems That Learn From Data

Machine learning is the subset of AI where systems improve through exposure to data rather than explicit programming. Instead of writing rules, you provide examples, and the algorithm finds patterns.

The core ML workflow looks like this:

```
Training Data → Algorithm → Model → Prediction
     ↑                               │
     └──── Feedback Loop ────────────┘
```

### Classical ML Algorithms

These algorithms don't use neural networks. They're fast, interpretable, and often the right choice for structured, tabular data:

| Algorithm | Best For | Interpretability |
|---|---|---|
| **Linear/Logistic Regression** | Prediction with clear feature relationships | High |
| **Decision Trees / Random Forests** | Classification with categorical features | High |
| **Support Vector Machines (SVMs)** | Binary classification with clear margins | Medium |
| **k-Nearest Neighbours** | Similarity-based classification | High |
| **Naive Bayes** | Text classification, spam filtering | High |
| **Gradient Boosted Trees (XGBoost)** | Structured data, competitions, production ML | Medium |

In production systems, gradient boosted trees (XGBoost, LightGBM) remain the go-to for structured data problems like lead scoring, churn prediction, and fraud detection. They frequently outperform deep learning on tabular datasets.

### When Classical ML Wins

Classical ML is preferable when:
- Your data is structured and tabular
- You need interpretable decisions (regulatory, compliance)
- Your dataset is small (thousands, not millions, of examples)
- Training speed matters more than marginal accuracy gains
- You need to explain *why* a prediction was made

## Deep Learning: Multi-Layer Neural Networks

Deep learning is the subset of machine learning that uses neural networks with multiple layers (hence "deep"). These layers learn increasingly abstract representations of data -- from raw pixels to edges to shapes to objects, or from characters to words to syntax to meaning.

### Key Architectures

**Convolutional Neural Networks (CNNs)** -- Designed for spatial data. Excel at image recognition, object detection, and any task where local patterns matter. Each convolutional layer learns to detect specific features (edges, textures, shapes).

**Recurrent Neural Networks (RNNs / LSTMs)** -- Designed for sequential data. Process inputs one step at a time while maintaining a hidden state. Were the standard for language tasks before transformers, and still used in some time-series applications.

**Transformers** -- The architecture behind GPT, Claude, and BERT. Use self-attention mechanisms to process entire sequences in parallel, learning relationships between all positions simultaneously. This parallelism made them dramatically more scalable than RNNs.

**Generative Adversarial Networks (GANs)** -- Two networks (generator and discriminator) trained against each other. Produce realistic synthetic data -- images, audio, tabular data.

```
Transformer Architecture (simplified):

Input Tokens → Embedding → [Self-Attention → Feed-Forward] × N → Output
                                    ↑
                            Positional Encoding
```

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The transformer's self-attention mechanism computes attention scores between every pair of tokens in a sequence. For a sequence of length <em>n</em>, this is an O(n<sup>2</sup>) operation -- which is why context window length is a fundamental constraint. Techniques like sliding window attention and sparse attention reduce this cost in production models. We cover this in detail in <a href="/learn/understand/how-llms-work/">How LLMs Actually Work</a>.</p>
</div>

## Choosing the Right Level

Here's the practical decision framework for choosing between these approaches:

| Problem Type | Recommended Approach | Example |
|---|---|---|
| Structured data, clear features | Classical ML (XGBoost) | Lead scoring from CRM fields |
| Image/video analysis | Deep Learning (CNNs) | Product image classification |
| Natural language understanding | Deep Learning (Transformers) | Email triage, text extraction |
| Sequence prediction | Deep Learning (RNNs/Transformers) | Sales forecasting from time series |
| Small dataset (< 1000 examples) | Classical ML | Niche classification tasks |
| Need for explainability | Classical ML | Compliance-driven decisions |

The biggest mistake in production ML is reaching for deep learning when classical ML would do the job faster, cheaper, and more transparently. Reserve deep learning for unstructured data -- text, images, audio, video -- where it genuinely excels.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <strong>AI Workflow Builder</strong> uses transformer-based LLMs under the hood for language tasks -- email triage, data extraction, classification -- while using deterministic logic for routing and actions. You get the best of both worlds without managing the infrastructure. Explore workflow templates on the <a href="/features/ai-workflow-builder">AI Workflow Builder</a> feature page.</p>
</div>

## The Convergence Trend

The boundaries between these categories are blurring in practice. Modern production systems often combine multiple approaches:

- **Feature engineering with classical ML, reasoning with LLMs** -- Use XGBoost for lead scoring, then feed the score into an LLM-powered workflow for personalised outreach.
- **Retrieval-augmented generation (RAG)** -- Combine traditional information retrieval (search algorithms, embeddings) with LLM generation. Your AI system *searches* your data, then *reasons* about it.
- **Agentic architectures** -- LLMs that invoke tools, including classical ML models, as part of multi-step reasoning chains.

Understanding the layers of the AI stack isn't just academic. It tells you what's happening inside the tools you use, helps you evaluate vendor claims, and lets you design systems that use the right approach at each stage.

## What's Next

Now that you understand the hierarchy, the next guide takes you inside the most impactful architecture in the stack today.

In **How LLMs Actually Work**, you'll explore the transformer architecture, tokenisation, attention mechanisms, and the training process that turns raw text into a system that can reason about language.
