import pandas as pd
from app.models.anamoly.iqr import iqr_anamoly_detection
from app.models.anamoly.z_score import z_anamoly_report
from app.schema.anamoly import DatasetAnamolyReport
from app.core.exception import AppException

def anamoly_report(df:pd.DataFrame,dataset_name):
    if df.empty or df.shape[1]==0:
        raise AppException(400,"Empty Dataframe")

    columns=[]

    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            iqr_anamoly_column=iqr_anamoly_detection(df[col],col)
            if iqr_anamoly_column.anamoly_count != 0:
                columns.append(iqr_anamoly_column) 
            else:
                z_anamoly_col=z_anamoly_report(df[col],col)
                if z_anamoly_col.anamoly_count!=0:
                    columns.append(z_anamoly_col)      
        else:
            continue

    return DatasetAnamolyReport(
        dataset_name=dataset_name,
        rows_count=len(df),
        column_count=df.shape[1],
        anamolies_column=len(columns),
        column_anamolies=columns
    )