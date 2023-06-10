// TODO: GIVEN a weather dashboard with form inputs
    // WHEN I search for a city
        // THEN I am presented with current and future conditions for that city and that city is added to the search history
    // WHEN I view current weather conditions for that city
        // THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
    // WHEN I view future weather conditions for that city
        // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
    // WHEN I click on a city in the search history
        // THEN I am again presented with current and future conditions for that city

//TASK: GET WEATHER DATA
    //TODO: USE GEOCODING API TO GET LAT/LON OF CITY FROM OPENWEATHER API
    //TODO: USE LAT/LON TO GET WEATHER DATA FROM OPENWEATHER ONE CALL API 3.0
//TASK: DISPLAY WEATHER DATA
    //TODO: USE WEATHER DATA TO DISPLAY CURRENT WEATHER CONDITIONS
    //TODO: USE WEATHER DATA TO DISPLAY 5-DAY FORECAST
//TASK: SAVE SEARCH HISTORY
    //TODO: SAVE SEARCH HISTORY TO LOCAL STORAGE
    //TODO: DISPLAY SEARCH HISTORY FROM LOCAL STORAGE
    //TODO: CLEAR SEARCH HISTORY BUTTON

var searchInputEl = document.getElementById('inputSearch');
var searchButtonEl = document.getElementById('searchBtn');
var APIkey = '69c891690c013252b4d865245ab10534'

// GET COORDINATES OF CITY USING GEOCODING API FROM OPENWEATHER
function getCoords(event) {
    
    event.preventDefault();

    var city = searchInputEl.value;
    var limit = 1;
    var queryGeoURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=' + limit + '&appid=' + APIkey;

    fetch(queryGeoURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        console.log(cityLat, cityLon);
        submitSearch(cityLat, cityLon);
    });
    
}

function submitSearch(lat, lon) {

    var queryOneCallURL = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + APIkey;
    
    fetch(queryOneCallURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });

}

searchButtonEl.addEventListener('click', getCoords);