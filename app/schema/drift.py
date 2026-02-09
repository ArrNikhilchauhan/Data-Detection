from pydantic import BaseModel
from typing import Literal, Optional,List

class ColumnDrift(BaseModel):
    column_name: str
    method:Literal['psi','ks']

    statistic: float          # KS statistic OR PSI score
    p_value: Optional[float]=None  # only for KS, None for PSI

    drift_detected: bool
    drift_level: Optional[Literal["none", "moderate", "severe"]] = None

class DatasetDriftReport(BaseModel):
    dataset_name: str

    baseline_rows: int
    current_rows: int

    total_columns: int
    drifted_columns: int

    column_drifts: List[ColumnDrift]
