function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
      });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap,
      "Dark Map": darkmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [38.6270, -90.1994],
      zoom: 4,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }

  function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var quakes = response.features;

    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the stations array
    for (var i = 0; i < quakes.length; i++) {
        var lat = response.features[i].geometry.coordinates[1];
        var lon = response.features[i].geometry.coordinates[0];
        var mag = response.features[i].properties.mag;
        var place = response.features[i].properties.place;
        var duration = (+(response.features[i].properties.dmin)) * 60;
        var color;
        
        if (mag < 1) {
            color = "blue"
        }
        else if (mag < 2) {
            color = "green"
        }
        else if (mag < 3) {
            color = "yellowgreen"
        }
        else if (mag < 4) {
            color = "gold"
        }
        else if (mag < 5) {
            color = "orangered"
        }
        else if (mag >= 5) {
            color = "red"
          }

        var radius = mag*100;
  
      // For each station, create a marker and bind a popup with the station's name
      var quakeMarker = L.circle([lat, lon], {           
        stroke: false,
        fillColor: .75,
        color: color,
        fillColor: color,
        radius: radius
      })
        .bindPopup("<h3"> + place + "</h3>" + "<h3> Magnitude: " + mag + "</h3><h3> Duration: " + duration + " sec</h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }

  var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

  d3.json(quakeURL, createMarkers);
