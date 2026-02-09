from enum import Enum


class SeverityLevel(str, Enum):
    LOW = "Healthy"
    MEDIUM = "Warning"
    HIGH = "Unhealthy"
    CRITICAL = "Critical"
