function initMap() {
    fetch("/stations").then(response => {
        return response.json();
    }).then(data => {
        fetch("static/js/styledmap.json").then(response => {
            return response.json();
        }).then(json => {
            console.log(json);
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

            displayInfoWindows(data, map);
            userPosition(map);
            new AutocompleteDirectionsHandler(map, data);
            
        });
    }).catch(err => {
        console.log("OOPS!", err);       
    });
}

class AutocompleteDirectionsHandler {
    constructor(map, data) {
      this.map = map;
      this.originPlaceId = "";
      this.destinationLat = 0;
      this.destinationLng = 0;
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);
      const container = document.getElementById('container-pac');
      const originInput = document.getElementById("origin-input");
      const destinationInput = document.getElementById("destination-input");
      const destinationContainer = document.createElement('DIV');
      destinationContainer.setAttribute('class', 'destination-container');
      const modeSelector = document.getElementById("mode-selector");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      // Specify just the place data fields that you need.
      originAutocomplete.setFields(["place_id"]);
      stationSearch(this, data, destinationInput);

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
      this.setupPlaceChangedListener(originAutocomplete);
      container.appendChild(modeSelector);
      container.appendChild(originInput);
      destinationContainer.appendChild(destinationInput);
      container.appendChild(destinationContainer);
      this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(container);

    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode, destinat) {
      const radioButton = document.getElementById(id);
      radioButton.addEventListener("click", () => {
        this.travelMode = mode;
        this.route();
      });
    }
    setupPlaceChangedListener(autocomplete, ...args) {
      if (autocomplete !== null) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
    
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
  
        this.originPlaceId = place.place_id;
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
      if (!this.originPlaceId || this.destinationLat == 0) {
        return;
      }
      const me = this;
      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
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

function stationSearch(self, data, destinationInput) {
  // Specify the autocomplete addresses for the stations
  var arr = [];
  data.forEach(station => {
    arr.push(station.address);
  });
  
  // Specify the add listeners for destination input
  var currentFocus;
  // Execute a function when someone writes in the text field:
  google.maps.event.addDomListener(destinationInput, 'input', function(e) {
      var a, b, i, val = this.value;
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
      for (i = 0; i < arr.length; i++) {
          // Check if the item starts with the same letters as the text field value:
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            // Create a DIV element for each matching element:
            b = document.createElement("DIV");
            // Make the matching letters bold:
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            // Insert a input field that will hold the current array item's value:
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            google.maps.event.addDomListener(b, "click", function(e) {
                // Insert the value for the pac text field:
                destinationInput.value = this.getElementsByTagName("input")[0].value;
                /* Close the list of pacd values,
                (or any other open lists of pacd values:*/
                closeAllLists(destinationInput);

                // Call function setupPlaceChangedListener to determine the route to the station
                data.forEach(station => {
                  if (station.address == arr[i]) {
                    self.setupPlaceChangedListener(null, station.position_lat, station.position_lng);
                  }
                });
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
      var x = document.getElementById(this.id + "pac-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
      } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
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
  
function displayInfoWindows(data, map) {
    fetch("/availability").then(response => {
        return response.json();
    }).then(availability => {
        availability.sort(compare);
        console.log(availability);
        var i = 0;
        data.forEach(station => {
            const contentStr = 
            '<div class="contentStr">' +
            '<p>' + station.name + '</p>' +
            '<p>' + station.number + '</p>' +
            '<p>' + availability[i].available_bikes + '</p>' +
            '<p>' + availability[i].available_bikes_stands + '</p>' +
            '</div>';
            const infowindow = new google.maps.InfoWindow({
                content: contentStr,
            });
            const marker = new google.maps.Marker({
                position: {lat: station.position_lat, lng: station.position_lng},
                map: map,
            });
            marker.addListener('mouseover', () => {
                infowindow.open(map, marker);
            });
            marker.addListener('mouseout', () => {
                infowindow.close(map, marker);
            });
            i++;
        });  
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

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "pac-active":*/
    x[currentFocus].classList.add("pac-active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all pac items:*/
    for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("pac-active");
    }
}

function userPosition(map) {
    var myloc = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new google.maps.Size(22,22),
        new google.maps.Point(0,18),
        new google.maps.Point(11,11)),
        shadow: null,
        zIndex: 999,
        map: map,
    });
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myloc.setPosition(me);
        }, function(error) {
            console.log(error);
        });
    }
}

