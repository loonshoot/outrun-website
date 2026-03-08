---
title: "Neural Networks Explained"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "9 min"
permalink: /learn/understand/neural-networks/
metaTitle: "Neural Networks Explained - Technical Guide"
metaDescription: "A technical walkthrough of neural network fundamentals: neurons, layers, activation functions, backpropagation, and how networks learn from data."
author: "Outrun"
date: 2026-02-15
learnings:
  - "How artificial neurons compute outputs from weighted inputs"
  - "The role of activation functions and why they enable non-linear learning"
  - "How backpropagation and gradient descent train networks"
  - "Common network topologies and when to use each"
crossTrackUrl: /learn/understand/what-is-computer-vision/
crossTrackTitle: "What is Computer Vision?"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "Foundation Models and RAG"
  url: /learn/understand/foundation-models-rag/
nextArticle:
  title: "What is MCP?"
  url: /learn/understand/what-is-mcp/
---

Neural networks are the computational substrate underneath every LLM, every image classifier, and every AI agent you interact with. They're simultaneously simpler than you'd expect (it's just weighted sums and non-linear functions) and more powerful than they have any right to be (they can approximate any continuous function).

This guide builds your understanding from a single neuron up through training full networks.

## The Artificial Neuron

A single artificial neuron does three things:

1. Takes multiple inputs, each with a weight
2. Computes a weighted sum (plus a bias term)
3. Passes the result through an activation function

```
Inputs      Weights
x1 ──(w1)──┐
x2 ──(w2)──┼──→ Σ(w*x) + b ──→ activation(z) ──→ output
x3 ──(w3)──┘
```

Mathematically:

```
z = w1*x1 + w2*x2 + w3*x3 + b
output = activation(z)
```

This is remarkably simple. A single neuron is just a linear function followed by a non-linear squash. The power comes from combining thousands (or billions) of them.

## Activation Functions: Why Non-Linearity Matters

Without activation functions, a neural network -- no matter how many layers -- would reduce to a single linear transformation. Stacking linear functions just produces another linear function. Activation functions introduce non-linearity, which is what allows networks to learn complex patterns.

| Function | Formula | Range | Used In |
|---|---|---|---|
| **ReLU** | max(0, z) | [0, infinity) | Hidden layers (default choice) |
| **Sigmoid** | 1 / (1 + e^-z) | (0, 1) | Binary output, gates |
| **Tanh** | (e^z - e^-z) / (e^z + e^-z) | (-1, 1) | Centred outputs, LSTMs |
| **GeLU** | z * Phi(z) | Approx (-0.17, infinity) | Transformers (GPT, BERT) |
| **SwiGLU** | Swish(xW) * xV | Variable | Modern LLMs (Llama, Claude) |
| **Softmax** | e^zi / Sigma(e^zj) | (0, 1), sums to 1 | Output layer for classification |

ReLU (Rectified Linear Unit) dominates because it's computationally cheap, avoids the vanishing gradient problem, and works well in practice. GeLU and SwiGLU are smoother variants used in transformer architectures, where the slight computational overhead is justified by better training dynamics.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Activation functions are the entire reason neural networks can learn anything interesting. Without them, a 100-layer network would have the same expressiveness as a single linear regression. The non-linearity is what creates the capacity to model complex, real-world relationships.</p>
</div>

## Network Architecture: Layers and Topology

Neurons are organised into layers. The most basic architecture is the feed-forward network:

```
Input Layer     Hidden Layer 1    Hidden Layer 2    Output Layer
(features)      (learned repr.)   (learned repr.)   (prediction)

  [x1] ─────→  [h1] ─────────→  [h1'] ──────────→ [y1]
  [x2] ─────→  [h2] ─────────→  [h2'] ──────────→ [y2]
  [x3] ─────→  [h3] ─────────→  [h3']
  [x4] ─────→  [h4]

  (Each arrow represents a weighted connection)
```

**Input layer** -- Receives raw features. For tabular data, each input might be a column (age, revenue, deal stage). For text, it's the embedding vector.

**Hidden layers** -- Learn increasingly abstract representations. The first hidden layer might detect simple patterns. Deeper layers combine those into complex features. This hierarchical feature learning is what "deep" in deep learning refers to.

**Output layer** -- Produces the final result. For classification, it's a softmax over classes. For regression, it's a single linear output. For language models, it's a softmax over the entire vocabulary.

### Common Topologies

**Fully connected (dense)** -- Every neuron in one layer connects to every neuron in the next. The default for tabular data and the building block of transformer FFN layers.

**Convolutional** -- Local connectivity with shared weights. A 3x3 convolutional filter slides across an image, detecting the same pattern everywhere. Produces translation-invariant features.

**Recurrent** -- Connections loop back, maintaining a hidden state across time steps. Each input modifies the state, creating a form of memory. LSTMs and GRUs add gating mechanisms to control what information persists.

**Transformer** -- No recurrence, no convolution. Uses self-attention to let every position attend to every other position. Processes entire sequences in parallel.

## Training: How Networks Learn

Training a neural network means finding the weight values that minimise prediction error. This happens through backpropagation and gradient descent.

### The Training Loop

```
1. Forward Pass
   Input → Network → Prediction

2. Loss Computation
   Compare prediction to ground truth
   Loss = f(prediction, actual)

3. Backward Pass (Backpropagation)
   Compute gradient of loss w.r.t. each weight
   ∂Loss/∂w for every weight in the network

4. Weight Update (Gradient Descent)
   w_new = w_old - learning_rate * ∂Loss/∂w

5. Repeat for next batch
```

### Backpropagation

Backpropagation is just the chain rule of calculus applied systematically through the network. Starting from the output layer, gradients are computed layer by layer, propagating the error signal backward.

For a weight in layer 2, the gradient tells us: "If I increase this weight by a tiny amount, how much does the loss change?" The weight is then adjusted in the direction that reduces the loss.

### Gradient Descent Variants

- **Stochastic Gradient Descent (SGD)** -- Update weights after each individual example. Noisy but fast.
- **Mini-batch SGD** -- Update after a batch of examples (32, 64, 256). Balances noise and stability.
- **Adam** -- Adaptive learning rates per parameter. Tracks both first and second moments of gradients. The default optimiser for most deep learning today.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>The learning rate is arguably the most important hyperparameter. Too high, and the network oscillates around the optimum and may diverge. Too low, and training takes forever or gets stuck in poor local minima. Modern practice uses learning rate schedulers (cosine annealing, warmup + decay) that adjust the rate during training. Large model training typically uses warmup -- starting with a tiny rate and gradually increasing -- to stabilise early training dynamics.</p>
</div>

## Regularisation: Preventing Overfitting

A neural network with millions of parameters can memorise training data instead of learning general patterns. Regularisation techniques prevent this:

**Dropout** -- During training, randomly set a fraction (typically 20-50%) of neuron outputs to zero. This forces the network to learn redundant representations and prevents co-adaptation of neurons.

**Weight decay (L2 regularisation)** -- Add a penalty proportional to the squared magnitude of weights. Keeps weights small, which produces smoother decision boundaries.

**Batch normalisation** -- Normalise the inputs to each layer, stabilising training and allowing higher learning rates.

**Early stopping** -- Monitor performance on a validation set. Stop training when validation performance stops improving, even if training loss continues to decrease.

## The Universal Approximation Theorem

One of the most important theoretical results in neural networks: a feed-forward network with a single hidden layer containing enough neurons can approximate any continuous function to any desired degree of accuracy.

This doesn't mean a single hidden layer is *practical* (deep networks learn more efficiently), but it establishes that neural networks are universal function approximators. Given enough capacity and data, they can learn any input-output mapping.

This is why neural networks can handle such diverse tasks -- image classification, language generation, protein folding, game playing. They're not pre-programmed for any specific task. They learn the mapping from data.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Every AI node in an Outrun workflow runs on neural network architectures -- transformers for language tasks, specialised models for classification. But you don't manage the networks directly. You describe what you want (triage this email, extract these fields, classify this lead), and Outrun handles model selection, inference, and result formatting. Build your first AI workflow on the <a href="/features/ai-workflow-builder">AI Workflow Builder</a> feature page.</p>
</div>

## From Theory to Practice

The neural network concepts in this guide are the foundation of everything you'll encounter in modern AI:

- **LLMs** are transformer neural networks with billions of parameters
- **Embedding models** are neural networks trained to produce similar vectors for similar meanings
- **Image classifiers** are convolutional neural networks trained on labelled images
- **Recommendation systems** are neural networks learning user-item interaction patterns

When you're debugging an AI system, evaluating a vendor, or designing an AI-powered feature, you're reasoning about neural networks -- even if you never touch a training loop.

## What's Next

With neural network fundamentals in place, the next guide covers a protocol that lets AI models connect to external tools and data sources.

In **What is MCP?**, you'll learn about the Model Context Protocol -- an open standard that gives AI models a standardised way to interact with external systems, and how it enables the agentic AI patterns that power modern automation platforms.
