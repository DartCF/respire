import logging
from fastapi import FastAPI, Request, status, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from typing import List

import models, schemas
from database import engine

# from routers import studies, data, admin

models.Base.metadata.create_all(bind=engine)  # create all tables

app = FastAPI()

# specify CORS valid origins
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5000",
    "http://localhost:8000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    'https://respire-dev.dartmouth.edu'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# exception handling -- log 422 results to console
@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

# health check
@app.get('/', status_code=200)
def root():
    return {'status': 'healthy'}

# this endpoint will take a json body with a module name and a module description
# it will create a new entry in the modules table with the module name and description
# it will return the module_id of the new entry
@app.post('/register_module', status_code=200, response_model=int)
def register_module(new_module: schemas.ModuleCreate, db: Session = Depends(get_db)):

    db_module = models.Module(**new_module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)

    return db_module.module_id

# get a list of all modules currently registered in the database
@app.get('/listModules', status_code=200, response_model=List[schemas.Module])
def get_modules(db: Session = Depends(get_db)):
    return db.query(models.Module).all()

# remove a module from the database
@app.delete('/deleteModule/{module_id}', status_code=200)
def delete_module(module_id: int, db: Session = Depends(get_db)):
    db.query(models.Module).filter(models.Module.module_id == module_id).delete()
    db.commit()
    return {'deleted': module_id}