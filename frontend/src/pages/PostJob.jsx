import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import API from "../api/API";

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitJob = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        salary: form.salary ? Number(form.salary) : null,
      };

      const res = await API.post("/jobs", payload);

      if (res.data?.data?.prediction) {
        setPrediction(res.data.data.prediction);
        setOpenDialog(true);

        setForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          description: "",
        });
      } else {
        navigate("/recruiter");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card elevation={5}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Post New Job
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Fill in the job details. The AI will automatically analyse the job
            after submission.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={submitJob}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Salary"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Job Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? "Analysing with AI..." : "Post Job & Analyse"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          navigate("/recruiter");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Analysis Result</DialogTitle>

        <DialogContent dividers>
          {prediction && (
            <>
              <Typography variant="h6" gutterBottom>
                Verdict
              </Typography>

              <Chip
                label={prediction.final_verdict || "Unknown"}
                color={
                  prediction.final_verdict?.toLowerCase() === "legitimate"
                    ? "success"
                    : prediction.final_verdict?.toLowerCase() === "fake"
                    ? "error"
                    : "warning"
                }
                sx={{ mb: 3 }}
              />

              {prediction.ml_confidence !== undefined && (
                <Typography gutterBottom>
                  <strong>ML Confidence:</strong>{" "}
                  {Number(prediction.ml_confidence).toFixed(2)}%
                </Typography>
              )}

              <Typography gutterBottom>
                <strong>Risk Level:</strong>{" "}
                {prediction.risk_level || "N/A"}
              </Typography>

              <Typography gutterBottom>
                <strong>Trust Score:</strong>{" "}
                {prediction.trust_score ?? "N/A"}
              </Typography>

              <Typography sx={{ mt: 2, mb: 1 }}>
                <strong>Explanation</strong>
              </Typography>

              {Array.isArray(prediction.explanation) ? (
                prediction.explanation.map((item, index) => (
                  <Typography
                    key={index}
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    • {item}
                  </Typography>
                ))
              ) : (
                <Typography color="text.secondary">
                  {prediction.explanation || "No explanation available."}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              navigate("/recruiter");
            }}
            variant="contained"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}