let markers = [];
let weatherPromise = fetchWeather();

// Function to fetch the weather data
async function fetchWeather() {
  // Fetch weather forecast info
  return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.266155&exclude=currently,minuetely,hourly&units=metric&appid=f092bb2fdf927ba79511674732a39c36')
  .then(function (response) {
    return response.json();
  }).catch(err => {
    console.log("OOPS!", err);
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

// Function that starts the map and its components
function initMap() {
    google.charts.load('current', {'packages':['corechart']});
    fetch("/stations").then(response => {
      return response.json();
    }).then(data => {
      fetch("static/js/styledmap.json").then(response => {
        return response.json();
      }).then(json => {
        fetch("/availability").then(response => {
          return response.json();
          }).then(availability => {
            availability.sort(compare);
            const styledMapType = new google.maps.StyledMapType(json, { name: "Styled Map" });
            const map = new google.maps.Map(document.getElementById("map"), {
                center: {lat: 53.349804, lng: -6.260310},
                zoom: 13,
                mapTypeControlOptions: {
                    mapTypeIds: [""],
                },
            });

            map.mapTypes.set("styled_map", styledMapType);
            map.setMapTypeId("styled_map");
            
            stationMarkersInfoButtons(data, map, availability);
            new AutocompleteDirectionsHandler(map, data, availability);
        
        });
      });
    }).catch(err => {
      console.log("OOPS!", err);       
    });
}

// Function that orders the dinamic availability data 
function compare(a, b) {
  const stationNum1 = a.number;
  const stationNum2 = b.number;

  let comparison = 0;
  if (stationNum1 > stationNum2) {
    comparison = 1;
  } else if (stationNum1 < stationNum2) {
    comparison = -1;
  }
  return comparison;
}

// Function that displays the three top bottoms in the map
function stationMarkersInfoButtons(data, map, availability) {
  const stationMarkersInfo = document.getElementById('station-markers-info');
  const displayAvailableBikes = document.getElementById('display-available-bikes');
  const displayAvailableBikesStands = document.getElementById('display-available-bikes-stands');
  const displayBikePaths = document.getElementById('display-bike-paths');
  const bikeLayer = new google.maps.BicyclingLayer();

  // Append the elements to the container
  stationMarkersInfo.appendChild(displayAvailableBikes);
  stationMarkersInfo.appendChild(displayAvailableBikesStands);
  stationMarkersInfo.appendChild(displayBikePaths);


  // Display markers
  var markersInfo = 'available_bikes';
  displayMarkers(data, map, availability, markersInfo);

  displayAvailableBikes.addEventListener('click', () => {
    displayAvailableBikes.classList.add('button-active');
    if (displayAvailableBikesStands.classList.contains('button-active')) {
      displayAvailableBikesStands.classList.remove('button-active');
    }
    if (displayBikePaths.classList.contains('button-active')) {
      displayBikePaths.classList.remove('button-active');
    }
    markersInfo = 'available_bikes';
    deleteMarkers();
    displayMarkers(data, map, availability, markersInfo);
    disableBikePaths(bikeLayer);
  });

  displayAvailableBikesStands.addEventListener('click', () => {
    displayAvailableBikesStands.classList.add('button-active');
    if (displayAvailableBikes.classList.contains('button-active')) {
      displayAvailableBikes.classList.remove('button-active');
      

    }
    if (displayBikePaths.classList.contains('button-active')) {
      displayBikePaths.classList.remove('button-active');
    }
    markersInfo = 'available_bikes_stands';
    deleteMarkers();
    displayMarkers(data, map, availability, markersInfo);
    disableBikePaths(bikeLayer);
  });

  displayBikePaths.addEventListener('click', () => {
    displayBikePaths.classList.add('button-active');
    if (displayAvailableBikes.classList.contains('button-active')) {
      displayAvailableBikes.classList.remove('button-active');
    }
    if (displayAvailableBikesStands.classList.contains('button-active')) {
      displayAvailableBikesStands.classList.remove('button-active');
    }
    deleteMarkers();
    bikePaths(map, bikeLayer);
  });

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(stationMarkersInfo);
}

// Function to display the map paths
function bikePaths(map, bikeLayer) {
  bikeLayer.setMap(map);
}

// Disable bike paths
function disableBikePaths(bikeLayer) {
  bikeLayer.setMap(null);
}

// Class and functions for the search system
class AutocompleteDirectionsHandler {
    constructor(map, data, availability) {
      this.map = map;
      this.myloc = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new google.maps.Size(22,22),
        new google.maps.Point(0,18),
        new google.maps.Point(11,11)),
        shadow: null,
        zIndex: 999,
        map: this.map,
      });
      this.routeMarkers = [];
      this.originLat = 0;
      this.originLng = 0;
      this.destinationLat = 0;
      this.destinationLng = 0;
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#1A73E8",
          zIndex: 10000,
          strokeWeight: "5",
        }  
      });
      this.directionsRenderer.setMap(map);
      const fullContainer = document.getElementById('full-container');
      const container = document.getElementById('container-pac');
      const originInput = document.getElementById("origin-input");
      const originContainer = document.getElementById('origin-container');
      const destinationInput = document.getElementById("destination-input");
      const destinationContainer = document.getElementById('destination-container');
      const upperWrapper = document.getElementById('upper-wrapper');
      const bottomWrapper = document.getElementById('bottom-wrapper');
      const searchDirection = document.getElementById('search-direction');
      const closeSearch = document.getElementById('close-search');
      const modeSelector = document.getElementById("mode-selector");
      const stationExtrainfo = document.getElementById("station-extrainfo");
      const customControlsView = document.getElementById('custom-controls-view');
      const focusDublinCenter = document.getElementById('focus-dublin-center');
      const focusViewUser = document.getElementById("focus-user-position");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      // Specify just the place data fields that you need.
      originAutocomplete.setFields(["place_id", "geometry"]);
      stationSearch(this, data, destinationInput, availability);

      // Specify just the place data fields that you need.
      this.setupClickListener(
        "changemode-walking",
        google.maps.TravelMode.WALKING
      );
      this.setupClickListener(
        "changemode-transit",
        google.maps.TravelMode.TRANSIT
      );
      this.setupClickListener(
        "changemode-driving",
        google.maps.TravelMode.DRIVING
      );

      // Add event listeners
      this.setupPlaceChangedListener(originAutocomplete);
      this.setupCloseListener("close-search");
      this.setupOpenListener("search-direction");
      this.setupRefreshSearchListener("refresh-search");
      this.setupUserPositionListener('user-position');
      this.setupViewUserPositionListener("focus-user-position");
      this.setupViewDublinListener('focus-dublin-center');
      
      // Display elements in the map
      originContainer.appendChild(originInput);
      destinationContainer.appendChild(destinationInput);
      destinationContainer.appendChild(searchDirection);
      upperWrapper.appendChild(originContainer);
      bottomWrapper.appendChild(destinationContainer);
      container.appendChild(modeSelector);
      container.appendChild(upperWrapper);
      container.appendChild(bottomWrapper);
      fullContainer.appendChild(container);      
      fullContainer.appendChild(stationExtrainfo);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(fullContainer);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(closeSearch);

      // Display custom controls
      customControlsView.appendChild(focusDublinCenter);
      customControlsView.appendChild(focusViewUser);
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(customControlsView);
    }

    // Sets a listener to open the search system
    setupRefreshSearchListener(id) {
      const refreshSearch = document.getElementById(id);
      refreshSearch.addEventListener("click", () => {
          this.refreshSearchEvent();
      });
    }

    // Function for refresh search
    refreshSearchEvent() {
      const originInput= document.getElementById('origin-input');
      const destinationInput= document.getElementById('destination-input');
      const waitingSearch = document.getElementById('waiting-search');
      const displayStationSearch = document.getElementById("display-station-search");
      const displayWeather = document.getElementById("display-weather");
      const displayOccupancy = document.getElementById("display-occupancy");
      displayStationSearch.innerHTML = "";
      displayWeather.style.display = "none";
      displayOccupancy.style.display = 'none';
      waitingSearch.style.display = "flex";
      waitingSearch.style.flexDirection = "column";
      waitingSearch.style.justifyContent = "space-around";
      waitingSearch.style.alignItems = "center";
      originInput.value = "";
      destinationInput.value = "";
      this.originLat = 0;
      this.originLng = 0;
      this.destinationLat = 0;
      this.destinationLng = 0;
      if (this.directionsRenderer != null) {
        this.directionsRenderer.setDirections({routes: []});
        this.removeRouteMarkers();
      }
    }

    // Sets a listener to make a search with the user current position
    setupUserPositionListener(id) {
      const iconPosition= document.getElementById(id);
      const originInput= document.getElementById('origin-input');
      iconPosition.addEventListener("click", () => {
        if (navigator.geolocation) {
          originInput.value = "Your position";
          navigator.geolocation.getCurrentPosition((pos) => {
            var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            this.myloc.setPosition(me);
            // Update the values for origin 
            this.originLat = this.myloc.getPosition().lat();
            this.originLng = this.myloc.getPosition().lng();
            // Try to get the route
            this.route();
          });
        }
        else {
          console.log("Unable to get user position");
        }
      });
    }

    // Sets a listener to display the view in the user position
    setupViewUserPositionListener(id) {
      const iconFocusView = document.getElementById(id);
      iconFocusView.addEventListener('click', () => {
        if (this.myloc.getPosition() != undefined) {
          this.map.setCenter(this.myloc.getPosition());
        }
        else {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                this.myloc.setPosition(me);
                this.map.setCenter(this.myloc.getPosition());
              });
          }
          else {
            console.log("Unable to get user position");
          }
        }
      });
    }

    // Sets a listener to display the view in Dublin center
    setupViewDublinListener(id) {
      const focusDublin = document.getElementById(id);
      focusDublin.addEventListener('click', () => {
        this.map.setCenter({lat: 53.349804, lng: -6.260310});
      });
    }

    // Sets a listener to open the search system
    setupOpenListener(id) {
      const openSearch = document.getElementById(id);
      const closeSearch = document.getElementById('close-search')
      const container = document.getElementById('container-pac');
      const upperWrapper = document.getElementById('upper-wrapper');
      const destinationInput= document.getElementById('destination-input');
      const destinationContainer= document.getElementById('destination-container');
      const modeSelector = document.getElementById('mode-selector');
      const pacList = document.getElementById('pac-list');
      const stationExtrainfo = document.getElementById("station-extrainfo");
      const fullContainer = document.getElementById("full-container");
      const refreshSearch = document.getElementById("refresh-search");
      const displayWeather = document.getElementById("display-weather");
      openSearch.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(0, 115, 152)";
        container.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
        container.style.justifyContent = "center";
        container.style.height = "275px";
        fullContainer.style.marginTop = "0px";
        upperWrapper.style.display = "flex";
        upperWrapper.style.justifyContent = "center";
        upperWrapper.style.alignItems = "center";
        modeSelector.style.display = "block"; 
        destinationInput.style.fontSize = "15px";
        destinationInput.style.width = "250px";
        destinationContainer.style.width = "250px";
        destinationContainer.style.padding = "0 11px 0 13px";
        pacList.style.width = "250px";
        openSearch.style.display = "none";
        closeSearch.style.display = "flex";
        stationExtrainfo.style.display = "block";
        fullContainer.style.height = "100%";
        refreshSearch.style.visibility = "visible";
        displayWeather.style.display = "block";
      })
    }
    // Sets a listener to close the search system
    setupCloseListener(id) {
      const closeSearch = document.getElementById(id);
      const openSearch = document.getElementById('search-direction');
      const container = document.getElementById('container-pac');
      const upperWrapper = document.getElementById('upper-wrapper');
      const destinationInput= document.getElementById('destination-input');
      const destinationContainer= document.getElementById('destination-container');
      const modeSelector = document.getElementById('mode-selector');
      const pacList = document.getElementById('pac-list');
      const stationExtrainfo = document.getElementById("station-extrainfo");
      const fullContainer = document.getElementById("full-container");
      const refreshSearch = document.getElementById("refresh-search");
      closeSearch.addEventListener("click", () => {
        this.refreshSearchEvent();
        container.style.backgroundColor = "transparent";
        container.style.boxShadow = "none";
        container.style.justifyContent = "normal";
        container.style.height = "auto";
        fullContainer.style.marginTop = "30px";
        upperWrapper.style.display = "none";
        modeSelector.style.display = "none";
        destinationInput.style.fontSize = "17px";
        destinationInput.style.width = "230px";
        destinationContainer.style.width = "275px";
        destinationContainer.style.padding = "10px 11px 10px 13px";
        pacList.style.width = "275px";
        closeSearch.style.display = "none";
        stationExtrainfo.style.display = "none";
        fullContainer.style.height = "auto";
        refreshSearch.style.visibility = "hidden";
        setTimeout(function() {
          openSearch.style.display = "inline";
          openSearch.style.verticalAlign= "-6px";
        }, 500);  
      })
    }
    // Sets a listener on a radio button to change the filter type on Places Autocomplete.
    setupClickListener(id, mode) {
      const radioButton = document.getElementById(id);
      radioButton.addEventListener("click", () => {
        this.travelMode = mode;
        this.route();
      });
    }
    // Sets a listener to calculate the route
    setupPlaceChangedListener(autocomplete, ...args) {
      if (autocomplete !== null) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
    
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          this.originLat = place.geometry.location.lat();
          this.originLng = place.geometry.location.lng();
          this.route();
        });
      } 
      else {
        this.destinationLat = args[0];
        this.destinationLng = args[1];
        this.route();     
      }
    }
    // Display route on the map
    route() {
      if (this.originLat == 0 || this.destinationLat == 0) {
        return;
      }
      const me = this;
      this.directionsService.route(
        {
          origin: { lat: this.originLat, lng: this.originLng },
          destination: { lat: this.destinationLat, lng: this.destinationLng },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
            var leg = response.routes[0].legs[0];
            this.removeRouteMarkers();

            if (this.travelMode == 'WALKING'){
              this.makeRouteMarker(leg.start_location, icons.walking);
            } else if (this.travelMode == 'TRANSIT') {
              this.makeRouteMarker(leg.start_location, icons.transit);
            } else if (this.travelMode == 'DRIVING') {
              this.makeRouteMarker(leg.start_location, icons.driving);
            }

            this.makeRouteMarker(leg.end_location, icons.end);
            console.log(this.travelMode);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
      var icons = {
        walking: new google.maps.MarkerImage(
          // URL
          'static/fixtures/icon-pedestrian-man.png',
          // (width,height)
          new google.maps.Size(32, 32)),
        transit: new google.maps.MarkerImage(
          // URL
          'static/fixtures/icon-front-bus.png',
          // (width,height)
          new google.maps.Size(32, 32)),
        driving: new google.maps.MarkerImage(
          // URL
          'static/fixtures/icon-front-car.png',
          // (width,height)
          new google.maps.Size(32, 32)),
        end: null
      };
    }

    // Display the markers for the start and end of the route
    makeRouteMarker(position, icon) {
      const routeMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: icon,
        zIndex: 10000,
      });
      this.routeMarkers.push(routeMarker);
    }

    removeRouteMarkers() {
      for (let i = 0; i < this.routeMarkers.length; i++) {
        this.routeMarkers[i].setMap(null); 
      }
      this.routeMarkers = [];
    }
}

// Function part of the search system. It provides the functionality to search for stations
function stationSearch(self, data, destinationInput, availability) {
  // Specify the add listeners for destination input
  var currentFocus = -1;
  // Execute a function when someone writes in the text field:
  google.maps.event.addDomListener(destinationInput, 'input', function(e) {
      var a, b, i;
      var val = this.value;
      /*close any already open lists of pacd values*/
      closeAllLists(destinationInput);
      if (!val) { return false;}
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
          if (station.address.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            // Create a DIV element for each matching element:
            b = document.createElement("DIV");
            b.style.display = "flex";
            b.style.alignItems = "center";
            // Insert the icon
            b.innerHTML = '<img src="static/fixtures/icon-bike-red.png" style="padding: 5px" width="20" height="20" alt="Red bike"/>';
            // Make the matching letters bold:
            b.innerHTML += "<strong>" + station.address.substr(0, val.length) + "</strong>";
            b.innerHTML += station.address.substr(val.length);
            // Insert a input field that will hold the current array item's value:
            b.innerHTML += "<input type='hidden' value='" + station.address + "'>";
            google.maps.event.addDomListener(b, "click", function(e) {
              for (i = 0; i < data.length; i++) {
                station = data[i];
                // Insert the value for the pac text field:
                destinationInput.value = this.getElementsByTagName("input")[0].value;
                // Compare both values
                if (station.address == destinationInput.value) {
                  // Close the list of pacd values or any other open lists of pacd values
                  closeAllLists(destinationInput);
                  // Display the weather info under the search bar
                  displayWeatherInfo('display-weather');
                  // Display the station info under the search bar 
                  displayStationSearch(station, availability[i]);
                  // Display graphs under the search bar
                  new displaySlidesGraphs(station.number); 
                  // Call function setupPlaceChangedListener to determine the route to the station
                  self.setupPlaceChangedListener(null, station.position_lat, station.position_lng);
                  break;
                }
              
              }
            });
            a.appendChild(b);
            predictions++;
            if (predictions >= 5 ) {
              break;
            }
          }
      }
    });

  // Execute a function presses a key on the keyboard
  google.maps.event.addDomListener(destinationInput, "keydown", function(e) {
      var x = document.getElementById("pac-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          if (currentFocus >= x.length) currentFocus = 0;
          /*and and make the current item more visible:*/
          addActive(x, currentFocus);
      } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          if (currentFocus < 0) currentFocus = (x.length - 1);
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
  google.maps.event.addDomListener(destinationInput, "blur", function(e) {
    setTimeout(() => {
      closeAllLists(destinationInput);
    }, 100); 
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

// Sets a function to open extra information about the station in the lateral bar
function displayStationSearch(station, availability) {
  const container = document.getElementById('container-pac');
  const stationExtrainfo = document.getElementById("station-extrainfo");
  const fullContainer = document.getElementById("full-container");
  const closeSearch = document.getElementById('close-search');
  const refreshSearch = document.getElementById("refresh-search");
  const displayStationSearch = document.getElementById("display-station-search");
  const waitingSearch = document.getElementById("waiting-search");
  const displayOccupancy = document.getElementById("display-occupancy");
  const displayWeather = document.getElementById("display-weather");
  container.style.backgroundColor = "rgb(0, 115, 152)";
  container.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
  container.style.justifyContent = "center";
  container.style.height = "275px";
  fullContainer.style.marginTop = "0px";
  stationExtrainfo.style.display = "block";
  fullContainer.style.height = "100%";
  closeSearch.style.display = "flex";
  waitingSearch.style.display = "none";
  refreshSearch.style.visibility = "visible";
  displayOccupancy.style.display = "block";
  displayWeather.style.display = "block";
  

  var iconBanking = '<img src="static/fixtures/icon-banking-false.png" style="opacity:0.2" width="24" height="24" alt="Banking false"/>';
  if (station.banking == 1) {
    iconBanking = '<img src="static/fixtures/icon-banking-true.png" width="24" height="24" alt="Banking true"/>';
  }
  const iconBike = '<img src="static/fixtures/icon-bike-blue.png" width="24" height="24" alt="Blue bike"/>';
  const iconParking = '<img src="static/fixtures/icon-parking.png" width="20" height="20" alt="Icon parking"/>';
  
  const contentStr = 
  '<div id="dinamic-station-info">' +
  '<div class="infowindow-station-title"><p><b>' + station.name + '</b> nº ' + station.number + '</p></div>' + 
  '<div class="station-infowindow">' +
  '<div class="infowindow-subelements"><p>' + availability.available_bikes + '</p>' + iconBike + '</div>' +
  '<div class="infowindow-subelements"><p>' + availability.available_bikes_stands + '</p>' + iconParking + '</div>' +
  '<div class="infowindow-subelements">' + iconBanking + '</div>' +
  '</div></div>';

  displayStationSearch.innerHTML = contentStr; 
}

// Sets a function to fetch and display the forecast weather
function displayWeatherInfo(id) {
  const displayWeatherContainer = document.getElementById(id);
  // Clear any old data
  if (displayWeatherContainer.innerHTML == "") {
    weatherPromise.then(data => {
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
          var contentStr = '';
          //iterate through the dates and format them from unix timestamps to days and dates 
          for (var i=0; i <datelist.length; i++){  
            formattedDates = new Date(datelist[i]*1000);
            dayName.push(formattedDates.toString().split(' ')[0]);
            date.push(formattedDates.toString().substr(4,6));  
          
            //iterate through the data and display day, date, temp, description, icon and wind
            var weatherIcon = '<img class="icons2" height = "50px" width = "50px" src="http://openweathermap.org/img/w/' + data[i].value['Weather'][0]['icon'] + '.png"/>';
            //create the containers to display weather 
            contentStr += '<div class="weather-slide fade"><div id="weather-header"><div><p>' + dayName[i] + '</p></div>' +
            '<div id="weather-description"><p>' + data[i].value['Weather'][0]['description'] + '</p></div>' +
            '<div><p>' + date[i] + '</p></div></div>' +
            '<div id="weather-info">' +
            '<div id="weather-temp" class="weather-items"><h1>' + data[i].value['Temp']['day'] + 'ºC</h1></div>' +
            '<div id="weather-icon" class="weather-items">' + weatherIcon + '</div>' +
            '<div id="weather-temp-min" class="weather-items"><p>Min<br>' + data[i].value['Temp']['max'] + '</p></div>' +
            '<div id="weather-temp-max" class="weather-items"><p>Max<br>' + data[i].value['Temp']['min'] + '</p></div>' +
            '<div id="weather-temp-humidity" class="weather-items"><p>Wind<br>' + data[i].value['Wind'] +  'mph</p></div>' +
            '</div></div>';
            
        }
        displayWeatherContainer.innerHTML = contentStr;

        showSlidesWeather(slideIndexWeather);
    }).catch(err => {
      console.log("OOPS! Can't display weather", err);       
    });
  } else {
    showSlidesWeather(slideIndexWeather);
  }
}

// Global variable to control which is the current slide
var slideIndexWeather = 1;

// Function that points to the prev or next slide
function plusSlidesWeather(n) {
  showSlidesWeather(slideIndexWeather += n);
}

// Function that points to the current slide
function currentSlideWeather(n) {
  showSlidesWeather(slideIndexWeather = n);
}

// Function that displays the already fetch weather
function showSlidesWeather(n) {
  var i;
  var slides = document.getElementsByClassName("weather-slide");
  if (n > slides.length) {slideIndexWeather = 1}    
  if (n < 1) {slideIndexWeather = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndexWeather-1].style.display = "flex";
  slides[slideIndexWeather-1].style.width = "90%";
  slides[slideIndexWeather-1].style.flexDirection = "column"; 
  slides[slideIndexWeather-1].style.alignItems = "center"; 
  slides[slideIndexWeather-1].style.justifyContent = "center";
}

// Function to display the occupancy of bikes and stands using google charts api
class displaySlidesGraphs {
  constructor(station_num) {
    this.slideIndex = 1;
    this.station_num = station_num;
    this.dataBikes;
    this.dataStands;

    // Setup event listeners
    this.getOccupancyData('occupancy-bikes', 'ocuppancy-stands');
  }


  getOccupancyData() {
    const prev = document.getElementsByClassName('prev')[0];
    const next = document.getElementsByClassName('next')[0];

    prev.addEventListener("click", () => {
      this.plusSlides(-1);
    });
    next.addEventListener("click", () => {
      this.plusSlides(1);
    });

    fetchOccupancy(this.station_num).then(jsonData => {
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
      this.dataBikes = dataBikes;
      this.dataStands = dataStands;

      this.showSlides(this.slideIndex);
    }).catch(err => {
      console.log("OOPS! Can't display occupancy", err);       
    });
  }

  displayOccupancy(id) {
    // Custom options
    var options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      width: 400,
      height: 200,
      fontName: 'Sans-serif',
      hAxis: {
        format: 'MMMM',
      },
      hAxis: {
        title: 'Month'
      },
      titleTextStyle: {
        fontSize: 15,
        fontName: 'Roboto, sans-serif',
      }
    };

    if (id == 'bikes') {
      // Instantiate and draw our charts, passing in some options.
      var chart = new google.visualization.LineChart(document.getElementById(id));
      options.title = 'Average Bikes nº ' + this.station_num;
      chart.draw(this.dataBikes, options);
    }
    else if (id == 'stands') {
      // Instantiate and draw our charts, passing in some options.
      var chart = new google.visualization.LineChart(document.getElementById(id));
      options.title = 'Average Stands nº ' + this.station_num;
      chart.draw(this.dataStands, options);
    }
    
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("myGraphs");
    if (n > slides.length) {this.slideIndex = 1}    
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        this.displayOccupancy(slides[i].id);  
        
    }
    slides[this.slideIndex-1].style.display = "block";
    this.displayOccupancy(slides[this.slideIndex-1].id);

  }

}

// Function to display the markers in the map  
function displayMarkers(data, map, availability, markersInfo) {
  var x = 0;
  data.forEach(station => {
    if (availability[x].number == station.number) {
      const marker = new myMarker(map, station, availability[x], markersInfo);
      markers.push(marker);
      x++;
    }
    else {
      for(var i = 0; i < availability.length; i++) {
        if(availability[i].number == station.number) {      
          const marker = new myMarker(map, station, availability[i], markersInfo);
          markers.push(marker);
          x++;
          break;
        }
      }
    }
  }); 
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].marker.setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// Class that creates a custom marker
class myMarker {
  constructor(map, station, availability, markersInfo) {
    this.map = map;
    if (markersInfo == 'available_bikes') {
      this.display_info = Number(availability.available_bikes);
    }else if(markersInfo == 'available_bikes_stands') {
      this.display_info = Number(availability.available_bikes_stands);
    }
    if (this.display_info < 6) {
      this.iconURL = 'static/fixtures/icon-location-red.png';
    }else if (this.display_info > 12){
      this.iconURL = 'static/fixtures/icon-location-green.png';
    }else {
      this.iconURL = 'static/fixtures/icon-location-yellow.png';
    }
    this.icon = {
      url: String(this.iconURL),
      size: new google.maps.Size(34, 34),
      scaledSize: new google.maps.Size(34, 34),
      labelOrigin: new google.maps.Point(17, 13)
    }  
    this.marker = new google.maps.Marker({
      position: {lat: station.position_lat, lng: station.position_lng},
      map: this.map,
      label: {
        className: 'labelMarker',
        text: ''+ this.display_info + '',
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif',
      },
      icon: this.icon,
    });
    this.station = station;
    this.availability = availability;

    var iconBanking = '<img src="static/fixtures/icon-banking-false.png" style="opacity:0.2" width="24" height="24" alt="Banking false"/>';
    if (station.banking == 1) {
      iconBanking = '<img src="static/fixtures/icon-banking-true.png" width="24" height="24" alt="Banking true"/>';
    }
    const iconBike = '<img src="static/fixtures/icon-bike-blue.png" width="24" height="24" alt="Blue bike"/>';
    const iconParking = '<img src="static/fixtures/icon-parking.png" width="20" height="20" alt="Icon parking"/>';
    
    const contentStr = 
    '<div class="contentStr">' +
    '<div class="infowindow-station-title"><p><b>' + station.name + '</b> nº ' + station.number + '</p></div>' + 
    '<div class="station-infowindow">' +
    '<div class="infowindow-subelements"><p><b>' + availability.available_bikes + '</b></p>' + iconBike + '</div>' +
    '<div class="infowindow-subelements"><p><b>' + availability.available_bikes_stands + '</b></p>' + iconParking + '</div>' +
    '<div class="infowindow-subelements">' + iconBanking + '</div>' +
    '</div></div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentStr,
    });
    infowindow.setZIndex(100);

    this.marker.addListener('mouseover', () => {
        infowindow.open(map, this.marker);
    });
    this.marker.addListener('mouseout', () => {
        infowindow.close(map, this.marker);
    });
    
    this.setupMarkerEvents(this.station, this.availability);

  }

  setupMarkerEvents(station, availability) {
    const destinationInput= document.getElementById('destination-input');
    this.marker.addListener('click', () => {
      displayStationSearch(station, availability);
      displayWeatherInfo('weather-slides-container');
      new displaySlidesGraphs(station.number);
      destinationInput.value = station.address;
    });
  }
}

