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
engine = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

sql = """
CREATE DATABASE IF NOT EXISTS dbbikes;
"""
engine.execute(sql)

sql = """
CREATE TABLE IF NOT EXISTS station (
number INTEGER,
address VARCHAR (256),
banking INTEGER,
bike_stands INTEGER,
bonus INTEGER,
contract_name VARCHAR(256),
name VARCHAR(256),
position_lat REAL,
position_lng REAL,
status VARCHAR(256)
);
"""

try:
        res = engine.execute("DROP TABLE IF EXISTS station")
            res = engine.execute(sql)
                print(res.fetchall())
except Exception as e:
        print(e)

        sql = """
        CREATE TABLE IF NOT EXISTS availability (
        number INTEGER,
        available_bikes INTEGER,
        available_bikes_stands INTEGER,
        last_update INTEGER
        );
        """
        try:
            res = engine.execute(sql)
                print(res.fetchall())
        except Exception as e:
                print(e)

sql = """
CREATE TABLE IF NOT EXISTS weather (
description VARCHAR(256),
icon VARCHAR(256),
temp INTEGER,
temp_min INTEGER,
temp_max INTEGER,
humidity INTEGER,
dt DATETIME
);
"""
try:
        res = engine.execute(sql)
            print(res.fetchall())
except Exception as e:
        print(e)
