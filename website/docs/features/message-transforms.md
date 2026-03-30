---
id: message-transforms
title: Message Transforms
sidebar_label: Message Transforms
sidebar_position: 5
---

# Message Transforms

BluesMinds can transform message formats on the fly, allowing you to use a single OpenAI-compatible format and have it routed to providers that use different native protocols (Anthropic Messages API, Google Gemini API, etc.).

## OpenAI → Anthropic Transform

When you route a request to a Claude model via the standard `/v1/chat/completions` endpoint, BluesMinds automatically converts the OpenAI message format to Anthropic's Messages API format.

You write:
```json
{
  "model": "claude-sonnet-4-5",
  "messages": [
    {"role": "system", "content": "You are a concise assistant."},
    {"role": "user", "content": "Summarize AI in one sentence."}
  ]
}
```

BluesMinds internally sends:
```json
{
  "model": "claude-sonnet-20240229",
  "system": "You are a concise assistant.",
  "messages": [
    {"role": "user", "content": "Summarize AI in one sentence."}
  ],
  "max_tokens": 1024
}
```

Your code never needs to know about Anthropic's format.

## Native Anthropic Messages Endpoint

If you prefer to use Anthropic's native message format directly, BluesMinds also exposes it:

```http
POST https://api.bluesminds.com/v1/messages
Authorization: Bearer sk-...
Content-Type: application/json
```

```json
{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Hello Claude!"}],
  "max_tokens": 256
}
```

This is useful for applications already built against the Anthropic SDK.

## OpenAI → Gemini Transform

Similarly, requests to Gemini models via `/v1/chat/completions` are automatically transformed into Google's `generateContent` format internally. The response is converted back to the OpenAI format before being returned to you.

## System Messages

All providers handle system messages differently. BluesMinds normalizes them:

| Provider | Handling |
|---------|---------|
| OpenAI | Native `{"role": "system", ...}` |
| Anthropic | Extracted to top-level `"system"` field |
| Google Gemini | Mapped to `system_instruction` |

Just use standard OpenAI `{"role": "system"}` in your messages array — BluesMinds handles the rest.

## Streaming Normalization

All providers use different streaming formats. BluesMinds normalizes all of them to OpenAI's SSE format:

```text
data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" world"}}]}
data: [DONE]
```

You never need to handle Anthropic event streams or Google SSE formats.

## Limitations

- **Embeddings** are not currently available
- **Audio STT** (speech-to-text) transforms are provider-specific; check model availability
- Some provider-specific parameters (e.g., Anthropic's `top_k`) are not forwarded through the OpenAI compat layer — use the native endpoint if you need them
