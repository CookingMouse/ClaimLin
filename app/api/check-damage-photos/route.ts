import type { ApiResponse, DisasterType } from "@/types/index";

export const runtime = "nodejs";

export type PredictiveChip = {
  id: string;
  message: string;
  action: string;
};

type CheckDamagePhotosRequest = {
  photoCount: number;
  disasterType: DisasterType;
};

type CheckDamagePhotosResponse = {
  severity: string | null;
  chips: PredictiveChip[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDisasterType(value: unknown): value is DisasterType {
  return value === "fire" || value === "flood";
}

function parseRequestBody(value: unknown): CheckDamagePhotosRequest | null {
  if (
    !isRecord(value) ||
    typeof value.photoCount !== "number" ||
    !Number.isFinite(value.photoCount) ||
    value.photoCount < 0 ||
    !isDisasterType(value.disasterType)
  ) {
    return null;
  }

  return {
    photoCount: value.photoCount,
    disasterType: value.disasterType,
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

function evaluateDamagePhotos(
  input: CheckDamagePhotosRequest,
): CheckDamagePhotosResponse {
  if (input.photoCount === 0) {
    return {
      severity: null,
      chips: [],
    };
  }

  if (input.disasterType === "fire") {
    return {
      severity: "high",
      chips: [
        {
          id: "hvac",
          message: "I see heavy soot. Add HVAC cleaning to your claim.",
          action: "Add HVAC line item",
        },
        {
          id: "wiring",
          message:
            "Fire damage often hides wiring degradation behind walls.",
          action: "Request wiring inspection",
        },
      ],
    };
  }

  return {
    severity: "medium",
    chips: [
      {
        id: "mould",
        message:
          "Flood photos detected. Mould risk is high — add remediation.",
        action: "Add mould remediation",
      },
      {
        id: "subfloor",
        message: "Subfloor moisture damage is often missed by adjusters.",
        action: "Request subfloor inspection",
      },
    ],
  };
}

function badRequest(message: string): Response {
  const response: ApiResponse<CheckDamagePhotosResponse> = {
    error: message,
  };

  return Response.json(response, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  const requestBody = await readJson(request);
  const input = parseRequestBody(requestBody);

  if (!input) {
    return badRequest("Missing required fields: photoCount, disasterType");
  }

  const response: ApiResponse<CheckDamagePhotosResponse> = {
    data: evaluateDamagePhotos(input),
  };

  return Response.json(response);
}
