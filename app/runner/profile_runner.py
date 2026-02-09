import pandas as pd
from app.schema.profiling import DatasetProfile, ColumnProfile
from app.models.profiling.numeric import profile_numeric_column
from app.core.exception import AppException

def profile_dataframe(df: pd.DataFrame, dataset_name: str) -> DatasetProfile:
    if df.empty or df.shape[1] == 0:
        raise AppException(422,"Empty DataFrame")

    columns = []

    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            columns.append(profile_numeric_column(df[col]))
        else:
            columns.append(
                ColumnProfile(
                    column_name=col,
                    dtype=str(df[col].dtype),
                    null_rate=df[col].isna().mean(),
                    unique_count=df[col].nunique()
                )
            )

    return DatasetProfile(
        dataset_name=dataset_name,
        row_count=len(df),
        column_count=df.shape[1],
        columns=columns
    )
