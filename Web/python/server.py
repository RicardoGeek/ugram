from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/health")
def health():
    return {
        "status": "up"
    }

import user_routes
import album_routes
import photo_routes
import file_routes