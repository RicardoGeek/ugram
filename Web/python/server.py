from flask import Flask, request

app = Flask(__name__)

import user_routes
import album_routes
import photo_routes