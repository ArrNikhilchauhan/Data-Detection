from app.core.exception import AppException
from app.schema.errorresponse import ErrorResponse
from app.utils.logging import logger
from fastapi import Request
from fastapi.responses import JSONResponse

async def app_exception_handler(req:Request,app:AppException):
    logger.error(app.message)
    error_message=ErrorResponse(error=app.message)
    return JSONResponse(
        status_code=app.status_code,
        content=error_message.model_dump()
    )

