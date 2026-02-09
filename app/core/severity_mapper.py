from app.core.severity import SeverityLevel


def anomaly_severity(anomaly_rate: float) -> SeverityLevel:
    if anomaly_rate >= 0.10:
        return SeverityLevel.CRITICAL
    elif anomaly_rate >= 0.05:
        return SeverityLevel.HIGH
    elif anomaly_rate >= 0.02:
        return SeverityLevel.MEDIUM
    return SeverityLevel.LOW


def drift_severity(psi: float, ks_pvalue: float) -> SeverityLevel:
    if psi >= 0.25:
        return SeverityLevel.CRITICAL
    elif psi >= 0.15:
        return SeverityLevel.HIGH
    elif psi >= 0.10:
        return SeverityLevel.MEDIUM
    return SeverityLevel.LOW
