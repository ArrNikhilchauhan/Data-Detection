from pydantic import BaseModel

class ColumnAnamoly(BaseModel):
    column_name:str
    method:str
    anamoly_count:float
    anamoly_rate:float
    threshold:float

class DatasetAnamolyReport(BaseModel):
    dataset_name:str
    rows_count:int
    column_count:int
    anamolies_column:int
    column_anamolies:list[ColumnAnamoly]