from fastapi import APIRouter,UploadFile,Form,File
from app.schema.drift import DatasetDriftReport
from app.models.dataingestion import validate_csv
from app.runner.drift_runner import drift_runner


drift_router=APIRouter()

@drift_router.post('/detect_drift',response_model=DatasetDriftReport)
async def detect_drift(current:UploadFile=File(...),reference:UploadFile=File(...),dataset_name:str=Form(...)):
    current_dataset=await validate_csv(current)
    reference_dataset=await validate_csv(reference)

    return drift_runner(current=current_dataset,reference=reference_dataset,dataset_name=dataset_name)


    
