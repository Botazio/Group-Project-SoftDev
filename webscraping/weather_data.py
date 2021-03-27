import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======
>>>>>>> developer
import glob
import os
from pprint import pprint
import simplejson as json
import requests
import time
from IPython.display import display
import json
from datetime import datetime



<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======
import simplejson as json
import requests
import json
import csv
import time
from datetime import datetime


<<<<<<< HEAD
>>>>>>> alvaro
=======
>>>>>>> developer
=======
>>>>>>> be08b5eeb242697c2007873255404ac083930b21
>>>>>>> developer
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

base_url = data["weatherAPI.url"]  # and the open weather endpoint
api_key = data["weatherAPI.key"]

complete_url = base_url + "appid=" + api_key + "&q=Dublin, IE&units=metric"

engine = create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======
>>>>>>> developer
def weather_to_db(text):
    checker = False
    weather = json.loads(text)
    
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======

def weather_to_db(text):
    checker = False
    weather = json.loads(text)

<<<<<<< HEAD
>>>>>>> alvaro
=======
>>>>>>> developer
=======
>>>>>>> be08b5eeb242697c2007873255404ac083930b21
>>>>>>> developer
    vals = [weather['weather'][0]['description'], weather['weather'][0]['icon'], weather['main']['temp'], weather['main']['temp_min'],
            weather['main']['temp_max'], weather['main']['humidity'], weather['dt']]
    try:
        vals[6] = datetime.fromtimestamp(vals[6])

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======
>>>>>>> developer
        engine.execute("insert into weather values(%s,%s,%s,%s,%s,%s,%s)", vals)

        with open(r'weather_data.csv', mode='a') as csv_file:
                    fieldnames = ['description', 'icon',
                              'temp', 'temp_min', 'temp_max', 'humidity', 'dt']
                    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

                    writer.writerow({'description': vals[0], 'icon': vals[1],
                                 'temp': vals[2], 'temp_min': vals[3], 'temp_max': vals[4], 'humidity': vals[5],
                                 'dt': vals[6]})
        checker = True

    except:
        print("Row already exist")
        

    if checker:
        csv_file.close()
    
    
def main():
    while True:
        try:
            r = requests.get(complete_url)            
            weather_to_db(r.text)
            
            time.sleep(15*60)
        except:
            
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> developer
=======
        engine.execute(
            "insert into weather values(%s,%s,%s,%s,%s,%s,%s)", vals)

        with open(r'weather_data.csv', mode='a') as csv_file:
            fieldnames = ['description', 'icon', 'temp',
                          'temp_min', 'temp_max', 'humidity', 'dt']
            try:
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

                writer.writerow({'description': vals[0], 'icon': vals[1],
                                 'temp': vals[2], 'temp_min': vals[3], 'temp_max': vals[4], 'humidity': vals[5],
                                 'dt': vals[6]})
            except Exception as e:
                print(e)
        checker = True

    except Exception as e:
        print(e)

    if checker:
        csv_file.close()


def main():
    while True:
        try:
            r = requests.get(complete_url)
            weather_to_db(r.text)

            time.sleep(15*60)
        except:

<<<<<<< HEAD
>>>>>>> alvaro
=======
>>>>>>> developer
=======
>>>>>>> be08b5eeb242697c2007873255404ac083930b21
>>>>>>> developer
            print(traceback.format_exc())
            time.sleep(15*60)
    return

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> alvaro
=======
>>>>>>> developer
=======
=======

>>>>>>> be08b5eeb242697c2007873255404ac083930b21
>>>>>>> developer
if __name__ == '__main__':
    main()
