---
id: faq
title: FAQ
sidebar_label: FAQ
sidebar_position: 3
---

# Frequently Asked Questions

Common questions about the BluesMinds API.

## Getting Started

### Why should I use BluesMinds?

BluesMinds gives you **one API key** to access hundreds of AI models. Instead of managing separate accounts, billing, and rate limits for OpenAI, Anthropic, Google, and others, you have a single endpoint, unified billing, and automatic failover.

### How do I get started with BluesMinds?

1. Visit [api.bluesminds.com/console](https://api.bluesminds.com/console) and sign up
2. Generate an API key under **Tokens**
3. Set `BLUESMINDS_API_KEY` and `BLUESMINDS_BASE=https://api.bluesminds.com/v1`
4. Use any OpenAI-compatible SDK — see the [Quickstart](/docs/quickstart)

### Do I need a specific SDK to use BluesMinds?

No. BluesMinds is fully OpenAI-compatible. Any library that accepts a `base_url` parameter works:
- Python: `openai` (`pip install openai`)
- Node.js: `openai` (`npm install openai`)
- Any HTTP client (curl, Axios, fetch, etc.)

---

## Models & Providers

### Which models are available?

BluesMinds provides models from OpenAI, Anthropic, Google, Mistral, DeepSeek, xAI, Alibaba, and many open-source providers. See the full [Models list](/docs/models) or call:

```bash
curl https://api.bluesminds.com/v1/models \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY"
```

### Can I use Claude / Gemini models?

Yes. Claude (Anthropic) and Gemini (Google) models are available based on your plan. The Unlimited ($60/mo) plan includes access to all available models.

### What happens if a model is unavailable?

BluesMinds automatically routes to an available provider when possible. If a model has no available provider, the API returns a `404` with a clear error. Always check `/v1/models` before hard-coding model IDs.

---

## Pricing & Billing

### What plans are available?

| Plan | Price | RPM |
|------|-------|-----|
| Free | $0/forever | 20 |
| Trial Pack | $5 / 24 hours | 10 |
| 10-Day Pass | $25 / 10 days | 10 |
| Unlimited | $60 / month | 15 |
| Enterprise | Custom | Custom |

See the full [Pricing page](/).

### What is RPM?

RPM = **Requests Per Minute**. It is the maximum number of API requests your key can make in a 60-second window.

### What counts as a request?

Every call to an endpoint (chat completions, image generation, TTS, etc.) counts as one request, regardless of token length.

### Is there a free trial?

The Free plan is available forever with no credit card required. You get **500 pi credits on signup** (20 RPM) to test any model. Credits are deducted per request based on the model used.

### What payment methods are accepted?

Credit/debit cards and crypto are accepted. For Enterprise, contact us on [Telegram](https://t.me/apibluesminds) for custom invoicing.

---

## Technical

### I'm getting a 401 error

- Confirm your header is `Authorization: Bearer sk-...` (not `sk- ...` with a space)
- Verify `BLUESMINDS_BASE=https://api.bluesminds.com/v1` (not `/v1/`)
- Check the key hasn't been deleted in the Console

### I'm getting a 404 Model Not Found

- Call `GET /v1/models` to refresh your model list
- Some models require a paid plan — check [Pricing](/)
- Update any hard-coded model IDs / aliases in your code

### I'm getting a 429 Rate Limited

Your key exceeded its RPM. Apply exponential backoff:

```python
import time, random

def call_with_backoff(fn, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                wait = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait)
            else:
                raise
```

Also check the `Retry-After` response header.

### Tool calls aren't being returned

- Ensure the `tools` array is included and each function's `parameters` JSON Schema is valid
- Only models that support tools (e.g., `gpt-4o`, `claude-sonnet-4-5`) return tool calls
- Check the model's capabilities via `/v1/models`

### Vision images aren't working

- URLs must be publicly accessible (not localhost or private networks)
- You can also use base64 data URLs: `data:image/jpeg;base64,...`
- Only vision-capable models (e.g., `gpt-4o`, `gemini-2.0-flash`) process images

---

## Management API

### What is the Management API?

The Management API (`/api/*`) lets you manage API keys, view logs, check your dashboard, and configure channels. It uses a **session token** obtained from `/api/user/login`, not an API key.

### How do I view my usage logs?

```bash
# 1. Login to get a session token
TOKEN=$(curl -s -X POST https://api.bluesminds.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"you","password":"pass"}' | jq -r '.data.token')

# 2. Query logs
curl -H "Authorization: $TOKEN" https://api.bluesminds.com/api/log/
```

See the full [API Reference](/docs/bluesminds-api#management-api) for all management endpoints.

---

## Support & Community

### Where can I get help?

- 💬 [Telegram Community](https://t.me/apibluesminds) — fastest response
- 📊 [Console](https://api.bluesminds.com/console) — view usage, manage keys
- 📖 [API Docs](/docs/bluesminds-api) — full reference

### How do I report a bug or request a feature?

Join the [Telegram community](https://t.me/apibluesminds) and post your report. Enterprise customers have a direct support channel.
