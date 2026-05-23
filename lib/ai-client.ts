type AIMessage = {
  role: "system" | "user";
  content: string;
};

type AIChatCompletionResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAIChatCompletionResponse(
  value: unknown,
): value is AIChatCompletionResponse {
  if (!isRecord(value) || !Array.isArray(value.choices)) {
    return false;
  }

  return (
    value.choices.length > 0 &&
    value.choices.every((choice) => {
      if (!isRecord(choice) || !isRecord(choice.message)) {
        return false;
      }

      return typeof choice.message.content === "string";
    })
  );
}

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured");
  }

  const apiBaseUrl =
    process.env.AI_API_BASE_URL?.replace(/\/+$/, "") ??
    "https://api.openai.com";
  const model = process.env.AI_MODEL;

  if (!model) {
    throw new Error("AI_MODEL is not configured");
  }

  const messages: AIMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API request failed: ${response.status} ${errorText}`);
  }

  const payload: unknown = await response.json();

  if (!isAIChatCompletionResponse(payload)) {
    throw new Error("AI API returned an invalid chat completion response");
  }

  const content = payload.choices
    .map((choice) => choice.message.content.trim())
    .find((choiceContent) => choiceContent.length > 0);

  if (!content) {
    throw new Error("AI API returned an empty response");
  }

  return content;
}
