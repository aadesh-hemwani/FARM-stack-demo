from typing import List, Optional
from pydantic import BaseModel, Field
from typing import Optional
import datetime
from datetime import timezone
import uuid


def utcToLocal(time):
    time = time.replace(tzinfo=timezone.utc).astimezone(tz=None)
    return (
        f"{time.day} {months[time.month]}, {time.year} at {time.hour%12}:{time.minute}"
    )


class Item(BaseModel):
    item_name: str
    isChecked: bool = False


class Checklist(BaseModel):
    list_id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str
    author_name: str
    created: Optional[str]
    items: Optional[List[Item]] = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Demo List",
                "author_name": "user",
                "created": "date"
            }
        }