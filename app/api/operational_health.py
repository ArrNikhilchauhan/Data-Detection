from fastapi import APIRouter,UploadFile,Depends,Request,Form,File
from app.schema.opreational_health import OperationalHealthReport
from app.models.dataingestion import validate_csv
from app.runner.anamoly_runner import anamoly_report
from app.runner.drift_runner import drift_runner
from app.runner.profile_runner import profile_dataframe
from app.runner.health_runner import health_runner
from app.runner.operational_runner import operational_health_runner
from app.db.db import get_db
from app.db.healthreport import healthreport,operation
from app.db.prev_score import prev_score
from app.core.rate_limiter import check_rate_limit


operational_router=APIRouter()

@operational_router.post('/operational',response_model=OperationalHealthReport)
async def operational_report(req:Request,current:UploadFile=File(...),reference:UploadFile=File(...),dataset_name:str=Form(...),db=Depends(get_db)):

    client_id=req.client.host
    check_rate_limit(client_id=client_id)

    current=await validate_csv(current)
    reference=await validate_csv(reference)

    drift=drift_runner(current,reference,dataset_name)
    anamoly=anamoly_report(reference,dataset_name)
    profile=profile_dataframe(reference,dataset_name)

    previous_score=prev_score(db=db,dataset_name=dataset_name)

    health=health_runner(profile=profile,anamoly=anamoly,drift=drift,dataset_name=dataset_name,previous_score=previous_score)

    healthreport(db=db,health_report=health,prev_score=previous_score)

    action= operational_health_runner(dataset_name=dataset_name,current_health_score=health.health_score,previous_health_score=previous_score,critical_issues=health.critical_issues_count,severe_drift_count=health.severity_drift_count)
    operation(db=db,action=action)

    return action






