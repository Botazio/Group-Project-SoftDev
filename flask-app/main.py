from flask import Flask, render_template, url_for, request, redirect
from sqlalchemy import create_engine
from datetime import datetime
import json
import pandas as pd

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
        except:
            return "Error: something wrong happened"

        return results

    def getAvailability(self):
        try:
            df = pd.read_sql_query(
                "SELECT * FROM (SELECT * FROM dbikes.availability as av ORDER BY av.id  DESC LIMIT 1000 ) as whatever GROUP BY whatever.number;", self.engine)
            results = df.to_json(orient='records')
        except:
            return "Error: something wrong happened"

        return results


@ app.route('/')
def index():
    return render_template('index.html')


@ app.route('/home')
def home():
    return "hello"


@ app.route('/stations')
def stations():
    stations = getData(engine).getStations()
    return stations


@ app.route('/availability')
def availability():
    availability = getData(engine).getAvailability()
    return availability


@ app.route('/predictions')
def predictions():
    return "hello"


@ app.route('/how_it_works')
def howItWorks():
    return "hello"


@ app.route('/about')
def about():
    return "hello"


if __name__ == "__main__":
    app.run(debug=True)
