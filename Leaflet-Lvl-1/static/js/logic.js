// function createMap(eData) {



// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  zero: new L.LayerGroup(),
  one: new L.LayerGroup(),
  two: new L.LayerGroup(),
  three: new L.LayerGroup(),
  four: new L.LayerGroup(),
  five: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.zero,
    layers.one,
    layers.two,
    layers.three,
    layers.four,
    layers.five
  ]
});

// Add our 'lightmap' tile layer to the map
var basemaps = {
  "light": lightmap,
  "dark": darkmap
};

// basemaps.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0+": layers.zero,
  "1+": layers.one,
  "2+": layers.two,
  "3+": layers.three,
  "4+": layers.four,
  "5+": layers.five
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(basemaps, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);



var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

var quakeMarkers = {};

d3.json(quakeURL, function(quakeData) {
    for (var i = 0; i < quakeData.length; i++) {
    var lat = quakeData.features[i].geometry.coordinates[1];
    var lon = quakeData.features[i].geometry.coordinates[0];
    var mag = quakeData.features[i].properties.mag;
    var place = quakeData.features[i].properties.place;
    var duration = (+(quakeData.features[i].properties.dmin)) * 60;

    if (mag < 1) {
        quakeMarkers.push({zero: L.circle([lat,lon], {
            stroke: false,
            fillOpacity: .75,
            color: "blue",
            fillColor: "blue",
            radius: mag * 20
          })});
    }
    else if (mag < 2) {
        quakeMarkers.push ({one: L.circle([lat, lon], {
            stroke: false,
            fillColor: .75,
            color: "green",
            fillColor: "green",
            radius: mag * 20
        })});
    }
    else if (mag < 3) {
        quakeMarkers.push ({two: L.circle([lat, lon], {
            stroke: false,
            fillColor: .75,
            color: "yellowgreen",
            fillColor: "yellowgreen",
            radius: mag * 20
        })});
    }
    else if (mag < 4) {
        quakeMarkers.push ({three: L.circle([lat, lon], {
            stroke: false,
            fillColor: .75,
            color: "gold",
            fillColor: "gold",
            radius: mag * 20
        })});
    }
    else if (mag < 5) {
        quakeMarkers.push ({four: L.circle([lat, lon], {
            stroke: false,
            fillColor: .75,
            color: "orangered",
            fillColor: "orangered",
            radius: mag * 20
        })});
    }
    else if (mag >= 5) {
        quakeMarkers.push ({five: L.circle([lat, lon], {
            stroke: false,
            fillColor: .75,
            color: "red",
            fillColor: "red",
            radius: mag * 20
        })
      })
    }

    quakeMarkers.bindPopup(place + "<br> Magnitude: " + mag + "<br> Duration: " + duration + " sec");

};

});

quakeMarkers.addTo(map);
