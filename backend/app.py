from flask import Flask, request
from flask_cors import CORS
import jwt
from flask import jsonify

app = Flask(__name__)
CORS(app)

from azure.cosmos import CosmosClient, PartitionKey
import os

# Azure Cosmos DB setup
url = os.environ['COSMOS_DB_URL']  # Replace with your Cosmos DB URL
key = os.environ['COSMOS_DB_KEY']  # Replace with your Cosmos DB key
client = CosmosClient(url, credential=key)

# Constants
database_name = 'YourDatabaseName'
container_name = 'YourContainerName'

# Ensure database exists
db = client.create_database_if_not_exists(id=database_name)

# Function to create or get a user-specific collection
def get_user_collection(user_oid):
    container_id = f"user-collection-{user_oid}"  # Unique ID for the user's collection
    try:
        container = db.create_container_if_not_exists(
            id=container_id,
            partition_key=PartitionKey(path="/partitionKey"),  # Adjust the partition key as needed
        )
        return container
    except Exception as e:
        print(f"An error occurred: {e}")
        # Handle exceptions appropriately

# Example usage
@app.route('/login', methods=['POST'])
def login():
    # ... Your existing login logic ...
    user_oid = jwt.decoded_token['oid']  # From your JWT decoding logic
    user_collection = get_user_collection(user_oid)
    # Use `user_collection` for further Cosmos DB operations for this user
    return 'User logged in and collection ensured.'

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' in request.files:
        audio_file = request.files['file']
        # Save the file, process it, etc.
        return 'File uploaded successfully', 200
    else:
        return 'No file found', 400

