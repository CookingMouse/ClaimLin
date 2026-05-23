import { callAI } from "@/lib/ai-client";
import { MOCK_CHAT_RESPONSES } from "@/lib/mock-analysis";
import type { ApiResponse, ChatMessage } from "@/types/index";

export const runtime = "nodejs";

type ChatPolicyRequest = {
  question: string;
  policyText?: string;
};

type ChatPolicyResponse = {
  answer: string;
  citation: string;
};

const MOCK_CITATIONS: Record<string, string> = {
  flood: "Endorsement 113B - Flood",
  bomba: "Fire Safety Warranty - Commercial Premises",
  deductible: "Policy Schedule - Deductible",
  excess: "Policy Schedule - Excess",
  coverage: "Section 1, Section 2, and Endorsement 113B",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isChatPolicyResponse(value: unknown): value is ChatPolicyResponse {
  return (
    isRecord(value) &&
    typeof value.answer === "string" &&
    value.answer.trim().length > 0 &&
    typeof value.citation === "string" &&
    value.citation.trim().length > 0
  );
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("AI response did not contain a JSON object");
  }

  return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
}

function parseChatPolicyResponse(text: string): ChatPolicyResponse {
  const parsed = parseJsonObject(text);

  if (!isChatPolicyResponse(parsed)) {
    throw new Error("AI response did not match chat policy response");
  }

  return {
    answer: parsed.answer.trim(),
    citation: parsed.citation.trim(),
  };
}

function parseRequestBody(value: unknown): ChatPolicyRequest | null {
  if (!isRecord(value) || typeof value.question !== "string") {
    return null;
  }

  const question = value.question.trim();

  if (!question) {
    return null;
  }

  if (
    value.policyText !== undefined &&
    typeof value.policyText !== "string"
  ) {
    return null;
  }

  const policyText = value.policyText?.trim();

  return {
    question,
    ...(policyText ? { policyText } : {}),
  };
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    return null;
  }
}

function getMockChatResponse(question: string): ChatPolicyResponse {
  const normalizedQuestion = question.toLowerCase();
  const matchedKeyword =
    Object.keys(MOCK_CHAT_RESPONSES).find((keyword) =>
      normalizedQuestion.includes(keyword),
    ) ?? "coverage";

  return {
    answer:
      MOCK_CHAT_RESPONSES[matchedKeyword] ?? MOCK_CHAT_RESPONSES.coverage,
    citation: MOCK_CITATIONS[matchedKeyword] ?? MOCK_CITATIONS.coverage,
  };
}

function badRequest(message: string): Response {
  const response: ApiResponse<ChatPolicyResponse> = {
    error: message,
  };

  return Response.json(response, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  const requestBody = await readJson(request);
  const input = parseRequestBody(requestBody);

  if (!input) {
    return badRequest("Missing required field: question");
  }

  const userQuestion: ChatMessage = {
    sender: "user",
    text: input.question,
  };

  try {
    const aiResponse = await callAI(
      "You are a Malaysian insurance policy assistant. Answer in plain English and cite one specific clause or endorsement. Return only valid JSON matching this shape: { answer: string; citation: string; }.",
      `Policy text:\n${input.policyText ?? "No policy text provided."}\n\nQuestion:\n${userQuestion.text}`,
    );
    const answer = parseChatPolicyResponse(aiResponse);
    const response: ApiResponse<ChatPolicyResponse> = {
      data: answer,
    };

    return Response.json(response);
  } catch {
    const response: ApiResponse<ChatPolicyResponse> = {
      data: getMockChatResponse(userQuestion.text),
      mock: true,
    };

    return Response.json(response);
  }
}
