// TODO: GIVEN a weather dashboard with form inputs
    // WHEN I search for a city
        // THEN I am presented with current and future conditions for that city and that city is added to the search history
    // WHEN I view future weather conditions for that city
        // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
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
var currentWeatherEl = document.getElementById('currentWeather');


var limit = 1;
var APIkey = '69c891690c013252b4d865245ab10534'
var baseGeoURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var baseOneCallURL = 'https://api.openweathermap.org/data/3.0/onecall?';
var excludeParams = 'minutely,hourly,alerts';
var unitsParam = 'imperial';


// GET COORDINATES OF CITY USING GEOCODING API FROM OPENWEATHER
function getCoords(event) {
    
    event.preventDefault();

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
        // getForecastWeather(cityLat, cityLon);
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
        var getCurTemp = data.current.temp + 'F'; // GET CURRENT TEMPERATURE
        var getCurHumidity = data.current.humidity + '%'; // GET CURRENT HUMIDITY IN PERCENT
        var getCurWindSpeed = data.current.wind_speed + 'MPH'; // GET CURRENT WIND SPEED IN MPH
        
        var curCityDate = document.createElement('h2');
        curCityDate.textContent = city + ' - ' + getCurDate;
        currentWeatherEl.appendChild(curCityDate);

        var curCloudsIcon = document.createElement('img')
        curCloudsIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + getCurCloudsIcon + '.png');
        curCloudsIcon.setAttribute('alt', getCurClouds + '% cloud cover');
        currentWeatherEl.appendChild(curCloudsIcon);
        
        var curTemp = document.createElement('span');
        curTemp.setAttribute('class', 'temperature');
        curTemp.textContent = getCurTemp;
        currentWeatherEl.appendChild(curTemp);

        var curHumidity = document.createElement('span');
        curHumidity.setAttribute('class', 'humidity');
        curHumidity.textContent = getCurHumidity;
        currentWeatherEl.appendChild(curHumidity);

        var curWindSpeed = document.createElement('span');
        curWindSpeed.setAttribute('class', 'windSpeed');
        curWindSpeed.textContent = getCurWindSpeed;
        currentWeatherEl.appendChild(curWindSpeed);

    });

}

// GET 5-DAY FORECAST USING ONE CALL API FROM OPENWEATHER
function getForecastWeather(lat, lon) {
    
}

searchButtonEl.addEventListener('click', getCoords);


// https://openweathermap.org/weather-conditions#How-to-get-icon-URL <-- ICONS
// {
//     "current": {
//         "temp": 56.53,
//         "humidity": 78,
//         "clouds": 100,
//         "wind_speed": 5.75,
//         "weather": [
//             {
//                 "id": 804,
//                 "main": "Clouds",
//                 "description": "overcast clouds",
//                 "icon": "04n"
//             }
//         ]
//     },
//     "daily": [
//         {
//             "temp": {
//                 "day": 76.78,
//                 "min": 54.86,
//                 "max": 79.61,
//                 "night": 57.49,
//                 "eve": 72.01,
//                 "morn": 56.35
//             },
//             "humidity": 36,
//             "wind_speed": 6.31,
//             "weather": [
//                 {
//                     "id": 804,
//                     "main": "Clouds",
//                     "description": "overcast clouds",
//                     "icon": "04d"
//                 }
//             ],
//             "clouds": 100,
//             "pop": 0,
//             "uvi": 6.86
//         },
//     ]
// }