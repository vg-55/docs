---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
---

# BluesMinds API — Introduction

> **Base URL:** `https://api.bluesminds.com/v1` · **Console:** [api.bluesminds.com/console](https://api.bluesminds.com/console) · **Community:** [t.me/apibluesminds](https://t.me/apibluesminds)

## What is BluesMinds?

BluesMinds is a **unified AI gateway** that provides a single, standardized OpenAI-compatible API endpoint for accessing hundreds of Large Language Models (LLMs) from various providers — including OpenAI, Anthropic, Google, Mistral, and more.

**Key benefits:**
- 🔀 **Automatic failover** — traffic shifts to healthy providers instantly
- 💸 **Cost optimization** — route to the most cost-effective model automatically
- 🛡️ **Privacy controls** — logs can be disabled per-request
- 🔌 **Drop-in compatibility** — works with existing OpenAI SDKs unchanged

## Core Concepts

| Concept | Description |
|---------|-------------|
| **API Key** | Bearer token (`sk-...`) used for all `/v1/*` LLM calls |
| **Session Token** | Short-lived token from `/api/user/login` for management endpoints |
| **Model ID** | Provider-prefixed string like `provider-1/gpt-4o` or plain `gpt-4o` |
| **Provider Routing** | BluesMinds selects the best upstream provider for each model |
| **RPM** | Requests Per Minute — rate limit enforced per API key |

## Architecture Overview

```
Your App (OpenAI SDK)
        │
        ▼
 BluesMinds API Gateway (api.bluesminds.com/v1)
        │
        ├── Provider A (OpenAI)
        ├── Provider B (Anthropic)
        ├── Provider C (Google)
        └── Provider D (Open-Source)
```

The gateway is fully transparent to your application — just change `base_url` and you're connected to all providers.

## Quick Links

| Resource | Link |
|----------|------|
| Quickstart Guide | [→ Quickstart](/docs/quickstart) |
| API Reference | [→ BluesMinds API](/docs/bluesminds-api) |
| Models List | [→ Models](/docs/models) |
| Pricing | [→ Pricing](/) |
| Console / Dashboard | [api.bluesminds.com/console](https://api.bluesminds.com/console) |
| Community (Telegram) | [t.me/apibluesminds](https://t.me/apibluesminds) |

## Important: Get Your API Key

:::caution
You must generate an API key from the [BluesMinds Console](https://api.bluesminds.com/console) before making any API calls.
:::

1. Sign in at [api.bluesminds.com/console](https://api.bluesminds.com/console)
2. Navigate to **Tokens** → **Create New Token**
3. Copy the key (starts with `sk-`) and store it securely
4. Set it as an environment variable: `export BLUESMINDS_API_KEY="sk-your-key"`
