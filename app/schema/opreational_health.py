from pydantic import BaseModel


class OperationalHealthReport(BaseModel):
    dataset_name: str

    health_score: int
    health_status: str
    trend: str

    critical_issues: int
    recommended_action: str
