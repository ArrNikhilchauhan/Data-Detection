from pydantic import BaseModel
from typing import Optional

class DatasetMeta(BaseModel):
    dataset:str
    source:Optional[str]=None
    timestmp:Optional[str]=None
