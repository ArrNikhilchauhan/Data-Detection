from pydantic import BaseModel
from typing import Optional, List

class ColumnProfile(BaseModel):
    column_name: str
    dtype: str

    null_rate: Optional[float] = None
    unique_count: Optional[int] = None

    mean: Optional[float] = None
    std: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None


class DatasetProfile(BaseModel):
    dataset_name: str
    row_count: int
    column_count: int
    columns: List[ColumnProfile]
