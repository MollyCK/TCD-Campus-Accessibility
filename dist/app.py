from flask import Flask, render_template, url_for, jsonify, request
import os, json, sqlalchemy
import numpy as np
from pymongo import MongoClient
import pprint
from bson import Binary, Code
from bson.json_util import dumps
from flask_cors import CORS, cross_origin

client = MongoClient('mongodb://rer:rer@123.56.68.67:7017/School')
db = client['School']
collection = db['Campus']

app = Flask(__name__)

@app.after_request
def after_request(response):
    '''
    Allows for Cross Origin Requests.
    '''
    response.headers.add('Access-Control-Allow-Origin', '*')    # the wildcard (*) only works for requests made with the crossorigin attribute set to anonymous, and it prevents sending credentials like cookies in requests
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
    
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))




@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/place/<id>')
def click_place_id(id):
    return dumps(collection.find_one({"id":int(id)}))

@app.route('/filter/<vals>', methods=['GET'])
def filter_submit(vals):
 
    return "rer"


@app.route('/survey', methods=['GET'])
def submit_survey():
    print(request.json)
    data = request.json
    
    placeID = data["score"]["id"]
    doc = collection.find_one({"id":placeID})
    print(doc.keys())

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
    floorStickyAnswer, floorUnevenAnswer]
   
    scoreKeys =  ['people', 'movement', 'talking', 'noise', 'light', 'lightBright', 'lightFlickering', 'lightColourPeculiar', 'smells', 'floorSticky', 'floorUneven',]

    count = 0
    for surveyValue in answersArray:
        key = scoreKeys[count]
        if surveyValue == 1:
            doc[key][0]["No"] = doc[key][0]["No"] + 1
        elif surveyValue == 2:
            doc[key][1]["Rarely"] = doc[key][1]["Rarely"] + 1
        elif surveyValue == 3:
            doc[key][2]["Sometimes"] = doc[key][2]["Sometimes"] + 1
        else:
            doc[key][3]["Yes"] = doc[key][3]["Yes"] + 1

        count = count + 1

    if seatsHardAnswer == 1: 
        doc["seatsHard"][0]["Soft"] = doc["seatsHard"][0]["Soft"] + 1
    else: 
        doc["seatsHard"][1]["Hard"] = doc["seatsHard"][1]["Hard"] + 1

    if texturesAnswer == 1: 
        doc["texturesRough"][0]["Smooth"] = doc["texturesRough"][0]["Smooth"] + 1
    else: 
        doc["texturesRough"][1]["Rough"] = doc["texturesRough"][1]["Rough"] + 1

    if data["score"]["noisesType"] == "Voices":
        doc["noiseType"][0]["Voices"] = doc["noiseType"][0]["Voices"] + 1
    elif data["score"]["noisesType"] == "Cutlery/Furniture":
        doc["noiseType"][1]["Cutlery/Furniture"] = doc["noiseType"][1]["Cutlery/Furniture"] + 1








    return ("done")


if __name__ == "__main__":
    app.run(debug=True)