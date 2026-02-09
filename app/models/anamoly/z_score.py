import pandas as pd
from app.schema.anamoly import ColumnAnamoly

def z_anamoly_report(col:pd.Series,col_name,threshold=3.0):

    std=col.std()
    if std==0:
        return 
    
    is_anamoly=(col<(-threshold*std))|(col>(threshold*std))

    anamoly_count=int(is_anamoly.sum())
    anamoly_rate=float(anamoly_count/len(col))

    return ColumnAnamoly(
        column_name=col_name,
        method="z-score",
        anamoly_count=anamoly_count,
        anamoly_rate=anamoly_rate,
        threshold=threshold
    )