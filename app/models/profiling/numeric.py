import pandas as pd
import numpy as np
from app.schema.profiling import ColumnProfile

def profile_numeric_column(series: pd.Series) -> ColumnProfile:
    return ColumnProfile(
        column_name=series.name,
        dtype=str(series.dtype),
        null_rate=series.isna().mean(),
        unique_count=series.nunique(),
        mean=series.mean(),
        std=series.std(),
        min=series.min(),
        max=series.max()
    )
