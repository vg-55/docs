---
title: OpenClaw
sidebar_label: OpenClaw
sidebar_position: 3
description: Configure OpenClaw to route requests through BluesMinds at https://api.bluesminds.com/v1 — access 100+ models with a single API key through OpenClaw's AI Gateway.
---

# OpenClaw

## What is OpenClaw?

[OpenClaw](https://docs.openclaw.ai/start/getting-started) is an AI agent platform with a built-in Gateway that connects to multiple model providers.
It supports messaging channels, safety features, and a control dashboard — all managed from your terminal.

Because OpenClaw supports **OpenAI-compatible providers**, you can point it at BluesMinds and access 100+ models from every major provider with a single API key.

---

## Why route OpenClaw through BluesMinds?

| Benefit | Detail |
|---|---|
| **100+ models, one key** | Access OpenAI, Anthropic, Google, Mistral, and more without juggling multiple API keys. |
| **Automatic failover** | If a provider is down, BluesMinds retries through an alternative seamlessly. |
| **Cost savings** | BluesMinds picks the cheapest available upstream for each request. |
| **Rate-limit handling** | Requests are distributed across providers to avoid per-provider caps. |

---

## Prerequisites

Install OpenClaw:

**macOS / Linux:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

Confirm the installation:

```bash
openclaw gateway status
```

Obtain your BluesMinds API key from the [BluesMinds Console](https://api.bluesminds.com/console).

---

## Configuration

OpenClaw uses a JSON5 config file at `~/.openclaw/openclaw.json`. Add BluesMinds as a custom provider:

```json5 title="~/.openclaw/openclaw.json"
{
  models: {
    mode: "merge",
    providers: {
      "bluesminds": {
        baseUrl: "https://api.bluesminds.com/v1",
        apiKey: "${BLUESMINDS_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "gpt-4o",
            name: "GPT-4o",
            contextWindow: 128000,
            maxTokens: 16384
          },
          {
            id: "claude-sonnet-4-5",
            name: "Claude Sonnet 4.5",
            contextWindow: 200000,
            maxTokens: 8192
          },
          {
            id: "gemini-2.0-flash",
            name: "Gemini 2.0 Flash",
            contextWindow: 1000000,
            maxTokens: 8192
          },
          {
            id: "deepseek-chat",
            name: "DeepSeek Chat",
            contextWindow: 128000,
            maxTokens: 8192
          }
        ]
      }
    }
  }
}
```

Then set your API key as an environment variable:

```bash
export BLUESMINDS_API_KEY=sk-your-bluesminds-key
```

Or hardcode it directly (less recommended):

```json5
{
  models: {
    providers: {
      "bluesminds": {
        baseUrl: "https://api.bluesminds.com/v1",
        apiKey: "sk-your-bluesminds-key",
        api: "openai-completions",
        // ...models
      }
    }
  }
}
```

---

## Setting BluesMinds as the Default Model

Update your agent defaults to use a BluesMinds model:

```json5 title="~/.openclaw/openclaw.json"
{
  agents: {
    defaults: {
      model: {
        primary: "bluesminds/gpt-4o",
        fallbacks: ["bluesminds/claude-sonnet-4-5"],
      },
      models: {
        "bluesminds/gpt-4o": { alias: "GPT-4o" },
        "bluesminds/claude-sonnet-4-5": { alias: "Sonnet" },
        "bluesminds/gemini-2.0-flash": { alias: "Flash" },
      },
    },
  },
}
```

This sets GPT-4o as primary with Claude Sonnet as fallback — both routed through BluesMinds.

---

## Per-Agent Configuration

Override models for a specific agent by creating:

```json5 title="~/.openclaw/agents/<agentId>/agent/models.json"
{
  providers: {
    "bluesminds": {
      baseUrl: "https://api.bluesminds.com/v1",
      apiKey: "${BLUESMINDS_API_KEY}",
      api: "openai-completions",
      models: [
        {
          id: "claude-sonnet-4-5",
          name: "Claude Sonnet 4.5",
          contextWindow: 200000,
          maxTokens: 8192
        }
      ]
    }
  }
}
```

Agent-level config takes precedence over the main `openclaw.json`.

---

## Available Models

BluesMinds supports all standard OpenAI model IDs plus cross-provider models. Check the [BluesMinds Models page](/docs/models) for the full list. Common examples:

| Model ID | Provider | Description |
|---|---|---|
| `gpt-4o` | OpenAI | Latest multimodal GPT-4o |
| `gpt-4.1` | OpenAI | Enhanced instruction-following |
| `claude-sonnet-4-5` | Anthropic | Balanced performance and speed |
| `claude-opus-4-5` | Anthropic | Most capable Claude model |
| `gemini-2.0-flash` | Google | Fast, 1M context window |
| `deepseek-chat` | DeepSeek | Strong open-source model |

---

## Verify the Setup

Check that the Gateway is running:

```bash
openclaw gateway status
```

Open the dashboard to see your configured models:

```bash
openclaw dashboard
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401 Unauthorized` | Confirm `BLUESMINDS_API_KEY` is set and starts with `sk-`. Run `echo $BLUESMINDS_API_KEY` to verify. |
| `Model not found` | Ensure the model `id` in your config matches a valid BluesMinds model. Check `/v1/models`. |
| Gateway won't start | Run `openclaw onboard --install-daemon` to re-initialize. |
| Config not loading | Verify JSON5 syntax — use `openclaw dashboard` to inspect active config. Check `OPENCLAW_CONFIG_PATH` if using a custom location. |
| Wrong models appearing | Set `mode: "replace"` instead of `"merge"` to use only BluesMinds models. |
| **Connection timeout** | Verify connectivity: `curl https://api.bluesminds.com/v1/models -H "Authorization: Bearer sk-your-key"` |
| **Responses seem slow** | Try a lighter model (e.g., `gpt-4o-mini`, `gemini-2.0-flash-lite`). |

---

## Next Steps

- Explore [BluesMinds Models](/docs/models) to see every available model and its context window.
- Learn about [Provider Routing](/docs/features/provider-routing) — BluesMinds automatically routes to the best available provider.
- Review [Privacy & Logging](/docs/features/privacy-logging) to understand how your prompts are handled.
- Set up [Claude Code](/docs/integrations/claude-code) or [Codex CLI](/docs/integrations/codex-cli) with BluesMinds too.
- Browse the [Full API Reference](/docs/bluesminds-api) for programmatic access.
