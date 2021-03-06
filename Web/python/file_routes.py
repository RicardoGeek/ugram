from server import app, request
from utils import files_helper
import boto3

@app.route('/upload', methods=['POST'])
def upload_file_temp():
    file = request.files['file']
    file.save('tmp/' + file.filename)

    return {
        'status': 'success',
        'file': file.filename
    }, 200

@app.route('/save', methods=['POST'])
def s3_save():
    request.get_json(force = True)
    data = request.json
    s3_client = boto3.client('s3')

    tmp_filename = data['filename']
    user = data['user_name']

    response = s3_client.upload_file('tmp/' + tmp_filename, 'bucket-imagenes-practica1', user + '/' + tmp_filename)

    return {
        'status': 'success',
        'result': user + '/' + tmp_filename
    }
    
