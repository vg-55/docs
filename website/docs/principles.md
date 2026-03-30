---
id: principles
title: Principles
sidebar_label: Principles
sidebar_position: 4
---

# Principles

The core design principles that guide how BluesMinds works.

## 1. OpenAI Compatibility First

BluesMinds is built to be a **drop-in replacement** for any OpenAI client. Change only your `base_url` — no other code changes required. This means:

- All OpenAI SDK methods work unchanged
- Response shapes match the OpenAI specification
- Error codes and types mirror OpenAI conventions
- Streaming uses the same SSE format (`data: {json}` … `data: [DONE]`)

## 2. Unified, Single Endpoint

Instead of juggling multiple API keys, SDKs, and billing accounts across providers, BluesMinds exposes **one URL** for everything:

```
https://api.bluesminds.com/v1
```

Your application code never needs to know which underlying provider is serving a request.

## 3. Automatic Failover & High Availability

If a provider is degraded or rate-limited, BluesMinds automatically reroutes traffic to an available alternative — with **no action required from you**. This delivers:

- Higher effective uptime than any single provider
- Transparent failover (same response format)
- Per-model fallback chains configured server-side

## 4. Cost Optimization

BluesMinds selects the most **cost-effective** provider for a given model when multiple are available. You benefit from competitive pricing without manually comparing provider rates.

## 5. Privacy by Default

- Request and response bodies are **not stored** by default
- You can explicitly opt in to logging via the Management API for audit/debug purposes
- API keys are scoped and revocable — never embed them in client apps
- The Management API uses short-lived session tokens, separate from LLM API keys

## 6. Standard Rate Limiting

Rate limits are enforced **per API key**:

| Plan | RPM |
|------|-----|
| Free | 20 |
| Trial Pack | 15 |
| 10-Day Pass | 15 |
| Unlimited | 15 |
| Enterprise | Custom |

On `429 Too Many Requests`, use **jittered exponential backoff** and honor the `Retry-After` header. Do not retry `401`, `403`, or `404` without fixing the underlying issue.

## 7. Explicit Model Selection

BluesMinds does not silently substitute models. If you request `gpt-4o` and it is unavailable, you receive a `404` — not a silent downgrade to a cheaper model. Always:

1. Call `GET /v1/models` to discover available models
2. Keep your model allowlist in sync with the live model list
3. Handle `404` in your application to present a meaningful user error

## 8. Separation of LLM and Management APIs

Two distinct API surfaces with different authentication:

| Surface | Base Path | Auth Method |
|---------|-----------|-------------|
| LLM (inference) | `/v1/*` | `Bearer sk-...` (API key) |
| Management | `/api/*` | Session token from login |

Never use an API key for management calls, or vice versa. This separation limits blast radius if a key is compromised.
