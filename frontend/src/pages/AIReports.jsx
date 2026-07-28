import {
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";

function AIReports() {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Detection Reports
      </Typography>

      <Typography sx={{ mt: 3 }}>
        Fake Job Probability
      </Typography>

      <LinearProgress
        variant="determinate"
        value={82}
        sx={{ height: 10, mt: 1 }}
      />

      <Typography sx={{ mt: 3 }}>
        Prediction: Fake Job
      </Typography>

      <Typography>
        Confidence: 82%
      </Typography>
    </Paper>
  );
}

export default AIReports;