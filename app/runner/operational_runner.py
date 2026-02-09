from app.schema.opreational_health import OperationalHealthReport
from app.core.action_engine import decide_action
from app.core.trend import compute_trend


def operational_health_runner(
    dataset_name: str,
    current_health_score: int,
    previous_health_score: int | None,
    critical_issues: int,
    severe_drift_count: int
):

    trend = compute_trend(previous_health_score, current_health_score)

    if current_health_score >= 80:
        status = "Healthy"
    elif current_health_score >= 60:
        status = "Warning"
    else:
        status = "Critical"

    action = decide_action(
        health_score=current_health_score,
        trend=trend,
        critical_issues=critical_issues,
        severe_drift_count=severe_drift_count
    )

    return OperationalHealthReport(
        dataset_name=dataset_name,
        health_score=current_health_score,
        health_status=status,
        trend=trend,
        critical_issues=critical_issues,
        recommended_action=action
    )
