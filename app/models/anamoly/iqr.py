import pandas as pd
from app.schema.anamoly import ColumnAnamoly
from app.core.exception import AppException

def iqr_anamoly_detection(column:pd.Series,col_name:str):

    if column.empty:
        raise AppException(400,"Column is missing")
    
    q1=column.quantile(0.25)
    q3=column.quantile(0.75)

    iqr=q3-q1

    lower_bound=q1-1.5*iqr
    upper_bound=q3+1.5*iqr

    is_anamoly=(column<lower_bound )| (column>upper_bound)

    anamoly_count=int(is_anamoly.sum())
    anamoly_rate=float(anamoly_count/len(column))

    return ColumnAnamoly(
        column_name=col_name,
        method="IQR",
        anamoly_count=anamoly_count,
        anamoly_rate=anamoly_rate,
        threshold=1.5
    )




    