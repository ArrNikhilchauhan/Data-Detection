import time
from collections import defaultdict
from app.core.limits import MAX_REQUESTS_PER_MINUTE
from app.core.errors import RateLimitExceeded


_requests = defaultdict(list)


def check_rate_limit(client_id: str):
    now = time.time()
    window_start = now - 60

    timestamps = _requests[client_id]
    timestamps[:] = [t for t in timestamps if t >= window_start]

    if len(timestamps) >= MAX_REQUESTS_PER_MINUTE:
        raise RateLimitExceeded("Rate limit exceeded")

    timestamps.append(now)
