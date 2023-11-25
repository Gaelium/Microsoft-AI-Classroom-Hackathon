from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'file' in request.files:
        audio_file = request.files['file']
        # Save the file, process it, etc.
        return 'File uploaded successfully', 200
    else:
        return 'No file found', 400
