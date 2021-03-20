import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
import simplejson as json
import requests
import json
import csv
import time
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
NAME = "Dublin"  # name of contract
STATIONS_URL = data["api.url"]  # and the JCDecaux endpoint
APIKEY = data["api.key"]

engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)


# Inject the dinamic info into the database and a csv file
def write_to_db(text):
    # Variable to check when the csv file should be closed
    checker = False
    stations = json.loads(text)
    for station in stations:
        vals = [station.get("number"), station.get("available_bikes"),
                station.get("available_bike_stands"), station.get("last_update")]

        # Checks if a row with that information already exists
        try:
            vals[3] = datetime.fromtimestamp(vals[3] / 1e3)
            engine.execute(
                "insert into availability (number, available_bikes, available_bikes_stands, last_update) values(%s,%s,%s,%s)", vals)
            with open(r'dinamic_data.csv', mode='a') as csv_file:
                fieldnames = ['number', 'available_bikes',
                              'available_bikes_stands', 'last_update']
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

                writer.writerow({'number': vals[0], 'available_bikes': vals[1],
                                 'available_bikes_stands': vals[2], 'last_update': vals[3]})
            checker = True
<<<<<<< HEAD
        except:
            print("Row already exist")
=======
        except Exception as e:
            print(e)
>>>>>>> alvaro
            continue

    if checker:
        csv_file.close()
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
            time.sleep(2*60)
    return


if __name__ == '__main__':
    main()
