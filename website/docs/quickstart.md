---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
sidebar_position: 2
---

# Quickstart

BluesMinds provides a unified API that gives you access to hundreds of AI models through a single endpoint. Switch between models and providers without changing your code, while automatically handling failovers and selecting cost-effective options.

:::important
Ensure you have generated an API key from your [BluesMinds dashboard](https://api.bluesminds.com/console) before proceeding with integration.
:::

## Step 1: Set Environment Variables

```bash
export BLUESMINDS_API_KEY="sk-your-api-key"
export BLUESMINDS_BASE="https://api.bluesminds.com/v1"
```

## Step 2: Make Your First Call

BluesMinds is OpenAI-compatible — point any existing OpenAI client at `https://api.bluesminds.com/v1`.

### Using cURL

```bash
curl https://api.bluesminds.com/v1/chat/completions \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "What is the meaning of life?"}
    ]
  }'
```

### Using Python (OpenAI SDK)

Install the SDK:
```bash
pip install openai
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("BLUESMINDS_API_KEY"),
    base_url=os.getenv("BLUESMINDS_BASE"),
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Say hello in one sentence."}],
)

print(response.choices[0].message.content)
```

### Using JavaScript / Node.js (OpenAI SDK)

Install the SDK:
```bash
npm install openai
```

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.BLUESMINDS_API_KEY,
  baseURL: process.env.BLUESMINDS_BASE,
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Say hello in one sentence." }],
});

console.log(response.choices[0].message.content);
```

## Step 3: Stream Responses

Streaming lets you display tokens as they are generated, for a faster UX.

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("BLUESMINDS_API_KEY"),
    base_url=os.getenv("BLUESMINDS_BASE"),
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Stream three words."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

SSE frame format:
```text
data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" world"}}]}
data: [DONE]
```

## Step 4: Use with Coding Tools

BluesMinds works natively with Cursor, Continue.dev, and other AI coding assistants.

Configure your tool by:
- **Base URL:** `https://api.bluesminds.com/v1`
- **API Key:** your `sk-...` key
- **Model:** any model from [`GET /v1/models`](/docs/models)

:::tip Compatibility Note
A4F / BluesMinds is designed to be fully compatible with the OpenAI API specification. Simply point your existing OpenAI client's `baseURL` to the BluesMinds endpoint.
:::

## Step 5: Explore Available Models

```bash
curl https://api.bluesminds.com/v1/models \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY"
```

See the full [Models reference](/docs/models) for a categorized list of available models.

## Next Steps

| Topic | Link |
|-------|------|
| All API endpoints | [BluesMinds API Reference](/docs/bluesminds-api) |
| Model list | [Models](/docs/models) |
| Tool Calling | [Features → Tool Calling](/docs/features/tool-calling) |
| Provider Routing | [Features → Provider Routing](/docs/features/provider-routing) |
| Pricing | [Pricing Page](/) |
