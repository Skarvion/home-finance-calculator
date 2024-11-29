import { LoanBreakdown, LoanRepaymentAnalysis } from "./data";
import { isTermFirstInAYear } from "./dateUtils";

export function calculateMinimumRepayment(
  loan: number,
  interestRate: number,
  termInMonths: number
): number {
  const monthlyInterestRate = interestRate / 100 / 12;
  if (monthlyInterestRate === 0) {
    return loan / termInMonths;
  }
  return (
    (loan * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -termInMonths))
  );
}

export function analyseLoanRepayment(
  loan: number,
  interestRate: number,
  termInMonths: number,
  monthlyRepayment: number,
  startingOffsetBalance: number,
  monthlyOffsetDeposit: number
): LoanRepaymentAnalysis {
  let leftOver = loan;
  let months = 0;
  let monthsRepayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let offsetBalance = startingOffsetBalance;

  const loanBreakdowns: LoanBreakdown[] = [
    {
      term: 0,
      principal: loan,
      interest: 0,
      offsetBalance: startingOffsetBalance,
    },
  ];

  for (let i = 0; i < termInMonths; i++) {
    let monthlyInterest = 0;
    let netPrincipalPayment = 0;
    offsetBalance += monthlyOffsetDeposit;

    if (leftOver > 0) {
      monthlyInterest =
        Math.max(leftOver - offsetBalance, 0) * (interestRate / 100 / 12);
      netPrincipalPayment = monthlyRepayment - monthlyInterest;
      leftOver -= netPrincipalPayment;
      leftOver = Math.max(leftOver, 0);
      totalPayment += monthlyRepayment;
      totalInterest += monthlyInterest;
      monthsRepayment++;
    }

    months++;
    loanBreakdowns.push({
      term: months,
      principal: leftOver,
      interest: monthlyInterest,
      offsetBalance,
    });
  }

  return {
    frequency: "monthly",
    totalTerms: termInMonths,
    loanBreakdowns,
    repayment: monthsRepayment,
    totalPayment,
    totalInterest,
  };
}

export function convertAnalysisFrequencyToYearly(
  loanRepaymentAnalysis: LoanRepaymentAnalysis
): LoanRepaymentAnalysis {
  if (loanRepaymentAnalysis.frequency === "yearly") {
    return loanRepaymentAnalysis;
  }

  const loanBreakdowns = loanRepaymentAnalysis.loanBreakdowns;
  const newLoanBreakdowns: LoanBreakdown[] = [];
  let yearlyTerm = 0;
  let accruedInterest = 0;

  for (let i = 0; i < loanBreakdowns.length; i++) {
    const loanBreakdown = loanBreakdowns[i];
    if (
      isTermFirstInAYear(loanBreakdown.term, loanRepaymentAnalysis.frequency)
    ) {
      newLoanBreakdowns.push({
        term: yearlyTerm,
        principal: loanBreakdown.principal,
        interest: accruedInterest,
        offsetBalance: loanBreakdown.offsetBalance,
      });
      yearlyTerm++;
      accruedInterest = 0;
    }
    accruedInterest += loanBreakdown.interest;
  }

  return {
    frequency: "yearly",
    totalTerms: yearlyTerm,
    loanBreakdowns: newLoanBreakdowns,
    repayment: loanRepaymentAnalysis.repayment,
    totalPayment: loanRepaymentAnalysis.totalPayment,
    totalInterest: loanRepaymentAnalysis.totalInterest,
  };
}
