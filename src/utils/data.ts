export type Frequency = "yearly" | "monthly" | "fortnightly" | "weekly";

export type LoanBreakdown = {
  term: number;
  principal: number;
  interest: number;
  offsetBalance: number;
};

export type LoanRepaymentAnalysis = {
  totalTerms: number;
  frequency: Frequency;
  loanBreakdowns: LoanBreakdown[];
  repayment: number;
  totalPayment: number;
  totalInterest: number;
};
