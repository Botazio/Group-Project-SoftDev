'''
Created on 18 Feb 2021

@author: alvaro
'''
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
import json

# Opening JSON file
f = open('passwords.json',)

# returns JSON object as a dictionary
data = json.load(f)

print()

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
    "mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

# Inject the dinamic info into the database


def write_to_db(text):
    stations = json.loads(text)
    for station in stations:
        vals = (station.get("number"), station.get("available_bikes"),
                station.get("available_bike_stands"), station.get("last_update"))
        engine.execute(
            "insert into availability (number, available_bikes, available_bikes_stands, last_update) values(%s,%s,%s,%s)", vals)
    return


def main():

    while True:
        try:
            r = requests.get(STATIONS_URL, params={
                "apiKey": APIKEY, "contract": NAME})

            write_to_db(r.text)
            # now sleep for 5 minutes
            time.sleep(5*60)
        except:
            # if there is any problem, print the traceback
            print(traceback.format_exc())

    return


if __name__ == '__main__':
    main()
