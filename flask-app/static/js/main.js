function initMap() {
    fetch("/stations").then(response => {
        return response.json();
    }).then(data => {
         
        console.log("data: ", data);

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

            infoWindows(data, map);
            });
        }).catch(err => {
            console.log("OOPS!", err);       
        });
}

function infoWindows(data, map) {
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