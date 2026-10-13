
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://bikashitadeb04_db_user:cmrit123@fakeguardcluster.h5nk5go.mongodb.net/?appName=FakeGuardCluster"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)