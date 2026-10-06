import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not configured")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is not configured")

client = MongoClient(MONGODB_URL)

db = client[DATABASE_NAME]


def get_database():
    return db