import { DEMO_CLAIM } from "@/lib/mock-data";
import {
  getMockHiddenDamages,
  getMockPolicyAnalysis,
} from "@/lib/mock-analysis";
import type {
  ApiResponse,
  Claim,
  HiddenDamageItem,
  PolicyAnalysis,
} from "@/types/index";

export const runtime = "nodejs";

type LoadDemoResponse = {
  claim: Claim;
  analysis: PolicyAnalysis;
  damages: HiddenDamageItem[];
};

export async function POST(): Promise<Response> {
  const response: ApiResponse<LoadDemoResponse> = {
    data: {
      claim: DEMO_CLAIM,
      analysis: getMockPolicyAnalysis(),
      damages: getMockHiddenDamages("fire"),
    },
    mock: true,
  };

  return Response.json(response);
}
