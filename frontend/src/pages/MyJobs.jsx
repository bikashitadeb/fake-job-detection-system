import { Paper, Typography } from "@mui/material";

export default function MyJobs() {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Jobs
      </Typography>

      <Typography color="text.secondary">
        Jobs posted by the recruiter will appear here.
      </Typography>
    </Paper>
  );
}