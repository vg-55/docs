---
id: provider-routing
title: Provider Routing
sidebar_label: Provider Routing
sidebar_position: 2
---

# Provider Routing

BluesMinds intelligently routes each request to the best available upstream provider, giving you higher uptime and cost efficiency without changing your code.

## How Routing Works

When you call `POST /v1/chat/completions` with `"model": "gpt-4o"`:

1. BluesMinds looks up all configured **channels** that serve `gpt-4o`
2. It selects the optimal channel based on **health**, **latency**, and **cost**
3. The request is forwarded; the response is normalized to OpenAI format
4. If the selected channel fails, BluesMinds retries on the next best channel

```
Your App
   │
   ▼
BluesMinds Gateway
   │
   ├─► Channel A (OpenAI Direct)    ← preferred if healthy
   ├─► Channel B (Azure OpenAI)     ← failover #1
   └─► Channel C (3rd-party proxy)  ← failover #2
```

## Automatic Failover

Failover is **transparent** — your application receives the same response shape whether it came from Channel A or Channel C. You never need to handle provider-specific errors in your business logic.

Failover triggers on:
- `5xx` errors from the upstream provider
- Network timeouts
- Provider-reported rate limit (`429`) that cannot be resolved locally

## Load Balancing

When multiple healthy channels serve the same model, BluesMinds distributes traffic to:
- Minimize latency (prefer low-p50 channels)
- Spread rate-limit exposure across providers
- Maximize cost efficiency

## Channel Configuration (Admin)

Channels are configured server-side by BluesMinds administrators. Enterprise customers can request custom channel configurations.

To view available channels (requires admin session token):

```bash
curl -H "Authorization: <session_token>" \
  https://api.bluesminds.com/api/channel/
```

## Best Practices

- **Check `/v1/models`** regularly — model availability reflects channel health
- **Don't retry 404s** — if a model isn't in `/v1/models`, no channel serves it
- **Use backoff on 429** — BluesMinds propagates upstream rate limits when all channels are exhausted

## Model Availability vs. Provider Availability

| Status | Meaning |
|--------|---------|
| Model in `/v1/models` | At least one healthy channel serves this model |
| Model absent from `/v1/models` | No channel currently available |
| `404` on inference call | Model was available at list time but channel went down between requests |

Always handle `404` gracefully by re-checking the model list.
