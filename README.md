# Group-Project-SoftDev
**Team Members**: Alvaro Garcia, Ellie Breen, Mark Seaver 

The DBikes application provides an informative and engaging platform for Dublin Bikes. The aim of the application is to help users find the best station to rent and return a bike. It offers the user an interactive platform whereby they can visualise the availability for stations, the weather and historical data for stations. The predictions page provides a predictive availability value, based on hour, day and weather. This will allow users to make smarter decisions on where and when to rent a DBike.

**Folders and content:**
1. **venv**
      1. _conda packages_ - requirement files for all conda packages used
      2. _pip packages_ - requirement files for all pip packages

2. **webscraping**
      1. _database_connection_ - to create tables for availability, weather and static station information
      2. _main.py_ which scrapes the JCdecaux api to provide dynamic availability data for the stations every 5 minutes
      3. _static_data.py_ - the code used to obtain the static station information from jcDecaux
      4. _weather_Data.py_ to scrape the openweather api for the current weather forecast at 15 minute intervals

3. **Data_Analytics**
      1. _DataProcessingAndPrepFinal_ - a notebook containing the data prep and cleaning before training the model 
      2. _Final_Model_ - the process of splitting the data, training and testing it with accuracy visualisations
      3. _Models_- a folder containing all the pickle files for each station - one for bikes and one for stands per station

4.  **flask-app**
      1. _app.py_ - the flask file that contains the get_data class to obtain the data from the databases and the get_models_get_predictions which obtains a prediction from the model          correlating to the station chosen by the user       
      2. _templates_ - folder containing a base html and and index html which extends the base      
      3. _static_ - folder containing 3 folders:

              1. css - main css, navbar css and other pages style sheets
              2. fixtures - containing any icons or images used in the application
              3. js - a main js, a styled map js and a specific nav bar animation js - all used to ensure the application is responsive 
