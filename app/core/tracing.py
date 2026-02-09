from time import time
from app.utils.logging import get_logger

logger = get_logger("trace")


def trace_step(step_name: str):
    def wrapper(fn):
        def inner(*args, **kwargs):
            start = time()
            result = fn(*args, **kwargs)
            duration = time() - start

            logger.info(
                f"step_completed",
                extra={
                    "step": step_name,
                    "duration_ms": round(duration * 1000, 2)
                }
            )
            return result
        return inner
    return wrapper
