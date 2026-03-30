---
id: privacy-logging
title: Privacy & Logging
sidebar_label: Privacy & Logging
sidebar_position: 1
---

# Privacy & Logging

BluesMinds gives you fine-grained control over whether your request and response bodies are stored.

## Default Behavior

By default, BluesMinds **does not persist** request/response body content. Only metadata (model, latency, status code, token counts) is recorded for billing and rate-limiting purposes.

## Enabling Logs

Opt in to detailed logging through the Console or Management API. Logs are useful for:

- Debugging unexpected outputs
- Auditing usage by team/project
- Replay of production requests in staging

### Viewing Logs via API

```bash
# 1. Login
TOKEN=$(curl -s -X POST https://api.bluesminds.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_user","password":"your_pass"}' | jq -r '.data.token')

# 2. Fetch logs
curl -H "Authorization: $TOKEN" \
  "https://api.bluesminds.com/api/log/"
```

### Log Schema

```json
{
  "id": "log_123",
  "timestamp": "2026-03-17T11:00:00Z",
  "endpoint": "/v1/chat/completions",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 18
  },
  "latency_ms": 820,
  "status": 200,
  "request_id": "req_abc",
  "user_metadata": {
    "tenant": "acme",
    "request_key": "abc-123"
  }
}
```

## Per-Request Metadata

You can attach metadata to any request via the `user` field (OpenAI-compatible):

```json
{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "Hello"}],
  "user": "tenant:acme|session:xyz"
}
```

This metadata appears in the `user_metadata` field of log entries, making it easy to filter by project or user.

## Request IDs

Capture `id` from the response body or the `X-Request-ID` response header for tracing:

```bash
curl -s -D - https://api.bluesminds.com/v1/chat/completions \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}]}' \
  | grep -i x-request-id
```

## Security Best Practices

- **Never embed API keys in client-side code** — always use server-side proxies
- **Rotate keys regularly** via the Console or `POST /api/token/`
- **Delete unused keys** with `DELETE /api/token/{id}`
- **Use scoped keys** per project to limit blast radius on compromise
