---
id: tool-calling
title: Tool Calling
sidebar_label: Tool Calling
sidebar_position: 3
---

# Tool Calling

BluesMinds supports OpenAI-compatible function/tool calling for models that have this capability (e.g., `gpt-4o`, `claude-sonnet-4-5`).

## Overview

Tool calling lets the model request execution of functions defined by your application. The flow is:

1. You send a request with `tools` defined
2. The model responds with `finish_reason: "tool_calls"` and a `tool_calls` array
3. Your code executes the function(s)
4. You send the results back in a follow-up message with `role: "tool"`
5. The model produces a final response

## Basic Example

### Step 1 — Send request with tools

```json
POST https://api.bluesminds.com/v1/chat/completions
Authorization: Bearer sk-...
Content-Type: application/json

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
        "description": "Get current weather for a city",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "City name, e.g. Paris"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["city"]
        }
      }
    }
  ]
}
```

### Step 2 — Model responds with tool call

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"city\": \"Paris\", \"unit\": \"celsius\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### Step 3 — Submit tool result

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "What's the weather in Paris?"},
    {
      "role": "assistant",
      "tool_calls": [{"id": "call_abc123", "type": "function", "function": {"name": "get_weather", "arguments": "{\"city\":\"Paris\"}"}}]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "{\"temperature\": 18, \"condition\": \"partly cloudy\"}"
    }
  ]
}
```

## Python SDK Example

```python
import json
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="https://api.bluesminds.com/v1",
)

tools = [{
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

messages = [{"role": "user", "content": "Weather in Paris?"}]

# First turn
response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
)

msg = response.choices[0].message

if msg.tool_calls:
    # Execute tool
    args = json.loads(msg.tool_calls[0].function.arguments)
    result = {"temperature": 18, "condition": "partly cloudy"}  # your actual logic

    # Second turn
    messages.append(msg)
    messages.append({
        "role": "tool",
        "tool_call_id": msg.tool_calls[0].id,
        "content": json.dumps(result),
    })

    final = client.chat.completions.create(model="gpt-4o", messages=messages)
    print(final.choices[0].message.content)
```

## Parallel Tool Calls

Some models return multiple tool calls in a single response. Iterate over `message.tool_calls` and execute all before sending results back:

```python
for tool_call in msg.tool_calls:
    # execute each independently
    result = execute(tool_call.function.name, tool_call.function.arguments)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result),
    })
```

## Supported Models

Check the model's `tools` capability flag via `GET /v1/models`. Key models that support tool calling:

- `gpt-4o`, `gpt-4.1`, `gpt-4.1-mini`
- `claude-sonnet-4-5`, `claude-haiku-4-5`, `claude-opus-4-5`
- `gemini-2.0-flash`, `gemini-2.5-pro`
- `deepseek-chat`, `deepseek-reasoner`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No `tool_calls` in response | Verify model supports tools; check `tools` schema is valid JSON Schema |
| `finish_reason` is `"stop"` not `"tool_calls"` | Model chose to answer directly — this is valid behavior |
| Tool arguments fail to parse | Ensure `"arguments"` is always a JSON string — parse with `json.loads()` |
