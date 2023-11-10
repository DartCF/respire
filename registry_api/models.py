from sqlalchemy import Column, Integer, String

from database import Base

class Module(Base):
    
        __tablename__ = "modules"
    
        module_id   = Column(Integer, primary_key=True, unique=True, index=True)
        module_name = Column(String)
        module_api  = Column(String)