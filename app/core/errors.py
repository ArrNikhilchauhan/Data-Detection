class InputLimitViolation(Exception):
    """Raised when dataset exceeds size/shape limits"""
    pass


class RateLimitExceeded(Exception):
    """Raised when request rate exceeds allowed threshold"""
    pass
