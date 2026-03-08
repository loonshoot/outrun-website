---
title: "Supervised vs Unsupervised Learning"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "8 min"
permalink: /learn/understand/supervised-unsupervised/
metaTitle: "Supervised vs Unsupervised Learning - Technical Guide"
metaDescription: "Understand the two foundational ML training paradigms, how self-supervised learning bridges the gap, and when to apply each in production systems."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How supervised learning uses labelled data to train predictive models"
  - "How unsupervised learning discovers hidden structure in data"
  - "Where self-supervised learning fits and why it powers LLMs"
  - "Practical decision framework for choosing the right paradigm"
prevArticle:
  title: "Prompt Engineering Patterns"
  url: /learn/understand/prompt-engineering/
nextArticle:
  title: "Evaluating LLMs"
  url: /learn/understand/evaluating-llms/
---

Every machine learning model learns from data. The difference between supervised and unsupervised learning comes down to one question: does the training data include the right answers?

This distinction isn't academic. It determines what problems you can solve, how much data preparation you need, and what kind of results you'll get. This guide covers both paradigms, plus the self-supervised approach that powers modern LLMs.

## Supervised Learning: Learning From Examples

In supervised learning, the training data includes both inputs and their correct outputs (labels). The model learns to map inputs to outputs by finding patterns that generalise to new, unseen data.

```
Training Data (labelled):
┌──────────────────────────────┬──────────────┐
│ Input (features)             │ Label (truth) │
├──────────────────────────────┼──────────────┤
│ Deal size: $50k, Stage: Demo │ Won          │
│ Deal size: $10k, Stage: Qual │ Lost         │
│ Deal size: $80k, Stage: Neg  │ Won          │
│ Deal size: $5k, Stage: Cold  │ Lost         │
└──────────────────────────────┴──────────────┘
                    ↓
            Training Algorithm
                    ↓
            Model: f(features) → Won/Lost
                    ↓
New input: Deal size: $60k, Stage: Neg → ?
Model predicts: Won (85% confidence)
```

### Two Tasks: Classification and Regression

**Classification** -- Predict a category. Spam vs not-spam. Lead priority (high/medium/low). Email intent (sales/support/billing).

**Regression** -- Predict a continuous value. Expected deal value. Time to close. Customer lifetime value.

### Common Supervised Algorithms

| Algorithm | Task Type | Strengths |
|---|---|---|
| **Logistic Regression** | Classification | Fast, interpretable, good baseline |
| **Random Forest** | Both | Handles mixed feature types, robust |
| **XGBoost / LightGBM** | Both | State-of-the-art for tabular data |
| **Support Vector Machines** | Classification | Effective in high-dimensional spaces |
| **Neural Networks** | Both | Handles unstructured data (text, images) |

### The Label Problem

Supervised learning's biggest constraint is that it requires labelled data. Someone (or something) has to provide the correct answer for every training example.

Labelling strategies:
- **Manual labelling** -- Humans annotate data. High quality but expensive. Typical cost: $0.05-$5.00 per label depending on task complexity.
- **Programmatic labelling** -- Write heuristic rules to generate noisy labels. Lower quality but massively scalable. Frameworks like Snorkel formalise this approach.
- **Active learning** -- The model identifies which unlabelled examples would be most informative. A human labels only those examples, maximising learning per label.
- **Transfer learning** -- Start with a pre-trained model and fine-tune on a small labelled dataset. This is how most production NLP works today.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>The quality of your labels is the ceiling on your model's performance. A sophisticated algorithm trained on noisy labels will always underperform a simple algorithm trained on clean labels. Invest in labelling quality before investing in model complexity.</p>
</div>

## Unsupervised Learning: Finding Hidden Structure

Unsupervised learning works with unlabelled data. There are no "right answers" -- the model discovers patterns, groupings, and structure on its own.

```
Unlabelled Data:
┌──────────────────────────────────┐
│ Customer A: 50 logins, 3 deals  │
│ Customer B: 2 logins, 0 deals   │
│ Customer C: 48 logins, 5 deals  │
│ Customer D: 1 login, 0 deals    │
│ Customer E: 55 logins, 4 deals  │
└──────────────────────────────────┘
              ↓
      Clustering Algorithm
              ↓
Cluster 1: {A, C, E}  ← "Power users"
Cluster 2: {B, D}     ← "At-risk / inactive"
```

### Key Unsupervised Tasks

**Clustering** -- Group similar data points together. Customer segmentation, document grouping, anomaly detection (points that don't fit any cluster).

**Dimensionality reduction** -- Compress high-dimensional data into fewer dimensions while preserving structure. PCA (Principal Component Analysis), t-SNE, and UMAP are common techniques. Useful for visualisation and as a preprocessing step.

**Anomaly detection** -- Identify data points that deviate significantly from the norm. Fraud detection, system monitoring, quality control.

**Association rules** -- Discover relationships between variables. "Customers who buy X also tend to buy Y." Market basket analysis.

### Common Unsupervised Algorithms

| Algorithm | Task | Key Property |
|---|---|---|
| **K-Means** | Clustering | Simple, fast, requires specifying K |
| **DBSCAN** | Clustering | Finds arbitrarily shaped clusters, handles noise |
| **Hierarchical Clustering** | Clustering | Produces a dendrogram of nested clusters |
| **PCA** | Dimensionality reduction | Linear, preserves maximum variance |
| **t-SNE / UMAP** | Dimensionality reduction | Non-linear, preserves local structure |
| **Isolation Forest** | Anomaly detection | Efficient, handles high-dimensional data |
| **Autoencoders** | Dimensionality reduction / anomaly detection | Neural network-based, learns compressed representations |

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>Embedding models (like those used in RAG pipelines) are a form of unsupervised dimensionality reduction. They compress text into dense vectors where semantic similarity corresponds to geometric proximity. When you search for similar documents using cosine similarity on embeddings, you're applying unsupervised learning principles to a retrieval task.</p>
</div>

## Self-Supervised Learning: The Third Paradigm

Self-supervised learning bridges the gap. It trains on unlabelled data but creates its own supervision signal from the data's structure. This is how LLMs are trained.

**Masked language modelling (BERT-style):** Hide a word in a sentence, train the model to predict it.
```
Input:  "The customer [MASK] the support team about a billing issue."
Target: "contacted"
```

**Next-token prediction (GPT-style):** Given a sequence, predict the next token.
```
Input:  "The quarterly revenue exceeded expectations by"
Target: "fifteen"
```

The label is derived from the data itself -- no human annotation needed. This is why LLMs can be trained on trillions of tokens: every text document on the internet is simultaneously input *and* training signal.

### Why Self-Supervised Learning Changed Everything

Before self-supervised learning, NLP relied on supervised approaches that required expensive human labelling. You might get 10,000 labelled examples for sentiment analysis -- enough for a narrow model, but not a general one.

Self-supervised pre-training on trillions of tokens produces a foundation model that understands language broadly. You then fine-tune (supervised) on a small labelled dataset for your specific task. The pre-training does the heavy lifting.

## The Decision Framework

| Dimension | Supervised | Unsupervised | Self-Supervised |
|---|---|---|---|
| **Data requirement** | Labelled data | Unlabelled data | Unlabelled data |
| **Output type** | Predictions (classification, regression) | Structure (clusters, patterns) | Representations (embeddings, pre-trained weights) |
| **Evaluation** | Clear metrics (accuracy, F1, RMSE) | Subjective (do clusters make sense?) | Downstream task performance |
| **Best for** | Known tasks with labelled examples | Exploration, segmentation, anomaly detection | Pre-training foundation models |
| **Scale** | Limited by labelling budget | Scales with data availability | Scales massively |

In practice, modern ML systems combine all three:

1. **Self-supervised pre-training** produces a foundation model
2. **Supervised fine-tuning** adapts it to your specific task
3. **Unsupervised clustering** groups your data for analysis and monitoring

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun's <strong>AI Email Intelligence</strong> combines these paradigms in practice. The underlying LLM was pre-trained (self-supervised), then aligned for instruction-following (supervised). At runtime, it classifies your emails (supervised task), while Outrun's analytics surface patterns across your pipeline (unsupervised insights). See how it works on the <a href="/features/ai-email-intelligence">Email Intelligence</a> feature page.</p>
</div>

## Reinforcement Learning: The Honourable Mention

Reinforcement learning (RL) doesn't fit neatly into supervised or unsupervised. An agent takes actions in an environment and learns from rewards and penalties. No labelled data, no discovering structure -- just trial and error optimised over time.

RL is used in LLM alignment (RLHF), game-playing agents, robotics, and recommendation systems. It's less common in typical business ML applications, but increasingly important as AI systems become more agentic.

## What's Next

Understanding training paradigms tells you how models learn. But once a model is trained, how do you know if it's actually good?

In **Evaluating LLMs**, you'll learn the metrics, benchmarks, and practical evaluation strategies for assessing LLM quality -- the critical skill for choosing between models and verifying that your AI features actually work.
