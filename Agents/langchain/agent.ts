import { createAgent, tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

const agent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [getWeather],
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
  })
);

const out_json_ex = {
  messages: [
    HumanMessage {
      "id": "d56896a4-ff8b-4632-8dcc-f5fb387aac85",
      "content": "What's the weather in Tokyo?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "msg_202512251527112cc39037ec4d4455",
      "content": [
        {
          "type": "text",
          "text": "I'll check the current weather in Tokyo for you."
        },
        {
          "type": "tool_use",
          "id": "call_d09e0a7a7961441bb2832d48",
          "name": "get_weather",
          "input": {
            "city": "Tokyo"
          }
        }
      ],
      "name": "model",
      "additional_kwargs": {
        "id": "msg_202512251527112cc39037ec4d4455",
        "type": "message",
        "role": "assistant",
        "model": "glm-4.7",
        "stop_reason": "tool_use",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 185,
          "output_tokens": 23,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        }
      },
      "response_metadata": {
        "id": "msg_202512251527112cc39037ec4d4455",
        "model": "glm-4.7",
        "stop_reason": "tool_use",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 185,
          "output_tokens": 23,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        },
        "type": "message",
        "role": "assistant",
        "model_provider": "anthropic"
      },
      "tool_calls": [
        {
          "name": "get_weather",
          "args": {
            "city": "Tokyo"
          },
          "id": "call_d09e0a7a7961441bb2832d48",
          "type": "tool_call"
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 185,
        "output_tokens": 23,
        "total_tokens": 208,
        "input_token_details": {
          "cache_read": 0
        }
      }
    },
    ToolMessage {
      "id": "ac9cad74-1122-4dae-b555-2f2c5e37dce3",
      "content": "It's always sunny in Tokyo!",
      "name": "get_weather",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "call_d09e0a7a7961441bb2832d48"
    },
    AIMessage {
      "id": "msg_20251225152712a7664a18c5ba4c48",
      "content": "The weather in Tokyo is always sunny! 🌞",
      "name": "model",
      "additional_kwargs": {
        "id": "msg_20251225152712a7664a18c5ba4c48",
        "type": "message",
        "role": "assistant",
        "model": "glm-4.7",
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 219,
          "output_tokens": 12,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        }
      },
      "response_metadata": {
        "id": "msg_20251225152712a7664a18c5ba4c48",
        "model": "glm-4.7",
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 219,
          "output_tokens": 12,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        },
        "type": "message",
        "role": "assistant",
        "model_provider": "anthropic"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 219,
        "output_tokens": 12,
        "total_tokens": 231,
        "input_token_details": {
          "cache_read": 0
        }
      }
    }
  ]
}
/*
{
  messages: [
    HumanMessage {
      "id": "d56896a4-ff8b-4632-8dcc-f5fb387aac85",
      "content": "What's the weather in Tokyo?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "msg_202512251527112cc39037ec4d4455",
      "content": [
        {
          "type": "text",
          "text": "I'll check the current weather in Tokyo for you."
        },
        {
          "type": "tool_use",
          "id": "call_d09e0a7a7961441bb2832d48",
          "name": "get_weather",
          "input": {
            "city": "Tokyo"
          }
        }
      ],
      "name": "model",
      "additional_kwargs": {
        "id": "msg_202512251527112cc39037ec4d4455",
        "type": "message",
        "role": "assistant",
        "model": "glm-4.7",
        "stop_reason": "tool_use",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 185,
          "output_tokens": 23,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        }
      },
      "response_metadata": {
        "id": "msg_202512251527112cc39037ec4d4455",
        "model": "glm-4.7",
        "stop_reason": "tool_use",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 185,
          "output_tokens": 23,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        },
        "type": "message",
        "role": "assistant",
        "model_provider": "anthropic"
      },
      "tool_calls": [
        {
          "name": "get_weather",
          "args": {
            "city": "Tokyo"
          },
          "id": "call_d09e0a7a7961441bb2832d48",
          "type": "tool_call"
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 185,
        "output_tokens": 23,
        "total_tokens": 208,
        "input_token_details": {
          "cache_read": 0
        }
      }
    },
    ToolMessage {
      "id": "ac9cad74-1122-4dae-b555-2f2c5e37dce3",
      "content": "It's always sunny in Tokyo!",
      "name": "get_weather",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "call_d09e0a7a7961441bb2832d48"
    },
    AIMessage {
      "id": "msg_20251225152712a7664a18c5ba4c48",
      "content": "The weather in Tokyo is always sunny! 🌞",
      "name": "model",
      "additional_kwargs": {
        "id": "msg_20251225152712a7664a18c5ba4c48",
        "type": "message",
        "role": "assistant",
        "model": "glm-4.7",
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 219,
          "output_tokens": 12,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        }
      },
      "response_metadata": {
        "id": "msg_20251225152712a7664a18c5ba4c48",
        "model": "glm-4.7",
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {
          "input_tokens": 219,
          "output_tokens": 12,
          "cache_read_input_tokens": 0,
          "server_tool_use": {
            "web_search_requests": 0
          },
          "service_tier": "standard"
        },
        "type": "message",
        "role": "assistant",
        "model_provider": "anthropic"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 219,
        "output_tokens": 12,
        "total_tokens": 231,
        "input_token_details": {
          "cache_read": 0
        }
      }
    }
  ]
}
*/
