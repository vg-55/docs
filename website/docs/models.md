---
id: models
title: Models
sidebar_label: Models
sidebar_position: 5
---

# Models

BluesMinds routes requests to models from a wide range of providers. Use the live endpoint to always get the current list.

---

## Pi Credit Pricing

The **Free plan** comes with **500 pi credits** on signup. Credits do not expire and can be used to test any model. Model credit costs vary — see [api.bluesminds.com/pricing](https://api.bluesminds.com/pricing) for current rates.


## Discovering Available Models

### OpenAI-style list

```bash
curl https://api.bluesminds.com/v1/models \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY"
```

Returns an array of model objects:
```json
{
  "object": "list",
  "data": [
    { "id": "gpt-4o", "object": "model", "created": 1715000000, "owned_by": "openai" },
    { "id": "claude-sonnet-4-5", "object": "model", "created": 1715000000, "owned_by": "anthropic" }
  ]
}
```

### Gemini-style metadata

```bash
curl https://api.bluesminds.com/v1beta/models \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY"
```

Returns Google-style model metadata (useful for Google-compatible clients).

:::tip
Always read `/v1/models` before hard-coding IDs. Model availability changes as providers update their offerings.
:::

---

## Plan Access

| Plan | Model Access |
|------|-------------|
| **Free** | Limited subset — basic models only, ~50% context |
| **10-Day Pass** | Good quality models, full context |
| **Unlimited** | All available models, full context |
| **Enterprise** | All models, priority routing, custom allowlists |

---

## Using a Model

Pass the model ID in the `model` field of any request:

```bash
curl https://api.bluesminds.com/v1/chat/completions \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

If the model is not found, you will receive:

```json
{
  "error": {
    "message": "Model not found",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}
```

Refresh your model list and update your code.
