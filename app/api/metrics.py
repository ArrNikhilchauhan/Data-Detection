from fastapi import APIRouter
from prometheus_client import generate_latest

metrics_router = APIRouter()


@metrics_router.get("/metrics")
def metrics():
    return generate_latest()
