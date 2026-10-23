import os
from datetime import datetime, date
from decimal import Decimal

import mysql.connector
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")


# ============================================================
# MYSQL CONFIGURATION
# ============================================================

MYSQL_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": os.getenv("MYSQL_PASSWORD"),
    "database": "fake_job_detection_db"
}


# ============================================================
# TABLES TO MIGRATE
# ============================================================

TABLES = [
    "applications",
    "companies",
    "flag_logs",
    "jobs",
    "notifications",
    "recruiters",
    "token_blocklist",
    "users"
]


# ============================================================
# CHECK MONGODB URI
# ============================================================

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is missing from your .env file."
    )


# ============================================================
# CONNECT TO MYSQL
# ============================================================

print("\nConnecting to MySQL...")

mysql_connection = mysql.connector.connect(
    host=MYSQL_CONFIG["host"],
    port=MYSQL_CONFIG["port"],
    user=MYSQL_CONFIG["user"],
    password=MYSQL_CONFIG["password"],
    database=MYSQL_CONFIG["database"]
)

mysql_cursor = mysql_connection.cursor(dictionary=True)

print("MySQL connected successfully!")


# ============================================================
# CONNECT TO MONGODB ATLAS
# ============================================================

print("\nConnecting to MongoDB Atlas...")

mongo_client = MongoClient(
    MONGO_URI,
    server_api=ServerApi("1")
)

mongo_client.admin.command("ping")

mongo_db = mongo_client["fakeguard"]

print("MongoDB Atlas connected successfully!")


# ============================================================
# CONVERT MYSQL VALUES TO MONGODB-SAFE VALUES
# ============================================================

def convert_value(value):

    if isinstance(value, datetime):
        return value

    if isinstance(value, date):
        return datetime.combine(
            value,
            datetime.min.time()
        )

    if isinstance(value, Decimal):
        return float(value)

    if isinstance(value, bytes):
        return value.decode(
            "utf-8",
            errors="replace"
        )

    return value


# ============================================================
# MIGRATE ONE TABLE
# ============================================================

def migrate_table(table_name):

    print("\n----------------------------------------")
    print(f"Migrating table: {table_name}")
    print("----------------------------------------")

    # Get all rows
    mysql_cursor.execute(
        f"SELECT * FROM `{table_name}`"
    )

    rows = mysql_cursor.fetchall()

    print(
        f"MySQL rows found: {len(rows)}"
    )

    # Get MongoDB collection
    collection = mongo_db[table_name]

    # Remove old migrated data
    collection.delete_many({})

    if not rows:

        print(
            f"No data found in {table_name}."
        )

        return

    # Convert values
    documents = []

    for row in rows:

        document = {}

        for key, value in row.items():

            document[key] = convert_value(value)

        documents.append(document)

    # Insert into MongoDB
    result = collection.insert_many(
        documents
    )

    print(
        f"MongoDB documents inserted: "
        f"{len(result.inserted_ids)}"
    )


# ============================================================
# START MIGRATION
# ============================================================

print("\n========================================")
print("MYSQL → MONGODB MIGRATION")
print("========================================")

print(
    f"MySQL database: "
    f"{MYSQL_CONFIG['database']}"
)

print(
    "MongoDB database: fakeguard"
)

print(
    f"Tables to migrate: {len(TABLES)}"
)


try:

    for table in TABLES:

        migrate_table(table)


    print("\n========================================")
    print("MIGRATION COMPLETED SUCCESSFULLY")
    print("========================================")


except Exception as error:

    print("\n========================================")
    print("MIGRATION FAILED")
    print("========================================")

    print(error)


finally:

    mysql_cursor.close()

    mysql_connection.close()

    mongo_client.close()

    print("\nConnections closed.")
