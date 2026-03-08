# CLAUDE.md - Outrun Marketing Website

## Product Overview

**Outrun** is an AI-powered sales automation platform that helps businesses automate their sales workflows and sync data across tools.

**Target Audiences**:
- Sales teams looking to automate repetitive tasks
- Marketing teams needing data synchronization
- Operations teams managing multi-tool workflows
- Enterprises requiring custom integrations

---

## Tech Stack

- **Framework**: Eleventy (11ty) with Bookshop components
- **Styling**: Tailwind CSS
- **Build**: Bun
- **CMS**: CloudCannon (optional)

---

## Site Structure

```
apps/website/
├── site/
│   ├── pages/           # Page content
│   │   ├── index.html   # Homepage
│   │   ├── docs/        # Documentation
│   │   └── learn/       # Educational content
│   ├── _includes/       # Layouts and partials
│   └── assets/          # Static assets
├── component-library/   # Bookshop components
├── .eleventy.js         # Eleventy config
└── tailwind.config.cjs  # Tailwind config
```

---

## B2B SaaS Website Best Practices

When making changes to this website, follow these conversion-optimized patterns:

### Hero Section Requirements

- **5-Second Test**: Visitors must understand what, who, and why within 5 seconds
- **Headline Formula**: Use benefit-driven headlines, not feature-focused
  - Jobs-to-be-Done: "Do/focus on [goal], not [painful task]"
  - Capability + Outcome: "[Capability] and [outcome with metric]"
- **Single CTA**: ONE clear primary CTA above the fold
- **Social Proof**: Logos/badges visible without scrolling
- **Objection Handlers**: "No credit card required" near CTA

### CTA Best Practices

- Start with action verb: "Get Started," "Start Free Trial," "See Demo"
- Keep to 4-5 words maximum
- High contrast with background (34% conversion lift)
- Include objection handlers nearby

### Pricing Page Psychology

- **3-4 tiers maximum** (never more than 5)
- Highlight recommended tier visually ("Most Popular")
- Show annual savings prominently
- Include FAQ section (40% of SaaS pages miss this)
- Trust signals: logos, review badges, guarantees

### Copy Guidelines

- Write at **grade 9 reading level** or below
- Lead with benefits, not features
- Use "you/your" language (customer-centric)
- Avoid jargon without definitions
- **FAB Framework**: Feature -> Advantage -> Benefit

### Trust Signals

- Customer logos (5-8 recognizable brands)
- Review badges (G2, Capterra ratings)
- Testimonials with full name, title, company, photo
- Performance metrics (customer count, uptime)

### Documentation/Learn Section

- Organize by user goals, not features
- Action-oriented titles ("Tracking your visibility" not "Tracking feature")
- Screenshots matching current UI
- Videos under 5 minutes with captions
- "Was this helpful?" feedback on articles

---

## Evaluation Checklist

Use `/marketing-review` skill to run a full evaluation. Key checks:

### Landing Page
- [ ] Clear value proposition above fold
- [ ] Benefit-driven headline (not feature-focused)
- [ ] ONE primary CTA with objection handler
- [ ] Social proof visible without scrolling
- [ ] Page loads under 2.5 seconds

### Pricing Page
- [ ] 3-4 clearly defined tiers
- [ ] Recommended tier highlighted
- [ ] Annual/monthly toggle with savings shown
- [ ] FAQ section with 8-10 questions
- [ ] Trust signals present

### Documentation
- [ ] Organized by user goals
- [ ] Grade 9 reading level
- [ ] Current screenshots
- [ ] Related content linked

### Technical
- [ ] Mobile responsive
- [ ] WCAG AA accessible (4.5:1 contrast)
- [ ] Keyboard navigable
- [ ] Alt text on images

---

## Anti-Patterns to Avoid

- Multiple competing CTAs (decision fatigue)
- Feature-focused instead of benefit-focused copy
- Vague headlines with buzzwords ("World-class," "Cutting-edge")
- Missing objection handlers near CTAs
- Heavy animations slowing load time
- Industry jargon without definitions
- Generic testimonials without specifics
- Hiding pricing when transparency would help

---

## Commands

```bash
# Development
bun run dev          # Start dev server with hot reload

# Build
bun run build        # Build for production (outputs to _site/)

# From monorepo root
bun run dev          # Starts all apps including website via turbo
```

---

## Making Changes

1. **Always test on mobile** - 80% of B2B buyers use mobile
2. **Run Lighthouse** after changes - target 90+ scores
3. **Check copy** against grade 9 reading level (Hemingway App)
4. **Verify CTAs** - one primary action per section
5. **Update screenshots** when UI changes in main app
