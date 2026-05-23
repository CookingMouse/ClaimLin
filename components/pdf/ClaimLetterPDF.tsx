import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  PropertyType,
  DisasterType,
  ValuationResult,
  PolicyAnalysis,
} from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: "2pt solid #7C3AED",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  logo: {
    fontSize: 16,
    fontWeight: "heavy",
    color: "#7C3AED",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7C3AED",
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottom: "1pt solid #F3E8FF",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: "#64748B",
  },
  value: {
    fontSize: 10,
    color: "#0F172A",
    fontWeight: "bold",
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  payoutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C3AED",
    textAlign: "right",
    marginTop: 8,
  },
  shortfallText: {
    fontSize: 9,
    color: "#EF4444",
    textAlign: "right",
    fontWeight: "bold",
  },
  coverageItem: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 3,
  },
  demandStatement: {
    fontSize: 11,
    color: "#1E293B",
    marginTop: 20,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94A3B8",
    borderTop: "1pt solid #F1F5F9",
    paddingTop: 10,
  },
});

interface ClaimLetterPDFProps {
  propertyType: PropertyType;
  disasterType: DisasterType;
  valuation: ValuationResult;
  policyAnalysis: PolicyAnalysis | null;
}

const ClaimLetterPDF: React.FC<ClaimLetterPDFProps> = ({
  propertyType,
  disasterType,
  valuation,
  policyAnalysis,
}) => {
  const date = new Date().toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FORMAL CLAIM SUBMISSION</Text>
          <Text style={styles.logo}>ClaimLin</Text>
        </View>

        {/* Section 1: Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Property & Incident Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Property Type:</Text>
            <Text style={styles.value}>{propertyType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Incident Type:</Text>
            <Text style={styles.value}>{disasterType.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Submission Date:</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        {/* Section 2: Valuation Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Valuation Audit Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Sum Insured Cap:</Text>
              <Text style={styles.value}>RM {valuation.sumInsured.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Est. Rebuild Cost:</Text>
              <Text style={styles.value}>RM {valuation.actualRebuildCost.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Calculated Physical Loss:</Text>
              <Text style={styles.value}>RM {valuation.lossValue.toLocaleString()}</Text>
            </View>
            
            <Text style={styles.payoutText}>
              Demanded ACV Settlement: RM {valuation.acvPayout.toLocaleString()}
            </Text>
            {valuation.isUnderInsured && (
              <Text style={styles.shortfallText}>
                * Underinsurance Shortfall: RM {valuation.underinsuranceShortfall.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Section 3: Policy Coverage Summary */}
        {policyAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Policy Coverage Compliance</Text>
            {policyAnalysis.coverageItems.map((item, idx) => (
              <Text key={idx} style={styles.coverageItem}>
                • {item.label}: {item.detail} ({item.clause})
              </Text>
            ))}
          </View>
        )}

        {/* Section 4: Demand Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Formal Demand</Text>
          <Text style={styles.demandStatement}>
            Based on the independent audit provided by the ClaimLin advocate platform, we formally submit this claim for the above-listed property. The valuation reflects current market reconstruction rates and strictly adheres to the terms outlined in the policy schedule. We demand the release of the ACV settlement as calculated.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by ClaimLin — AI-Powered Claims Advocate. Internal Reference: CL-2026-PDF
        </Text>
      </Page>
    </Document>
  );
};

export default ClaimLetterPDF;
