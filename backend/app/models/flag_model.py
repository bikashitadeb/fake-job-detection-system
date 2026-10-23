"""Backward-compatible import for the canonical fraud flag model."""

from app.models.flag_log_model import FlagLog


# Existing admin service imports Flag; use the one SQLAlchemy mapping for flag_logs.
Flag = FlagLog
