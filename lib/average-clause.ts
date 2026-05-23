import type { ValuationResult } from "../types/index";

export function calculateValuation(
  sumInsured: number,
  rebuildCost: number,
  lossValue: number,
): ValuationResult {
  const coverageRatio = rebuildCost > 0 ? sumInsured / rebuildCost : 0;
  const isUnderInsured = rebuildCost > 0 && sumInsured < rebuildCost;
  const calculatedPayout = isUnderInsured
    ? coverageRatio * lossValue
    : lossValue;
  const acvPayout = Math.min(calculatedPayout, lossValue);
  const underinsuranceShortfall = isUnderInsured
    ? lossValue - acvPayout
    : 0;

  return {
    sumInsured,
    actualRebuildCost: rebuildCost,
    lossValue,
    coverageRatio,
    isUnderInsured,
    acvPayout,
    underinsuranceShortfall,
    ledgerItems: [],
  };
}
