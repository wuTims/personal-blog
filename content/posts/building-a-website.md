---
title: How I Built My Blog with AI
summary: I used AI to build a complete website in less than a week. Here's how I did it and what I learned.
date: 2025-12-08
tags:
  - ai
  - frontend
  - web development
  - walkthrough
cover: https://media.wutims.com/wutims_og_1200px.png
published: true
---

## Introduction

"Is frontend dead?" I don't want to be alarmist, but that was genuinely the question I wanted to answer. Not dead in the sense that design, style, and branding no longer matter. In this world of AI content, nothing matters more than having a standout design with a human touch. But how much of a human element is needed? What are the limits of using AI to create stylistic and elegant user interfaces? I thought that building a website would help answer these questions.

I know a fair bit about frontend development, but am by no means an expert. What I discovered is that expertise matters less than clarity. If you don't know what you want to build or how it should look, AI won't magically fill in the gaps. But if you maintain control of the overall design and let AI handle implementation, you can get surprisingly far.

The cool thing about any part of this process is, if you're unclear about anything or aren't sure of a particular direction, just ask AI! This isn't cheating or dumbing yourself down. It's being curious and learning by doing. The AI is there to expedite your research and learning, not replace it.

---

## Walkthrough of the Process

I had dabbled with using other AI tools to help with frontend implementation; they worked well, but felt a bit lacking. Then, I came across this video by AI Jason:

<iframe width="560" height="315" src="https://www.youtube.com/embed/vcJVnyhmLS4?si=e_stM5bO7BnNA9So" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

He describes a process of creating a style guide—a concrete set of rules to style your website—to establish a foundation. The style guide also helps to ground the AI with a source of truth, filling in any ambiguities or assumptions. However, generating a complete style guide isn't a straightforward task and requires a bit of human feedback looping to get it right.

### Step 1: Data / Context Retrieval

First, unless you're a designer, find a website style that you really vibe with. I chose [Chroma](https://www.trychroma.com/). From that website, gather source examples by retrieving the full HTML and CSS, focusing on specific element styles you want to replicate. Take screenshots of relevant areas that you feel really capture the overall feel of the site.

### Step 2: Refining Into a Prototype

Next, refine the data you gathered into something presentable. Instruct the AI to generate a version of the website based on the data you collected. Finally, iterate on the initial output until you arrive at a design that you mesh with.

### Step 3: Generating the Style Guide

Once you're happy with the prototype design, you can finally prompt AI to generate the [style guide](https://www.webfx.com/blog/web-design/css-style-guides/). If you're unsure about what exactly needs to go into a style guide, feel free to ask AI (this is what I did). A few key things I learned to focus on in a style guide: typography, color palette, spacing, box-shadows, and animations.

### Step 4: Building Components

With style guide in hand, you're ready to start building components. I wanted to experiment as much as possible on different designs, so I made the [component library](https://wutims.com/components) a crucial layer of my website. I treated it as a space to rapidly generate different components, play around with them, and pick the ones that worked. This rapid experimentation is only possible because the AI agent is grounded by the style guide. Without it, the agent can start drifting and generate components that don't fit the rest of the site. After a few days of experimenting with different components and layouts, the core website was complete.

### Step 5: Additional Features

To be honest, I had no experience setting up [SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) or [GEO](https://arxiv.org/abs/2311.09735), [meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), or [email and newsletter](https://www.beehiiv.com/) functionality. These features aren't strictly necessary, but are important for the reach and shareability of the site. I did some "co-research" with my AI agent and had all of these features implemented two days later.

### Rapid Experimentation Methodology

A quick aside on experimentation: I came across a paper on a technique called [Verbalized Sampling](https://www.verbalized-sampling.com/). The idea is to add specific instructions to your prompt so the LLM generates responses across a wider range of possibilities. Results were mixed, but it was really cool to visualize so many different designs.

---

## Conclusion

Coming back to my initial question: is frontend dead? There's definitely still a place for deep frontend technical know-how. But I'd strongly argue that, with the current frameworks and tooling available, any engineer with a bit of research and curiosity can build elegant user experiences.

My main takeaway from this whole process: use AI to explore, not to shortcut. If you're not clear on your vision at first, use AI to help plan it out. Iterate with variations and selectively choose your direction. From style guide to component library to completed website, the whole thing took less than a week. There has never been a better time for being creative and building cool personal projects. I hope you give this process a try and let me know what you think!

## Code

I've open-sourced the entire project on [GitHub](https://github.com/wuTims/personal-blog). Here's the layout:

- `docs/` — full style guide, implementation guides, and condensed summaries I created for more efficient AI context retrieval
- `src/components/` — building block UI elements and the component library
- `scripts/` — utilities for generating RSS feeds, sitemaps, and newsletter cards

For infrastructure: the site runs on TanStack Start (Vite + TypeScript), deploys to Cloudflare Workers, and uses Cloudflare for DNS and email routing. beehiiv handles the newsletter and analytics.

_Note: I'm on a paid [Claude Max Plan](https://www.claude.com/pricing/max), but everything else has been free._
