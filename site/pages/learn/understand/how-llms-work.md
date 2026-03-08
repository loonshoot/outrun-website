---
title: "How LLMs Actually Work"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "12 min"
permalink: /learn/understand/how-llms-work/
metaTitle: "How LLMs Actually Work - Technical Guide"
metaDescription: "A technical walkthrough of large language model internals: tokenisation, embeddings, attention mechanisms, and the training pipeline that produces modern LLMs."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How tokenisation converts text into model inputs"
  - "What attention mechanisms actually compute"
  - "The pre-training and fine-tuning pipeline"
  - "Why context windows, temperature, and inference cost matter in production"
crossTrackUrl: /learn/understand/what-are-llms/
crossTrackTitle: "What Are LLMs?"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "AI vs ML vs Deep Learning"
  url: /learn/understand/ai-vs-ml-deep-learning/
nextArticle:
  title: "Foundation Models and RAG"
  url: /learn/understand/foundation-models-rag/
---

Large language models power the AI features you build with every day -- email triage, code generation, data extraction, workflow automation. But how do they actually work under the hood? Understanding the internals makes you better at prompt design, architecture decisions, and debugging when things go wrong.

This guide walks through the full pipeline, from raw text to generated output.

## The Pipeline at a Glance

Every LLM interaction follows this flow:

```
Text Input
    ↓
Tokenisation (text → token IDs)
    ↓
Embedding (token IDs → vectors)
    ↓
Transformer Layers × N
  ├── Self-Attention (what relates to what)
  └── Feed-Forward Network (process each position)
    ↓
Output Layer (vectors → probability distribution over vocabulary)
    ↓
Sampling (pick next token)
    ↓
Repeat until done
```

Let's walk through each stage.

## Tokenisation: Text to Numbers

Models don't see text. They see sequences of integers called token IDs. A tokeniser splits input text into tokens -- subword units that balance vocabulary size against sequence length.

Modern LLMs use byte-pair encoding (BPE) or similar algorithms. Common words get their own token. Rare words get split into subword pieces:

```
"Tokenisation is fascinating"
→ ["Token", "isation", " is", " fascinating"]
→ [5765, 2082, 374, 27387]
```

Key properties of tokenisation that affect your work:

- **Token count determines cost.** API pricing is per-token. A 4,000-word document might be ~5,500 tokens.
- **Context window is measured in tokens.** A 128k context window model can process ~96,000 words of English, but code and structured data tokenise less efficiently.
- **Tokenisation varies by model.** GPT-4, Claude, and Llama each have different tokenisers. The same text produces different token counts on different models.

## Embeddings: Numbers to Meaning

Each token ID maps to a high-dimensional vector (typically 4096-12288 dimensions in modern models). This embedding vector captures the semantic meaning of the token based on patterns learned during training.

Positional encodings are added to each embedding so the model knows *where* in the sequence each token appears. Without positional information, the model would treat "the cat sat on the mat" and "the mat sat on the cat" identically.

```
Token: "automation"
    ↓
Embedding vector: [0.23, -0.87, 0.12, ..., 0.45]  (4096 dimensions)
    +
Position encoding: [0.01, 0.99, -0.01, ..., 0.54]
    =
Input to first transformer layer
```

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Embeddings are why LLMs understand meaning, not just spelling. Words with similar meanings (like "automate" and "streamline") end up close together in embedding space. This geometric relationship is the foundation of everything LLMs can do with language.</p>
</div>

## Self-Attention: The Core Mechanism

Self-attention is what makes transformers work. For each token, the attention mechanism asks: "Which other tokens in this sequence are relevant to understanding *this* token?"

Technically, each token produces three vectors from its embedding:
- **Query (Q):** "What am I looking for?"
- **Key (K):** "What do I contain?"
- **Value (V):** "What information do I carry?"

The attention score between two tokens is the dot product of one token's Query and another's Key. High scores mean high relevance. These scores are normalised (softmax) and used to create a weighted combination of Value vectors.

```
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
```

### Multi-Head Attention

Rather than computing one attention pattern, transformers compute multiple patterns in parallel ("heads"). Each head can learn a different type of relationship:

- One head might track syntactic dependencies (subject-verb agreement)
- Another might track semantic relationships (what "it" refers to)
- Another might track positional patterns (list item ordering)

A model with 32 attention heads computes 32 different views of token relationships simultaneously, then combines them.

### Why This Matters in Practice

The attention mechanism is why:
- LLMs can follow instructions that reference earlier context ("use the format I described above")
- Long-range dependencies work (connecting a pronoun to its antecedent 2000 tokens back)
- Context window size directly impacts capability (more context = more relationships the model can track)

## The Transformer Block

Each transformer layer contains self-attention followed by a feed-forward network. A typical LLM stacks 32-96 of these layers:

```
Input
  ↓
┌─────────────────────────┐
│  Layer Normalisation     │
│  Multi-Head Attention    │──→ Residual Connection
│  Layer Normalisation     │
│  Feed-Forward Network    │──→ Residual Connection
└─────────────────────────┘
  ↓  (repeat N times)
Output
```

Residual connections (skip connections) add the input of each sub-layer to its output. This prevents the vanishing gradient problem and lets the model learn incremental refinements at each layer. Early layers tend to capture syntax and surface patterns. Later layers capture higher-level reasoning and abstraction.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The feed-forward network in each transformer block is typically a two-layer MLP with a non-linear activation (GeLU or SwiGLU). Recent research suggests these layers act as key-value memories -- they store factual associations learned during training. This is partly why scaling model size (more parameters in the FFN layers) improves factual recall.</p>
</div>

## Training: Pre-training and Alignment

LLM training happens in two major phases:

### Phase 1: Pre-training

The model processes enormous text corpora (trillions of tokens) with a simple objective: predict the next token. Given "The capital of France is", the model learns to assign high probability to "Paris."

This self-supervised approach requires no labelled data. The text *is* the label. By predicting the next token across trillions of examples, the model develops broad language understanding, world knowledge, and reasoning capability.

Pre-training is astronomically expensive -- millions of GPU-hours and tens of millions of dollars for frontier models.

### Phase 2: Alignment (Fine-tuning + RLHF)

A pre-trained model is a next-token predictor. It's not yet an assistant. The alignment phase shapes its behaviour:

1. **Supervised Fine-Tuning (SFT)** -- Train on curated examples of ideal responses. "Given this instruction, here's the perfect answer."
2. **Reinforcement Learning from Human Feedback (RLHF)** -- Human raters rank model outputs. A reward model learns these preferences. The LLM is then optimised to produce outputs the reward model scores highly.

This two-phase process is why a base model (pre-trained only) behaves very differently from a chat model (aligned). The base model rambles and continues text. The aligned model follows instructions, stays on topic, and refuses harmful requests.

## Inference: Generating Output

When you send a prompt to an LLM API, here's what happens:

1. **Tokenise** the prompt.
2. **Forward pass** through all transformer layers.
3. **Produce a probability distribution** over the entire vocabulary for the next token.
4. **Sample** from that distribution (controlled by temperature).
5. **Append** the chosen token to the sequence.
6. **Repeat** from step 2 until a stop condition is met.

This is autoregressive generation -- each token depends on all previous tokens. It's inherently sequential, which is why LLM output streams token by token.

### Temperature and Sampling

- **Temperature 0:** Always pick the highest-probability token. Deterministic, repetitive output.
- **Temperature 0.3-0.7:** Mild randomness. Good for tasks requiring consistency with some creativity.
- **Temperature 1.0+:** High randomness. More creative, but less predictable.

**Top-p (nucleus) sampling** is an alternative: instead of a fixed temperature, only consider tokens whose cumulative probability exceeds a threshold (e.g., top 95%). This dynamically adjusts randomness based on the model's confidence.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>When you build workflows in Outrun's <strong>AI Workflow Builder</strong>, the platform handles inference parameters automatically -- using lower temperatures for data extraction (where precision matters) and higher temperatures for content generation (where creativity helps). See how it works on the <a href="/features/ai-workflow-builder">AI Workflow Builder</a> feature page.</p>
</div>

## Production Considerations

Understanding LLM internals helps you reason about real-world constraints:

**Latency** -- Autoregressive generation means latency scales linearly with output length. A 500-token response takes roughly 5x longer to generate than a 100-token response. Streaming mitigates perceived latency.

**Cost** -- API cost scales with total token count (input + output). Long system prompts that repeat on every call add up fast. Optimising prompt length is a genuine engineering concern.

**Context window utilisation** -- Stuffing the context window degrades performance on tasks that require focusing on specific parts of the input. More context is not always better. RAG architectures retrieve only the most relevant chunks rather than dumping everything in.

**Hallucination** -- The model always generates *something* plausible. It has no mechanism for saying "I don't know" unless trained to do so. Grounding outputs against retrieved facts (RAG) and implementing verification steps are essential for production reliability.

## What's Next

Now that you understand the internal machinery, the next guide covers how these base capabilities get extended for real-world applications.

In **Foundation Models and RAG**, you'll learn how retrieval-augmented generation grounds LLMs in your actual data, eliminating hallucination and making AI outputs trustworthy enough for production use.
