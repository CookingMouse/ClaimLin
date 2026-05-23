import { ValuationResult } from "../types";

export function calculateValuation(
  sumInsured: number,
  actualRebuildCost: number,
  lossValue: number
): ValuationResult {
  const isUnderInsured = sumInsured < actualRebuildCost;
  const coverageRatio = sumInsured / actualRebuildCost;
  const acvPayout = isUnderInsured
    ? Math.round(lossValue * coverageRatio)
    : lossValue;
  const underinsuranceShortfall = lossValue - acvPayout;

  return {
    sumInsured,
    actualRebuildCost,
    lossValue,
    coverageRatio,
    isUnderInsured,
    acvPayout,
    underinsuranceShortfall,
    ledgerItems: [],
  };
}
