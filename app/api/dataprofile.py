from fastapi import APIRouter,UploadFile,File,Form
from app.models.dataingestion import validate_csv
from app.runner.profile_runner import profile_dataframe
from app.schema.profiling import DatasetProfile
from app.runner.anamoly_runner import anamoly_report
from app.schema.anamoly import DatasetAnamolyReport

profile_router=APIRouter()

@profile_router.post('/profile',response_model=DatasetProfile)
async def upload(file:UploadFile=File(...),dataset_name:str=Form(...)):
    df=await validate_csv(file)
    return profile_dataframe(df,dataset_name)

@profile_router.post('/detect_anomaly',response_model=DatasetAnamolyReport)
async def detect_anamoly(file:UploadFile,dataset_name:str):
    df=await validate_csv(file)
    return anamoly_report(df,dataset_name)
