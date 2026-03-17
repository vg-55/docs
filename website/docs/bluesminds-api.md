---
id: bluesminds-api
title: BluesMinds API
sidebar_label: Overview
hide_title: true
---

# BluesMinds API

> **Base URL:** `https://api.bluesminds.com/v1` · **Last Updated:** 2026-03-17 · **Support:** [Console](https://api.bluesminds.com/console) · [Community](https://t.me/apibluesminds)

## Table of Contents
- [Introduction](#introduction)
- [Quickstart](#quickstart)
- [Auth & Environment](#auth--environment)
- [SDK Setup](#sdk-setup)
- [Core Concepts & Routing](#core-concepts--routing)
- [Models](#models)
- [Pricing & Rate Limits](#pricing--rate-limits)
- [LLM API](#llm-api)
  - [Chat Completions](#chat-completions)
  - [Tool Calling](#tool-calling)
  - [Vision Inputs](#vision-inputs)
  - [Streaming](#streaming)
  - [Images](#images)
  - [Audio (TTS)](#audio-tts)
  - [Anthropic Messages](#anthropic-messages)
- [Management API](#management-api)
- [Errors & Retries](#errors--retries)
- [Observability](#observability)
- [SDK Usage Examples](#sdk-usage-examples)
- [Migration & Model Mapping](#migration--model-mapping)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Resources](#resources)

## Introduction
BluesMinds offers OpenAI-compatible LLM endpoints with Anthropic- and Gemini-style compatibility layers, plus a management plane for keys, logs, and channels. Use the `/v1` LLM surface with API keys and the `/api/*` management surface with session tokens.

## Quickstart
1) Export env vars (LLM):
```bash
export BLUESMINDS_API_KEY="sk-your-api-key"
export BLUESMINDS_BASE="https://api.bluesminds.com/v1"
```

2) cURL a chat completion:
```bash
curl "$BLUESMINDS_BASE/chat/completions" \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Say hello in one sentence."}]
  }'
```

3) Stream with Python SDK (OpenAI-compatible):
```python
from openai import OpenAI

client = OpenAI(api_key="sk-your-api-key", base_url="https://api.bluesminds.com/v1")

for chunk in client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Stream three words."}],
    stream=True,
):
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="")
```

> **Note:** Streaming uses SSE frames (`data: {json}` … `data: [DONE]`).

## Auth & Environment
- **LLM (/v1)**: `Authorization: Bearer sk-...` (API key).
- **Management (/api/*)**: `Authorization: <session_token>` (session token from login).
- Shared headers: `Content-Type: application/json` for JSON bodies.
- Rotate keys via `/api/token/`; never embed secrets in client apps.

## SDK Setup
- Python: `pip install openai`
- Node.js: `npm install openai`
- Env vars: `BLUESMINDS_API_KEY`, `BLUESMINDS_BASE=https://api.bluesminds.com/v1`

## Core Concepts & Routing
- **OpenAI drop-in:** Use OpenAI SDKs/clients with `base_url=BLUESMINDS_BASE`.
- **Anthropic compatibility:** Use `/v1/messages` (Claude-style) with the same API key.
- **Model IDs & aliases:** Use IDs from `GET /v1/models`. Aliases may route to providers; keep allowlists in sync.
- **Routing:** BluesMinds routes by model ID to underlying provider channels; unavailable models return 404.
- **Streaming:** SSE format mirrors OpenAI; reconnect on transient failures with backoff.
- **No embeddings:** Embedding endpoints are not available.

## Models
### /v1 models (OpenAI-style)
`GET /v1/models` lists models for OpenAI-compatible calls.

### /v1beta/models (Gemini-style metadata)
`GET /v1beta/models` returns Google-style model metadata for discovery.

Example model snapshot:

| Provider | Model ID | Capabilities | Max Tokens (ctx) | Group | Notes |
|---|---|---|---|---|---|
| OpenAI | gpt-4o | vision, tools, json | ~128k | default | Flagship |
| OpenAI | gpt-4.1 | json | ~128k | default | Often free/promotional |
| OpenAI | gpt-5.1 | tools, json | ~200k | vip | High-end |
| Anthropic | claude-opus-4-5 | tools | ~200k | vip | Claude opus |
| Anthropic | claude-sonnet-4-5 | tools | ~200k | default | Balanced |
| Google | gemini-2.5-pro | vision, json | ~200k | vip | Via chat completions |
| Google | gemini-2.0-flash | vision, json | ~1M | default | Long context |
| DeepSeek | deepseek-reasoner | tools | ~128k | default | Reasoning |
| xAI | grok-3 | tools | ~128k | vip | |
| Alibaba | qwen-max | vision, tools | ~128k | vip | |
| Other | (various) | varies | varies | default | Check `/v1/models` |

> **Note:** Always read `/v1/models` or `/v1beta/models` to confirm availability before hard-coding IDs.

## Pricing & Rate Limits
- **Currency:** ¤ (credits). Charges are per request.
- **Effective price:** `effective_price = base_price × token_group_multiplier`.
- **Groups:** `default = 1x`, `vip = negotiated/0x promotional when applicable`.

Sample prices (per request):

| Model | Group | Price (¤) |
|---|---|---|
| gpt-4.1 | default | 0.000 |
| gpt-4o | default | 2.000 |
| gemini-2.5-pro | vip | 10.000 |
| gpt-5.1 | vip | 15.000 |

Rate limits & backoff:
- Expect per-key quotas; bursts allowed within limits.
- On `429 Too Many Requests`, back off (e.g., 1s, 2s, 4s) and honor `Retry-After` when present.
- Retry safely on 429/500/timeouts with jittered exponential backoff; avoid retrying 401/403/404 without fixes.

## LLM API
Use API keys and `BLUESMINDS_BASE=https://api.bluesminds.com/v1`.

### Chat Completions
```http
POST https://api.bluesminds.com/v1/chat/completions
Authorization: Bearer sk-...
Content-Type: application/json
```

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are concise."},
    {"role": "user", "content": "Give one fact about Mars."}
  ],
  "max_tokens": 64,
  "temperature": 0.7,
  "response_format": {"type": "json_object"}
}
```

### Tool Calling
```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "What's the weather in Paris?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather by city",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {"type": "string"}
          },
          "required": ["city"]
        }
      }
    }
  ]
}
```

### Vision Inputs
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "Describe the image."},
        {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
      ]
    }
  ]
}
```

### Streaming
```bash
curl "$BLUESMINDS_BASE/chat/completions" \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Stream two words"}],
    "stream": true
  }'
```

SSE shape:
```text
data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" world"}}]}
data: [DONE]
```

### Images
```http
POST https://api.bluesminds.com/v1/images/generations
Authorization: Bearer sk-...
Content-Type: application/json
```

```json
{ "model": "dall-e-3", "prompt": "A serene mountain at dawn", "n": 1, "size": "1024x1024" }
```

### Audio (TTS)
```http
POST https://api.bluesminds.com/v1/audio/speech
Authorization: Bearer sk-...
Content-Type: application/json
```

```json
{ "model": "tts-1", "voice": "alloy", "input": "Hello from BluesMinds" }
```

### Anthropic Messages
```http
POST https://api.bluesminds.com/v1/messages
Authorization: Bearer sk-...
Content-Type: application/json
```

```json
{ "model": "claude-opus-4-5", "messages": [{"role": "user", "content": "Summarize BluesMinds."}], "max_tokens": 256 }
```

Shared headers/params cheat sheet:
- Headers: `Authorization: Bearer sk-...`, `Content-Type: application/json`
- Params: `model` (required), `messages`, `stream`, `max_tokens`, `temperature`, `top_p`, `tools`, `response_format`.

## Management API
Uses session tokens (login) and a custom envelope.

### Login (session token)
```bash
curl -X POST https://api.bluesminds.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Token CRUD (API keys)
- List keys:
```bash
curl -H "Authorization: <session_token>" https://api.bluesminds.com/api/token/
```
- Create key:
```bash
curl -X POST https://api.bluesminds.com/api/token/ \
  -H "Authorization: <session_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "ci-bot"}'
```
- Delete key:
```bash
curl -X DELETE https://api.bluesminds.com/api/token/{id} \
  -H "Authorization: <session_token>"
```

### Logs & Dashboard
- Logs:
```bash
curl -H "Authorization: <session_token>" https://api.bluesminds.com/api/log/
```
- Dashboard:
```bash
curl -H "Authorization: <session_token>" https://api.bluesminds.com/api/dashboard/
```

### Channels (admin)
- List channels:
```bash
curl -H "Authorization: <session_token>" https://api.bluesminds.com/api/channel/
```

Management response envelope:
```json
{ "message": "", "success": true, "data": { ... } }
```

## Errors & Retries

### LLM (/v1*, OpenAI style)
```json
{ "error": { "code": "", "message": "Token missing", "type": "new_api_error" } }
```

### Management (/api/*)
```json
{ "message": "Unauthorized", "success": false }
```

HTTP codes: 200 success; 401 invalid/missing key or session; 403 forbidden; 404 not found; 429 rate limited; 500 internal.

Retry policy:
- Retry 429/500/timeouts with jittered exponential backoff; respect `Retry-After`.
- Do not retry 401/403/404 without fixing inputs.
- For streaming, reconnect and continue logically at the app layer.

## Observability
- **Request IDs:** Capture `id` in responses or `X-Request-ID` header.
- **Logs API:** `GET /api/log/` (session token) for audits; filter by time/model in console.
- **Log schema (representative):**
```json
{
  "id": "log_123",
  "timestamp": "2026-03-17T11:00:00Z",
  "endpoint": "/v1/chat/completions",
  "model": "gpt-4o",
  "usage": {"prompt_tokens": 12, "completion_tokens": 18},
  "latency_ms": 820,
  "status": 200,
  "request_id": "req_abc",
  "user_metadata": {"tenant": "acme", "request_key": "abc-123"}
}
```

## SDK Usage Examples
Set env vars first:
```bash
export BLUESMINDS_API_KEY="sk-your-api-key"
export BLUESMINDS_BASE="https://api.bluesminds.com/v1"
```

### Python (chat + streaming)
```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("BLUESMINDS_API_KEY"), base_url=os.getenv("BLUESMINDS_BASE"))

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "List 3 colors"}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="")
```

### Python (tools)
```python
from openai import OpenAI

client = OpenAI(api_key="sk-your-api-key", base_url="https://api.bluesminds.com/v1")

resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Weather in Paris"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather by city",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string"}},
                "required": ["city"]
            }
        }
    }]
)

print(resp.choices[0].message)
```

### JavaScript / Node.js (streaming)
```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.BLUESMINDS_API_KEY,
  baseURL: process.env.BLUESMINDS_BASE,
});

const stream = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Stream two words" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

### JavaScript (vision)
```javascript
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.BLUESMINDS_API_KEY, baseURL: process.env.BLUESMINDS_BASE });

const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Describe the image." },
        { type: "image_url", image_url: { url: "https://example.com/image.jpg" } },
      ],
    },
  ],
});

console.log(resp.choices[0].message.content);
```

### JavaScript (tools)
```javascript
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.BLUESMINDS_API_KEY, baseURL: process.env.BLUESMINDS_BASE });

const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Weather in Paris" }],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get weather by city",
        parameters: {
          type: "object",
          properties: { city: { type: "string" } },
          required: ["city"],
        },
      },
    },
  ],
});

console.log(resp.choices[0].message);
```

## Migration & Model Mapping
Use `GET /v1/models` to update allowlists. Example mappings:

| Upstream call | BluesMinds model | Notes |
|---|---|---|
| gpt-4o | gpt-4o | Drop-in |
| gpt-4-vision-preview | gpt-4-vision-preview | Vision parity |
| gpt-4.1 | gpt-4.1 | Often free/promotional |
| gpt-5.1 | gpt-5.1 | High-end |
| claude-3.5-sonnet-20241022 | claude-sonnet-4-5 | Updated Sonnet |
| claude-3.5-haiku-20241022 | claude-haiku-4-5 | Updated Haiku |
| claude-3-opus-20240229 | claude-opus-4-5 | Newer Opus |

## FAQ / Troubleshooting
- **401/Invalid key:** Confirm `Authorization: Bearer sk-...` and `BLUESMINDS_BASE=https://api.bluesminds.com/v1`.
- **404/Model not found:** Refresh `/v1/models` and update allowlists/aliases.
- **429/Rate limited:** Apply exponential backoff with jitter; respect `Retry-After`.
- **Tool calls missing:** Ensure `tools` schema is valid and model supports tools (e.g., gpt-4o).
- **Vision issues:** Use `image_url` objects with publicly reachable URLs or base64 data URLs.

## Resources
- Website: [https://api.bluesminds.com](https://api.bluesminds.com)
- Console/Dashboard: [https://api.bluesminds.com/console](https://api.bluesminds.com/console)
- Model Marketplace: [https://api.bluesminds.com/#/model-marketplace](https://api.bluesminds.com/#/model-marketplace)
- Community (Telegram): [https://t.me/apibluesminds](https://t.me/apibluesminds)
- Platform repo: [https://github.com/QuantumNous/new-api](https://github.com/QuantumNous/new-api)
