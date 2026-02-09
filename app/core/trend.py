def compute_trend(
    previous_score: int | None,
    current_score: int
) -> str:
    if previous_score is None:
        return "unknown"

    if current_score <= previous_score - 10:
        return "worsening"
    elif current_score >= previous_score + 5:
        return "improving"
    return "stable"
