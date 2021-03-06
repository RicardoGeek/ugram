from flask import Flask, request

app = Flask(__name__)

@app.route("/health")
def health():
    return {
        "status": "up"
    }

import user_routes
import album_routes
import photo_routes
import file_routes