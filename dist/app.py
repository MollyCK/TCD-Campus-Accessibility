from flask import Flask, render_template, url_for, jsonify, request
import os, json, sqlalchemy
from pymongo import MongoClient
import pprint
from bson import Binary, Code
from bson.json_util import dumps

client = MongoClient('mongodb://rer:rer@123.56.68.67:7017/School')
db = client['School']
collection = db['Campus']

app = Flask(__name__)
@app.after_request
def after_request(response):
    '''
    Allows for Cross Origin Requests.
    '''
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
    
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))


pprint.pprint(collection.find_one({"id": 75}))

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/place/<id>')
def click_place_id(id):
    return dumps(collection.find_one({"id":int(id)}))

@app.route('/filter/<vals>', methods=['GET'])
def filter_submit(vals):
    # go into db and get n locations by some closest mean avg of each filter
    return vals


@app.route('/survey', methods=['POST'])
def submit_survey():
    data = request.json
    print(data["score"]["people"])
    return ("rer")


if __name__ == "__main__":
    app.run(debug=True)