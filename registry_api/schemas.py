from typing import Optional
from pydantic import BaseModel, Field

class ModuleBase(BaseModel):
    module_name: str
    module_api: str
    # this is needed to make the primary key optional
    class Config:
        orm_mode = True

class Module(ModuleBase):
    module_id: Optional[int] = Field(primary_key=True, unique=True, index=True)

class ModuleCreate(ModuleBase):
    pass