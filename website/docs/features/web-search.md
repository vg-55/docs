---
id: web-search
title: Web Search
sidebar_label: Web Search
sidebar_position: 6
---

# Web Search

Some models available through BluesMinds support live web search, allowing the model to retrieve up-to-date information before generating a response.

## Models with Web Search

Web search is available on select models that have built-in search capability or via tool-augmented search. Check the current model list:

```bash
curl https://api.bluesminds.com/v1/models \
  -H "Authorization: Bearer $BLUESMINDS_API_KEY"
```

Models known to support search include:
- `grok-3` (xAI — native web search)
- `gemini-2.0-flash` (Google — grounding with Google Search)
- Select search-augmented variants

## Using Search via Tool Calling

For models that don't have built-in search, you can implement web search as a tool:

```python
from openai import OpenAI
import json, requests

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="https://api.bluesminds.com/v1",
)

tools = [{
    "type": "function",
    "function": {
        "name": "web_search",
        "description": "Search the web for current information",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    }
}]

messages = [{"role": "user", "content": "What is the current price of Bitcoin?"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
)

msg = response.choices[0].message

if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    query = json.loads(tool_call.function.arguments)["query"]

    # Execute your search (e.g., using SerpAPI, Brave Search, etc.)
    search_result = your_search_function(query)

    messages.append(msg)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(search_result),
    })

    final = client.chat.completions.create(model="gpt-4o", messages=messages)
    print(final.choices[0].message.content)
```

## Using Grok with Native Search

`grok-3` has built-in web search that activates automatically for time-sensitive queries:

```json
{
  "model": "grok-3",
  "messages": [
    {"role": "user", "content": "What happened in the tech industry this week?"}
  ]
}
```

Grok will search the web and include sources in its response.

## Using Gemini with Google Grounding

When using Gemini models via the `/v1beta/models` path, Google Search grounding can be enabled. For the standard `/v1/chat/completions` endpoint, use Gemini's standard capabilities and supplement with tool-based search.

## Best Practices

- **Use search for time-sensitive queries** — LLMs have training cutoffs; search retrieves current info
- **Cite sources** — ask the model to include URLs from search results for verifiability
- **Rate limit awareness** — search tool calls count against your RPM limit
- **Cache common queries** — if many users ask the same question, cache search results to reduce latency and cost

## Limitations

- Native search is only available on specific models (Grok, Gemini variants)
- Tool-based search requires you to integrate a search API (SerpAPI, Brave, Bing, etc.)
- Search results are injected into the context window — very long results may exceed context limits
