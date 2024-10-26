import os
from fastapi import APIRouter

router = APIRouter()

@router.delete('/delete/recorded/foods')
def delete_recorded_foods():
    if(os.path.isfile("foods.txt")):
        os.remove("foods.txt")
        return {"is_deleted": True}
    else:
        return {"is_deleted": False}