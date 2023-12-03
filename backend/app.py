from flask import Flask, request
from flask_cors import CORS
import jwt
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    token = request.headers.get('Authorization').split()[1]  # Assuming Bearer token
    decoded_token = jwt.decode(token, options={"verify_signature": False})
    print(decoded_token)
    user_id = decoded_token['oid']  # or other relevant user identifier
    # Here, add logic to check Cosmos DB and create a collection if needed
    return jsonify({"message": "User logged in", "user_id": user_id})

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' in request.files:
        audio_file = request.files['file']
        # Save the file, process it, etc.
        return 'File uploaded successfully', 200
    else:
        return 'No file found', 400

