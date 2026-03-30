---
title: OpenAI Codex CLI
sidebar_label: Codex CLI
sidebar_position: 2
description: Configure the OpenAI Codex CLI to route requests through BluesMinds at https://api.bluesminds.com/v1 — access 100+ models including Claude, Gemini, and more with a single API key.
---

# OpenAI Codex CLI

## What is the Codex CLI?

The [Codex CLI](https://github.com/openai/codex) is an open-source, agentic terminal tool from OpenAI.
It uses OpenAI's models (e.g., `gpt-4o`, `gpt-4.1`, `o3`) to read your codebase, execute shell commands, and iteratively solve tasks — similar to Claude Code but built on the OpenAI SDK.

Because BluesMinds provides a **fully OpenAI-compatible API**, you can redirect Codex CLI to BluesMinds with two environment variables and gain access to every model in the BluesMinds marketplace — including Claude models — without changing how you invoke the tool.

---

## Why route Codex CLI through BluesMinds?

| Benefit | Detail |
|---|---|
| **Cross-provider model access** | Use `claude-sonnet-4-5` or `gemini-pro` through the same Codex CLI that normally only speaks OpenAI. |
| **Automatic failover** | If OpenAI is down or rate-limiting, BluesMinds retries through an alternative provider seamlessly. |
| **Cost control** | BluesMinds selects the cheapest upstream option for each request. |
| **Single API key** | No need to manage separate OpenAI, Anthropic, and Google credentials. |

---

## Prerequisites

Install the Codex CLI globally via npm:

```bash
npm install -g @openai/codex
```

Confirm the installation:

```bash
codex --version
```

Obtain your BluesMinds API key from the [BluesMinds Console](https://api.bluesminds.com/v1console).

---

## Environment Variable Configuration

| Variable | Value |
|---|---|
| `OPENAI_BASE_URL` | `https://api.bluesminds.com/v1` |
| `OPENAI_API_KEY` | Your BluesMinds API key (`sk-…`) |

### One-off (inline):

```bash
OPENAI_BASE_URL=https://api.bluesminds.com/v1 \
OPENAI_API_KEY=sk-your-bluesminds-key \
codex "Refactor the main function to use async/await"
```

### Persistent (shell profile):

Add the following to your `~/.zshrc` or `~/.bashrc`:

```bash
export OPENAI_BASE_URL=https://api.bluesminds.com/v1
export OPENAI_API_KEY=sk-your-bluesminds-key
```

Then reload:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

Then run Codex normally:

```bash
codex "Write unit tests for src/parser.ts"
```

---

## `.env` File

```bash title=".env"
OPENAI_BASE_URL=https://api.bluesminds.com/v1
OPENAI_API_KEY=sk-your-bluesminds-key
```

Load before running:

```bash
export $(cat .env | xargs) && codex "Your task here"
```

---

## Codex CLI Config File

The Codex CLI reads `~/.codex/config.json` (or `$CODEX_HOME/config.json`).
You can bake the BluesMinds base URL and model into this file so you never need to set environment variables manually:

```json title="~/.codex/config.json"
{
  "model": "gpt-4o",
  "provider": "openai",
  "providers": {
    "openai": {
      "apiKey": "sk-your-bluesminds-key",
      "baseURL": "https://api.bluesminds.com/v1"
    }
  }
}
```

Then run normally — no extra environment variables needed:

```bash
codex "Refactor this function to use async/await"
```

---

## Supported Models (OpenAI-compatible)

BluesMinds supports all standard OpenAI model IDs, plus cross-provider models. Check the [BluesMinds Models page](/docs/models) for the complete list. Common examples:

| Model ID | Description |
|---|---|
| `gpt-4o` | Latest multimodal GPT-4o |
| `gpt-4.1` | Enhanced instruction-following |
| `gpt-4o-mini` | Fast and cost-efficient |
| `o3` | Full reasoning model |
| `o4-mini` | Compact reasoning model |

---

## CLI Usage Examples

```bash
# One-shot task
OPENAI_BASE_URL=https://api.bluesminds.com/v1 \
OPENAI_API_KEY=sk-your-bluesminds-key \
codex "Add JSDoc comments to every exported function in src/"

# Use a specific model
OPENAI_BASE_URL=https://api.bluesminds.com/v1 \
OPENAI_API_KEY=sk-your-bluesminds-key \
codex --model gpt-4.1 "Explain the bug in src/parser.ts"

# Interactive mode (omit the task argument)
OPENAI_BASE_URL=https://api.bluesminds.com/v1 \
OPENAI_API_KEY=sk-your-bluesminds-key \
codex
```

---

## Quick Reference

```bash
# For Codex CLI and all OpenAI-compatible tools
export OPENAI_API_KEY=sk-your-bluesminds-key
export OPENAI_BASE_URL=https://api.bluesminds.com/v1
```

BluesMinds implements the full OpenAI REST specification — any tool that works with the OpenAI SDK will work with BluesMinds.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401 Unauthorized` | Confirm `OPENAI_API_KEY` matches your BluesMinds key and starts with `sk-`. |
| `404 model not found` | Verify the model ID exists on the [BluesMinds Models page](/docs/models). Model IDs are case-sensitive. |
| `ECONNREFUSED` | Confirm `OPENAI_BASE_URL` is set. Some library versions default to `https://api.openai.com`. |
| Config file ignored | Delete `~/.codex/config.json` and recreate it; check for JSON syntax errors with `cat ~/.codex/config.json | python3 -m json.tool`. |
| Rate limit errors | BluesMinds routes across providers — if one provider is saturated, try a different model variant (e.g., `gpt-4o-mini` instead of `gpt-4o`). |
| **Auth errors (401/403)** | 1. Re-copy your key from the [BluesMinds Console](https://api.bluesminds.com/v1console). 2. Ensure no extra spaces or line breaks. 3. Confirm the key starts with `sk-`. |
| **Connection timeout** | Verify connectivity: `curl https://api.bluesminds.com/v1/models -H "Authorization: Bearer sk-your-key"` |
| **Tool uses wrong endpoint** | Some tools cache the base URL. Restart the tool — or open a new terminal — after changing env vars. |
| **Responses seem slow** | Try a lighter model for faster responses (e.g., `gpt-4o-mini`). |
| **Context window errors** | Switch to a model with a larger context window (e.g., `gpt-4.1` supports 1M tokens). |

---

## Next Steps

- Explore [BluesMinds Models](/docs/models) to see every available model and its context window.
- Learn about [Provider Routing](/docs/features/provider-routing) — BluesMinds automatically routes to the best available provider.
- Review [Privacy & Logging](/docs/features/privacy-logging) to understand how your prompts are handled.
- Set up [Claude Code](/docs/integrations/claude-code) with BluesMinds too.
- Browse the [Full API Reference](/docs/bluesminds-api) for programmatic access.
