import { useMemo, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  InputAdornment,
} from "@mui/material";
import {
  analyseLoanRepayment,
  calculateMinimumRepayment,
} from "./utils/loanCalculatorUtils";
import { formatToAud } from "./utils/currencyUtils";
import LoanBreakdownTable from "./components/LoanBreakdownTable";
import { LoanRepaymentAnalysis } from "./utils/data";
import { formatMonthsToStr } from "./utils/dateUtils";
import LoanChart from "./components/LoanChart";

const theme = createTheme({
  spacing: 8,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: "8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "8px",
        },
      },
    },
  },
});

const dollarSlotProps = {
  input: {
    startAdornment: <InputAdornment position="start">$</InputAdornment>,
  },
};

export default function LoanCalculator() {
  const [loan, setLoan] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [interestPayment, setInterestPayment] = useState<number>(0);
  const [additionalRepayment, setAdditionalRepayment] = useState<number>(0);
  const [startingOffsetBalance, setStartingOffsetBalance] = useState<number>(0);
  const [monthlyOffsetDeposit, setMonthlyOffsetDeposit] = useState<number>(0);
  const [offsetBalanceWhenFinish, setOffsetBalanceWhenFinish] =
    useState<number>(0);

  const [repaymentMonths, setRepaymentMonths] = useState<number>(0);

  const [loanRepaymentAnalysis, setLoanRepaymentAnalysis] =
    useState<LoanRepaymentAnalysis | null>(null);

  const minimumRepayment = useMemo(() => {
    return calculateMinimumRepayment(loan, interestRate, term * 12);
  }, [loan, interestRate, term]);

  const calculateLoan = () => {
    const analysis = analyseLoanRepayment(
      loan,
      interestRate,
      term * 12,
      minimumRepayment + additionalRepayment,
      startingOffsetBalance,
      monthlyOffsetDeposit
    );

    setLoanRepaymentAnalysis(analysis);
    setRepaymentMonths(analysis.repayment);
    setTotalPayment(analysis.totalPayment);
    setInterestPayment(analysis.totalInterest);

    setOffsetBalanceWhenFinish(
      analysis.loanBreakdowns.find((breakdown) => breakdown.principal === 0)
        ?.offsetBalance ?? 0
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Home Loan Calculator
        </Typography>
        <Box>
          <TextField
            label="Loan Amount"
            type="number"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            slotProps={dollarSlotProps}
            margin="normal"
          />
          <TextField
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            margin="normal"
          />
          <TextField
            label="Term (Years)"
            type="number"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            margin="normal"
          />
        </Box>
        <Box>
          <Typography variant="h6">
            Minimum Repayment {formatToAud(minimumRepayment)}
          </Typography>
          <TextField
            label="Additional Repayment"
            type="number"
            value={additionalRepayment}
            onChange={(e) => setAdditionalRepayment(Number(e.target.value))}
            slotProps={dollarSlotProps}
            margin="normal"
          />
          <Typography variant="h6" gutterBottom>
            Regular Repayment:{" "}
            {formatToAud(minimumRepayment + additionalRepayment)}
          </Typography>
          <TextField
            label="Starting Offset Balance"
            type="number"
            value={startingOffsetBalance}
            onChange={(e) => setStartingOffsetBalance(Number(e.target.value))}
            margin="normal"
          />
          <TextField
            label="Monthly Offset Deposit"
            type="number"
            value={monthlyOffsetDeposit}
            onChange={(e) => setMonthlyOffsetDeposit(Number(e.target.value))}
            slotProps={dollarSlotProps}
            margin="normal"
          />
        </Box>

        <Button variant="contained" color="primary" onClick={calculateLoan}>
          Calculate
        </Button>
        <Typography variant="h6" gutterBottom>
          Total Payment: {formatToAud(totalPayment)}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Interest Payment: {formatToAud(interestPayment)}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Finish Repayment in{" "}
          {formatMonthsToStr(repaymentMonths) +
            (repaymentMonths < term * 12
              ? ` (reduced by ${formatMonthsToStr(
                  term * 12 - repaymentMonths
                )})`
              : "")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Offset Balance when loan finished:{" "}
          {formatToAud(offsetBalanceWhenFinish)}
        </Typography>
        <Box display="flex" justifyContent="center">
          <LoanChart loanRepaymentAnalysis={loanRepaymentAnalysis} />
        </Box>
        <LoanBreakdownTable loanRepaymentAnalysis={loanRepaymentAnalysis} />
      </Container>
    </ThemeProvider>
  );
}
