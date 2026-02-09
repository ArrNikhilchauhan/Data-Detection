import numpy as np
import pandas as pd

def calculate_psi(
    reference: pd.Series,
    current: pd.Series,
    bins: int = 10
) -> float:

    reference = reference.dropna()
    current = current.dropna()

    if reference.empty or current.empty:
        return 0.0

    quantiles = np.linspace(0, 1, bins + 1)
    bin_edges = np.unique(np.quantile(reference, quantiles))

    # Safety check
    if len(bin_edges) <= 2:
        return 0.0

    ref_bins = pd.cut(reference, bin_edges, include_lowest=True)
    cur_bins = pd.cut(current, bin_edges, include_lowest=True)

    ref_dist = ref_bins.value_counts(normalize=True)
    cur_dist = cur_bins.value_counts(normalize=True)

    # Align bins
    epsilon=1e-6
    ref_dist, cur_dist = ref_dist.align(cur_dist, fill_value=epsilon)

    ref_dist = ref_dist.clip(lower=epsilon)
    cur_dist = cur_dist.clip(lower=epsilon)

    psi = np.sum((ref_dist - cur_dist) * np.log(ref_dist / cur_dist))
    return float(psi)


def psi_level(psi:float):
    if psi<0.1:
        return "none"
    elif psi<0.25:
        return "moderate"
    else:
        return "severe"