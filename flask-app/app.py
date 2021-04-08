from flask import Flask, render_template, url_for, request, redirect
from sqlalchemy import create_engine
from datetime import datetime
import json
import pandas as pd
import os
import re
import pickle
import numpy as np

app = Flask(__name__)

# Opening JSON file
f = open(r'passwords.json',)

# returns JSON object as a dictionary
data = json.load(f)

# Closing file
f.close()

# Info to connect to the database
URL = data["database.url"]
PORT = 3306
DB = data["database.db"]
USER = data["database.user"]
PASSWORD = data["database.password"]

# Create engine
engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)


# Class to extract the data from the different tables in the database
class getData():
    def __init__(self, engine):
        self.engine = engine

    def getStations(self):
        try:
            df = pd.read_sql_table('station', self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    def getAvailability(self):
        try:
            df = pd.read_sql_query(
                "SELECT * FROM (SELECT * FROM dbikes.availability as av ORDER BY av.id  DESC LIMIT 1000 ) as whatever GROUP BY whatever.number;", self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    def getOcuppancy(self, num):
        try:
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%Y-%m-%d') as date, avg(available_bikes) as ocuppancy_bikes,
            avg(available_bikes_stands) as ocuppancy_stands FROM dbikes.availability
            WHERE number = { num } GROUP BY number, date(last_update) ORDER BY last_update ASC;"""
            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    def getDailyOcuppancy(self, num, date):
        try:
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%d-%m-%Y-%H') as date, available_bikes,
            available_bikes_stands FROM dbikes.availability
            WHERE number = { num } and DATE_FORMAT(last_update,'%d-%m-%Y') = '{ date }'
            GROUP BY DATE_FORMAT(last_update,'%d-%m-%Y-%H');"""
            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    def getHistoricalAvgOcuppancy(self, type):
        try:
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%Y')as date, avg(available_bikes) as bikes, avg(available_bikes_stands) as stands FROM dbikes.availability
            GROUP BY number, year(last_update)
            ORDER BY { type } desc;"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    def getHistoricalWeather(self):
        try:
            sql = f"""SELECT description, icon, temp, temp_min, temp_max, humidity, DATE_FORMAT(dt,'%Y-%m-%d')as date 
            FROM dbikes.weather
            GROUP BY date(dt)
            ORDER BY date ASC;"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results


def get_Models_get_predictions(num, temp, hour, description, day):
    Bikesfiles = {}
    Standsfiles = {}

    if hour < 11:
        hours = list(range(hour, hour+12, 1))

    else:
        hours_left = 23 - hour
        hours_start = list(range(hour, hour+hours_left+1, 1))
        hours_to_add = 12 - hours_left
        other_hours = list(range(hours_to_add))
        hours = hours_start + other_hours

    for file in os.listdir('static/MLModel/'):
        if file.endswith("Bikes.pkl"):
            regex = re.compile(r'\d+')
            station = [int(x) for x in regex.findall(file)]
            Bikesfiles[station[0]] = file

        elif file.endswith("Stands.pkl"):
            regex = re.compile(r'\d+')
            station = [int(x) for x in regex.findall(file)]
            Standsfiles[station[0]] = file

    BikesModelName = Bikesfiles.get(num)
    StandsModelName = Standsfiles.get(num)

    with open('static/MLModel/' + BikesModelName, 'rb') as handle:
        modelBikes = pickle.load(handle)

    with open('static/MLModel/' + StandsModelName, 'rb') as handle:
        modelStands = pickle.load(handle)
    predictionsBikes = {}
    for x in hours:
        array = np.array([temp, x, description, day])
        x_test = array.reshape(1, -1)
        p = modelBikes.predict(x_test)
        predictionsBikes[x] = p.astype(int)

    predictionsStands = {}
    for x in hours:
        array = np.array([temp, x, description, day])
        x_test = array.reshape(1, -1)
        p = modelStands.predict(x_test)
        predictionsStands[x] = p.astype(int)

    return predictionsBikes


@ app.route('/')
def index():
    return render_template('index.html')


@ app.route('/predictions')
def predictions():
    return render_template('predictions.html')


@ app.route('/how_it_works')
def howItWorks():
    return "hello"


@ app.route('/about')
def about():
    return render_template(('about.html'))


@ app.route('/query/<string:num>/<string:temp>/<int:hour>/<string:description>/<string:day>')
def query_prediction_model(num, temp, hour, description, day):
    num = int(num)
    temp = float(temp)
    hour = int(hour)
    description = 3
    query = get_Models_get_predictions(num, temp, hour, description, 2)

    return {'hello': 42}


@ app.route('/stations')
def stations():
    stations = getData(engine).getStations()
    return stations


@ app.route('/availability')
def availability():
    availability = getData(engine).getAvailability()
    return availability


@ app.route('/occupancy/<int:station_id>')
def get_occupancy(station_id):
    occupancy = getData(engine).getOcuppancy(station_id)
    return occupancy


@ app.route('/daily_occupancy/<int:station_id>/<string:date>')
def get_daily_occupancy(station_id, date):
    print(date)
    dailyOccupancy = getData(engine).getDailyOcuppancy(station_id, date)
    return dailyOccupancy


@ app.route('/historical_occupancy/<string:occupancy_type>')
def get_historical_occupancy(occupancy_type):
    historical_occupancy = getData(
        engine).getHistoricalAvgOcuppancy(occupancy_type)
    return historical_occupancy


@ app.route('/historical_weather')
def get_historical_weather():
    historical_weather = getData(engine).getHistoricalWeather()
    return historical_weather


if __name__ == "__main__":
    app.run(debug=True)
