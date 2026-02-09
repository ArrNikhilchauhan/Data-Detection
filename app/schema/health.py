from pydantic import BaseModel,Field
from typing import Literal
from app.schema.profiling import DatasetProfile
from app.schema.anamoly import DatasetAnamolyReport
from app.schema.drift import DatasetDriftReport

class HealthReport(BaseModel):
    dataset_name:str
    health_score:int=Field(description="Health score of the dataset define the kind of reliablity and how much cleaned it is",gt=0,lt=100)
    health_status:Literal['Healthy','Warning','Unhealthy','Critical']
    breakdown:list
    severity_drift_count:int
    critical_issues_count:int
    previous_health_score:int | None 
