---
title: Claude Code
sidebar_label: Claude Code
sidebar_position: 1
description: Configure Claude Code to route requests through BluesMinds at https://api.bluesminds.com/ — unlocking provider fallback, cost savings, and unified model access with a single API key.
---

# Claude Code

## What is Claude Code?

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's official AI coding CLI.
It reads your codebase, writes code, runs tests, and iterates — all from your terminal via a conversational interface.

By default Claude Code sends requests directly to Anthropic's API.
You can redirect it to BluesMinds by setting two environment variables, keeping the exact same UX while gaining BluesMinds' routing and reliability features.

---

## Why route Claude Code through BluesMinds?

| Benefit | Detail |
|---|---|
| **Provider fallback** | If Anthropic's API is degraded, BluesMinds automatically retries through an alternative provider. |
| **Rate-limit bypass** | BluesMinds distributes load so long coding sessions don't hit Anthropic's per-minute limits. |
| **Unified billing** | One key, one invoice — whether you use Claude, GPT-4, or any other model. |
| **Privacy controls** | Disable prompt logging entirely with a single header. |

---

## Prerequisites

Install Claude Code globally via npm:

```bash
npm install -g @anthropic-ai/claude-code
```

Confirm the installation:

```bash
claude --version
```

Obtain your BluesMinds API key from the [BluesMinds Console](https://api.bluesminds.com/console).

---

## Environment Variable Configuration

Set the following two environment variables before running `claude`:

| Variable | Value |
|---|---|
| `ANTHROPIC_BASE_URL` | `https://api.bluesminds.com/` |
| `ANTHROPIC_API_KEY` | Your BluesMinds API key (`sk-…`) |

> **Note:** Claude Code also checks `ANTHROPIC_API_URL` on some versions. Setting both is safe — the `ANTHROPIC_BASE_URL` variable takes precedence in current releases.

### One-off (inline):

```bash
ANTHROPIC_BASE_URL=https://api.bluesminds.com/ \
ANTHROPIC_API_KEY=sk-your-bluesminds-key \
claude
```

### Persistent (shell profile):

Add the following to your `~/.zshrc` or `~/.bashrc`:

```bash
export ANTHROPIC_BASE_URL=https://api.bluesminds.com/
export ANTHROPIC_API_KEY=sk-your-bluesminds-key
```

Then reload:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

---

## `.env` File Approach

If you prefer to keep credentials in a project-level file (add it to `.gitignore`!):

```bash title=".env"
ANTHROPIC_BASE_URL=https://api.bluesminds.com/
ANTHROPIC_API_KEY=sk-your-bluesminds-key
```

Load it before invoking Claude Code:

```bash
export $(cat .env | xargs) && claude
```

Or use [dotenv-cli](https://github.com/entropitor/dotenv-cli):

```bash
npx dotenv-cli -- claude
```

---

## Selecting a Model

Pass the `--model` flag to override the default:

```bash
ANTHROPIC_BASE_URL=https://api.bluesminds.com/ \
ANTHROPIC_API_KEY=sk-your-bluesminds-key \
claude --model claude-sonnet-4-5
```

BluesMinds supports the full range of Anthropic model IDs. Check the [BluesMinds Models page](/docs/models) for the complete, up-to-date list. Common examples:

| Model ID | Description |
|---|---|
| `claude-opus-4-5` | Most capable; best for complex, multi-step tasks |
| `claude-sonnet-4-5` | Balanced performance and speed (recommended) |
| `claude-haiku-3-5` | Fastest and lowest cost |
| `claude-sonnet-3-7` | Previous Sonnet generation |

---

## CLI Usage Examples

```bash
# Start an interactive Claude Code session via BluesMinds
ANTHROPIC_BASE_URL=https://api.bluesminds.com/ \
ANTHROPIC_API_KEY=sk-your-bluesminds-key \
claude

# Non-interactive: one-shot prompt
ANTHROPIC_BASE_URL=https://api.bluesminds.com/ \
ANTHROPIC_API_KEY=sk-your-bluesminds-key \
claude -p "Explain the function in src/utils.ts"

# Use a specific model
ANTHROPIC_BASE_URL=https://api.bluesminds.com/ \
ANTHROPIC_API_KEY=sk-your-bluesminds-key \
claude --model claude-opus-4-5
```

---

## Quick Reference

```bash
# For Claude Code and Anthropic SDK tools
export ANTHROPIC_API_KEY=sk-your-bluesminds-key
export ANTHROPIC_BASE_URL=https://api.bluesminds.com/

# Older Claude Code versions may also need:
export ANTHROPIC_API_URL=https://api.bluesminds.com/
```

BluesMinds automatically maps the Anthropic message format to and from the appropriate upstream provider.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Authentication error` | Confirm `ANTHROPIC_API_KEY` is set and starts with `sk-`. Run `echo $ANTHROPIC_API_KEY` to verify. |
| `Model not found` | Check the model ID on the [BluesMinds Models page](/docs/models). BluesMinds uses the same model IDs as Anthropic. |
| `Connection refused` / `ECONNREFUSED` | Verify `ANTHROPIC_BASE_URL` is exactly `https://api.bluesminds.com/` — no trailing slash. |
| Claude Code ignores env vars | Ensure variables are exported in the **same shell session**. `echo $ANTHROPIC_BASE_URL` should print the URL. |
| Still hitting Anthropic directly | Some older Claude Code versions use `ANTHROPIC_API_URL` instead. Try setting that variable as well: `export ANTHROPIC_API_URL=https://api.bluesminds.com/` |
| **Auth errors (401/403)** | 1. Re-copy your key from the [BluesMinds Console](https://api.bluesminds.com/console). 2. Ensure no extra spaces or line breaks. 3. Confirm the key starts with `sk-`. |
| **Connection timeout** | Verify connectivity: `curl https://api.bluesminds.com//models -H "Authorization: Bearer sk-your-key"` |
| **Tool uses wrong endpoint** | Some tools cache the base URL. Restart the tool — or open a new terminal — after changing env vars. |
| **Responses seem slow** | Try a lighter model for faster responses (e.g., `claude-haiku-3-5`). |
| **Context window errors** | Switch to a model with a larger context window (e.g., `claude-opus-4-5` supports 200k). |

---

## Next Steps

- Explore [BluesMinds Models](/docs/models) to see every available model and its context window.
- Learn about [Provider Routing](/docs/features/provider-routing) — BluesMinds automatically routes to the best available provider.
- Review [Privacy & Logging](/docs/features/privacy-logging) to understand how your prompts are handled.
- Set up [OpenAI Codex CLI](/docs/integrations/codex-cli) with BluesMinds too.
- Browse the [Full API Reference](/docs/bluesminds-api) for programmatic access.
