from flask import Flask, request
from flask_cors import CORS
import jwt
from flask import jsonify

app = Flask(__name__)
CORS(app)

from azure.cosmos import CosmosClient, PartitionKey
import os

# Azure Cosmos DB setup
# url = os.environ['COSMOS_DB_URL']  # Replace with your Cosmos DB URL
# key = os.environ['COSMOS_DB_KEY']  # Replace with your Cosmos DB key
# client = CosmosClient(url, credential=key)
# temporary comment out

# Constants
database_name = 'YourDatabaseName'
container_name = 'YourContainerName'

# Ensure database exists
# db = client.create_database_if_not_exists(id=database_name)
db = None

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
        # with this audio_file, feed it into speech to text using azure cognitive services:
        # https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-speech-to-text
        # Save the file, process it, etc.
        return 'File uploaded successfully', 200
    else:
        return 'No file found', 400


# we are assuming we have an audio file
@app.route('/transcribe-audio', methods=['POST'])
def transcribe_audio(audio_file):
    subscription_key = "YourSubscriptionKey"
    region = "YourRegion"
    #subscription key comes from azure cognitive services
    #so an example request would be:
    #https://YourRegion.api.cognitive.microsoft.com/sts/v1.0/issuetoken
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    audio_config = speechsdk.audio.AudioConfig(filename=audio_file)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = speech_recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    elif result.reason == speechsdk.ResultReason.NoMatch:
        return "No speech could be recognized"
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        return "Speech Recognition canceled: {}".format(cancellation_details.reason)
    return "Something went wrong"
# so to test this function, we need to have an audio file
    
    

