import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

const rows = [
  {
    title: "Software Engineer",
    company: "Google",
    status: "Verified",
  },
  {
    title: "Frontend Developer",
    company: "Infosys",
    status: "Pending",
  },
  {
    title: "Backend Engineer",
    company: "Amazon",
    status: "Fake",
  },
  {
    title: "Data Analyst",
    company: "TCS",
    status: "Verified",
  },
];

const getColor = (status) => {
  switch (status) {
    case "Verified":
      return "success";
    case "Pending":
      return "warning";
    case "Fake":
      return "error";
    default:
      return "default";
  }
};

export default function RecentJobsTable() {
  return (
    <TableContainer component={Paper} sx={{ mt: 5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Job Title</b></TableCell>
            <TableCell><b>Company</b></TableCell>
            <TableCell><b>Status</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.company}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={getColor(row.status)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}