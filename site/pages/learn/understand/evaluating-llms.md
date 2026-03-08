---
title: "Evaluating LLMs"
layout: layouts/learn.liquid
track: process-builders
tier: understand
readTime: "9 min"
permalink: /learn/understand/evaluating-llms/
metaTitle: "Evaluating LLMs - Technical Guide"
metaDescription: "Learn how to evaluate large language models for production use: benchmarks, custom evaluation frameworks, cost analysis, and practical testing strategies."
author: "Outrun"
date: 2026-02-15
learnings:
  - "Standard LLM benchmarks and what they actually measure"
  - "How to build custom evaluation frameworks for your use case"
  - "Cost-quality-latency trade-offs across model providers"
  - "Production evaluation patterns: A/B testing, human eval, and automated grading"
crossTrackUrl: /learn/understand/choosing-the-right-ai-model/
crossTrackTitle: "Choosing the Right AI Model"
crossTrackLabel: "Want the business perspective?"
prevArticle:
  title: "Supervised vs Unsupervised Learning"
  url: /learn/understand/supervised-unsupervised/
nextArticle:
---

Choosing an LLM for a production feature is not a matter of picking the one with the highest benchmark score. Benchmarks tell you how a model performs on standardised tasks. They don't tell you how it'll perform on *your* tasks, at *your* scale, within *your* cost constraints.

This guide covers evaluation from both sides -- understanding public benchmarks and building your own evaluation framework.

## Public Benchmarks: What They Measure

The LLM landscape is full of benchmarks. Here's what the major ones actually test:

| Benchmark | What It Measures | Limitations |
|---|---|---|
| **MMLU** | Multi-task language understanding (57 subjects) | Multiple choice; doesn't test generation quality |
| **HumanEval / MBPP** | Code generation (function completion) | Only tests short functions, not real-world codebases |
| **GSM8K** | Grade-school math word problems | Simple math; doesn't reflect complex reasoning |
| **MATH** | Competition-level mathematics | Very specific; doesn't generalise to business reasoning |
| **MT-Bench** | Multi-turn conversation quality | Subjective; depends on judge model quality |
| **HELM** | Holistic evaluation (many dimensions) | Comprehensive but complex to interpret |
| **ARC** | Science reasoning | Narrow domain |
| **Chatbot Arena (LMSYS)** | Human preference ranking (ELO) | Best proxy for general quality, but crowd-sourced |

### Reading Benchmarks Critically

**Benchmark saturation** -- When top models score 90%+ on a benchmark, the remaining differences aren't meaningful for real-world use. MMLU is approaching this point.

**Data contamination** -- If benchmark questions appeared in a model's training data, scores are inflated. This is a known problem with older benchmarks.

**Task mismatch** -- High HumanEval scores don't mean a model will write good production code. Benchmark tasks are typically short, self-contained, and well-specified -- the opposite of real engineering work.

**The Chatbot Arena exception** -- LMSYS Chatbot Arena uses blind A/B comparisons with real users. It's the closest thing to a ground-truth quality ranking, and it correlates well with practical experience.

<div class="learn-callout learn-callout--key-takeaway">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
Key Takeaway
</div>
<p>Use public benchmarks to create a shortlist of candidate models. Then evaluate that shortlist on <em>your</em> data, with <em>your</em> prompts, measuring <em>your</em> success criteria. Public benchmarks are a starting point, not a decision.</p>
</div>

## Building a Custom Evaluation Framework

The most reliable way to evaluate an LLM for your use case is to build a task-specific evaluation set and automate testing.

### Step 1: Define Success Criteria

Before writing a single test case, define what "good" means for your task:

```
Task: Email triage
Success criteria:
  - Classification accuracy ≥ 95%
  - Urgency detection recall ≥ 90% (don't miss urgent emails)
  - JSON output parse rate = 100%
  - Latency < 3 seconds (p95)
  - Cost < $0.005 per email
```

### Step 2: Build a Test Set

Create 50-200 labelled examples that cover:

- **Common cases** (70%) -- Typical inputs your system will see most often
- **Edge cases** (20%) -- Ambiguous inputs, missing fields, unusual formatting
- **Adversarial cases** (10%) -- Inputs designed to break the model (prompt injection attempts, extremely long inputs, non-English text)

Store your test set in version control alongside your prompts. When you change a prompt, re-run the full test suite.

### Step 3: Choose Evaluation Methods

**Exact match** -- Does the output exactly match the expected value? Good for classification labels, structured fields.

**Fuzzy match** -- Does the output contain the key information, even if phrased differently? Good for summaries, free-text fields.

**LLM-as-judge** -- Use a separate (typically stronger) LLM to evaluate the output. Provide it with the input, expected output, and actual output, and ask it to grade quality on a rubric.

```
# LLM-as-judge prompt
You are evaluating the quality of an email triage system.

Input email: {email}
Expected classification: {expected}
System output: {actual}

Rate the output on these dimensions (1-5):
- Correctness: Is the classification correct?
- Completeness: Are all required fields present?
- Accuracy: Are extracted fields accurate to the source?

Provide scores and brief justification.
```

**Human evaluation** -- Have domain experts rate outputs on a defined rubric. Essential for subjective quality (tone, helpfulness) and as a calibration for automated methods.

<div class="learn-callout learn-callout--deep-dive">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
Technical Deep Dive
</div>
<p>LLM-as-judge evaluation has its own biases. Models tend to prefer longer outputs, outputs that use their own phrasing style, and outputs listed first in comparison prompts (position bias). Mitigate this by randomising comparison order, calibrating against human ratings, and using multiple judge models when possible. Frameworks like <code>promptfoo</code> and <code>deepeval</code> automate much of this.</p>
</div>

## The Cost-Quality-Latency Triangle

In production, model quality is one of three competing constraints:

```
        Quality
       /      \
      /        \
     /          \
   Cost ────── Latency
```

You can optimise for any two, but not all three simultaneously.

### Model Tiers and Trade-offs

| Tier | Examples | Quality | Latency (TTFT) | Cost (per 1M tokens) |
|---|---|---|---|---|
| **Frontier** | Claude Opus, GPT-4o | Highest | 500ms-2s | $15-75 |
| **Balanced** | Claude Sonnet, GPT-4o-mini | High | 200ms-800ms | $3-15 |
| **Fast/Cheap** | Claude Haiku, GPT-4.1-mini | Good | 100ms-400ms | $0.25-3 |
| **Open-source** | Llama 3, Mistral, Qwen | Varies | Self-hosted | Infrastructure cost |

### Cost Optimisation Strategies

**Prompt caching** -- Most providers offer cached pricing for repeated system prompts. If your system prompt is 2000 tokens and identical across calls, caching can reduce cost by 50-90%.

**Model routing** -- Use a smaller model for simple tasks (classification, extraction) and a larger model for complex tasks (reasoning, multi-step analysis). Route dynamically based on input complexity.

**Batching** -- Send multiple items in a single API call where possible. Many extraction tasks can process 5-10 items per request.

**Output length control** -- Set max_tokens appropriately. If you only need a JSON classification, don't let the model generate 2000 tokens of explanation.

## Production Evaluation Patterns

### Offline Evaluation

Run your test suite against candidate models before deployment:

```
for model in [claude-sonnet, gpt-4o-mini, llama-70b]:
    results = run_test_suite(model, test_set, prompt)
    print(f"{model}: accuracy={results.accuracy}, "
          f"latency_p95={results.latency_p95}, "
          f"cost_per_call={results.cost}")
```

This gives you a clear comparison across models, but doesn't capture real-world distribution shifts or user behaviour.

### Online Evaluation (A/B Testing)

Deploy two models simultaneously and route traffic between them:

- **Traffic split** -- Send 90% to the incumbent model, 10% to the challenger
- **Metrics** -- Track accuracy (via delayed human review), latency, cost, and downstream business metrics (e.g., response time to triaged emails)
- **Statistical significance** -- Run until you have enough observations to detect meaningful differences (typically hundreds to thousands of samples)

### Continuous Monitoring

Even after deployment, monitor for degradation:

- **Output format compliance** -- Are JSON responses still parsing correctly?
- **Classification distribution** -- Has the ratio of categories shifted unexpectedly? A sudden spike in "other" classification might indicate the model is struggling with new input patterns.
- **Latency trends** -- Are response times increasing? Provider infrastructure changes can affect this.
- **Human feedback** -- Build feedback loops where users can flag incorrect triage decisions. These flags become new test cases.

<div class="learn-callout learn-callout--tryit">
<div class="learn-callout-label">
<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
Try it in Outrun
</div>
<p>Outrun provides built-in <strong>audit trails</strong> for every AI decision. Each email triage, workflow execution, and agent action is logged with the full input, output, and reasoning chain. This gives you the observability layer you need for continuous evaluation without building it yourself. Explore the governance features on the <a href="/features/comprehensive-audit-trails">Audit Trails</a> feature page.</p>
</div>

## Evaluation Checklist for Production Deployment

Before shipping an LLM-powered feature, verify these dimensions:

**Functional quality:**
- [ ] Test suite accuracy meets threshold on common cases
- [ ] Edge cases handled gracefully (returns "uncertain" rather than hallucinating)
- [ ] Adversarial inputs don't produce harmful or incorrect outputs
- [ ] Output format is 100% parseable

**Performance:**
- [ ] p50 latency meets UX requirements
- [ ] p99 latency won't trigger timeouts
- [ ] Cost per call is within budget at projected volume

**Reliability:**
- [ ] Provider rate limits won't be hit at peak traffic
- [ ] Fallback behaviour defined (what happens when the API is down?)
- [ ] Retry logic handles transient errors

**Governance:**
- [ ] All inputs and outputs are logged for audit
- [ ] PII handling meets compliance requirements
- [ ] Model version is pinned (not "latest")

## The Evaluation Mindset

LLM evaluation is not a one-time gate before launch. It's a continuous practice:

- Prompts change. Re-evaluate.
- Models get updated by providers. Re-evaluate.
- Input distribution shifts over time. Re-evaluate.
- Business requirements evolve. Re-evaluate.

Build evaluation into your development workflow the same way you'd build testing into a software project. Your evaluation suite is as valuable as your production code -- it's the mechanism that keeps your AI features trustworthy.
