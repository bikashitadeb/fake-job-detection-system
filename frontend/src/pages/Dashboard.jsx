import { Grid, Typography } from "@mui/material";
import StatCard from "../components/StatCard";
import RecentJobsTable from "../components/RecentJobsTable";

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Recruiter Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Jobs Posted" value="42" color="#1976d2" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Applications" value="310" color="#2e7d32" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Fake Jobs Detected" value="7" color="#d32f2f" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending Reviews" value="15" color="#ed6c02" />
        </Grid>
      </Grid>

      <RecentJobsTable />
    </>
  );
}