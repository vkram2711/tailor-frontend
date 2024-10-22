from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

uri = "mongodb+srv://vkram:8NTKwyd2cvfMYPrS@tailor.hvxg2.mongodb.net/?retryWrites=true&w=majority&appName=Tailor"

# Replace the connection string with your MongoDB Atlas connection string
client = AsyncIOMotorClient(uri)
db = client.mydatabase
customers_collection = db.customers
appointments_collection = db.appointments
