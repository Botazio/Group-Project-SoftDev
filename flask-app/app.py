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

    # Gets the stations data
    def getStations(self):
        try:
            df = pd.read_sql_table('station', self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the availability data
    def getAvailability(self):
        try:
            df = pd.read_sql_query(
                "SELECT * FROM (SELECT * FROM dbikes.availability as av ORDER BY av.id  DESC LIMIT 1000 ) as whatever GROUP BY whatever.number;", self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the historical occupancy for a station
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

    # Gets the occupancy for a station for a single day
    def getDailyOcuppancy(self, num, date):
        try:
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%Y-%m-%d-%H') as date, available_bikes,
            available_bikes_stands FROM dbikes.availability
            WHERE number = { num } and DATE_FORMAT(last_update,'%Y-%m-%d') = '{ date }'
            GROUP BY DATE_FORMAT(last_update,'%Y-%m-%d-%H');"""
            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the occupancy for all the stations at a certain hour
    def getDailyHourlyOcuppancy(self, date, hour, type):
        try:
            dayTime = date + "-" + hour
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%Y-%m-%d-%H') as date, avg(available_bikes) as bikes,
            avg(available_bikes_stands) as stands FROM dbikes.availability
            WHERE  DATE_FORMAT(last_update,'%Y-%m-%d-%H') = '{ dayTime }'
            GROUP BY number ORDER BY { type } desc;"""
            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the occupancy for all the stations for a certain day
    def getCompleteDailyOcuppancy(self, date, type):
        try:
            sql = f"""SELECT number, DATE_FORMAT(last_update,'%Y-%m-%d') as date, avg(available_bikes) as bikes,
            avg(available_bikes_stands) as stands FROM dbikes.availability
            WHERE  DATE_FORMAT(last_update,'%Y-%m-%d') = '{ date }'
            GROUP BY number, date(last_update) ORDER BY { type } desc;"""
            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the average occupancy for each station through time
    def getHistoricalAvgOcuppancy(self, type):
        try:
            sql = f"""SELECT number, avg(available_bikes) as bikes, avg(available_bikes_stands) as stands FROM dbikes.availability
            GROUP BY number
            ORDER BY { type } desc;"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the average occupancy for the sum of all the stations for each day
    def getCompleteHistoricalAvgOcuppancy(self):
        try:
            sql = f"""SELECT DATE_FORMAT(last_update,'%Y-%m-%d')as date, avg(available_bikes) as bikes, avg(available_bikes_stands) as stands
            FROM dbikes.availability
            GROUP BY DATE_FORMAT(last_update,'%Y-%m-%d')
            ORDER BY date"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the average occupancy for the sum of all the station in all time
    def getOcuppancyRelation(self):
        try:
            sql = f"""SELECT  avg(available_bikes) as bikes, avg(available_bikes_stands) as stands
            FROM dbikes.availability"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the weather for a certain day and hour
    def getDailyHourlyWeather(self, date, hour):
        try:
            dayTime = date + "-" + hour
            sql = f"""SELECT description, icon, temp, temp_min, temp_max, humidity, DATE_FORMAT(dt,'%Y-%m-%d-%H')as date 
            FROM dbikes.weather WHERE DATE_FORMAT(dt,'%Y-%m-%d-%H') = '{ dayTime }' LIMIT 1;"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the weather for a certain day
    def getDailyWeather(self, date):
        try:
            sql = f"""SELECT description, icon, temp, temp_min, temp_max, humidity, DATE_FORMAT(dt,'%Y-%m-%d-%H-%i')as date 
            FROM dbikes.weather WHERE DATE_FORMAT(dt,'%Y-%m-%d') = '{ date }';"""

            df = pd.read_sql_query(sql, self.engine)
            results = df.to_json(orient='records')
        except Exception as e:
            return e

        return results

    # Gets the historical weather
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


# Function to get predictions for a certain input
def get_Models_get_predictions(num, temp, hour, description, day):
    DayDict = {'Friday': 0,
               'Wednesday': 6,
               'Saturday': 2,
               'Tuesday': 5,
               'Thursday': 4,
               'Monday': 1,
               'Sunday': 3}

    description_dict = {'light rain': 5,
                        'broken clouds': 0,
                        'clear sky': 1,
                        'mist': 7,
                        'few clouds': 2,
                        'moderate rain': 8,
                        'scattered clouds': 10,
                        'overcast clouds': 9,
                        'light intensity drizzle': 4,
                        'light snow': 6,
                        'heavy intensity rain': 3}

    # encode categorical data to numeric for model
    description_encoded = description_dict.get(description)
    day_encoded = DayDict.get(day)

    Bikesfiles = {}
    Standsfiles = {}

    if hour < 11:
        hours = list(range(hour, hour+12, 1))

    else:
        hours_left = 23 - hour
        hours_start = list(range(hour, hour+hours_left+1, 1))
        hours_to_add = 11 - hours_left
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
    predictionsBikes = []
    for i in range(len(hours)):
        array = np.array([temp, hours[i], description_encoded, day_encoded])
        x_test = array.reshape(1, -1)
        p = modelBikes.predict(x_test)
        predictionsBikes.append(int(p))

    predictionsStands = []
    for i in range(len(hours)):
        array = np.array([temp, hours[i], description_encoded, day_encoded])
        x_test = array.reshape(1, -1)
        p = modelStands.predict(x_test)
        predictionsStands.append(int(p))

    return json.dumps({"bikes": predictionsBikes, "stands": predictionsStands})

# Routes for the different pages in the application


@ app.route('/')
def index():
    return render_template('index.html')


@ app.route('/predictions')
def predictions():
    return render_template('predictions.html')


@ app.route('/how_it_works')
def howItWorks():
    return render_template('how2.html')


@ app.route('/about')
def about():
    return render_template(('about.html'))

# Routes for dinamic data that is fetch by JavaScript


@ app.route('/query/<string:num>/<string:temp>/<string:hour>/<string:description>/<string:day>')
def query_prediction_model(num, temp, hour, description, day):
    num = int(num)
    temp = float(temp)
    hour = int(hour)
    query = get_Models_get_predictions(num, temp, hour, description, day)
    print(query)
    return query


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


@ app.route('/daily_hourly_occupancy/<string:date>/<string:hour>/<string:occupancy_type>')
def get_daily_hourly_occupancy(date, hour, occupancy_type):
    dailyHourlyOccupancy = getData(
        engine).getDailyHourlyOcuppancy(date, hour, occupancy_type)
    return dailyHourlyOccupancy


@ app.route('/daily_occupancy/<int:station_id>/<string:date>')
def get_daily_occupancy(station_id, date):
    dailyOccupancy = getData(engine).getDailyOcuppancy(station_id, date)
    return dailyOccupancy


@ app.route('/complete_daily_occupancy/<string:date>/<string:occupancy_type>')
def get_complete_daily_occupancy(date, occupancy_type):
    completeDailyOccupancy = getData(
        engine).getCompleteDailyOcuppancy(date, occupancy_type)
    return completeDailyOccupancy


@ app.route('/historical_occupancy/<string:occupancy_type>')
def get_historical_occupancy(occupancy_type):
    historical_occupancy = getData(
        engine).getHistoricalAvgOcuppancy(occupancy_type)
    return historical_occupancy


@ app.route('/complete_historical_occupancy')
def get_complete_historical_occupancy():
    complete_historical_occupancy = getData(
        engine).getCompleteHistoricalAvgOcuppancy()
    return complete_historical_occupancy


@ app.route('/occupancy_relation')
def get_occupancy_relation():
    occupancy_relation = getData(
        engine).getOcuppancyRelation()
    return occupancy_relation


@ app.route('/daily_weather/<string:date>/<string:hour>')
def get_daily_hourly_weather(date, hour):
    daily_hourly_weather = getData(engine).getDailyHourlyWeather(date, hour)
    return daily_hourly_weather


@ app.route('/daily_weather/<string:date>')
def get_daily_weather(date):
    daily_weather = getData(engine).getDailyWeather(date)
    return daily_weather


@ app.route('/historical_weather')
def get_historical_weather():
    historical_weather = getData(engine).getHistoricalWeather()
    return historical_weather


if __name__ == "__main__":
    app.run(host="0.0.0.0")
