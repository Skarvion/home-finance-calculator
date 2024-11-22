export type LoanBreakdown = {
  month: number;
  principal: number;
  interest: number;
  offsetBalance: number;
  // availableCash: number;
};

export type LoanRepaymentAnalysis = {
  loanBreakdowns: LoanBreakdown[];
  monthsRepayment: number;
  totalPayment: number;
  totalInterest: number;
};
