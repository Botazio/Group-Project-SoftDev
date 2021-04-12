function callGoogleCharts() {
  google.charts.load("current", { packages: ["corechart"] });
}

function animationButtons() {
  const predictionsButton = document.getElementById("predictions-container");
  const historicalButton = document.getElementById("historical-container");
  const stationButton = document.getElementById("station-container");
  const fullSearchButton = document.getElementById("full-search-container");
  const stationSearchContainer = document.getElementById(
    "station-search-container"
  );
  const calendarInput = document.getElementById("calendar-container");
  const stationInput = document.getElementById("station-input");
  const date = document.getElementById("calendar");
  const hour = document.getElementById("hour");
  const darkMode = document.getElementById("dark-mode-container");
  const searchButton = document.getElementById("search-button-container");

  // Dates and hours for the calendar
  var today = new Date();
  var nextHour = new Date();
  nextHour.setSeconds(0, 0);
  Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + m * 60 * 1000);
    return this;
  };
  nextHour.addMinutes(60);
  nextHour.setMinutes(0, 0);
  nextHour = nextHour.toLocaleTimeString("en-GB");

  today = today.toISOString().split("T")[0];
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString().split("T")[0];

  // Set the initial values
  date.min = today;
  date.max = "2030-01-01";
  date.value = "";
  hour.min = nextHour;
  hour.value = "";
  stationInput.value = "";

  searchButton.addEventListener("click", () => {
    // Refresh the hour for future searchs
    nextHour = new Date();
    nextHour.setSeconds(0, 0);
    Date.prototype.addMinutes = function (m) {
      this.setTime(this.getTime() + m * 60 * 1000);
      return this;
    };
    nextHour.addMinutes(60);
    nextHour.setMinutes(0, 0);
    nextHour = nextHour.toLocaleTimeString("en-GB");
    if (predictionsButton.classList.contains("active-button") == true) {
      hour.min = nextHour;
    }
  });

  predictionsButton.addEventListener("click", () => {
    if (predictionsButton.classList.contains("active-button") == true) {
      return;
    } else {
      fullSearchButton.classList.remove("active-button");
      fullSearchButton.style.display = "none";
      historicalButton.classList.remove("active-button");
      predictionsButton.classList.add("active-button");
      date.value = "";
      date.min = today;
      date.max = "2030-01-01";
      hour.min = nextHour;
      stationButton.classList.add("active-button");
      stationSearchContainer.style.display = "flex";
      calendarInput.style.display = "flex";
      if (darkMode.classList.contains("dark-mode-active") == true) {
        historicalButton.classList.remove("active-button-dark");
        predictionsButton.classList.add("active-button-dark");
        fullSearchButton.classList.remove("active-button-dark");
        stationButton.classList.add("active-button-dark");
      } else {
        historicalButton.classList.remove("active-button-light");
        predictionsButton.classList.add("active-button-light");
        fullSearchButton.classList.remove("active-button-light");
        stationButton.classList.add("active-button-light");
      }
    }
  });

  historicalButton.addEventListener("click", () => {
    if (historicalButton.classList.contains("active-button") == true) {
      return;
    } else {
      fullSearchButton.style.display = "flex";
      historicalButton.classList.add("active-button");
      predictionsButton.classList.remove("active-button");
      date.value = "";
      date.min = "2021-02-25";
      date.max = yesterday;
      hour.min = null;
      hour.value = "";
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
    } else {
      stationButton.classList.add("active-button");
      fullSearchButton.classList.remove("active-button");
      stationSearchContainer.style.display = "flex";
      calendarInput.style.display = "flex";
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
    } else {
      fullSearchButton.classList.add("active-button");
      stationButton.classList.remove("active-button");
      stationSearchContainer.style.display = "none";
      calendarInput.style.display = "none";

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
  // Create the objects from the html elements
  const predictionsButton = document.getElementById("predictions-container");
  const historicalButton = document.getElementById("historical-container");
  const stationButton = document.getElementById("station-container");
  const fullSearchButton = document.getElementById("full-search-container");
  const stationInput = document.getElementById("station-input");
  const hour = document.getElementById("hour");
  const date = document.getElementById("calendar");
  const searchButton = document.getElementById("search-button-container");
  const darkMode = document.getElementById("dark-mode-container");
  const layout1 = document.getElementById("layout1");
  const layout2 = document.getElementById("layout2");
  const layout3 = document.getElementById("layout3");

  // Create const for the containers
  const container1 = document.getElementById("container1");
  const container2 = document.getElementById("container2");
  const container3 = document.getElementById("container3");
  const container4a = document.getElementById("container4-a");
  const container4b = document.getElementById("container4-b");

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

    // Restore the icons to initial configuration
    document.getElementById("info-icon1").src = "static/fixtures/icon-info.png";
    document.getElementById("info-icon2").src = "static/fixtures/icon-info.png";

    // Declare the search variables
    var searchHour;
    var searchDate;
    var searchStationInput;

    // Styles for the graphs
    var options;

    var optionsDark = {
      width: "100%",
      height: "100%",
      curveType: "function",
      fontName: "Roboto, sans-serif",
      series: {
        0: { color: "rgb(38, 194, 129)" },
      },
      lineWidth: 3,
      hAxis: {
        textStyle: {
          color: "white",
        },
        titleTextStyle: {
          color: "white",
        },
        minorGridlines: {
          count: 0,
        },
      },
      vAxis: {
        titleTextStyle: {
          color: "white",
        },
        textStyle: {
          color: "white",
        },
        minorGridlines: {
          count: 0,
        },
      },
      textStyle: {
        color: "white",
      },
      titleTextStyle: {
        fontSize: 14,
        fontName: "Roboto, sans-serif",
        color: "white",
      },
      legend: {
        textStyle: {
          color: "white",
        },
      },
      barCornerRadius: "25px",
      backgroundColor: {
        fill: "transparent",
      },
    };

    var optionsLight = {
      width: "100%",
      height: "100%",
      curveType: "function",
      fontName: "Roboto, sans-serif",
      series: {
        0: { color: "rgb(0, 115, 152)" },
      },
      lineWidth: 3,
      hAxis: {
        textStyle: {
          color: "black",
        },
        titleTextStyle: {
          color: "black",
        },
        minorGridlines: {
          count: 0,
        },
      },
      vAxis: {
        titleTextStyle: {
          color: "black",
        },
        textStyle: {
          color: "black",
        },
        minorGridlines: {
          count: 0,
        },
      },
      textStyle: {
        color: "black",
      },
      titleTextStyle: {
        fontSize: 14,
        fontName: "Roboto, sans-serif",
        color: "black",
      },
      legend: {
        textStyle: {
          color: "black",
        },
      },
      barCornerRadius: "25px",
      backgroundColor: {
        fill: "transparent",
      },
    };

    // Check the different selections made by the user
    if (historicalButton.classList.contains("active-button")) {
      searchCompleteHour = hour.value; // Could be an empty string
      // We only use the hour, no need for the minutes
      searchHour = searchCompleteHour.split(":");
      searchHour = searchHour[0];
      // We take the date from the input date html element
      searchDate = date.value;
      if (stationButton.classList.contains("active-button")) {
        searchStationInput = stationInput.value.split(" ");
        stationNumber = searchStationInput[searchStationInput.length - 1];
        // If the user does not enter an hour display a search for the full day
        if (searchHour == "" && searchDate == "") {
          // Display occupancy in container 4
          fetchOccupancy(stationNumber)
            .then((jsonData) => {
              // Create our data table out of JSON data loaded from server.
              // Create table for bikes occupancy
              var dataBikes = new google.visualization.DataTable();
              dataBikes.addColumn("date", "Time");
              dataBikes.addColumn("number", "Average Bikes");
              // Create table for bike stands
              var dataStands = new google.visualization.DataTable();
              dataStands.addColumn("date", "Time");
              dataStands.addColumn("number", "Average Stands");

              jsonData.forEach((el) => {
                var dateArray = el.date.split("-");
                dataBikes.addRows([
                  [
                    new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                    el.ocuppancy_bikes,
                  ],
                ]);
                dataStands.addRows([
                  [
                    new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                    el.ocuppancy_stands,
                  ],
                ]);
              });

              // Insert the elements in the array
              arraySearchElements.push(dataBikes);
              arraySearchElements.push(dataStands);
            })
            .catch((err) => {
              console.log(err);
            });

          fetchHistoricalWeather().then((weatherData) => {
            // Create table for historical weather
            var historicalWeather = new google.visualization.DataTable();
            historicalWeather.addColumn("date", "Time");
            historicalWeather.addColumn("number", "Humidity");
            historicalWeather.addColumn("number", "Temperature");

            weatherData.forEach((el) => {
              var dateArray = el.date.split("-");
              historicalWeather.addRows([
                [
                  new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                  el.humidity,
                  el.temp,
                ],
              ]);
            });

            // Insert the elements in the array
            arraySearchElements.push(historicalWeather);
          });

          // Display ranking of the different stations
          fetchHistoricalOccupancy("bikes")
            .then((rankingAvailableBikes) => {
              fetchHistoricalOccupancy("stands").then(
                (rankingAvailableStands) => {
                  var positionBikes;
                  var positionStands;
                  var avgBikes;
                  var avgStands;
                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableBikes.length; i++) {
                    if (rankingAvailableBikes[i].number == stationNumber) {
                      positionBikes = i + 1;
                      avgBikes = rankingAvailableBikes[i].bikes;
                      break;
                    }
                  }

                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableStands.length; i++) {
                    if (rankingAvailableStands[i].number == stationNumber) {
                      positionStands = i + 1;
                      avgStands = rankingAvailableStands[i].stands;
                      break;
                    }
                  }

                  // Check if the view is set for dark mode
                  var classNameTable;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    classNameTable =
                      "station-rankings station-rankings-darkmode";
                  } else {
                    classNameTable =
                      "station-rankings station-rankings-lightmode";
                  }

                  // Bikes
                  // Display the first five values and the station
                  var checker = false;
                  var contentStr =
                    "<div class='" +
                    classNameTable +
                    "'><p>Ranking Availability Bikes</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableBikes[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Historical Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableBikes[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableBikes[i].bikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Historical Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgBikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionBikes +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Historical Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgBikes.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionBikes +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  // Stands
                  // Display the first five values and the station
                  checker = false;
                  contentStr +=
                    "<div class='" +
                    classNameTable +
                    "'><p>Ranking Availability Stands</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableStands[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Historical Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableStands[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableStands[i].stands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Historical Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgStands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionStands +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Historical Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgStands.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionStands +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  container1.innerHTML = contentStr;

                  // Push information about that station to container 2
                  var iconBike;
                  var iconParking;
                  var classNameDinamicInfo;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-darkmode.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking-green.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-darkmode";
                  } else {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-blue.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-lightmode";
                  }

                  // Join the first elements of the array to get the station name
                  var stationName = "";
                  for (i = 0; i < searchStationInput.length - 1; i++) {
                    stationName += searchStationInput[i] + " ";
                  }

                  var contentStr =
                    '<div id="dinamic-station-info" class=' +
                    classNameDinamicInfo +
                    ">" +
                    "<div><b>" +
                    "Historical Mean Availability</b></div>" +
                    "<p><b>" +
                    stationName +
                    "nº " +
                    stationNumber +
                    "</b></p>" +
                    '<div id="station-infowindow">' +
                    "<div class='infowindow-subelement'>" +
                    avgBikes.toFixed(2) +
                    iconBike +
                    "</div><div class='infowindow-subelement'>" +
                    avgStands.toFixed(2) +
                    iconParking +
                    "</div></div></div>";

                  container2.innerHTML = contentStr;

                  // Call fucntion to display data
                  updateSearch();
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (searchDate != "" && searchHour == "") {
          // Display occupancy in container 4
          fetchDailyOccupancy(stationNumber, searchDate)
            .then((jsonData) => {
              // Create our data table out of JSON data loaded from server.
              // Create table for bikes occupancy
              var dataBikes = new google.visualization.DataTable();
              dataBikes.addColumn("date", "Time");
              dataBikes.addColumn("number", "Average Daily Bikes");
              // Create table for bike stands
              var dataStands = new google.visualization.DataTable();
              dataStands.addColumn("date", "Time");
              dataStands.addColumn("number", "Average Daily Stands");

              jsonData.forEach((el) => {
                var dateArray = el.date.split("-");
                dataBikes.addRows([
                  [
                    new Date(
                      dateArray[0],
                      dateArray[1] - 1,
                      dateArray[2],
                      dateArray[3]
                    ),
                    el.available_bikes,
                  ],
                ]);
                dataStands.addRows([
                  [
                    new Date(
                      dateArray[0],
                      dateArray[1] - 1,
                      dateArray[2],
                      dateArray[3]
                    ),
                    el.available_bikes_stands,
                  ],
                ]);
              });

              // Insert the elements in the array
              arraySearchElements.push(dataBikes);
              arraySearchElements.push(dataStands);
            })
            .catch((err) => {
              console.log(err);
            });

          fetchDailyWeather(searchDate).then((weatherData) => {
            // Create table for daily weather
            var dailyWeather = new google.visualization.DataTable();
            dailyWeather.addColumn("date", "Time");
            dailyWeather.addColumn("number", "Daily Humidity");
            dailyWeather.addColumn("number", "Daily Temperature");

            for (i = 0; i < weatherData.length; i += 5) {
              var dateArray = weatherData[i].date.split("-");
              dailyWeather.addRows([
                [
                  new Date(
                    dateArray[0],
                    dateArray[1] - 1,
                    dateArray[2],
                    dateArray[3],
                    dateArray[4]
                  ),
                  weatherData[i].humidity,
                  weatherData[i].temp,
                ],
              ]);
            }

            // Insert the elements in the array
            arraySearchElements.push(dailyWeather);
          });

          // Display ranking of the different stations
          fetchAllDailyOccupancy(searchDate, "bikes")
            .then((rankingAvailableBikes) => {
              fetchAllDailyOccupancy(searchDate, "stands").then(
                (rankingAvailableStands) => {
                  var positionBikes;
                  var positionStands;
                  var avgBikes;
                  var avgStands;
                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableBikes.length; i++) {
                    if (rankingAvailableBikes[i].number == stationNumber) {
                      positionBikes = i + 1;
                      avgBikes = rankingAvailableBikes[i].bikes;
                      break;
                    }
                  }

                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableStands.length; i++) {
                    if (rankingAvailableStands[i].number == stationNumber) {
                      positionStands = i + 1;
                      avgStands = rankingAvailableStands[i].stands;
                      break;
                    }
                  }

                  // Check if the view is set for dark mode
                  var classNameTable;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    classNameTable =
                      "station-rankings station-rankings-darkmode";
                  } else {
                    classNameTable =
                      "station-rankings station-rankings-lightmode";
                  }

                  // Bikes
                  // Display the first five values and the station
                  var checker = false;
                  var contentStr =
                    "<div class='" +
                    classNameTable +
                    "'><p>" +
                    searchDate +
                    "Ranking Bikes</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableBikes[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableBikes[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableBikes[i].bikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgBikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionBikes +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgBikes.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionBikes +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  // Stands
                  // Display the first five values and the station
                  checker = false;
                  contentStr +=
                    "<div class='" +
                    classNameTable +
                    "'><p>" +
                    searchDate +
                    "Ranking Stands</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableStands[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableStands[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableStands[i].stands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgStands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionStands +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgStands.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionStands +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  container1.innerHTML = contentStr;

                  // Push information about that station to container 2
                  var iconBike;
                  var iconParking;
                  var classNameDinamicInfo;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-darkmode.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking-green.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-darkmode";
                  } else {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-blue.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-lightmode";
                  }

                  // Join the first elements of the array to get the station name
                  var stationName = "";
                  for (i = 0; i < searchStationInput.length - 1; i++) {
                    stationName += searchStationInput[i] + " ";
                  }

                  var contentStr =
                    '<div id="dinamic-station-info" class=' +
                    classNameDinamicInfo +
                    ">" +
                    "<div><b>" +
                    searchDate +
                    "</p></div>" +
                    "<div><p>" +
                    "Daily Mean Availability</b></div>" +
                    "<p><b>" +
                    stationName +
                    "nº " +
                    stationNumber +
                    "</b></p>" +
                    '<div id="station-infowindow">' +
                    "<div class='infowindow-subelement'>" +
                    avgBikes.toFixed(2) +
                    iconBike +
                    "</div><div class='infowindow-subelement'>" +
                    avgStands.toFixed(2) +
                    iconParking +
                    "</div></div></div>";

                  container2.innerHTML = contentStr;

                  // Call fucntion to display data
                  updateSearch();
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (searchDate != "" && searchHour != "") {
          // Display occupancy in container 4
          fetchDailyOccupancy(stationNumber, searchDate)
            .then((jsonData) => {
              // Create our data table out of JSON data loaded from server.
              // Create table for bikes occupancy
              var dataBikes = new google.visualization.DataTable();
              dataBikes.addColumn("date", "Time");
              dataBikes.addColumn("number", "Average Daily Bikes");
              // Create table for bike stands
              var dataStands = new google.visualization.DataTable();
              dataStands.addColumn("date", "Time");
              dataStands.addColumn("number", "Average Daily Stands");

              jsonData.forEach((el) => {
                var dateArray = el.date.split("-");
                dataBikes.addRows([
                  [
                    new Date(
                      dateArray[0],
                      dateArray[1] - 1,
                      dateArray[2],
                      dateArray[3]
                    ),
                    el.available_bikes,
                  ],
                ]);
                dataStands.addRows([
                  [
                    new Date(
                      dateArray[0],
                      dateArray[1] - 1,
                      dateArray[2],
                      dateArray[3]
                    ),
                    el.available_bikes_stands,
                  ],
                ]);
              });

              // Insert the elements in the array
              arraySearchElements.push(dataBikes);
              arraySearchElements.push(dataStands);
            })
            .catch((err) => {
              console.log(err);
            });

          fetchDailyHourlyWeather(searchDate, searchHour)
            .then((weatherData) => {
              // Check if the view is set for dark mode
              var className;
              if (darkMode.classList.contains("dark-mode-active")) {
                className = "weather-slide-darkmode";
              } else {
                className = "weather-slide-lightmode";
              }

              data = weatherData[0];
              var contentStr;
              //iterate through the data and display day, date, temp, description, icon and wind
              var weatherIcon =
                '<img class="icons2" height = "50px" width = "50px" src="http://openweathermap.org/img/w/' +
                data.icon +
                '.png"/>';
              //create the containers to display weather
              contentStr =
                '<div id="weather-slide" class=' +
                className +
                '><div id="weather-header"><div><p>' +
                searchCompleteHour +
                "</p></div>" +
                '<div id="weather-description"><p>' +
                data.description +
                "</p></div>" +
                "<div><p>" +
                searchDate +
                "</p></div></div>" +
                '<div id="weather-info">' +
                '<div id="weather-temp" class="weather-items"><h1>' +
                data.temp +
                "ºC</h1></div>" +
                '<div id="weather-icon" class="weather-items">' +
                weatherIcon +
                "</div>" +
                '<div id="weather-temp-min" class="weather-items"><p>Min<br>' +
                data.temp_min +
                "</p></div>" +
                '<div id="weather-temp-max" class="weather-items"><p>Max<br>' +
                data.temp_max +
                "</p></div>" +
                '<div id="weather-temp-humidity" class="weather-items"><p>Humidity<br>' +
                data.humidity +
                "</p></div>" +
                "</div></div>";

              container3.innerHTML = contentStr;
            })
            .catch((err) => {
              console.log(err);
            });

          // Display ranking of the different stations
          fetchDailyHourlyOccupancy(searchDate, searchHour, "bikes")
            .then((rankingAvailableBikes) => {
              fetchDailyHourlyOccupancy(searchDate, searchHour, "stands").then(
                (rankingAvailableStands) => {
                  var positionBikes;
                  var positionStands;
                  var avgBikes;
                  var avgStands;
                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableBikes.length; i++) {
                    if (rankingAvailableBikes[i].number == stationNumber) {
                      positionBikes = i + 1;
                      avgBikes = rankingAvailableBikes[i].bikes;
                      break;
                    }
                  }

                  // Loop through the data until we find our station
                  for (i = 0; i < rankingAvailableStands.length; i++) {
                    if (rankingAvailableStands[i].number == stationNumber) {
                      positionStands = i + 1;
                      avgStands = rankingAvailableStands[i].stands;
                      break;
                    }
                  }

                  // Check if the view is set for dark mode
                  var classNameTable;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    classNameTable =
                      "station-rankings station-rankings-darkmode";
                  } else {
                    classNameTable =
                      "station-rankings station-rankings-lightmode";
                  }

                  // Bikes
                  // Display the first five values and the station
                  var checker = false;
                  var contentStr =
                    "<div class='" +
                    classNameTable +
                    "'><p>" +
                    searchDate +
                    " " +
                    searchCompleteHour +
                    " " +
                    "Ranking Bikes</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableBikes[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableBikes[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableBikes[i].bikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgBikes.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionBikes +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgBikes.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionBikes +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  // Stands
                  // Display the first five values and the station
                  checker = false;
                  contentStr +=
                    "<div class='" +
                    classNameTable +
                    "'><p>" +
                    searchDate +
                    " " +
                    searchCompleteHour +
                    " " +
                    "Ranking Stands</p><table>";
                  for (i = 0; i < 3; i++) {
                    var x = i + 1;
                    if (rankingAvailableStands[i].number != stationNumber) {
                      contentStr +=
                        "<tr><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr><td>" +
                        rankingAvailableStands[i].number +
                        "</td>" +
                        "<td>" +
                        rankingAvailableStands[i].stands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        x +
                        "</td>";
                    } else {
                      checker = true;
                      contentStr +=
                        "<tr class='station-target'><th>Station Number</th>" +
                        "<th>Availability</th>" +
                        "<th>Position</th></tr>" +
                        "<tr class='station-target'><td>" +
                        stationNumber +
                        "</td>" +
                        "<td>" +
                        avgStands.toFixed(2) +
                        "</td>" +
                        "<td>" +
                        positionStands +
                        "</td>";
                    }
                  }

                  if (checker == false) {
                    contentStr +=
                      "<tr class='station-target'><th>Station Number</th>" +
                      "<th>Availability</th>" +
                      "<th>Position</th></tr>" +
                      "<tr class='station-target'><td>" +
                      stationNumber +
                      "</td>" +
                      "<td>" +
                      avgStands.toFixed(2) +
                      "</td>" +
                      "<td>" +
                      positionStands +
                      "</td>";
                  }

                  contentStr += "</table></div>";

                  container1.innerHTML = contentStr;

                  // Push information about that station to container 2
                  var iconBike;
                  var iconParking;
                  var classNameDinamicInfo;
                  if (darkMode.classList.contains("dark-mode-active")) {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-darkmode.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking-green.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-darkmode";
                  } else {
                    iconBike =
                      '<img id="icon-bike-dinamic" src="static/fixtures/icon-bike-blue.png" width="28" height="28" alt="Icon bike"/>';
                    iconParking =
                      '<img id="icon-stand-dinamic" src="static/fixtures/icon-parking.png" width="24" height="24" alt="Icon parking"/>';
                    classNameDinamicInfo = "dinamic-station-info-lightmode";
                  }

                  // Join the first elements of the array to get the station name
                  var stationName = "";
                  for (i = 0; i < searchStationInput.length - 1; i++) {
                    stationName += searchStationInput[i] + " ";
                  }

                  var contentStr =
                    '<div id="dinamic-station-info" class=' +
                    classNameDinamicInfo +
                    ">" +
                    "<div><b>" +
                    searchDate +
                    " " +
                    searchCompleteHour +
                    "</p></div>" +
                    "<div><p>" +
                    "Hourly Mean Availability</b></div>" +
                    "<p><b>" +
                    stationName +
                    "nº " +
                    stationNumber +
                    "</b></p>" +
                    '<div id="station-infowindow">' +
                    "<div class='infowindow-subelement'>" +
                    avgBikes.toFixed(2) +
                    iconBike +
                    "</div><div class='infowindow-subelement'>" +
                    avgStands.toFixed(2) +
                    iconParking +
                    "</div></div></div>";

                  container2.innerHTML = contentStr;

                  // Call fucntion to display data
                  updateSearch();
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } // If statement for error handling
        if (searchDate == "" && searchHour != "") {
          const infoIcon1 = document.getElementById("info-icon1");
          infoIcon1.src = "static/fixtures/icon-cross-red.png";
        } // If statement for error handling
        if (
          (searchDate != "" || searchHour != "") &&
          searchStationInput == ""
        ) {
          const infoIcon2 = document.getElementById("info-icon2");
          infoIcon2.src = "static/fixtures/icon-cross-red.png";
        }
      } else if (fullSearchButton.classList.contains("active-button")) {
        // Display occupancy in container 4
        fetchCompleteHistoricalOccupancy()
          .then((jsonData) => {
            // Create our data table out of JSON data loaded from server.
            // Create table for bikes occupancy
            var dataBikes = new google.visualization.DataTable();
            dataBikes.addColumn("date", "Time");
            dataBikes.addColumn("number", "Average Daily Bikes All Stations");
            // Create table for bike stands
            var dataStands = new google.visualization.DataTable();
            dataStands.addColumn("date", "Time");
            dataStands.addColumn("number", "Average Daily Stands All Stations");

            jsonData.forEach((el) => {
              var dateArray = el.date.split("-");
              dataBikes.addRows([
                [
                  new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                  el.bikes,
                ],
              ]);
              dataStands.addRows([
                [
                  new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                  el.stands,
                ],
              ]);
            });
            // Insert the elements in the array
            arraySearchElements.push(dataBikes);
            arraySearchElements.push(dataStands);

            // Call function to display data
            updateSearch();
          })
          .catch((err) => {
            console.log(err);
          });

        fetchHistoricalWeather()
          .then((weatherData) => {
            // Create table for historical weather
            var historicalWeather = new google.visualization.DataTable();
            historicalWeather.addColumn("date", "Time");
            historicalWeather.addColumn("number", "Humidity");
            historicalWeather.addColumn("number", "Temperature");

            weatherData.forEach((el) => {
              var dateArray = el.date.split("-");
              historicalWeather.addRows([
                [
                  new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
                  el.humidity,
                  el.temp,
                ],
              ]);
            });

            // Insert the elements in the array
            arraySearchElements.push(historicalWeather);

            // Call function to display data
            updateSearch();
          })
          .catch((err) => {
            console.log(err);
          });

        // Display a pie chart with the occupancy relation between stands and bikes
        fetchOccupancyRelation()
          .then((relationData) => {
            var occupancyRelation = new google.visualization.arrayToDataTable([
              ["Relation", "Occupancy Relation"],
              ["Bikes", relationData[0].bikes],
              ["Stands", relationData[0].stands],
            ]);

            // Insert the elements in the array
            arraySearchElements.push(occupancyRelation);
          })
          .catch((err) => {
            console.log(err);
          });

        // Display ranking of the different stations
        fetchHistoricalOccupancy("bikes")
          .then((rankingAvailableBikes) => {
            fetchHistoricalOccupancy("stands").then(
              (rankingAvailableStands) => {
                // Check if the view is set for dark mode
                var classNameTable;
                if (darkMode.classList.contains("dark-mode-active")) {
                  classNameTable = "station-rankings station-rankings-darkmode";
                } else {
                  classNameTable =
                    "station-rankings station-rankings-lightmode";
                }

                // Bikes
                // Display the first five values
                var contentStr =
                  "<div class='" +
                  classNameTable +
                  "'>" +
                  "<p>Ranking Availability Bikes</p><table>";
                for (i = 0; i < 4; i++) {
                  var x = i + 1;
                  contentStr +=
                    "<tr><th>Station Number</th>" +
                    "<th>Historical Availability</th>" +
                    "<th>Position</th></tr>" +
                    "<tr><td>" +
                    rankingAvailableBikes[i].number +
                    "</td>" +
                    "<td>" +
                    rankingAvailableBikes[i].bikes.toFixed(2) +
                    "</td>" +
                    "<td>" +
                    x +
                    "</td>";
                }

                contentStr += "</table></div>";

                // Stands
                // Display the first five values
                contentStr +=
                  "<div class='" +
                  classNameTable +
                  "'><p>Ranking Availability Stands</p><table>";
                for (i = 0; i < 4; i++) {
                  var x = i + 1;
                  contentStr +=
                    "<tr><th>Station Number</th>" +
                    "<th>Historical Availability</th>" +
                    "<th>Position</th></tr>" +
                    "<tr><td>" +
                    rankingAvailableStands[i].number +
                    "</td>" +
                    "<td>" +
                    rankingAvailableStands[i].stands.toFixed(2) +
                    "</td>" +
                    "<td>" +
                    x +
                    "</td>";
                }

                contentStr += "</table></div>";

                container1.innerHTML = contentStr;

                // Push information about that station to container 2

                // Call function to display data
                updateSearch();
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (predictionsButton.classList.contains("active-button")) {
      searchHour = hour.value;
      searchDate = date.value;
      if (stationButton.classList.contains("active-button")) {
        var arrayQueryModel = [];
        searchStationInput = stationInput.value;
        searchStationInput = searchStationInput.split(" ");
        searchStationInput = searchStationInput[searchStationInput.length - 1];
        fetchForecastWeather().then((data) => {
          searchHour = searchHour.split(":");
          searchHour = searchHour[0];

          searchDate = searchDate.split("-");
          searchDate = new Date(
            searchDate[0],
            searchDate[1] - 1,
            searchDate[2]
          );
          var weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";

          var dayWeek = weekday[searchDate.getDay()];

          // Variables to store day names and dates
          var dayName;
          var formattedDates;
          var indexWeatherArray;

          // Loop through the array to get the day
          for (x = 0; x < data.daily.length; x++) {
            formattedDates = new Date(data.daily[x].dt * 1000);
            dayName = weekday[formattedDates.getDay()];
            if (dayName == dayWeek) {
              indexWeatherArray = x;
              break;
            }
          }

          var weatherTarget = data.daily[indexWeatherArray];
          var tempTarget = weatherTarget.temp.day;
          var descriptionTarget = weatherTarget.weather[0].description;

          // Push everything into the query array
          arrayQueryModel.push(
            searchStationInput,
            tempTarget,
            searchHour,
            descriptionTarget,
            dayWeek
          );
          console.log(arrayQueryModel);

          fetch(
            "/query/" +
              arrayQueryModel[0] +
              "/" +
              arrayQueryModel[1] +
              "/" +
              arrayQueryModel[2] +
              "/" +
              arrayQueryModel[3] +
              "/" +
              arrayQueryModel[4]
          )
            .then((response) => {
              console.log(response);
              return response.json();
            })
            .catch((err) => {
              console.log("OOPS!", err);
            });
        });
      }
    }

    // Accomodate the search to changes in the screen size or dark mode
    darkMode.addEventListener("click", updateSearch);

    layout1.addEventListener("click", () => {
      const dinamicStationInfo = document.getElementById(
        "dinamic-station-info"
      );
      const weatherSlide = document.getElementById("weather-slide");
      if (dinamicStationInfo == null) {
        container2.innerHTML = "";
      }
      if (weatherSlide == null) {
        container3.innerHTML = "";
      }
      container4a.innerHTML = "";
      container4b.innerHTML = "";
      updateSearch();
    });
    layout2.addEventListener("click", () => {
      const dinamicStationInfo = document.getElementById(
        "dinamic-station-info"
      );
      const weatherSlide = document.getElementById("weather-slide");
      if (dinamicStationInfo == null) {
        container2.innerHTML = "";
      }
      if (weatherSlide == null) {
        container3.innerHTML = "";
      }
      container4a.innerHTML = "";
      container4b.innerHTML = "";
      updateSearch();
    });
    layout3.addEventListener("click", () => {
      const dinamicStationInfo = document.getElementById(
        "dinamic-station-info"
      );
      const weatherSlide = document.getElementById("weather-slide");
      if (dinamicStationInfo == null) {
        container2.innerHTML = "";
      }
      if (weatherSlide == null) {
        container3.innerHTML = "";
      }
      container4a.innerHTML = "";
      container4b.innerHTML = "";
      updateSearch();
    });
    window.addEventListener("resize", updateSearch);

    function updateSearch() {
      if (darkMode.classList.contains("dark-mode-active")) {
        options = optionsDark;
      } else {
        options = optionsLight;
      }

      arraySearchElements.forEach((elem) => {
        if (elem.If) {
          if (elem.If[1].label == "Average Bikes") {
            options.title = "Average Bikes nº " + stationNumber;
            options.hAxis.title = "Months";
            options.vAxis.title = "Bikes";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-a")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Average Stands") {
            options.title = "Average Stands nº " + stationNumber;
            options.hAxis.title = "Months";
            options.vAxis.title = "Stands";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-b")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Average Daily Bikes") {
            options.title =
              searchDate + " " + "Average Bikes nº " + stationNumber;
            options.hAxis.title = "Hours";
            options.vAxis.title = "Bikes";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-a")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Average Daily Stands") {
            options.title =
              searchDate + " " + "Average Stands nº " + stationNumber;
            options.hAxis.title = "Hours";
            options.vAxis.title = "Stands";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-b")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Average Daily Bikes All Stations") {
            options.title = "Average Bikes";
            options.hAxis.title = "Months";
            options.vAxis.title = "Bikes";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-a")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Average Daily Stands All Stations") {
            options.title = "Average Stands";
            options.hAxis.title = "Months";
            options.vAxis.title = "Bikes";
            var chart = new google.visualization.LineChart(
              document.getElementById("container4-b")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Occupancy Relation") {
            options.title = "Occupancy Relation";
            var chart = new google.visualization.PieChart(
              document.getElementById("container2")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Humidity") {
            options.title = "Historical Weather";
            options.hAxis.title = "Months";
            options.vAxis.title = "Temp, Humidity";
            var chart = new google.visualization.LineChart(
              document.getElementById("container3")
            );
            chart.draw(elem, options);
          } else if (elem.If[1].label == "Daily Humidity") {
            options.title = searchDate + " " + "Weather";
            options.hAxis.title = "Hours";
            options.vAxis.title = "Temp, Humidity";
            var chart = new google.visualization.LineChart(
              document.getElementById("container3")
            );
          }
          // Plot the graphs if everything has gone right
          if (chart) {
            chart.draw(elem, options);
          }
        }
      });
    }
  });
}

// Function part of the search system. It provides the functionality to search for stations
function stationSearch() {
  fetch("/stations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const stationInput = document.getElementById("station-input");
      // Specify the add listeners for destination input
      var currentFocus = -1;
      // Execute a function when someone writes in the text field:
      stationInput.addEventListener("input", function (e) {
        var a, b, i;
        var val = this.value;
        /*close any already open lists of pacd values*/
        closeAllLists(stationInput);
        if (!val) {
          return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", "pac-list");
        a.setAttribute("class", "pac-items");
        /*append the DIV element as a child of the pac container:*/
        this.parentNode.appendChild(a);

        // For each item in the array...
        var predictions = 0;
        for (i = 0; i < data.length; i++) {
          station = data[i];
          // Check if the item starts with the same letters as the text field value:
          if (
            station.address.substr(0, val.length).toUpperCase() ==
            val.toUpperCase()
          ) {
            // Create a DIV element for each matching element:
            b = document.createElement("DIV");
            b.style.display = "flex";
            b.style.alignItems = "center";
            // Insert the icon
            b.innerHTML =
              '<img src="static/fixtures/icon-bike-red.png" style="padding: 5px" width="20" height="20" alt="Red bike"/>';
            // Station number

            // Make the matching letters bold:
            b.innerHTML +=
              "<strong>" + station.address.substr(0, val.length) + "</strong>";
            b.innerHTML += station.address.substr(val.length);
            b.innerHTML += " " + station.number;
            // Insert a input field that will hold the current array item's value:
            b.innerHTML +=
              '<input type="hidden" value="' +
              station.address +
              " " +
              station.number +
              '">';
            b.addEventListener("click", function (e) {
              for (i = 0; i < data.length; i++) {
                station = data[i];
                // Insert the value for the pac text field:
                stationInput.value = this.getElementsByTagName(
                  "input"
                )[0].value;
                // Close the list of pacd values or any other open lists of pacd values
                closeAllLists(stationInput);
              }
            });
            a.appendChild(b);
            predictions++;
            if (predictions >= 5) {
              break;
            }
          }
        }
      });

      // Execute a function presses a key on the keyboard
      stationInput.addEventListener("keydown", function (e) {
        var x = document.getElementById("pac-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          if (currentFocus >= x.length) currentFocus = 0;
          /*and and make the current item more visible:*/
          addActive(x, currentFocus);
        } else if (e.keyCode == 38) {
          //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          if (currentFocus < 0) currentFocus = x.length - 1;
          /*and and make the current item more visible:*/
          addActive(x, currentFocus);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
      });

      // Execute a function when blur
      stationInput.addEventListener("blur", function (e) {
        setTimeout(() => {
          closeAllLists(stationInput);
        }, 100);
      });
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Closes the list of possible stations
function closeAllLists(input, elmnt) {
  /*close all pac lists in the document,
 except the one passed as an argument:*/
  var x = document.getElementsByClassName("pac-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != input) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

// Add an html class active to the selected element
function addActive(x, currentFocus) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(x);
  /*add class "pac-active":*/
  x[currentFocus].classList.add("pac-active");
}

// Removes the html class active
function removeActive(x) {
  /*a function to remove the "active" class from all pac items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("pac-active");
  }
}

// Function to fetch the historic occupancy for a station
async function fetchOccupancy(num) {
  return fetch("/occupancy/" + num)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for a station in a certain day
async function fetchDailyOccupancy(num, day) {
  return fetch("/daily_occupancy/" + num + "/" + day)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for all the stations in a certain day and hour
async function fetchDailyHourlyOccupancy(day, hour, type) {
  return fetch("/daily_hourly_occupancy/" + day + "/" + hour + "/" + type)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for all the stations in a certain day
async function fetchAllDailyOccupancy(day, type) {
  return fetch("/complete_daily_occupancy/" + day + "/" + type)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for all time for all the stations
async function fetchHistoricalOccupancy(type) {
  return fetch("/historical_occupancy/" + type)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for all time for all the stations
async function fetchCompleteHistoricalOccupancy() {
  return fetch("/complete_historical_occupancy")
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Fucntion to fetch the occupancy for all time for all the stations
async function fetchOccupancyRelation() {
  return fetch("/occupancy_relation")
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Function to fetch the weather data
async function fetchForecastWeather() {
  // Fetch weather forecast info
  return fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.266155&exclude=currently,minuetely,hourly&units=metric&appid=f092bb2fdf927ba79511674732a39c36"
  )
    .then(function (response) {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Function to fetch the weather for a day and an hour
async function fetchDailyHourlyWeather(date, hour) {
  // Fetch weather forecast info
  return fetch("/daily_weather/" + date + "/" + hour)
    .then(function (response) {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Function to fetch the weather for one day
async function fetchDailyWeather(date) {
  // Fetch weather forecast info
  return fetch("/daily_weather/" + date)
    .then(function (response) {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Function to fetch the weather data
async function fetchHistoricalWeather() {
  // Fetch weather forecast info
  return fetch("/historical_weather")
    .then(function (response) {
      return response.json();
    })
    .catch((err) => {
      console.log("OOPS!", err);
    });
}

// Init the functions when page is loaded
animationButtons();
searchOptions();
callGoogleCharts();
stationSearch();
