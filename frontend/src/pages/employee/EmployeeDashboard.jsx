
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import {
  AssignmentOutlined,
  ArrowForwardRounded,
  BusinessRounded,
  CheckCircleOutlineRounded,
  ClearRounded,
  LocationOnOutlined,
  RefreshRounded,
  SearchRounded,
  SecurityRounded,
  ShieldOutlined,
  WorkOutlineRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import {
  getJobs,
  getApplications,
  getProfile,
} from "../../api/Dashboard";
import API from "../../api/API";

const getPayload = (response) => response?.data ?? response ?? {};

const getList = (response, key) => {
  const payload = getPayload(response);
  const list = Array.isArray(payload)
    ? payload
    : payload?.[key] ?? payload?.data?.[key] ?? [];
  return Array.isArray(list) ? list : [];
};

const getJobId = (job) => job?.id ?? job?.job_id;

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("jobs");
  const [applyingJob, setApplyingJob] = useState(null);

  const loadDashboard = useCallback(async (showLoader = false) => {
    if (showLoader) setRefreshing(true);
    setError("");

    try {
      const [profileResult, jobsResult, applicationsResult] =
        await Promise.allSettled([
          getProfile(),
          getJobs(),
          getApplications(),
        ]);

      if (profileResult.status === "fulfilled") {
        const data = getPayload(profileResult.value);
        setUser(data?.user ?? data?.profile ?? data);
      }

      if (jobsResult.status === "fulfilled") {
        setJobs(getList(jobsResult.value, "jobs"));
      } else {
        console.error("Unable to load jobs:", jobsResult.reason);
        setError("We couldn't load jobs. Please try refreshing.");
      }

      if (applicationsResult.status === "fulfilled") {
        const list = getList(applicationsResult.value, "applications");
        setApplications(list);
        setAppliedJobs(
          list
            .map((app) => app.job_id ?? app.job?.id)
            .filter((id) => id !== undefined && id !== null)
        );
      } else {
        console.error(
          "Unable to load applications:",
          applicationsResult.reason
        );
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while loading your dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const applyJob = async (jobId) => {
    if (jobId == null) return;

    setError("");
    setApplyingJob(jobId);

    try {
      await API.post(`/applications/${jobId}/apply`, {
        cover_letter: "",
        resume_url: "",
      });

      setAppliedJobs((current) =>
        current.some((id) => String(id) === String(jobId))
          ? current
          : [...current, jobId]
      );

      await loadDashboard();
    } catch (err) {
      console.error("Application error:", err);
      setError(
        err?.response?.data?.message ||
          "Your application couldn't be submitted. Please try again."
      );
    } finally {
      setApplyingJob(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const company = job.company_name ?? job.company?.name ?? "";

    const matchesSearch =
      !query ||
      String(job.title ?? "").toLowerCase().includes(query) ||
      String(company).toLowerCase().includes(query) ||
      String(job.location ?? "").toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (filter === "verified") return Boolean(job.linkedin_verified);
    if (filter === "suspicious") return Boolean(job.is_fake_predicted);
    return true;
  });

  const verifiedCount = jobs.filter((job) => job.linkedin_verified).length;
  const suspiciousCount = jobs.filter((job) => job.is_fake_predicted).length;

  const stats = [
    {
      title: "Available jobs",
      value: jobs.length,
      note: "Explore opportunities",
      icon: <WorkOutlineRounded />,
      tone: "violet",
      action: () => {
        setActiveSection("jobs");
        setFilter("all");
      },
    },
    {
      title: "Verified jobs",
      value: verifiedCount,
      note: "LinkedIn-verified listings",
      icon: <CheckCircleOutlineRounded />,
      tone: "green",
      action: () => {
        setActiveSection("jobs");
        setFilter("verified");
      },
    },
    {
      title: "Suspicious jobs",
      value: suspiciousCount,
      note: "Listings to review carefully",
      icon: <WarningAmberRounded />,
      tone: "red",
      action: () => {
        setActiveSection("jobs");
        setFilter("suspicious");
      },
    },
    {
      title: "Applications",
      value: applications.length,
      note: "Track your applications",
      icon: <AssignmentOutlined />,
      tone: "blue",
      action: () => setActiveSection("applications"),
    },
  ];

  if (loading) {
    return (
      <Box sx={loadingStyle}>
        <Box sx={loadingIcon}>
          <ShieldOutlined sx={{ fontSize: 42 }} />
        </Box>
        <CircularProgress size={26} sx={{ color: "#a78bfa", mt: 3 }} />
        <Typography sx={{ mt: 2, fontWeight: 700, fontSize: 18 }}>
          Preparing your workspace
        </Typography>
        <Typography sx={{ mt: 0.75, color: "#8f9bb3", fontSize: 13 }}>
          Loading your jobs and applications
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageStyle}>
      <Box sx={ambientGlow} />

      <Box sx={contentStyle}>
        {/* Breadcrumb and page actions */}
        <Box sx={topbar}>
          <Box>
            <Typography sx={eyebrow}>
              FAKEGUARD AI <Box component="span" sx={eyebrowDot} /> EMPLOYEE
              WORKSPACE
            </Typography>
            <Typography sx={breadcrumb}>
              Dashboard <Box component="span" sx={{ color: "#69758d" }}> / Overview</Box>
            </Typography>
          </Box>

          <Button
            startIcon={
              refreshing ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <RefreshRounded />
              )
            }
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            sx={refreshButton}
          >
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </Box>

        {/* Welcome banner */}
        <Box sx={welcomePanel}>
          <Box sx={welcomeCopy}>
            <Box sx={welcomeBadge}>
              <ShieldOutlined sx={{ fontSize: 15 }} />
              <Typography component="span">YOUR CAREER, PROTECTED</Typography>
            </Box>

            <Typography component="h1" sx={welcomeTitle}>
              Welcome back,{" "}
              <Box component="span" sx={gradientText}>
                {user?.name?.trim()?.split(/\s+/)[0] || "there"}.
              </Box>
            </Typography>

            <Typography sx={welcomeDescription}>
              Find your next opportunity with AI-powered job risk insights.
              Make your next career move with more confidence.
            </Typography>

            <Box sx={welcomeActions}>
              <Button
                onClick={() => {
                  setActiveSection("jobs");
                  setFilter("all");
                  document
                    .getElementById("job-discovery")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                endIcon={<ArrowForwardRounded />}
                sx={primaryButton}
              >
                Explore opportunities
              </Button>

              <Typography sx={secureNote}>
                <SecurityRounded sx={{ fontSize: 15 }} />
                AI-assisted job screening
              </Typography>
            </Box>
          </Box>

          <Box sx={heroArtwork} aria-hidden="true">
            <Box sx={orbitOuter} />
            <Box sx={orbitInner} />
            <Box sx={heroShield}>
              <ShieldOutlined sx={{ fontSize: 66 }} />
            </Box>
            <Box sx={heroStatus}>
              <Box sx={statusDot} />
              <Typography component="span">TRUST FIRST</Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={errorAlert}
          >
            {error}
          </Alert>
        )}

        {/* Dashboard metrics */}
        <Box sx={sectionHeading}>
          <Box>
            <Typography sx={sectionEyebrow}>YOUR ACTIVITY</Typography>
            <Typography component="h2" sx={sectionTitle}>
              At a glance
            </Typography>
          </Box>
          <Typography sx={sectionCaption}>
            Live counts from your workspace
          </Typography>
        </Box>

        <Box sx={statsGrid}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              style={{ minWidth: 0 }}
            >
              <Card
                component="button"
                type="button"
                onClick={stat.action}
                sx={{
                  ...statCard,
                  "--tone": tones[stat.tone].color,
                  "--tone-bg": tones[stat.tone].background,
                }}
              >
                <Box sx={statTop}>
                  <Box sx={statIcon}>{stat.icon}</Box>
                  <ArrowForwardRounded sx={statArrow} />
                </Box>

                <Typography sx={statLabel}>{stat.title}</Typography>
                <Typography sx={statValue}>{stat.value}</Typography>
                <Typography sx={statNote}>{stat.note}</Typography>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Job discovery */}
        {activeSection === "jobs" && (
          <Box id="job-discovery" sx={{ mt: 5, scrollMarginTop: 24 }}>
            <Box sx={sectionHeading}>
              <Box>
                <Typography sx={sectionEyebrow}>FIND YOUR NEXT MOVE</Typography>
                <Typography component="h2" sx={sectionTitle}>
                  Job discovery
                </Typography>
                <Typography sx={sectionCaption}>
                  Search listings and review their AI trust signals.
                </Typography>
              </Box>
              <Chip
                label={`${filteredJobs.length} results`}
                sx={resultsChip}
              />
            </Box>

            <Card sx={searchPanel}>
              <TextField
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by role, company, or location..."
                inputProps={{ "aria-label": "Search jobs" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ color: "#8e9bb5" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <Button
                        aria-label="Clear search"
                        onClick={() => setSearch("")}
                        sx={{ minWidth: 34, color: "#9aa6bd" }}
                      >
                        <ClearRounded fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ) : null,
                }}
                sx={searchField}
              />

              <Box sx={filterBar}>
                <Typography sx={filterLabel}>FILTER BY</Typography>
                {[
                  { label: "All jobs", value: "all" },
                  { label: "Verified", value: "verified" },
                  { label: "Suspicious", value: "suspicious" },
                ].map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    sx={{
                      ...filterButton,
                      ...(filter === item.value ? activeFilter : {}),
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Card>

            {filteredJobs.length === 0 ? (
              <Card sx={emptyState}>
                <Box sx={emptyIcon}>
                  <SearchRounded sx={{ fontSize: 30 }} />
                </Box>
                <Typography sx={emptyTitle}>
                  {jobs.length === 0
                    ? "No job listings yet"
                    : "No matching opportunities"}
                </Typography>
                <Typography sx={emptyDescription}>
                  {jobs.length === 0
                    ? "When the server returns available jobs, they will appear here."
                    : "Try a different search term or select another filter."}
                </Typography>
                {(search || filter !== "all") && (
                  <Button
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    sx={{ ...filterButton, mt: 2 }}
                  >
                    Clear filters
                  </Button>
                )}
              </Card>
            ) : (
              <Box sx={jobsGrid}>
                {filteredJobs.map((job, index) => {
                  const id = getJobId(job);
                  const isApplied = appliedJobs.some(
                    (appliedId) => String(appliedId) === String(id)
                  );
                  const isSuspicious = Boolean(job.is_fake_predicted);
                  const trust = Math.min(
                    100,
                    Math.max(0, Number(job.trust_score) || 0)
                  );
                  const risk = Math.min(
                    100,
                    Math.max(0, Number(job.fake_probability) || 0)
                  );

                  return (
                    <motion.div
                      key={id ?? `${job.title}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.25) }}
                      style={{ minWidth: 0, height: "100%" }}
                    >
                      <Card sx={jobCard}>
                        <Box sx={jobCardTop}>
                          <Box sx={companyMark}>
                            <BusinessRounded sx={{ fontSize: 23 }} />
                          </Box>
                          <Chip
                            size="small"
                            icon={
                              isSuspicious ? (
                                <WarningAmberRounded />
                              ) : (
                                <SecurityRounded />
                              )
                            }
                            label={isSuspicious ? "Review recommended" : "AI screened"}
                            sx={{
                              ...trustChip,
                              color: isSuspicious ? "#fca5a5" : "#86efac",
                              background: isSuspicious
                                ? "rgba(248,113,113,.08)"
                                : "rgba(74,222,128,.08)",
                            }}
                          />
                        </Box>

                        <Typography component="h3" sx={jobTitle}>
                          {job.title || "Untitled position"}
                        </Typography>

                        <Typography sx={companyName}>
                          {job.company_name ?? job.company?.name ?? "Company not specified"}
                        </Typography>

                        <Box sx={jobMetaRow}>
                          <LocationOnOutlined sx={{ fontSize: 17 }} />
                          <Typography component="span">
                            {job.location || "Location not specified"}
                          </Typography>
                        </Box>

                        {job.job_type && (
                          <Box sx={{ mt: 1.5 }}>
                            <Chip label={job.job_type} size="small" sx={jobTypeChip} />
                          </Box>
                        )}

                        <Box sx={trustPanel}>
                          <Box sx={trustHeading}>
                            <Typography sx={trustLabel}>
                              AI trust score
                            </Typography>
                            <Typography
                              sx={{
                                ...trustPercentage,
                                color: isSuspicious ? "#fca5a5" : "#86efac",
                              }}
                            >
                              {trust}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={trust}
                            sx={{
                              ...trustProgress,
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 10,
                                background: isSuspicious
                                  ? "#f87171"
                                  : "linear-gradient(90deg,#34d399,#22d3ee)",
                              },
                            }}
                          />
                          <Typography sx={trustFootnote}>
                            {isSuspicious
                              ? `Estimated fraud probability: ${risk}%`
                              : "Screening signal, not a guarantee"}
                          </Typography>
                        </Box>

                        {job.linkedin_verified && (
                          <Chip
                            icon={<CheckCircleOutlineRounded />}
                            label="LinkedIn verified"
                            size="small"
                            sx={verifiedChip}
                          />
                        )}

                        {job.ai_explanation && (
                          <Typography sx={aiExplanation}>
                            <SecurityRounded sx={{ fontSize: 16, flexShrink: 0 }} />
                            {job.ai_explanation}
                          </Typography>
                        )}

                        <Box sx={{ flexGrow: 1, minHeight: 22 }} />

                        <Button
                          fullWidth
                          disabled={isApplied || applyingJob === id || id == null}
                          onClick={() => applyJob(id)}
                          endIcon={
                            applyingJob === id ? null : <ArrowForwardRounded />
                          }
                          sx={applyButton}
                        >
                          {applyingJob === id ? (
                            <CircularProgress size={19} color="inherit" />
                          ) : isApplied ? (
                            "Application submitted"
                          ) : (
                            "View & apply"
                          )}
                        </Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Applications */}
        {activeSection === "applications" && (
          <Box sx={{ mt: 5 }}>
            <Box sx={sectionHeading}>
              <Box>
                <Typography sx={sectionEyebrow}>YOUR CAREER JOURNEY</Typography>
                <Typography component="h2" sx={sectionTitle}>
                  My applications
                </Typography>
                <Typography sx={sectionCaption}>
                  Keep track of the jobs you have applied for.
                </Typography>
              </Box>
              <Button
                onClick={() => setActiveSection("jobs")}
                endIcon={<ArrowForwardRounded />}
                sx={primaryButton}
              >
                Find jobs
              </Button>
            </Box>

            {applications.length === 0 ? (
              <Card sx={emptyState}>
                <Box sx={emptyIcon}>
                  <AssignmentOutlined sx={{ fontSize: 30 }} />
                </Box>
                <Typography sx={emptyTitle}>
                  Your journey starts here
                </Typography>
                <Typography sx={emptyDescription}>
                  Your submitted applications will appear in this section.
                </Typography>
                <Button
                  onClick={() => setActiveSection("jobs")}
                  sx={{ ...primaryButton, mt: 2 }}
                >
                  Explore jobs
                </Button>
              </Card>
            ) : (
              <Box sx={jobsGrid}>
                {applications.map((app) => {
                  const job = jobs.find(
                    (item) =>
                      String(getJobId(item)) === String(app.job_id)
                  );

                  return (
                    <Card key={app.id ?? app.job_id} sx={applicationCard}>
                      <Box sx={jobCardTop}>
                        <Box sx={companyMark}>
                          <AssignmentOutlined />
                        </Box>
                        <Chip
                          size="small"
                          label={app.status || "Pending"}
                          sx={resultsChip}
                        />
                      </Box>
                      <Typography sx={jobTitle}>
                        {job?.title || app.job_title || "Job application"}
                      </Typography>
                      <Typography sx={companyName}>
                        {job?.company_name || app.company_name || "Company"}
                      </Typography>
                      {app.applied_at && (
                        <Typography sx={trustFootnote}>
                          Applied on{" "}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        <Box sx={footer}>
          <Box sx={footerBrand}>
            <ShieldOutlined sx={{ fontSize: 17 }} />
            <Typography component="span">FAKEGUARD AI</Typography>
          </Box>
          <Typography sx={footerText}>
            AI-assisted screening. Informed career decisions.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const tones = {
  violet: { color: "#b69aff", background: "rgba(139,92,246,.13)" },
  green: { color: "#6ee7b7", background: "rgba(16,185,129,.12)" },
  red: { color: "#fca5a5", background: "rgba(248,113,113,.12)" },
  blue: { color: "#7dd3fc", background: "rgba(56,189,248,.12)" },
};

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  boxSizing: "border-box",
  position: "relative",
  isolation: "isolate",
  overflowX: "clip",
  padding: { xs: 2, sm: 3, md: 4 },
  color: "#edf2ff",
  background: "#090d19",
  fontFamily: '"Inter", "Roboto", sans-serif',
  "& *": { boxSizing: "border-box" },
  "& ::selection": {
    background: "rgba(139,92,246,.4)",
    color: "#fff",
  },
};

const contentStyle = {
  width: "100%",
  maxWidth: 1600,
  mx: "auto",
  position: "relative",
  zIndex: 1,
};

const loadingStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#edf2ff",
  background: "#090d19",
};

const ambientGlow = {
  position: "absolute",
  zIndex: -1,
  pointerEvents: "none",
  top: -180,
  left: "20%",
  width: 600,
  height: 500,
  borderRadius: "50%",
  background: "rgba(91,64,196,.18)",
  filter: "blur(120px)",
};

const loadingIcon = {
  width: 82,
  height: 82,
  display: "grid",
  placeItems: "center",
  borderRadius: 4,
  color: "#c4b5fd",
  background: "rgba(139,92,246,.13)",
  border: "1px solid rgba(167,139,250,.25)",
};

const topbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  pb: 3,
  mb: 3,
  borderBottom: "1px solid rgba(148,163,184,.13)",
};

const eyebrow = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  color: "#a5b0c7",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "1.7px",
};

const eyebrowDot = {
  display: "inline-block",
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#a78bfa",
};

const breadcrumb = {
  mt: 1,
  fontSize: 13,
  fontWeight: 700,
  color: "#e2e8f0",
};

const refreshButton = {
  border: "1px solid rgba(148,163,184,.22)",
  borderRadius: 2,
  px: 2,
  py: 1,
  color: "#dbe4f5",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "none",
  "&:hover": { background: "rgba(255,255,255,.05)" },
};

const welcomePanel = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 3,
  position: "relative",
  overflow: "hidden",
  minHeight: { xs: 300, md: 290 },
  p: { xs: 3, sm: 4, md: 5 },
  borderRadius: 4,
  border: "1px solid rgba(167,139,250,.2)",
  background:
    "linear-gradient(115deg,rgba(76,51,151,.28),rgba(20,28,49,.88) 65%,rgba(17,24,39,.95))",
  boxShadow: "0 22px 60px rgba(0,0,0,.18)",
};

const welcomeCopy = { maxWidth: 760, position: "relative", zIndex: 1 };

const welcomeBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 1.4,
  py: 0.8,
  mb: 2.5,
  borderRadius: 1.5,
  color: "#c4b5fd",
  background: "rgba(139,92,246,.12)",
  border: "1px solid rgba(167,139,250,.2)",
  "& span": {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "1.2px",
  },
};

const welcomeTitle = {
  fontSize: { xs: 30, sm: 39, md: 48 },
  fontWeight: 850,
  lineHeight: 1.17,
  letterSpacing: "-1.7px",
  overflowWrap: "anywhere",
};

const gradientText = {
  background: "linear-gradient(90deg,#c4b5fd,#93c5fd)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const welcomeDescription = {
  maxWidth: 620,
  mt: 2,
  color: "#a8b3c9",
  fontSize: { xs: 13, sm: 14 },
  lineHeight: 1.9,
};

const welcomeActions = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2.5,
  mt: 3,
};

const primaryButton = {
  px: 2.3,
  py: 1.2,
  borderRadius: 2,
  color: "#fff",
  background: "linear-gradient(100deg,#8054e9,#5269e8)",
  textTransform: "none",
  fontSize: 12,
  fontWeight: 800,
  boxShadow: "0 8px 22px rgba(100,75,220,.22)",
  "&:hover": {
    background: "linear-gradient(100deg,#7043d8,#4359d6)",
  },
};

const secureNote = {
  display: "flex",
  alignItems: "center",
  gap: 0.7,
  color: "#a5b0c7",
  fontSize: 11,
};

const heroArtwork = {
  position: "relative",
  display: { xs: "none", md: "grid" },
  placeItems: "center",
  flexShrink: 0,
  width: 260,
  height: 220,
  mr: 2,
};

const orbitOuter = {
  position: "absolute",
  width: 215,
  height: 215,
  borderRadius: "50%",
  border: "1px solid rgba(167,139,250,.16)",
  boxShadow: "0 0 60px rgba(124,58,237,.08)",
};

const orbitInner = {
  position: "absolute",
  width: 160,
  height: 160,
  borderRadius: "50%",
  border: "1px dashed rgba(167,139,250,.3)",
};

const heroShield = {
  width: 116,
  height: 116,
  display: "grid",
  placeItems: "center",
  borderRadius: 5,
  color: "#d8ccff",
  background:
    "linear-gradient(145deg,rgba(139,92,246,.3),rgba(59,130,246,.12))",
  border: "1px solid rgba(196,181,253,.35)",
  boxShadow: "0 0 65px rgba(124,58,237,.22)",
};

const heroStatus = {
  position: "absolute",
  bottom: 0,
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.9,
  borderRadius: 2,
  background: "#141c2e",
  border: "1px solid rgba(148,163,184,.2)",
  "& span": {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "1px",
  },
};

const statusDot = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "#6ee7b7",
  boxShadow: "0 0 10px #34d399",
};

const errorAlert = {
  mt: 3,
  borderRadius: 2,
  position: "relative",
  zIndex: 1,
};

const sectionHeading = {
  display: "flex",
  alignItems: { xs: "flex-start", sm: "flex-end" },
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 2,
  mt: 4,
  mb: 2.5,
};

const sectionEyebrow = {
  color: "#8e9bb5",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "1.7px",
};

const sectionTitle = {
  mt: 0.6,
  fontSize: { xs: 24, sm: 29 },
  lineHeight: 1.3,
  fontWeight: 850,
  letterSpacing: "-.7px",
};

const sectionCaption = {
  mt: 0.8,
  color: "#8e9bb5",
  fontSize: 12,
  lineHeight: 1.7,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(1,minmax(0,1fr))",
    sm: "repeat(2,minmax(0,1fr))",
    lg: "repeat(4,minmax(0,1fr))",
  },
  gap: 2,
  width: "100%",
};

const statCard = {
  display: "block",
  width: "100%",
  minWidth: 0,
  p: 2.5,
  textAlign: "left",
  borderRadius: 3,
  color: "#edf2ff",
  cursor: "pointer",
  background: "linear-gradient(145deg,#141c2d,#101626)",
  border: "1px solid rgba(148,163,184,.15)",
  boxShadow: "0 10px 28px rgba(0,0,0,.12)",
  transition: "transform .2s ease,border-color .2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    borderColor: "var(--tone)",
  },
};

const statTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 2.3,
};

const statIcon = {
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  borderRadius: 2,
  color: "var(--tone)",
  background: "var(--tone-bg)",
  "& svg": { fontSize: 22 },
};

const statArrow = {
  color: "#65718a",
  fontSize: 18,
};

const statLabel = {
  color: "#a5b0c7",
  fontSize: 12,
  fontWeight: 600,
};

const statValue = {
  mt: 0.8,
  fontSize: 34,
  lineHeight: 1.2,
  fontWeight: 850,
  letterSpacing: "-1px",
};

const statNote = {
  mt: 1.2,
  color: "#7e8aa4",
  fontSize: 11,
  lineHeight: 1.5,
};

const resultsChip = {
  color: "#c4b5fd",
  background: "rgba(139,92,246,.1)",
  border: "1px solid rgba(167,139,250,.2)",
  fontSize: 11,
  fontWeight: 700,
};

const searchPanel = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: 3,
  background: "#111827",
  border: "1px solid rgba(148,163,184,.15)",
  boxShadow: "0 12px 35px rgba(0,0,0,.12)",
};

const searchField = {
  "& .MuiOutlinedInput-root": {
    minHeight: 51,
    borderRadius: 2,
    color: "#edf2ff",
    background: "rgba(255,255,255,.025)",
    "& fieldset": { borderColor: "rgba(148,163,184,.2)" },
    "&:hover fieldset": { borderColor: "rgba(167,139,250,.5)" },
    "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
  },
  "& input": { fontSize: 13, userSelect: "text" },
  "& input::placeholder": { color: "#7e8aa4", opacity: 1 },
};

const filterBar = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  mt: 2,
  pt: 2,
  borderTop: "1px solid rgba(148,163,184,.12)",
};

const filterLabel = {
  mr: 0.5,
  color: "#77849e",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "1.4px",
};

const filterButton = {
  minHeight: 34,
  px: 1.6,
  borderRadius: 1.7,
  border: "1px solid rgba(148,163,184,.18)",
  color: "#aeb9cf",
  background: "transparent",
  textTransform: "none",
  fontSize: 11,
  fontWeight: 700,
  "&:hover": {
    color: "#edf2ff",
    background: "rgba(139,92,246,.08)",
    borderColor: "rgba(167,139,250,.4)",
  },
};

const activeFilter = {
  color: "#e9ddff",
  background: "rgba(139,92,246,.16)",
  borderColor: "rgba(167,139,250,.55)",
  "&:hover": {
    background: "rgba(139,92,246,.23)",
  },
};

const jobsGrid = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0,1fr)",
    md: "repeat(2,minmax(0,1fr))",
    xl: "repeat(3,minmax(0,1fr))",
  },
  alignItems: "stretch",
  gap: 2,
  width: "100%",
};

const jobCard = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minWidth: 0,
  p: { xs: 2.2, sm: 2.6 },
  borderRadius: 3,
  color: "#edf2ff",
  background: "linear-gradient(145deg,#141c2d,#101626)",
  border: "1px solid rgba(148,163,184,.15)",
  boxShadow: "0 14px 36px rgba(0,0,0,.14)",
  transition: "border-color .2s ease,transform .2s ease",
  "&:hover": {
    borderColor: "rgba(167,139,250,.38)",
  },
};

const jobCardTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  flexWrap: "wrap",
  mb: 2.3,
};

const companyMark = {
  width: 44,
  height: 44,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  borderRadius: 2,
  color: "#c4b5fd",
  background: "rgba(139,92,246,.12)",
  border: "1px solid rgba(167,139,250,.16)",
};

const trustChip = {
  maxWidth: "100%",
  border: "1px solid rgba(148,163,184,.16)",
  "& .MuiChip-label": { fontSize: 9, fontWeight: 800 },
  "& .MuiChip-icon": { fontSize: 14 },
};

const jobTitle = {
  fontSize: 19,
  fontWeight: 800,
  lineHeight: 1.4,
  letterSpacing: "-.3px",
  overflowWrap: "anywhere",
};

const companyName = {
  mt: 0.8,
  color: "#a5b0c7",
  fontSize: 12,
  overflowWrap: "anywhere",
};

const jobMetaRow = {
  display: "flex",
  alignItems: "center",
  gap: 0.8,
  mt: 1.7,
  color: "#8996af",
  "& span": {
    fontSize: 11,
    overflowWrap: "anywhere",
  },
};

const jobTypeChip = {
  color: "#bac6dc",
  background: "rgba(148,163,184,.08)",
  border: "1px solid rgba(148,163,184,.13)",
  "& .MuiChip-label": { fontSize: 10 },
};

const trustPanel = {
  mt: 2.7,
  p: 1.7,
  borderRadius: 2,
  background: "rgba(255,255,255,.025)",
  border: "1px solid rgba(148,163,184,.1)",
};

const trustHeading = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  mb: 1.2,
};

const trustLabel = {
  color: "#a5b0c7",
  fontSize: 11,
  fontWeight: 600,
};

const trustPercentage = {
  fontSize: 15,
  fontWeight: 850,
};

const trustProgress = {
  height: 5,
  borderRadius: 10,
  background: "rgba(148,163,184,.13)",
};

const trustFootnote = {
  mt: 1.2,
  color: "#77849e",
  fontSize: 10,
  lineHeight: 1.6,
};

const verifiedChip = {
  mt: 1.8,
  color: "#86efac",
  background: "rgba(74,222,128,.07)",
  border: "1px solid rgba(74,222,128,.2)",
  "& .MuiChip-label": { fontSize: 10, fontWeight: 700 },
  "& .MuiChip-icon": { fontSize: 15, color: "#86efac" },
};

const aiExplanation = {
  display: "flex",
  alignItems: "flex-start",
  gap: 0.8,
  mt: 2,
  color: "#9caac2",
  fontSize: 11,
  lineHeight: 1.8,
  overflowWrap: "anywhere",
};

const applyButton = {
  minHeight: 43,
  mt: 2.5,
  borderRadius: 2,
  color: "#e9ddff",
  background: "rgba(139,92,246,.13)",
  border: "1px solid rgba(167,139,250,.28)",
  textTransform: "none",
  fontSize: 12,
  fontWeight: 800,
  "&:hover": {
    background: "rgba(139,92,246,.24)",
    borderColor: "rgba(167,139,250,.5)",
  },
  "&.Mui-disabled": {
    color: "#a5b0c7",
    background: "rgba(148,163,184,.08)",
    borderColor: "rgba(148,163,184,.12)",
  },
};

const emptyState = {
  py: { xs: 5, sm: 7 },
  px: 3,
  mt: 1,
  borderRadius: 3,
  textAlign: "center",
  color: "#edf2ff",
  background: "#111827",
  border: "1px dashed rgba(148,163,184,.2)",
  boxShadow: "none",
};

const emptyIcon = {
  width: 62,
  height: 62,
  display: "grid",
  placeItems: "center",
  mx: "auto",
  borderRadius: 3,
  color: "#b9a1ff",
  background: "rgba(139,92,246,.12)",
};

const emptyTitle = {
  mt: 2,
  fontSize: 18,
  fontWeight: 800,
};

const emptyDescription = {
  maxWidth: 460,
  mx: "auto",
  mt: 1,
  color: "#8e9bb5",
  fontSize: 12,
  lineHeight: 1.8,
};

const applicationCard = {
  p: 2.6,
  minWidth: 0,
  borderRadius: 3,
  color: "#edf2ff",
  background: "linear-gradient(145deg,#141c2d,#101626)",
  border: "1px solid rgba(148,163,184,.15)",
};

const footer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1.5,
  mt: 6,
  pt: 2.5,
  borderTop: "1px solid rgba(148,163,184,.12)",
};

const footerBrand = {
  display: "flex",
  alignItems: "center",
  gap: 0.8,
  color: "#a78bfa",
  "& span": {
    fontSize: 10,
    fontWeight: 850,
    letterSpacing: "1.4px",
  },
};

const footerText = {
  color: "#66738c",
  fontSize: 10,
};
