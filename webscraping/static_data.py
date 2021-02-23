
import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
import glob
import os
from pprint import pprint
import simplejson as json
import requests
import time
from IPython.display import display
# Opening JSON file
f = open(r'passwords.json',)

# returns JSON object as a dictionary
data = json.load(f)

# Closing file
f.close()

# info to connect to the database
URL = data["database.url"]
PORT = "3306"
DB = data["database.db"]
USER = data["database.user"]
PASSWORD = data["database.password"]

# info for the web-scraping
NAME = "Dublin"  # name of contract
STATIONS_URL = data["api.url"]  # and the JCDecaux endpoint
APIKEY = data["api.key"]
engine = create_engine(
            "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
r= requests.get(STATIONS_URL, params={"apiKey":APIKEY, "contract":NAME})

def  station_to_db(text):
      stations = json.loads(text)
      for station in stations:
                
             vals = ( station.get("number"), station.get("address"), int(station.get("banking")), station.get("bike_stands"), 
                    int(station.get("bonus")), station.get("contract_name"), station.get("name"), 
                          station.get("position").get("lat"), station.get("position").get("lng"),
                                                                     station.get("status"))
             engine.execute("insert into station values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", vals)
      return
station_to_db(r.text)
