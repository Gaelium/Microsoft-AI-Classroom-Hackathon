from flask import Flask, request, session, jsonify
from flask_session import Session
from flask_cors import CORS, cross_origin
import jwt
from flask import jsonify
from azure.cosmos import exceptions, CosmosClient, PartitionKey
import azure.cognitiveservices.speech as speechsdk
from werkzeug.utils import secure_filename
import os
from pydub import AudioSegment
import random
from azure.storage.blob import BlobServiceClient
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient

app = Flask(__name__)
app.secret_key = os.environ['FLASK_SECRET_KEY']
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.run(debug=True)

from datetime import timedelta

# Set session to permanent and configure lifetime
app.permanent_session_lifetime = timedelta(days=1)
# Azure Cognitive Search setup
search_service_name = "search-cap"
index_name = "students"
api_key = os.environ['SEARCH_API_KEY']

search_client = SearchClient(endpoint=f"https://{search_service_name}.search.windows.net/",
                             index_name=index_name,
                             credential=AzureKeyCredential(api_key))

# Initialize the Blob Service Client
blob_service_client = BlobServiceClient.from_connection_string(os.environ['COSMOS_BLOB_CONNECTION'])
container_name = 'students'
blob_container_client = blob_service_client.get_container_client(container_name)

# Azure Cosmos DB setup
url = os.environ['COSMOS_DB_URL']  # Replace with your Cosmos DB URL
key = os.environ['COSMOS_DB_KEY']  # Replace with your Cosmos DB key
client = CosmosClient(url, credential=key)
# temporary comment out

# Constants
database_name = os.environ['COSMOS_DB_NAME']
container_name = os.environ['COSMOS_DB_CONTAINER']

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
    token = request.headers.get('Authorization').split()[1]
    decoded_token = jwt.decode(token, options={"verify_signature": False})

    user_oid = decoded_token['oid']
    #set user_oid to session
    session["user_oid"] = user_oid
    session.modified = True
    print(session["user_oid"])
    user_collection = get_user_collection(user_oid)


    # Use `user_collection` for further Cosmos DB operations for this user
    return 'User logged in and collection ensured.'

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' in request.files:
        audio_file = request.files['file']
        file_path = secure_filename(audio_file.filename)
        #save webm file
        audio_file.save(file_path)
        print(audio_file)
        webm_audio = AudioSegment.from_file(file_path, format="webm")
        file_name = "output_filename.wav"
        # Export as .wav
        webm_audio.export(file_name, format="wav")

        
        #convert to wav file

        text = transcribe_audio(file_name)
        print(text)
        return 'File uploaded successfully', 200
    else:
        return 'No file found', 400


# we are assuming we have an audio file
@app.route('/transcribe-audio', methods=['POST'])
@cross_origin(supports_credentials=True)
def transcribe_audio(audio_file):
    subscription_key = os.environ["AUDIO"]
    region = os.environ["AUDIO_REGION"]
    #subscription key comes from azure cognitive services
    #so an example request would be:
    #https://YourRegion.api.cognitive.microsoft.com/sts/v1.0/issuetoken
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region, speech_recognition_language="en-US")
    audio_config = speechsdk.audio.AudioConfig(filename=audio_file)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = speech_recognizer.recognize_once()
    print("result")
    print(result)
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    elif result.reason == speechsdk.ResultReason.NoMatch:
        return "No speech could be recognized"
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        return "Speech Recognition canceled: {}".format(cancellation_details.reason)
    return "Something went wrong"
# so to test this function, we need to have an audio file

#function to upload files to class for a specific user
def add_material_to_class(user_oid, class_id, material_info):
    container = get_user_collection(user_oid)
    try:
        class_item = container.read_item(item=class_id, partition_key=user_oid)
        if 'materials' not in class_item:
            class_item['materials'] = []

        class_item['materials'].append(material_info)
        container.upsert_item(class_item)
    except Exception as e:
        print(f"An error occurred: {e}")
        # Handle exceptions appropriately
@app.route('/upload-material', methods=['POST'])

def upload_material():
    # ... existing logic for file upload ...

    if 'file' not in request.files:
        return 'No file part', 400

    user_oid = session.get('user_oid')
    print(user_oid)
    class_id = session.get('class_id')
    material_file = request.files['file']
    filename = secure_filename(material_file.filename)

    # Create a blob client using the local file name as the name for the blob
    blob_client = blob_container_client.get_blob_client(blob=f"{user_oid}/{class_id}/{filename}")

    # Upload the file to Azure Blob Storage
    blob_client.upload_blob(material_file)

    # Create material info with the URL of the blob
    material_info = {
        'filename': filename,
        'blob_url': blob_client.url,
        'type': 'pdf' or 'png'  # Determine based on the file
    }

    add_material_to_class(user_oid, class_id, material_info)
    return 'Material uploaded successfully', 200

@app.route('/create-class', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_class():
    user_oid = session.get('user_oid')
    container = get_user_collection(user_oid)
    class_info = request.json  # Assuming class details are sent in request body
    session["class_id"] = class_info

    try:
        class_info['id'] = 'class-' + str(random.randint(1000, 9999))  # Generate a random ID
        class_info['materials'] = []  # Initialize an empty list for materials
        container.create_item(class_info)
    except Exception as e:
        print(f"An error occurred: {e}")
    return jsonify({'message': 'Class created successfully'}), 200


# validate answer using langchain
@app.route('/validate-answer', methods=['POST'])
@cross_origin(supports_credentials=True)
def validate_answer():
    data = request.json
    question = data.get('question')
    user_answer = data.get('answer')
    user_oid = session.get('user_oid')

    # Step 1: Search for relevant materials using the question as the search query
    search_results = search_client.search(search_text=question, filter=f"user_oid eq '{user_oid}'")

    # Step 2: Extract relevant content from search results
    relevant_content = extract_relevant_content(search_results)

    # Step 3: Use Langchain to validate the answer
    feedback = langchain_validate_answer(question, user_answer, relevant_content)

    return jsonify({'feedback': feedback})

def extract_relevant_content(search_results):
    relevant_content = []

    for result in search_results:
        # Assuming 'content' field contains the main text of the material
        content = result.get('content', '') 
        if content:
            relevant_content.append(content)

    # Combine all relevant contents into a single text block, or handle as needed
    combined_content = ' '.join(relevant_content)
    return combined_content
    # Extract and return relevant content from search results
    # ...

def langchain_validate_answer(question, answer, content):
    # Use Langchain to analyze the answer against the content
    # Return feedback
    # ...
    return 'True'
