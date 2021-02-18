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

# info to connect to the database
URL = "group-project.csuftpmigzgq.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbikes"
USER = "alvaro"
PASSWORD = "Oravla01"

# info for the web-scraping
NAME = "Dublin"  # name of contract
STATIONS_URL = "https://api.jcdecaux.com/vls/v1/stations"  # and the JCDecaux endpoint
APIKEY = "facbcc8b7cb57b3d308cd541f3c1bec268a36aff"

engine = create_engine(
    "mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)


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
