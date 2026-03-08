---
title: "The AI Glossary for Business"
layout: layouts/learn.liquid
track: business-leaders
tier: understand
readTime: "10 min"
permalink: /learn/understand/ai-glossary/
metaTitle: "The AI Glossary for Business - Every AI Term Explained Simply"
metaDescription: "A clear, jargon-free glossary of AI terms for business leaders. From agents to zero-shot learning, understand the language of AI."
author: "Outrun"
date: 2026-02-15
learnings:
  - "Clear definitions of essential AI terms"
  - "How key AI concepts relate to business operations"
  - "The vocabulary needed to evaluate AI vendors confidently"
  - "Quick-reference resource for AI conversations and decisions"
prevArticle:
  title: "Choosing the Right AI Model"
  url: /learn/understand/choosing-the-right-ai-model/
nextArticle:
---

AI conversations are full of jargon. Vendors use it. Articles use it. Your technical team uses it. And if you don't know what the terms mean, you can't evaluate claims, ask the right questions, or make informed decisions.

This glossary gives you clear, no-nonsense definitions of every AI term you're likely to encounter as a business leader. Bookmark it. Come back to it. Use it to cut through the noise.

## Core Concepts

### Artificial Intelligence (AI)
Software that can handle tasks requiring human-like judgement. This includes understanding language, recognising patterns, making decisions, and taking actions. AI is the broadest category -- everything else in this glossary falls under it.

### Machine Learning (ML)
A subset of AI where software *learns* from data rather than being explicitly programmed. Instead of writing rules like "if the email contains 'invoice,' route it to finance," you show the system thousands of examples and it learns the patterns itself.

### Deep Learning
A subset of machine learning that uses neural networks with many layers (hence "deep"). This is the technology behind most modern AI breakthroughs, including LLMs and computer vision.

### Large Language Model (LLM)
AI software trained on massive amounts of text that can understand, generate, and reason about language. GPT-4, Claude, Gemini, and Llama are all LLMs. They power chatbots, email automation, content generation, and most text-based AI features.

### Generative AI
AI that *creates* new content -- text, images, code, audio, video. LLMs are the most common type. When an AI drafts an email, writes a report, or generates a summary, that's generative AI.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>The hierarchy is: <strong>AI > Machine Learning > Deep Learning > LLMs > Generative AI</strong>. Each is a more specific subset of the one before it. When someone says "AI," they could mean any of these. When they say "LLM," they're being specific.</p>
</div>

## Model-Related Terms

### Parameter
A single value the model learned during training. Think of parameters as the "knowledge" stored in the model. More parameters generally means more nuanced understanding. Modern LLMs have billions of parameters.

### Training
The process of exposing a model to data so it learns patterns. Training a large model requires enormous computing resources and can take weeks or months. You typically don't train models yourself -- you use pre-trained ones.

### Fine-Tuning
Taking a pre-trained model and training it further on your specific data. This makes the model better at your particular use case. Like hiring a generalist and then training them on your industry.

### Context Window
The amount of text a model can consider at one time. Measured in "tokens" (roughly words). A model with a 100K token context window can process roughly 75,000 words in a single request -- about the length of a short novel.

### Token
The unit of text that models process. Roughly equivalent to a word, though some words split into multiple tokens. Pricing is often based on tokens processed (input + output).

### Prompt
The instruction or question you give to an AI model. Prompt quality dramatically affects output quality. "Summarise this email" is a prompt. "Summarise this email in three bullet points, highlighting action items and deadlines" is a better prompt.

### Hallucination
When a model generates confident-sounding information that is factually incorrect. The model isn't "lying" -- it's generating the most probable-sounding text based on patterns, which sometimes produces fabrications. Critical to manage in business applications.

### Temperature
A setting that controls how creative or predictable the model's output is. Low temperature = more predictable, consistent outputs. High temperature = more creative, varied outputs. For business automation, lower temperature is usually better.

## Architecture and Approach Terms

### Neural Network
The underlying structure of modern AI models. Inspired (loosely) by the brain, it's layers of mathematical functions that process data. You don't need to understand the maths -- just know that this is the "engine" under the hood.

### Transformer
The specific type of neural network architecture that powers LLMs. The "T" in GPT stands for "Transformer." This architecture is particularly good at understanding relationships between words in a sentence, which is why LLMs are so effective at language tasks.

### Natural Language Processing (NLP)
The field of AI focused on understanding and generating human language. Sentiment analysis, text classification, summarisation, and translation are all NLP capabilities.

### Computer Vision
AI that processes and understands visual information -- images, documents, video. OCR (reading text from images), image classification, and object detection are computer vision capabilities.

### Multi-Modal
AI that can process multiple types of input -- text, images, audio, video -- in a single interaction. Modern frontier models are multi-modal: you can show them a photo and ask a question about it.

| Term | Simple Definition | Why It Matters |
|---|---|---|
| **Parameter** | A unit of model knowledge | More = smarter, but also more expensive |
| **Context Window** | How much text the model can read at once | Determines if it can process your long documents |
| **Token** | A unit of text (roughly a word) | Determines pricing for most AI services |
| **Temperature** | Creativity dial (low = predictable) | Controls consistency in your workflows |
| **Hallucination** | Model makes things up | Need guardrails for business-critical tasks |

## Deployment and Integration Terms

### API (Application Programming Interface)
The standard way software talks to AI models. Your business tools send requests to the AI via an API and receive responses. You don't need to manage this directly -- your AI platform handles it.

### RAG (Retrieval-Augmented Generation)
A technique where the AI retrieves relevant information from your data *before* generating a response. Instead of relying only on training data, it pulls in current, specific information. This is how AI gives answers grounded in your business data rather than generic responses.

### Agent (AI Agent)
An AI system that doesn't just respond to questions but *takes actions* autonomously. It can read data, make decisions, and execute multi-step workflows -- like monitoring your inbox, classifying emails, and updating your CRM without human intervention.

### Workflow / Pipeline
A defined sequence of AI steps that process data from start to finish. "Read email -> classify intent -> extract data -> update CRM -> draft response" is a workflow. Each step might use a different AI capability.

### MCP (Model Context Protocol)
A standard for connecting AI models to external tools and data sources. It gives AI agents secure, structured access to your business applications so they can read data and take actions across your tech stack.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun uses many of the concepts in this glossary. Its <strong>AI Agents</strong> use RAG to access your data, the <strong>Model Context Protocol</strong> to connect to your tools, and <strong>workflows</strong> to chain AI steps together. See it all in action on the <a href="/features/ai-agents">AI Agents</a> and <a href="/features/model-context-protocol">MCP</a> feature pages.</p>
</div>

## Safety and Governance Terms

### Guardrails
Rules and constraints placed on AI to prevent unwanted behaviour. This includes content filters, action limits, approval requirements, and output validation. Essential for business-critical workflows.

### Human-in-the-Loop
A workflow design where humans review or approve AI outputs before they're acted upon. Used for high-stakes decisions where you want AI speed but human judgement as a safety net.

### Audit Trail
A complete log of every action the AI took, every decision it made, and every piece of data it accessed. Critical for compliance, debugging, and building trust in AI systems.

### Explainability
The ability to understand *why* an AI made a particular decision. Some models are more explainable than others. For regulated industries, this can be a compliance requirement.

### Bias
Systematic errors in AI outputs that reflect biases in training data. If the training data over-represents certain perspectives, the model may produce outputs that are unfair or inaccurate for under-represented groups. Important to monitor in any customer-facing AI application.

<div class="learn-callout learn-callout--why-it-matters">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
Why This Matters
</div>
<p>Governance terms matter as much as capability terms. When evaluating AI vendors, their answers about <strong>guardrails</strong>, <strong>audit trails</strong>, and <strong>human-in-the-loop</strong> options tell you whether they've built a product for real business use or just a demo. Outrun provides <a href="/features/comprehensive-audit-trails">comprehensive audit trails</a> for full visibility.</p>
</div>

## Advanced Terms Worth Knowing

### Zero-Shot / Few-Shot Learning
**Zero-shot** means the AI can handle a task it hasn't been specifically trained for, based on general knowledge. **Few-shot** means you give it a few examples and it learns the pattern. Both mean less setup time for you.

### Embedding
A way of representing text (or images) as numbers so AI can compare them. When an AI finds documents "similar to" your query, it's comparing embeddings. This powers search, recommendation, and clustering features.

### Fine-Tuning vs Prompt Engineering
**Fine-tuning** changes the model itself (expensive, requires data). **Prompt engineering** changes how you talk to the model (cheap, requires creativity). Most business use cases start with prompt engineering and only fine-tune if needed.

### Inference
The process of running a trained model on new data to get results. When you send an email to an AI for classification, that's inference. Inference costs are the ongoing operational expense of using AI (as opposed to the one-time cost of training).

### Orchestration
Coordinating multiple AI models, tools, and steps to complete a complex task. An orchestration layer decides which model to use for each step, manages data flow between steps, and handles errors. This is what platforms like Outrun provide so you don't have to build it yourself.

### Latency
The time it takes for the AI to respond. For real-time applications (chat, live classification), low latency is critical. For async workflows (email processing, report generation), higher latency is acceptable.

## Using This Glossary

This glossary is designed to be a reference, not a one-time read. When you encounter a term in a vendor pitch, a board presentation, or a conversation with your technical team, come back here for a quick, reliable definition.

The terms in this glossary cover the vocabulary you need to evaluate AI tools, have informed conversations with vendors, and make confident decisions about AI for your business. You don't need to know more than this to be an effective AI buyer and leader.

## The Understand Section: Complete

You've completed the Understand track. You now have a solid foundation in AI fundamentals -- from what AI is and how LLMs work, to NLP, computer vision, model selection, and the vocabulary to navigate AI conversations with confidence.
