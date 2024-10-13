from uuid import uuid4

from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from auth0 import get_current_user
from models import Customer, Measurement
from mongo_utils import customers_collection

app = FastAPI()

# Define the allowed origins
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

# Add the CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/customers")
async def create_customer(customer: Customer, user: dict = Depends(get_current_user)):
    customer.user_id = user["sub"]
    customer_dict = customer.dict()
    customer_dict["_id"] = ObjectId()
    existing_customer = await customers_collection.find_one({"email": customer.email})
    if existing_customer:
        raise HTTPException(status_code=400, detail="Customer already exists")
    await customers_collection.insert_one(customer_dict)
    return {"message": "Customer created successfully", "id": str(customer_dict["_id"])}


@app.get("/api/customers")
async def get_all_customers(user: dict = Depends(get_current_user)):
    customers = await customers_collection.find({"user_id": user["sub"]}).to_list(length=None)
    for customer in customers:
        customer["customer_id"] = str(customer["_id"])
        del customer["_id"]
    return customers


@app.get("/api/customers/{customer_id}")
async def get_customer(customer_id: str, user: dict = Depends(get_current_user)):
    customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not customer or customer["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer["customer_id"] = str(customer["_id"])
    del customer["_id"]
    return customer


@app.put("/api/customers/{customer_id}")
async def update_customer(customer_id: str, customer: Customer, user: dict = Depends(get_current_user)):
    existing_customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not existing_customer or existing_customer["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    await customers_collection.update_one({"_id": ObjectId(customer_id)}, {"$set": customer.dict()})
    return {"message": "Customer updated successfully"}


@app.delete("/api/customers/{customer_id}")
async def delete_customer(customer_id: str, user: dict = Depends(get_current_user)):
    existing_customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not existing_customer or existing_customer["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    result = await customers_collection.delete_one({"_id": ObjectId(customer_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}


@app.post("/api/customers/{customer_id}/measurements")
async def create_measurements(customer_id: str, measurement: Measurement, user: dict = Depends(get_current_user)):
    customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not customer or customer["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not measurement.measurement_id:
        measurement.measurement_id = str(uuid4())
    customer_measurements = customer.get("measurements", [])
    customer_measurements.append(measurement.dict())
    await customers_collection.update_one(
        {"_id": ObjectId(customer_id)},
        {"$set": {"measurements": customer_measurements}}
    )
    return {"message": "Measurement added successfully"}


@app.get("/api/customers/{customer_id}/measurements")
async def get_measurements(customer_id: str, user: dict = Depends(get_current_user)):
    customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not customer or customer["user_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.get("measurements", [])
