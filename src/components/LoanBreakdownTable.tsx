import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { LoanBreakdown } from "../utils/data";
import { formatToAud } from "../utils/currencyUtils";

export type LoanBreakdownTableProps = {
  loanBreakdowns: LoanBreakdown[];
};

export default function LoanBreakdownTable({
  loanBreakdowns,
}: Readonly<LoanBreakdownTableProps>) {
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
          {loanBreakdowns.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.month}</TableCell>
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
