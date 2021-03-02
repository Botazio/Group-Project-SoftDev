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
from datetime import datetime



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
city_name = "Dublin, IE"  # name of contract
base_url = data["weatherAPI.url"]  # and the JCDecaux endpoint
api_key = data["weatherAPI.key"]

complete_url = base_url + "appid=" + api_key + "&q=" + city_name

engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

def weather_to_db(text):
    weather = json.loads(text)

    vals = [weather['weather'][0]['description'], weather['weather'][0]['icon'], weather['main']['temp'], weather['main']['temp_min'],
            weather['main']['temp_max'], weather['main']['humidity'], weather['dt']]
    vals[6] = datetime.fromtimestamp(vals[6])

    engine.execute("insert into weather values(%s,%s,%s,%s,%s,%s,%s)", vals)

    return


def main():
    while True:
        try:
            r = requests.get(complete_url)
            weather_to_db(r.text)

            time.sleep(10*60)
        except:

            print(traceback.format_exc())
            time.sleep(2*60)
    return

if __name__ == '__main__':
    main()
