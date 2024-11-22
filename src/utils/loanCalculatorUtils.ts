import { LoanBreakdown, LoanRepaymentAnalysis } from "./data";

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
      month: 0,
      principal: loan,
      interest: 0,
      offsetBalance: startingOffsetBalance,
      // availableCash,
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
      month: months,
      principal: leftOver,
      interest: monthlyInterest,
      offsetBalance,
    });
  }

  return {
    loanBreakdowns,
    monthsRepayment,
    totalPayment,
    totalInterest,
  };
}
