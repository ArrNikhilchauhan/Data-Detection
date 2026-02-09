import time
from fastapi import Request
from app.core.metrics import REQUEST_COUNT, REQUEST_LATENCY


async def metrics_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)

    latency = time.time() - start

    REQUEST_COUNT.labels(
        endpoint=request.url.path,
        method=request.method,
        status=response.status_code
    ).inc()

    REQUEST_LATENCY.labels(
        endpoint=request.url.path
    ).observe(latency)

    return response
