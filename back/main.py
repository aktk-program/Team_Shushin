from fastapi import FastAPI

app = FastAPI()

import string_to_model

app.include_router(string_to_model.router)

# uvicorn main:app --reload で実行