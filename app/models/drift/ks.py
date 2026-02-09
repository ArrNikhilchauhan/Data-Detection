import pandas as pd
from scipy.stats import ks_2samp

def calculate_ks(
    reference: pd.Series,
    current: pd.Series,
    alpha: float = 0.1
):
    reference = reference.dropna()
    current = current.dropna()

    # Guard rails
    if reference.empty or current.empty:
        return {
            "statistic": 0.0,
            "p_value": 1.0,
            "drift_detected": False
        }

    statistic, p_value = ks_2samp(reference, current)

    print(p_value)
    drift_detected = p_value < alpha

    return {
        "statistic": float(statistic),
        "p_value": float(p_value),
        "drift_detected": drift_detected
    }
