// fetch weather forecast info
fetch('https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.266155&exclude=currently,minuetely,hourly&units=metric&appid=f092bb2fdf927ba79511674732a39c36')
  .then(function (response) {
    return response.json();
  })//pass data into displayForecast function
  .then(function (data) {
    displayForecast(data);
  }) //catch any errors
  .catch(function (err) {
    console.log(err);
  });
  
  //function to display forecast
function displayForecast(data){  
    // store daily info needed in variable
    var dailyInfo = data['daily'];      
// create a data dictionary of dates and values corresponsing to the dates
    var data=[];
    var datelist=[];
        //iterate through the info and store dates as keys and weather info as a nested dict
        for (var i=0;i<dailyInfo.length;  i++ ){
          var dateData = {
          "Temp":dailyInfo[i].temp,
          "Weather": dailyInfo[i].weather, 
          "Wind":dailyInfo[i].wind_speed};
            data.push({
              key:dailyInfo[i].dt,
              value: dateData});
              datelist.push(dailyInfo[i].dt);
        }
    // variables to store day names and dates 
      var dayName=[];
      var date=[];
      var formattedDates=[];

      //iterate through the dates and format them from unix timestamps to days and dates 
      for (var i=0; i <datelist.length; i++){  
         
          formattedDates = new Date(datelist[i]*1000);
          dayName.push(formattedDates.toString().split(' ')[0]);
          date.push(formattedDates.toString().substr(4,6));
          
          //create a variable to display the weather 
          var DisplayWeather='';  
          //create a table to display weather   
          var table = "<table class='Weather'><caption>7-Day Weather Forecast</caption>";
          //iterate through the data and display day, date, temp, description, icon and wind
          for (var j =0; j <data.length; j++){
              table+= "<th>"+ dayName[j] + "</th><tr><td>" + date[j] + "</td></tr><tr><td>"+ data[j].value['Temp']['day'] 
              + "&#8451;</td></tr><tr><td>" + data[j].value['Weather'][0]['description'] 
              + "</td></tr><tr><td><img class='icons2' height = '50px' width = '50px' src='http://openweathermap.org/img/w/" + data[j].value['Weather'][0]['icon']
              +".png'/></td></tr><tr><td>" +  data[j].value['Wind'] +  "mph</td></tr>";
          
          
        }
        DisplayWeather += table;
        //Close the table
        DisplayWeather += "</table>"
        //Dispay info in container table
        document.getElementById('containerTable').innerHTML = DisplayWeather;

      
      }
  }
