from fastapi import FastAPI

app = FastAPI()

import string_to_model
import reset_recorded_foods
import scoring

app.include_router(string_to_model.router)
app.include_router(reset_recorded_foods.router)
app.include_router(scoring.router)

# uvicorn main:app --reload で実行