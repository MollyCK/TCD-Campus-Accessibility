from flask import Flask, render_template, url_for, jsonify, request
import os, json, sqlalchemy, arrayComputation
import numpy as np
from arrayComputation import array_maths
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


#pprint.pprint(collection.find_one({"id": 75}))

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/place/<id>')
def click_place_id(id):
    return dumps(collection.find_one({"id":int(id)}))

@app.route('/filter/<vals>', methods=['GET'])
def filter_submit(vals):
    return vals


@app.route('/survey', methods=['POST'])
def submit_survey():
    data = request.json
    placeID = data["score"]["id"]
    doc = collection.find_one({"id":placeID})

    peopleAnswer = data["score"]["people"]
    movementAnswer = data["score"]["movement"]
    talkingAnswer = data["score"]["talking"]
    noiseAnswer = data["score"]["noise"]
    lightAnswer = data["score"]["light"]
    lightBrightAnswer = data["score"]["lightBright"]
    lightFlickeringAnswer = data["score"]["lightFlickering"]
    lightColourPeculiarAnswer = data["score"]["lightColourPeculiar"]
    smellsAnswer = data["score"]["smells"]
    floorStickyAnswer = data["score"]["floorSticky"]
    floorUnevenAnswer = data["score"]["floorUneven"]
    seatsHardAnswer = data["score"]["seatsHardBinary"]
    texturesAnswer = data["score"]["texturesRoughBinary"]

    peopleAnswer = data["score"]["people"]
    movementAnswer = data["score"]["movement"]
    talkingAnswer = data["score"]["talking"]
    noiseAnswer = data["score"]["noise"]
    lightAnswer = data["score"]["light"]
    lightBrightAnswer = data["score"]["lightBright"]
    lightFlickeringAnswer = data["score"]["lightFlickering"]
    lightColourPeculiarAnswer = data["score"]["lightColourPeculiar"]
    smellsAnswer = data["score"]["smells"]
    floorStickyAnswer = data["score"]["floorSticky"]
    floorUnevenAnswer = data["score"]["floorUneven"]
    seatsHardAnswer = data["score"]["seatsHardBinary"]
    texturesAnswer = data["score"]["texturesRoughBinary"]



    answersArray = [peopleAnswer, movementAnswer, talkingAnswer, noiseAnswer, lightAnswer, lightBrightAnswer, lightFlickeringAnswer, lightColourPeculiarAnswer, smellsAnswer, 
    floorStickyAnswer, floorUnevenAnswer, seatsHardAnswer,texturesAnswer]
   
    for surveyValue in answersArray:
        count = 0
        if surveyValue == 1:
            array = np.array([1, 0, 0, 0])
        elif surveyValue == 2:
            array = np.array([0, 1, 0 ,0])
        elif surveyValue == 3:
            array = np.array([0, 0, 1, 0])
        else:
            array = np.array([0, 0, 0, 1])
        newArray = numpy.add(array,dbArray[count])
        collection.insert_one({id:newArray})
        count = count + 1





    return ("done")


if __name__ == "__main__":
    app.run(debug=True)