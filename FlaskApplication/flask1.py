
from flask import Flask, render_template
from jinja2 import Template
from sqlalchemy import create_engine
import pandas as pd

URL="dbikes.c3unsvuvmclp.us-east-1.rds.amazonaws.com"
PORT="3306"
DB="dbikes"
USER="mark"
PASSWORD = "COMP30830"

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/stations")
def stations():
    engine= create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URL, PORT, DB), echo=True)
    df = pd.read_sql("SELECT * from station", engine)
    #results = engine.execute("select * from stations")
    #print([res for res in results])
    #print(df.head())
    #print(df.head(3).to_json(orient='records'))
    return df.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
