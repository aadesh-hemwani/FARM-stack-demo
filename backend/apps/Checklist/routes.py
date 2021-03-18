from fastapi import APIRouter, Request, status, HTTPException
from fastapi.params import Body
from fastapi.responses import JSONResponse
from .models import Checklist, Item
from fastapi.encoders import jsonable_encoder

router = APIRouter()


@router.post("/")
async def create_new_checklist(request: Request, checklist: Checklist = Body(...)):
    """
    create a new checklist
    """
    clist = jsonable_encoder(checklist)
    new_clist = await request.app.mongodb["lists"].insert_one(clist)
    created_list = await request.app.mongodb["lists"].find_one(
        {"_id": new_clist.inserted_id}
    )
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_list)


@router.get("/")
async def get_all_checklists(request: Request):
    """
    get all checklists
    """
    lists = []
    data = await request.app.mongodb["lists"].find().to_list(length=100)
    for doc in data:
        lists.append(doc)
    return lists


@router.post("/add_item/{id}")
async def add_item_to_list(id: str, request: Request, item: Item = Body(...)):
    """
    add item to a list
    """
    item = jsonable_encoder(item)
    await request.app.mongodb["lists"].update_one(
        {"_id": id}, {"$push": {"items": item}}
    )
    return JSONResponse(status_code=status.HTTP_200_OK)


@router.put("/{list_id}/{index}")
async def update_item_checked(list_id: str, index: int, request: Request):
    """
    toggle item in a list as checked or unchecked
    """
    statusChecked = await request.app.mongodb["lists"].find_one({"_id": list_id})
    statusChecked = jsonable_encoder(statusChecked)

    await request.app.mongodb["lists"].update_one(
        {"_id": list_id},
        {
            "$set": {
                f"items.{index}.isChecked": (
                    not statusChecked["items"][index]["isChecked"]
                )
            }
        },
    )
    updated = await request.app.mongodb["lists"].find_one({"_id": list_id})
    updated = jsonable_encoder(updated)
    return updated


@router.delete("/{list_id}/{index}")
async def delete_list_item(list_id: str, index: int, request: Request):
    """
    delete a checklist item by index
    """
    await request.app.mongodb["lists"].update_one(
        {"_id": list_id}, {"$set": {f"items.{index}": None}}
    )
    await request.app.mongodb["lists"].update_one(
        {"_id": list_id}, {"$pull": {f"items": None}}
    )
    return JSONResponse(status_code=status.HTTP_200_OK)


@router.delete("/{id}")
async def delete_checklist(id: str, request: Request):
    """
    delete a checklist by id
    """
    delete_result = await request.app.mongodb["lists"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"List {id} not found")
