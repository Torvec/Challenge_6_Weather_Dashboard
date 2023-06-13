dayjs.extend(window.dayjs_plugin_advancedFormat);

// PAGE ELEMENTS
const searchInputEl = document.getElementById('inputSearch');
const searchButtonEl = document.getElementById('searchBtn');
const searchHistoryEl = document.getElementById('searchHistory');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastEl = document.getElementById('forecast');

// LOCAL STORAGE VARIABLES
var cities = JSON.parse(localStorage.getItem('cities')) || []; // GETS CITIES FROM LOCAL STORAGE OR CREATES EMPTY ARRAY

function initialState() {
    if(!cities || cities.length === 0) {
        var noWeatherData_Msg = document.createElement('p');
        noWeatherData_Msg.textContent = 'Use Search to get Weather Data for a City';
        currentWeatherEl.appendChild(noWeatherData_Msg);
    } else {
        showSearchHistory(); // SHOW SEARCH HISTORY IF LOCAL STORAGE IS POPULATED
        getWeatherData(cities[0]); // GET WEATHER DATA FOR LAST SEARCHED CITY
    }
}

// GET WEATHER DATA FROM OPENWEATHER USING GEOCODING API AND ONE CALL API 3.0
function getWeatherData(city) {
    
    var APIkey = '69c891690c013252b4d865245ab10534';
    var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`;
    fetch(geoURL)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok.'); // CREATES ERROR OBJECT FOR ERROR HANDLING
        }
        return response.json();
    })
    .then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var oneCallURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIkey}`
        fetch(oneCallURL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok.'); // CREATES ERROR OBJECT FOR ERROR HANDLING
            }
            return response.json();
        })
        .then(function(data) {
            // GET CURRENT WEATHER DATA
            var getCurDate = data.current.dt;
            var formattedCurDate = dayjs.unix(getCurDate).format('MMMM Do, YYYY');
            var getCurClouds = data.current.clouds;
            var getCurCloudsIcon = data.current.weather[0].icon;
            var getCurTemp = Math.floor(data.current.temp);
            var getCurHumidity = data.current.humidity;
            var getCurWindSpeed = Math.floor(data.current.wind_speed);
            currentWeatherEl.innerHTML = 
            `<div class="card">
                <h2>${city}</h2>
                <h3>${formattedCurDate}</h3>
                <div class="card-header">
                    <img class="weatherIcon" src="https://openweathermap.org/img/wn/${getCurCloudsIcon}.png" alt="${getCurClouds}">
                    <p class="temperature">${getCurTemp}&deg;<sup>F</sup></p>
                </div>
                <p class="humidity">Humidity: ${getCurHumidity}%</p>
                <p class="windSpeed">Wind Speed: ${getCurWindSpeed} MPH</p>
            </div>`;

            // GET 5-DAY FORECAST DATA
            var forecastHTML = '';
            for (var i = 0; i < 5; i++) {
                var getForecastDate = data.daily[i].dt;
                var formattedForecastDate = dayjs.unix(getForecastDate).format('MMMM Do, YYYY');
                var getForecastClouds = data.daily[i].clouds;
                var getForecastCloudsIcon = data.daily[i].weather[0].icon;
                var getForecastTemp = Math.floor(data.daily[i].temp.day);
                var getForecastHumidity = data.daily[i].humidity;
                var getForecastWindSpeed = Math.floor(data.daily[i].wind_speed);
                forecastHTML += `
                <div class="card">
                <h3>${formattedForecastDate}</h3>
                <div class="card-header">
                    <img class="weatherIcon" src="https://openweathermap.org/img/wn/${getForecastCloudsIcon}.png" alt="${getForecastClouds}">
                    <p class="temperature">${getForecastTemp}&deg;<sup>F</sup></p>
                </div>
                <p class="humidity">Humidity: ${getForecastHumidity}%</p>
                <p class="windSpeed">Wind Speed: ${getForecastWindSpeed} MPH</p>
                </div>`;
            }
            forecastEl.innerHTML = forecastHTML;
        })
        // CATCH ERRORS FOR ONE CALL 3.0 API FETCH REQUEST
        .catch(function(error) {
            console.log('Error:', error.message); 
        });
    })
    // CATCH ERRORS FOR GEOCODING API FETCH REQUEST
    .catch(function(error) {
        console.log('Error:', error.message); 
    });
};

// SAVE SEARCH HISTORY TO LOCAL STORAGE
function saveSearchHistory(city) {
    cities.unshift(city); // ADDS CITY TO BEGINNING OF ARRAY
    if (cities.length > 10) {
        cities.pop();// REMOVES LAST CITY FROM ARRAY IF ARRAY LENGTH IS GREATER THAN 10
    }
    localStorage.setItem('cities', JSON.stringify(cities));// SAVES ARRAY TO LOCAL STORAGE
    addSearchCityButton(city); // ADDS CITY TO SEARCH HISTORY
}

function addSearchCityButton(city) {
    var citySearched = document.createElement('button');
    citySearched.setAttribute('class', 'citySearched');
    citySearched.textContent = city;
    searchHistoryEl.appendChild(citySearched);
}

function showSearchHistory() {
    for (var i = 0; i < cities.length; i++) {
        addSearchCityButton(cities[i]);
    }
}

// EVENT LISTENER FOR SEARCH HISTORY BUTTONS, USES EVENT BUBBLING ON THE PARENT ELEMENT TO LISTEN FOR CLICKS ON BUTTON ELEMENTS
searchHistoryEl.addEventListener('click', function(event) {
    if (event.target.classList.contains('citySearched')) {
        var cityName = event.target.textContent;
        getWeatherData(cityName);
    }});

// EVENT LISTENER FOR SEARCH BUTTON
searchButtonEl.addEventListener('click', function() {
    if (!searchInputEl.value) {
        alert('Please enter a city name');
        return;
    }
    var cityName = searchInputEl.value;
    saveSearchHistory(cityName);
    getWeatherData(cityName);
    searchInputEl.value = '';
});

initialState();