from datetime import datetime
from uuid import uuid4

from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from auth0 import get_current_user
from mail_utils import send_confirmation_email, send_reschedule_email, send_deletion_email
from models import Customer, Measurement, Appointment
from mongo_utils import customers_collection, appointments_collection

pending_appointments = []

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

@app.post("/api/public/customers")
async def create_customer_public(customer: Customer):
    customer_dict = customer.to_mongo()
    existing_customer = await customers_collection.find_one({"email": customer.email, "tailor_id": customer.tailor_id})
    if existing_customer:
        raise HTTPException(status_code=400, detail="Customer already exists")
    await customers_collection.insert_one(customer_dict)
    return {"message": "Customer created successfully", "id": str(customer_dict["_id"])}


@app.post("/api/customers")
async def create_customer(customer: Customer, user: dict = Depends(get_current_user)):
    customer_dict = customer.to_mongo()
    customer_dict["tailor_id"] = user["sub"]
    existing_customer = await customers_collection.find_one({"email": customer.email, "tailor_id": customer.tailor_id})
    if existing_customer:
        raise HTTPException(status_code=400, detail="Customer already exists")
    await customers_collection.insert_one(customer_dict)
    return {"message": "Customer created successfully", "id": str(customer_dict["_id"])}


@app.get("/api/tailors/{tailor_id}/customers/check")
async def check_customer_exists(email: str, tailor_id: str):
    customer_data = await customers_collection.find_one({"email": email, "tailor_id": tailor_id})
    if customer_data:
        return {"exists": True, "id": str(customer_data["_id"])}
    return {"exists": False}


@app.get("/api/customers")
async def get_all_customers(user: dict = Depends(get_current_user)):
    customers = await customers_collection.find({"tailor_id": user["sub"]}).to_list(length=None)
    return [Customer.from_mongo(customer) for customer in customers]


@app.get("/api/customers/{customer_id}")
async def get_customer(customer_id: str, user: dict = Depends(get_current_user)):
    customer_data = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not customer_data or customer_data["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = Customer.from_mongo(customer_data)
    return customer


@app.get("/api/tailors/{tailor_id}/customers")
async def get_customer_by_email(email: str, tailor_id: str):
    customer_data = await customers_collection.find_one({"email": email, "tailor_id": tailor_id})
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer not found")
    return Customer.from_mongo(customer_data)


@app.put("/api/customers/{customer_id}")
async def update_customer(customer_id: str, customer: Customer, user: dict = Depends(get_current_user)):
    existing_customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not existing_customer or existing_customer["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    await customers_collection.update_one({"_id": ObjectId(customer_id)}, {"$set": customer.dict()})
    return {"message": "Customer updated successfully"}


@app.delete("/api/customers/{customer_id}")
async def delete_customer(customer_id: str, user: dict = Depends(get_current_user)):
    existing_customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not existing_customer or existing_customer["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    result = await customers_collection.delete_one({"_id": ObjectId(customer_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}


@app.post("/api/customers/{customer_id}/measurements")
async def create_measurements(customer_id: str, measurement: Measurement, user: dict = Depends(get_current_user)):
    customer = await customers_collection.find_one({"_id": ObjectId(customer_id)})
    if not customer or customer["tailor_id"] != user["sub"]:
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
    if not customer or customer["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.get("measurements", [])


@app.post("/api/tailors/{tailor_id}/appointments/book")
async def create_appointment_for_customer(tailor_id: str, appointment: Appointment, background_tasks: BackgroundTasks):
    # Check if the customer exists
    customer_data = await customers_collection.find_one({"_id": ObjectId(appointment.customer_id), "tailor_id": tailor_id})
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer not found")

    appointment.tailor_id = tailor_id
    appointment.confirmed = False
    appointment_dict = appointment.to_mongo()
    await appointments_collection.insert_one(appointment_dict)

    # Add to pending appointments
    pending_appointments.append(str(appointment_dict["_id"]))

    # Notify tailor (in a real-world scenario, you'd use a proper notification system)
    background_tasks.add_task(notify_tailor, tailor_id, str(appointment_dict["_id"]))

    return {"message": "Appointment booked successfully", "id": str(appointment_dict["_id"])}


@app.get("/api/tailor/pending-appointments")
async def get_pending_appointments(user: dict = Depends(get_current_user)):
    tailor_id = user["sub"]
    pending = await appointments_collection.find({"tailor_id": tailor_id, "confirmed": False}).to_list(length=None)
    return [Appointment.from_mongo(appointment) for appointment in pending]


@app.post("/api/appointments")
async def create_appointment_with_customer(appointment: Appointment, user: dict = Depends(get_current_user)):
    appointment.tailor_id = user["sub"]
    appointment_dict = appointment.to_mongo()
    await appointments_collection.insert_one(appointment_dict)
    return {"message": "Appointment created successfully", "id": str(appointment_dict["_id"])}


@app.post("/api/tailors/{tailor_id}/appointments")
async def create_appointment_with_tailor(tailor_id: str, appointment: Appointment):
    customer_data = await customers_collection.find_one({"_id": ObjectId(appointment.customer_id), "tailor_id": tailor_id})
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer not found")

    appointment.tailor_id = tailor_id
    appointment_dict = appointment.to_mongo()
    await appointments_collection.insert_one(appointment_dict)
    return {"message": "Appointment created successfully", "id": str(appointment_dict["_id"])}


@app.get("/api/appointments/{appointment_id}")
async def get_appointment(appointment_id: str, user: dict = Depends(get_current_user)):
    existing_appointment = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not existing_appointment or existing_appointment["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Appointment not found")

    customer_data = await customers_collection.find_one({"_id": ObjectId(existing_appointment["customer_id"])})
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer not found")

    appointment = Appointment.from_mongo(existing_appointment)
    customer = Customer.from_mongo(customer_data)
    appointment_dict = appointment.dict()
    appointment_dict["customer"] = customer.dict()
    return appointment_dict


@app.get("/api/appointments")
async def get_appointments(user: dict = Depends(get_current_user)):
    appointments = await appointments_collection.find({"tailor_id": user["sub"]}).to_list(length=None)
    return [Appointment.from_mongo(appointment) for appointment in appointments]


@app.put("/api/appointments/{appointment_id}/reschedule")
async def reschedule_appointment(appointment_id: str, new_date: datetime, background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    existing_appointment = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not existing_appointment or existing_appointment["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Appointment not found")
    await appointments_collection.update_one({"_id": ObjectId(appointment_id)}, {"$set": {"date": new_date}})

    # Send reschedule email to customer
    customer = await customers_collection.find_one({"_id": ObjectId(existing_appointment["customer_id"])})
    if customer:
        background_tasks.add_task(send_reschedule_email, customer["email"], str(existing_appointment), new_date.isoformat())

    return {"message": "Appointment rescheduled successfully"}


@app.put("/api/appointments/{appointment_id}/confirm")
async def confirm_appointment(appointment_id: str, background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    existing_appointment = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not existing_appointment or existing_appointment["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Appointment not found")

    await appointments_collection.update_one({"_id": ObjectId(appointment_id)}, {"$set": {"confirmed": True}})

    # Remove from pending appointments
    if appointment_id in pending_appointments:
        pending_appointments.remove(appointment_id)

    # Send confirmation email to customer
    customer = await customers_collection.find_one({"_id": ObjectId(existing_appointment["customer_id"])})
    if customer:
        background_tasks.add_task(send_confirmation_email, customer["email"], str(existing_appointment))

    return {"message": "Appointment confirmed successfully"}


@app.delete("/api/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str, background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    existing_appointment = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not existing_appointment or existing_appointment["tailor_id"] != user["sub"]:
        raise HTTPException(status_code=404, detail="Appointment not found")
    result = await appointments_collection.delete_one({"_id": ObjectId(appointment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Send deletion email to customer
    customer = await customers_collection.find_one({"_id": ObjectId(existing_appointment["customer_id"])})
    if customer:
        background_tasks.add_task(send_deletion_email, customer["email"], str(existing_appointment))

    return {"message": "Appointment deleted successfully"}


@app.get("/api/tailors/appointments")
async def get_all_appointments_for_tailor(user: dict = Depends(get_current_user)):
    appointments = await appointments_collection.find({"tailor_id": user["sub"]}).sort("date", 1).to_list(length=None)
    return [Appointment.from_mongo(appointment) for appointment in appointments]


@app.get("/api/tailor/id")
async def get_user_id(user: dict = Depends(get_current_user)):
    return {"tailor_id": user["sub"]}


async def notify_tailor(tailor_id: str, appointment_id: str):
    print(f"Notification: New appointment {appointment_id} for tailor {tailor_id}")
