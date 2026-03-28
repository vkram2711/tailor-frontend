import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.mydatabase
customers_collection = db.customers
appointments_collection = db.appointments
