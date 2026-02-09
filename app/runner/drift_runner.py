import pandas as pd
from app.core.exception import AppException
from app.models.drift.psi import calculate_psi,psi_level
from app.models.drift.ks import calculate_ks
from app.schema.drift import DatasetDriftReport,ColumnDrift

def drift_runner(current:pd.DataFrame,reference:pd.DataFrame,dataset_name):
    if current.empty or current.shape[1]==0:
        raise AppException(400,"Empty Dataframe")
    elif not current.columns.equals(reference.columns):
        raise AppException(400,"Datset must be with same columns")
    
    columns=[]

    for col in current.columns:
        if pd.api.types.is_numeric_dtype(reference[col]):
            psi=calculate_psi(reference[col],current[col])
            ks=calculate_ks(reference[col],current[col])
            drift_level=psi_level(psi)
            if drift_level in ['moderate','severe']:
                columns.append(ColumnDrift(
                    column_name=col,
                    method="psi",
                    statistic=psi,
                    drift_detected=True,
                    drift_level=drift_level
                ))
            if ks["drift_detected"]:
                columns.append(ColumnDrift(
                    column_name=col,
                    method="ks",
                    statistic=ks["statistic"],
                    p_value=ks["p_value"],
                    drift_detected=ks["drift_detected"]
                ))
        else:
            continue

    return DatasetDriftReport(
        dataset_name=dataset_name,
        baseline_rows=len(reference),
        current_rows=len(current),
        total_columns=reference.shape[1],
        drifted_columns=len(columns),
        column_drifts=columns
    )