function initMap() {
    fetch("/stations").then(response => {
        return response.json();
    }).then(data => {
        fetch("static/js/styledmap.json").then(response => {
            return response.json();
        }).then(json => {
            console.log(json);
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

                displayInfoWindows(data, map, availability);
                new AutocompleteDirectionsHandler(map, data, availability);
            
            });
          });
    }).catch(err => {
        console.log("OOPS!", err);       
    });
}

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
      this.originLat = 0;
      this.originLng = 0;
      this.destinationLat = 0;
      this.destinationLng = 0;
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
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
      displayStationSearch.innerHTML = "";
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
      const refreshSearch = document.getElementById("refresh-search");
      openSearch.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(0, 115, 152)";
        container.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
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
        stationExtrainfo.style.visibility = "visible";
        refreshSearch.style.visibility = "visible";
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
      const refreshSearch = document.getElementById("refresh-search");
      closeSearch.addEventListener("click", () => {
        this.refreshSearchEvent();
        container.style.backgroundColor = "transparent";
        container.style.boxShadow = "none";
        upperWrapper.style.display = "none";
        modeSelector.style.display = "none";
        destinationInput.style.fontSize = "17px";
        destinationInput.style.width = "230px";
        destinationContainer.style.width = "275px";
        destinationContainer.style.padding = "10px 11px 10px 13px";
        pacList.style.width = "275px";
        closeSearch.style.display = "none";
        stationExtrainfo.style.visibility = "hidden";
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
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  }

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
            // Make the matching letters bold:
            b.innerHTML = "<strong>" + station.address.substr(0, val.length) + "</strong>";
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
                  // Display the station info under the search bar 
                  displayStationSearch(station, availability[i]);
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

  // Execute a function presses a key on the keyboard:
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
}

// Sets a listener to open extra information about the station
function displayStationSearch(station, availability) {
  const container = document.getElementById('container-pac');
  const stationExtrainfo = document.getElementById("station-extrainfo");
  const closeSearch = document.getElementById('close-search');
  const refreshSearch = document.getElementById("refresh-search");
  const displayStationSearch = document.getElementById("display-station-search");
  const waitingSearch = document.getElementById("waiting-search");
  container.style.backgroundColor = "rgb(0, 115, 152)";
  container.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
  stationExtrainfo.style.visibility = "visible";
  closeSearch.style.display = "flex";
  waitingSearch.style.display = "none";
  refreshSearch.style.visibility = "visible";

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

function addActive(x, currentFocus) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(x);
  /*add class "pac-active":*/
  x[currentFocus].classList.add("pac-active");
}

function removeActive(x) {
  /*a function to remove the "active" class from all pac items:*/
  for (var i = 0; i < x.length; i++) {
  x[i].classList.remove("pac-active");
  }
}
  
function displayInfoWindows(data, map, availability) {
  var i = 0;
  data.forEach(station => {
      new myMarker(map, station, availability[i]);
      i++;
  });   
}

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

class myMarker {
  constructor(map, station, availability) {
    this.map = map;
    this.icon = {
      url: 'static/fixtures/location.svg',
      size: new google.maps.Size(100, 100),
      scaledSize: new google.maps.Size(100, 100),
      anchor: new google.maps.Point(16, 16),
      labelOrigin: new google.maps.Point(16, 16)
    }
    this.svgMarker = {
      path: "static/fixtures/location.svg",
      fillColor: 'rgba(0, 115, 152, 1)',
      fillOpacity: 1,
      strokeWeight: 0.4,
      rotation: 0,
      scale: 0.08,
      strokeColor: 'black',
      labelOrigin: new google.maps.Point(24, -12),
    };  
    this.marker = new google.maps.Marker({
      position: {lat: station.position_lat, lng: station.position_lng},
      map: this.map,
      label: {
        className: 'labelMarker',
        text: ''+ availability.available_bikes + '',
      },
      icon: this.svgMarker,
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
      destinationInput.value = station.address;
    });
  }
}

