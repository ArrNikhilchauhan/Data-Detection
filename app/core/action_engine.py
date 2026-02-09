def decide_action(
    health_score: int,
    trend: str,
    critical_issues: int,
    severe_drift_count: int
) -> str:

    if health_score < 40:
        return "BLOCK_PIPELINE"

    if severe_drift_count > 0:
        return "RETRAIN_MODEL"

    if trend == "worsening" and critical_issues > 0:
        return "DATA_ENGINEER_REVIEW"

    if health_score < 70:
        return "MONITOR"

    return "NO_ACTION"
