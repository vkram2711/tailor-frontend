from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


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


class Customer(BaseModel):
    name: str
    email: EmailStr
    phone: str
    measurements: Optional[List[Measurement]] = []
    additional_info: Optional[AdditionalInfo] = None
    user_id: Optional[str] = None
