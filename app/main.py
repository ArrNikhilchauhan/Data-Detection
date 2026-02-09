from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import health_router
from app.api.operational_health import operational_router
from app.api.dataprofile import profile_router
from app.api.drift_route import drift_router
from app.core.exception import AppException
from app.core.exception_handler import app_exception_handler
from app.api.middleware.request_context import request_context_middleware
from app.api.middleware.metrics import metrics_middleware
from app.api.metrics import metrics_router


app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(router=health_router,prefix='/health',tags=['test'])
app.include_router(router=profile_router,prefix='/profiling',tags=['profiling'])
app.include_router(router=drift_router,prefix='/drift',tags=['drift'])
app.include_router(router=operational_router,prefix='/operation',tags=['Operation'])
app.include_router(router=metrics_router,prefix='/metrics',tags=['Metrics'])

app.add_exception_handler(AppException,app_exception_handler)
app.middleware("http")(request_context_middleware)
app.middleware("http")(metrics_middleware)

