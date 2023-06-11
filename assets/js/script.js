// TODO: GIVEN a weather dashboard with form inputs
    // WHEN I search for a city
        // THEN I am presented with current and future conditions for that city and that city is added to the search history
    // WHEN I click on a city in the search history
        // THEN I am again presented with current and future conditions for that city

//TASK: GET WEATHER DATA
    //TODO: USE GEOCODING API TO GET LAT/LON OF CITY FROM OPENWEATHER API
    //TODO: USE LAT/LON TO GET WEATHER DATA FROM OPENWEATHER ONE CALL API 3.0
//TASK: DISPLAY WEATHER DATA
    //TODO: USE WEATHER DATA TO DISPLAY CURRENT WEATHER CONDITIONS
        //IMAGE OF CLOUD COVER (0-100%), CURRENT TEMPERATURE, CURRENT WIND SPEED, CURRENT HUMIDITY
    //TODO: USE WEATHER DATA TO DISPLAY 5-DAY FORECAST
        //IMAGE OF CLOUD COVER (0-100%), TEMPERATURE (HI/LO?), WIND SPEED, HUMIDITY
//TASK: SAVE SEARCH HISTORY
    //TODO: SAVE SEARCH HISTORY TO LOCAL STORAGE
    //TODO: DISPLAY SEARCH HISTORY FROM LOCAL STORAGE
    //TODO: CLEAR SEARCH HISTORY BUTTON

var searchInputEl = document.getElementById('inputSearch');
var searchButtonEl = document.getElementById('searchBtn');
var searchHistoryEl = document.getElementById('searchHistory');
var currentWeatherEl = document.getElementById('currentWeather');
var forecastEl = document.getElementById('forecast');

var limit = 1;
var APIkey = '69c891690c013252b4d865245ab10534'
var baseGeoURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var baseOneCallURL = 'https://api.openweathermap.org/data/3.0/onecall?';
var excludeParams = 'minutely,hourly,alerts';
var unitsParam = 'imperial';

function clearSection(section) {
    section.innerHTML = '';
}


// GET COORDINATES OF CITY USING GEOCODING API FROM OPENWEATHER
function getCoords() {

    var cityName = searchInputEl.value;
    var getGeoURL = baseGeoURL + cityName + '&limit=' + limit + '&appid=' + APIkey;

    fetch(getGeoURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        getCurrentWeather(cityName, cityLat, cityLon);
        getForecastWeather(cityLat, cityLon);
    });
}

// GET CURRENT WEATHER CONDITIONS USING ONE CALL API FROM OPENWEATHER
function getCurrentWeather(city, lat, lon) {

    var getOneCallURL = baseOneCallURL + 'lat=' + lat + '&lon=' + lon + '&exclude=' + excludeParams + '&units=' + unitsParam + '&appid=' + APIkey;
    
    fetch(getOneCallURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        var getCurDate = data.current.dt; // TODO: NEED TO CONVERT TO MM/DD/YYYY - CURRENTLY RETURNS UNIX TIMESTAMP IN UTC
        var getCurClouds = data.current.clouds; // GET CURRENT CLOUD COVER IN PERCENT AND USE IT AS ALT TEXT FOR THE ICON
        var getCurCloudsIcon = data.current.weather[0].icon; // GET CURRENT CLOUD COVER ICON
        var getCurTemp = Math.floor(data.current.temp); // GET CURRENT TEMPERATURE AND REMOVE DECIMALS
        var getCurHumidity = data.current.humidity; // GET CURRENT HUMIDITY IN PERCENT
        var getCurWindSpeed = Math.floor(data.current.wind_speed); // GET CURRENT WIND SPEED IN MPH AND REMOVE DECIMALS
        
        currentWeatherEl.innerHTML = 
        `<div class="card">
            <h2>${city}</h2>
            <h3>${getCurDate}</h3>
            <div class="card-header">
                <img class="weatherIcon" src="https://openweathermap.org/img/wn/${getCurCloudsIcon}.png" alt="${getCurClouds}">
                <p class="temperature">${getCurTemp}&deg;<sup>F</sup></p>
            </div>
            <p class="humidity">Humidity: ${getCurHumidity}%</p>
            <p class="windSpeed">Wind Speed: ${getCurWindSpeed} MPH</p>
        </div>`;
    });

}

// GET 5-DAY FORECAST USING ONE CALL API FROM OPENWEATHER
function getForecastWeather(lat, lon) {
    
    var getOneCallURL = baseOneCallURL + 'lat=' + lat + '&lon=' + lon + '&exclude=' + excludeParams + '&units=' + unitsParam + '&appid=' + APIkey;

    fetch(getOneCallURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    
        var forecastHTML = '';

        for (var i = 0; i < 5; i++) {

            var getForecastDate = data.daily[i].dt; // TODO: NEED TO CONVERT TO MM/DD/YYYY - CURRENTLY RETURNS UNIX TIMESTAMP IN UTC
            var getForecastClouds = data.daily[i].clouds; // GET CURRENT CLOUD COVER IN PERCENT AND USE IT AS ALT TEXT FOR THE ICON
            var getForecastCloudsIcon = data.daily[i].weather[0].icon; // GET CURRENT CLOUD COVER ICON
            var getForecastTemp = Math.floor(data.daily[i].temp.day); // GET CURRENT TEMPERATURE AND REMOVE DECIMALS
            var getForecastHumidity = data.daily[i].humidity; // GET CURRENT HUMIDITY IN PERCENT
            var getForecastWindSpeed = Math.floor(data.daily[i].wind_speed); // GET CURRENT WIND SPEED IN MPH AND REMOVE DECIMALS

            forecastHTML += `
            <div class="card">
            <h3>${getForecastDate}</h3>
            <div class="card-header">
                <img class="weatherIcon" src="https://openweathermap.org/img/wn/${getForecastCloudsIcon}.png" alt="${getForecastClouds}">
                <p class="temperature">${getForecastTemp}&deg;<sup>F</sup></p>
            </div>
            <p class="humidity">Humidity: ${getForecastHumidity}%</p>
            <p class="windSpeed">Wind Speed: ${getForecastWindSpeed} MPH</p>
            </div>`;
        }
            forecastEl.innerHTML = forecastHTML;
    });
};

searchButtonEl.addEventListener('click', function() {
    getCoords();
    event.preventDefault();
    clearSection(currentWeatherEl);
    clearSection(forecastEl);
});