import io
import pandas as pd
from app.core.limits import MAX_FILE_SIZE_MB, MAX_ROWS, MAX_COLUMNS
from app.core.errors import InputLimitViolation


async def validate_csv(file):
    if not file.filename.endswith(".csv"):
        raise InputLimitViolation("Only CSV files are allowed")

    content = await file.read()

    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise InputLimitViolation(
            f"File too large ({size_mb:.2f} MB). Max allowed is {MAX_FILE_SIZE_MB} MB"
        )

    df = pd.read_csv(io.BytesIO(content))

    if df.empty:
        raise InputLimitViolation("CSV file is empty")

    if df.shape[0] > MAX_ROWS:
        raise InputLimitViolation(
            f"Too many rows ({df.shape[0]}). Max allowed is {MAX_ROWS}"
        )

    if df.shape[1] > MAX_COLUMNS:
        raise InputLimitViolation(
            f"Too many columns ({df.shape[1]}). Max allowed is {MAX_COLUMNS}"
        )

    return df
