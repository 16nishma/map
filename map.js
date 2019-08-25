var ourLocation; // the latitude and longitude of where we are
var view; // the space that we're working with on the screen
var map; // a visual map where we can see where we are

function init() {
    // we are initializing all the above variables with VALUES
    // we are initializing our location with a lat and long
    ourLocation = ol.proj.fromLonLat([-73.89216, 40.7464509]);

    view = new ol.View({
        center: ourLocation,
        zoom: 18
    });

    map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
        })],
        loadTilesWhileAnimating: false,
        view: view
    });
}

function takeMeHome() {
    view.animate({
        center: ourLocation, // our home location, re-center the map
        duration: 2000 // this is 2 seconds in milliseconds
    })
}

// this is going to animate me to the country on the map
function takeMeToCountry() {
    var countryName = document.getElementById("country-name").value;
    if (countryName === "") {
        alert("That's not a valid country")
        return; //exits the program
    }

    var query="http://restcountries.eu/rest/v2/name/"+countryName
    // for exampple: http://restcountries.eu/rest/v2/name/Japan
    query=query.replace(/ /g,"%20")

    // make an http get request
    var countryRequest = new XMLHttpRequest()
    countryRequest.open('GET',query, true);

    // when the ready state is 4, then we are ready to load the map
    alert("READY STATE: " + countryRequest.readyState)
    alert("STATUS: " + countryRequest.status)
    alert("RESPONSE: " + countryRequest.response)

    countryRequest.onload = processCountryRequest;
    
    countryRequest.send();
}

function processCountryRequest() {
    if(countryRequest.readyState != 4) {
        return;
    }

    if (countryRequest.status != 200 || countryRequest.responseText === "") {
        alert("We were unable to find your requested country!")
        return;
    }

    var countryInformation = JSON.parse(countryRequest.responseText)

    var lon = countryInformation[0].latlng[1];
    var lat = countryInformation[0].latlng[0];

    var location = ol.proj.fromLonLat([lon,lat]);


    view.animate({
        center: location,
        duration: 2000,
        zoom: 10
    })
}

window.onload = init;