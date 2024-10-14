from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel
from pydantic import EmailStr


class MongoModel(BaseModel):
    id: Optional[str] = None

    @classmethod
    def from_mongo(cls, data: dict):
        if data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

    def to_mongo(self) -> dict:
        data = self.dict()
        data["_id"] = ObjectId(data.pop("id"))
        return data


class MeasurementEntry(BaseModel):
    type: str
    value: float


class Measurement(BaseModel):
    entries: List[MeasurementEntry]
    measurement_id: Optional[str] = None
    date: datetime


class AdditionalInfo(BaseModel):
    notes: Optional[str] = None
    preferences: Optional[str] = None


class Customer(MongoModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    gender: Optional[str] = None
    measurements: Optional[List[Measurement]] = []
    additional_info: Optional[AdditionalInfo] = None
    tailor_id: Optional[str] = None


class Appointment(MongoModel):
    customer_id: str
    request_work: str
    additional_notes: Optional[str] = None
    date: datetime
    confirmed: Optional[bool] = False
    tailor_id: Optional[str] = None
