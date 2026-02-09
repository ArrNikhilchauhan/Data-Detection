from fastapi import APIRouter,UploadFile,Depends,Form,File
from app.runner.health_runner import health_runner
from app.schema.health import HealthReport
from app.models.dataingestion import validate_csv
from app.runner.anamoly_runner import anamoly_report
from app.runner.drift_runner import drift_runner
from app.runner.profile_runner import profile_dataframe
from app.db.prev_score import prev_score
from app.db.db import get_db


health_router=APIRouter()

@health_router.post('/health_report',response_model=HealthReport)
async def health(reference:UploadFile=File(...),current:UploadFile=File(...),dataset_name:str=Form(...),db=Depends(get_db)):

    reference=await validate_csv(reference)
    current=await validate_csv(current)

    profile=profile_dataframe(reference,dataset_name)
    anamoly=anamoly_report(reference,dataset_name)
    drift=drift_runner(current,reference,dataset_name)

    previous_score=prev_score(db=db,dataset_name=dataset_name)

    return health_runner(profile,anamoly,drift,dataset_name,previous_score=previous_score)






    