---
title: "2025 AgentBeats Competition Submission"
summary: "Agentifying Sierra's tau2-bench for UC Berkeley's AgentBeats competition, enabling natural-language evaluation of conversational agents via A2A protocol."
date: 2026-01-14
tags: ["ai", "agents", "benchmarks"]
github: "https://github.com/wuTims/tau2-bench-agent"
cover: "https://media.wutims.com/tau2-bench-icon.png"
featured: true
---

# What is AgentBeats?

AgentBeats envisions a more streamlined and accessible agentic evaluation platform where benchmarks themselves are agents that can evaluate other agents. You can read more about the platform on their competition page [AgentX AgentBeats Competition](https://rdi.berkeley.edu/agentx-agentbeats.html) and their developer documentation [Agentified Agent Assessment (AAA) & AgentBeats](https://docs.agentbeats.dev/).

This project was developed as part of UC Berkeley's MOOC [Agentic AI](https://agenticai-learning.org/f25) course's AgentBeats competition, specifically for Sierra's Custom Track.

## Why Tau2 Bench?

I chose to agentify tau2-bench because it's a widely adopted benchmark for conversational agents, and working with it would deepen my understanding of how these agents are evaluated.

# Agentifying Tau2 Bench

AgentBeats provided Tau2 Bench as the example agentified benchmark for all submissions to reference. There was some delay in them announcing this and providing the code, so my initial implementation took a different approach.

## A2A and ADK

Using A2A as the basis for agent communication was required, but I also chose Google's Agent Development Kit (ADK) to assist with structured agent and tool definitions. ADK integrates well with A2A and provides convenience methods to make any ADK agent A2A-compatible.

My approach was to create tau2-agent using ADK's LLMAgent, equipping it with tools to administer tau2-bench evaluations. This enables natural-language evaluation requests such as "Evaluate my agent at `<agent_endpoint>` with the airline domain using 5 tasks and 2 trials." Under the hood, tau2-agent wraps tau2's `run_domain` function, parsing the request and passing the target agent's A2A endpoint to tau2-bench. As a result, the end user can evaluate their agent through a familiar conversational interface.

## AgentBeats Integration

AgentBeats' architecture favors structured inputs, outputs, and config-based requests. While my natural-language interface worked well standalone, integrating it with the platform required adaptation. To support both interaction modes, I added a separate route that follows AgentBeats' structured format while preserving the original natural-language endpoint. This dual-interface approach lets users choose between conversational evaluation requests or direct config-based requests.

## LLM Headaches

I tested multiple models for both my wrapper agent and tau2's user simulator before settling on Qwen3. Nebius generously provided participants with $50 of credit, which allowed me to experiment with several models including Kimi-K2-Thinking, Llama 3.1-8B, Gemini 2 Flash, and Qwen3-Coder.

The main challenge was inconsistent tool-calling behavior. Each model handled tool calls differently, and there was no clear documentation explaining these differences. This led to many debugging loops trying to figure out why tau2 evaluations were failing — often the issue wasn't my code but unexpected model behavior.

Qwen3-30B and Qwen3-235B Thinking proved the most reliable in my testing, with consistent tool-calling and instruction-following at reasonable cost. The main tau2 repository defaults to GPT-4+ for both the agent and user simulator, so the benchmark may be better tuned for larger foundation models.

# Expanding Tau2 Bench Domains

In addition to adding A2A-agent evaluation capabilities to tau2 bench, I also wanted to explore creating a new domain. The philosophy behind my new domain design is to test behavior beyond what's already being evaluated by the other domains. There's a foundational set of behaviors that can be tested across all domains such as basic tool calling, context retrieval, and policy compliance. Simply creating a new domain without adding additional complexity is like testing the same behavior with a different label. With increased model performance and improved agent design, new domains must add more complex scenarios that can push agent behavior beyond current domains.

I propose a Vacation Rental domain that introduces a host profile aspect for an additional complexity factor in evaluating agent behavior. Agents must not only follow domain policy, such as defined by Airbnb or VRBO, but also must act on behalf of host preferences. The host profile is designed to evaluate how well agents can replicate host psychology and desires while still following domain policy. Therefore, the Vacation Rental domain allows the creation of complex scenarios that incorporate domain policy, host profile, and listing details, while at the same time handling guest requests and complaints. By adding host profiles, we can better evaluate how well agents can follow human preferences and not just rules set forth by the domain.

# Takeaways

Tool-calling consistency varied significantly across models and wasn't predictable from general capability. For benchmark design, new domains should introduce behavioral complexity rather than topical variation.

# Code References

- [Sierra Tau2 Bench](https://github.com/sierra-research/tau2-bench)
- [Tau2 Bench Agent](https://github.com/wuTims/tau2-bench-agent)
- [Tau2 Bench Agent Leaderboard](https://github.com/wuTims/tau2-bench-agent-leaderboard)
