animationButtons();
searchOptions();
callGoogleCharts();

function callGoogleCharts() {
   google.charts.load('current', {'packages':['corechart']});
}

function animationButtons() {
   const predictionsButton = document.getElementById("predictions-container");
   const historicalButton = document.getElementById("historical-container");
   const stationButton = document.getElementById("station-container");
   const fullSearchButton = document.getElementById("full-search-container");
   const stationSearchContainer = document.getElementById("station-search-container");
   const stationInput = document.getElementById("station-input");
   const date = document.getElementById("calendar");
   const hour = document.getElementById("hour");
   const darkMode = document.getElementById("dark-mode-container");
   const searchButton = document.getElementById("search-button-container");

   // Dates and hours for the calendar 
   var today = new Date();
   var nextHalfHour = new Date();
   nextHalfHour.setSeconds(0,0);
   Date.prototype.addMinutes = function(m) {
      this.setTime(this.getTime() + (m*60*1000));
      return this;
    }
   nextHalfHour.addMinutes(30);
   nextHalfHour = nextHalfHour.toLocaleTimeString('en-GB');

   today = today.toISOString().split("T")[0];
   var yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   yesterday = yesterday.toISOString().split("T")[0];

   // Set the initial values
   date.min = today;
   date.max = "2030-01-01"
   date.value = "";
   hour.min = nextHalfHour;
   hour.value = "";
   stationInput.value = "";

   searchButton.addEventListener("click", () => {
      // Refresh the hour for future searchs 
      nextHalfHour = new Date();
      nextHalfHour.setSeconds(0,0);
      Date.prototype.addMinutes = function(m) {
         this.setTime(this.getTime() + (m*60*1000));
         return this;
      }
      nextHalfHour.addMinutes(30);
      nextHalfHour = nextHalfHour.toLocaleTimeString('en-GB');
      hour.min = nextHalfHour;
   });


   predictionsButton.addEventListener("click", () => {
      if (predictionsButton.classList.contains("active-button") == true) {
         return;
      }
      else {
         historicalButton.classList.remove("active-button");
         predictionsButton.classList.add("active-button");
         date.value = "";
         date.min = today;
         date.max = "2030-01-01";
         hour.min = nextHalfHour;
         if (darkMode.classList.contains("dark-mode-active") == true) {
            historicalButton.classList.remove("active-button-dark");
            predictionsButton.classList.add("active-button-dark");
         } else {
            historicalButton.classList.remove("active-button-light");
            predictionsButton.classList.add("active-button-light");
         }
      }
   });

   historicalButton.addEventListener("click", () => {
      if (historicalButton.classList.contains("active-button") == true) {
         return;
      }
      else {
         historicalButton.classList.add("active-button");
         predictionsButton.classList.remove("active-button");
         date.value = "";
         date.min = "2021-02-28"
         date.max = yesterday;
         hour.min = "";
         if (darkMode.classList.contains("dark-mode-active") == true) {
            predictionsButton.classList.remove("active-button-dark");
            historicalButton.classList.add("active-button-dark");
         } else {
            predictionsButton.classList.remove("active-button-light");
            historicalButton.classList.add("active-button-light");
         }
      }
   });

   stationButton.addEventListener("click", () => {
      if (stationButton.classList.contains("active-button") == true) {
         return;
      }
      else {
         stationButton.classList.add("active-button");
         fullSearchButton.classList.remove("active-button");
         stationSearchContainer.style.display = "flex";
         if (darkMode.classList.contains("dark-mode-active") == true) {
            fullSearchButton.classList.remove("active-button-dark");
            stationButton.classList.add("active-button-dark");
         } else {
            fullSearchButton.classList.remove("active-button-light");
            stationButton.classList.add("active-button-light");
         }
      }
   });

   fullSearchButton.addEventListener("click", () => {
      if (fullSearchButton.classList.contains("active-button") == true) {
         return;
      }
      else {
         fullSearchButton.classList.add("active-button");
         stationButton.classList.remove("active-button");
         stationSearchContainer.style.display = "none";
         if (darkMode.classList.contains("dark-mode-active") == true) {
            stationButton.classList.remove("active-button-dark");
            fullSearchButton.classList.add("active-button-dark");
         } else {
            stationButton.classList.remove("active-button-light");
            fullSearchButton.classList.add("active-button-light");
         }
      }
   });
}

function searchOptions() { 
   const predictionsButton = document.getElementById("predictions-container");
   const historicalButton = document.getElementById("historical-container");
   const stationButton = document.getElementById("station-container");
   const stationInput = document.getElementById("station-input");
   const hour = document.getElementById("hour");
   const date = document.getElementById("calendar");
   const searchButton = document.getElementById("search-button-container");
   const darkMode = document.getElementById("dark-mode-container");

   // Create const for the containers
   const container1 = document.getElementById('container1');
   const container2 = document.getElementById('container2');
   const container3 = document.getElementById('container3');
   const container4a = document.getElementById('container4-a');
   const container4b = document.getElementById('container4-b');

   // Array to contain the elements of the current search. Useful for dark mode and responsiveness
   var arraySearchElements = new Array();

   searchButton.addEventListener("click", () => {
      // Clean Previous Search
      container1.innerHTML = "";
      container2.innerHTML = "";
      container3.innerHTML = "";
      container4a.innerHTML = "";
      container4b.innerHTML = "";
      arraySearchElements = new Array();

      // Declare the search variables
      var searchHour;
      var searchDate;
      var searchStationInput;

      // Styles for the graphs
      var options;

      var optionsDark = {
         width:'100%',
         height: '100%',
         curveType: 'function',
         fontName: 'Roboto, sans-serif',
         series: {
            0: {color: 'rgb(38, 194, 129)'},
         }, 
         lineWidth: 3,     
         hAxis: {
           textStyle: {
              color: 'white',
           },
           titleTextStyle: {
            color: 'white',
            },
            minorGridlines: {
               count: 0,
            }
         },
         vAxis: {
            titleTextStyle: {
               color: 'white',
            },
            textStyle: {
               color: 'white',
            },
            minorGridlines: {
               count: 0,
            },
         },
         textStyle: {
            color: 'white',
         },
         titleTextStyle: {
           fontSize: 14,
           fontName: 'Roboto, sans-serif',
           color: 'white',
         },
         legend: {
            textStyle: {
               color: 'white',
            }
         },
         barCornerRadius: '25px',
         backgroundColor: {
            fill: 'transparent',
         },
       };

       var optionsLight = {
         width:'100%',
         height: '100%',
         curveType: 'function',
         fontName: 'Roboto, sans-serif',
         series: {
            0: {color: 'rgb(0, 115, 152)'},
         }, 
         lineWidth: 3,     
         hAxis: {
           textStyle: {
              color: 'black',
           },
           titleTextStyle: {
            color: 'black',
            },
            minorGridlines: {
               count: 0,
            }
         },
         vAxis: {
            titleTextStyle: {
               color: 'black',
            },
            textStyle: {
               color: 'black',
            },
            minorGridlines: {
               count: 0,
            },
         },
         textStyle: {
            color: 'black',
         },
         titleTextStyle: {
           fontSize: 14,
           fontName: 'Roboto, sans-serif',
           color: 'black',
         },
         legend: {
            textStyle: {
               color: 'black',
            }
         },
         barCornerRadius: '25px',
         backgroundColor: {
            fill: 'transparent',
         },
       };

      // Check the different selections made by the user 
      if (historicalButton.classList.contains("active-button")) {
         searchHour = hour.value; // Could be an empty string
         searchDate = date.value;
         if (stationButton.classList.contains("active-button")) {
            searchStationInput = stationInput.value;
            // If the user does not enter an hour display a search for the full day
            if (searchHour == "") {
               // Display occupancy in container 4
               fetchOccupancy('42').then(jsonData => {
                  // Create our data table out of JSON data loaded from server.
                  // Create table for bikes occupancy
                  var dataBikes = new google.visualization.DataTable();
                  dataBikes.addColumn('date', 'Time');
                  dataBikes.addColumn('number', 'Average Bikes');
                  // Create table for bike stands
                  var dataStands = new google.visualization.DataTable();
                  dataStands.addColumn('date', 'Time');
                  dataStands.addColumn('number', 'Average Stands');
            
                  jsonData.forEach(el => {
                    var dateArray = el.date.split("-");
                    dataBikes.addRows([
                      [new Date(dateArray[0], dateArray[1] - 1, dateArray[2]), el.ocuppancy_bikes],
                    ]);
                    dataStands.addRows([
                      [new Date(dateArray[0], dateArray[1] - 1, dateArray[2]), el.ocuppancy_stands],
                    ]); 
                  });

                  // Insert the elements in the array
                  arraySearchElements.push(dataBikes);
                  arraySearchElements.push(dataStands);

                  // Call fucntion to display data
                  updateSearch();
                   
                }).catch(err => {
                  console.log("OOPS! Can't display occupancy", err);       
                });
            }
            else {

            }
         }
      } 
      else if (searchButton.classList.contains("active-button")) {
         searchHour = hour.value;
         searchDate = date.value;
         if (stationButton.classList.contains("active-button")) {
            searchStationInput = stationInput.value;
         }
      }

      darkMode.addEventListener("click", updateSearch);
      window.addEventListener("resize", updateSearch);


      function updateSearch() {
         if (darkMode.classList.contains("dark-mode-active")) {
            options = optionsDark;
   
         } else {
            options = optionsLight;
         }
         
         arraySearchElements.forEach(elem => {
            if (elem.If[1].label == 'Average Bikes') {
               options.title = 'Average Bikes nº ' + searchStationInput;
               options.hAxis.title = 'Months';
               options.vAxis.title = 'Bikes';
               var chart = new google.visualization.LineChart(document.getElementById('container4-a'));
               chart.draw(elem, options);
            } else if (elem.If[1].label == 'Average Stands') {
               options.title = 'Average Stands nº ' + searchStationInput;
               options.hAxis.title = 'Months';
               options.vAxis.title = 'Stands';
               var chart = new google.visualization.LineChart(document.getElementById('container4-b'));
               chart.draw(elem, options);
            }
            
         });
      }
 
   });

}


// Fucntion to fetch the occupancy during time
async function fetchOccupancy(num) {
   return fetch("/occupancy/"+ num).then(response => {
     return response.json();
   }).catch(err => {
     console.log("OOPS!", err);
   });
 }