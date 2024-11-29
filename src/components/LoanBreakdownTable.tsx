import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
// import { LoanBreakdown, LoanRepaymentAnalysis } from "../utils/data";
import { formatToAud } from "../utils/currencyUtils";
import { LoanRepaymentAnalysis } from "../utils/data";

export type LoanBreakdownTableProps = {
  loanRepaymentAnalysis: LoanRepaymentAnalysis | null;
};

export default function LoanBreakdownTable({
  loanRepaymentAnalysis,
}: Readonly<LoanBreakdownTableProps>) {
  if (!loanRepaymentAnalysis) {
    return <Typography>No data</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Month</TableCell>
            <TableCell>Principal</TableCell>
            <TableCell>Interest</TableCell>
            <TableCell>Offset Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loanRepaymentAnalysis.loanBreakdowns.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.term}</TableCell>
              <TableCell>{formatToAud(row.principal)}</TableCell>
              <TableCell>{formatToAud(row.interest)}</TableCell>
              <TableCell>{formatToAud(row.offsetBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
