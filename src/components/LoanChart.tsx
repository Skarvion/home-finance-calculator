import { LineChart } from "@mui/x-charts";
import { LoanRepaymentAnalysis } from "../utils/data";
import { useEffect, useState } from "react";
import { convertAnalysisFrequencyToYearly } from "../utils/loanCalculatorUtils";

export type LoanChartProps = {
  loanRepaymentAnalysis: LoanRepaymentAnalysis | null;
};

export default function LoanChart({
  loanRepaymentAnalysis,
}: Readonly<LoanChartProps>) {
  const [xAxisYear, setXAxisYear] = useState<number[]>([]);
  const [loanBalances, setLoanBalances] = useState<number[]>([]);
  const [offsetBalances, setOffsetBalances] = useState<number[]>([]);

  useEffect(() => {
    if (!loanRepaymentAnalysis) {
      return;
    }

    const yearlyAnalysis = convertAnalysisFrequencyToYearly(
      loanRepaymentAnalysis
    );

    const labels = Array.from(
      { length: yearlyAnalysis.totalTerms },
      (_, i) => i
    );
    const loanBalanceData = yearlyAnalysis.loanBreakdowns.map(
      (breakdown) => breakdown.principal
    );
    const offsetBalanceData = yearlyAnalysis.loanBreakdowns.map(
      (breakdown) => breakdown.offsetBalance
    );

    setXAxisYear(labels);
    setLoanBalances(loanBalanceData);
    setOffsetBalances(offsetBalanceData);
  }, [loanRepaymentAnalysis]);

  if (!loanRepaymentAnalysis) {
    return null;
  }

  return (
    <LineChart
      xAxis={[{ data: xAxisYear }]}
      series={[
        { data: loanBalances, label: "Loan Balance" },
        { data: offsetBalances, label: "Offset Balance" },
      ]}
      height={700}
      width={800}
    />
  );
}
