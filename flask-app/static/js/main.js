function initMap() {
   fetch("/stations").then(response => {
      return response.json();
   }).then(data => {
      console.log("data: ", data);

      fetch("styledmap.json")
        .then(response => response.json())
        .then(json => console.log(json));

      const styledMapType = new google.maps.StyledMapType(
         [
            {
                "featureType": "all",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#5b6571"
                    },
                    {
                        "lightness": "35"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e8ebeb"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                    {
                        "weight": 0.9
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#83cead"
                    },
                ]
            },
            {
               "featureType": "poi.park",
               "elementType": "labels",
               "stylers": [
                   {
                       "visibility": "on"
                   },
               ]
           },
           {
            "featureType": "poi.attraction",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
            ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#fee379"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#7fc8ed"
                    }
                ]
            },
            {
               "featureType": "water",
               "elementType": "labels",
               "stylers": [
                   {
                       "visibility": "on"
                   },
               ]
           }
        ],
         { name: "Styled Map" }
       );

      const map = new google.maps.Map(document.getElementById("map"), {
         center: {lat: 53.349804, lng: -6.260310},
         zoom: 13,
         mapTypeControlOptions: {
            mapTypeIds: [""],
          },
      });

      map.mapTypes.set("styled_map", styledMapType);
      map.setMapTypeId("styled_map");

      data.forEach(station => {
         const marker = new google.maps.Marker({
            position: {lat: station.position_lat, lng: station.position_lng},
            map: map,
         });
         marker.addListener('click', () => {
            const infowindow = new google.maps.InfoWindow({
               content: '<p> ' + station.name + '</p>'
            });
            infowindow.open(map, marker);
         });
      });    
      }).catch(err => {
         console.log("OOPS!", err);
      })
}

