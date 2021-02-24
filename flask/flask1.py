#!/bin/bash

from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Hello! Welcome to Dublin Bikes!</h1>"

if __name__ == "__main__":
    app.run()
