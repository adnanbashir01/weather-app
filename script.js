// import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

// Access the elements
const navbar = document.querySelector('.navbar');
const cardBody = document.querySelector('.card-body__mine');
const searchForm = document.querySelector('#mainSearch');
const city = document.querySelector('#city');
const formInput = document.querySelector('#formInput')
const temp = document.querySelector('#temp');
const feelsLike = document.querySelector('#feelsLike');
const maxTemp = document.querySelector('#maxTemp');
const minTemp = document.querySelector('#minTemp');
const humidity = document.querySelector('#humidity');
const cloudCover = document.querySelector('#cloudCover');
const windSpeed = document.querySelector('#windSpeed');
const sunnyCondition = document.querySelector('#sunnyCondition');
const checkAgain = document.querySelector('.checkAgain');

// Get the current location
const currentLocation = function () {
    // Promisify the geolocation 
    const getPosition = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    }

    getPosition().then(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=224116842654155321462x108681`)
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            checkWether(data.city);
        })
}

// Show weather for current location
currentLocation();


// Render Weatehr 
const renderWeather = function (weather, cityName) {
    try {
        if (!weather.temp) {
            const alert = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Report not found!</strong> Please search for a valid city.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
            navbar.insertAdjacentHTML("afterend", alert);
            throw new Error('Weather report not found');
        }
        cardBody.innerHTML = '';
        const html = `
                <h1 class="card-title pricing-card-title">
                  <span id="temp">${weather.temp}</span
                  ><small class="text-body-secondary fw-light">&deg;C</small>
                </h1>
                <ul class="list-unstyled mt-3 mb-4">
                  <li>Feels Like: <span id="feelsLike">${weather.feels_like}</span>&deg;C</li>
                  <li>Max Temp. Today: <span id="maxTemp">${weather.max_temp}</span>&deg;C</li>
                  <li>Min Temp. Today: <span id="minTemp">${weather.min_temp}</span>&deg;C</li>
                  <li>Humidity: <span id="humidity">${weather.humidity}</span>%</li>
                  <li>Cloud Cover: <span id="cloudCover">${weather.cloud_pct}</span>%</li>
                  <li>Wind Speed: <span id="windSpeed">${weather.wind_speed}</span>km/h</li>
                </ul> 
                <button
                  type="button"
                  class="w-100 btn btn-lg btn-primary checkAgain"
                >
                  Check Again
                </button>
                `;
        cardBody.insertAdjacentHTML("afterbegin", html);
        city.innerText = cityName;

        // Compute the sunny condition
        if (weather.cloud_pct < 20) sunnyCondition.innerText = 'Sunny 🌞'
        if (weather.cloud_pct >= 20 && weather.cloud_pct <= 50) sunnyCondition.innerText = 'Mostly Sunny 🌤'
        if (weather.cloud_pct >= 51 && weather.cloud_pct <= 75) sunnyCondition.innerText = 'Mostly Cloudy 🌥';
        if (weather.cloud_pct >= 75) sunnyCondition.innerText = 'Cloudy ☁';
    } catch (error) {
        console.log(error);
    }
}



const checkWether = async function (city) {
    const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1fa56a898cmsh2ca457adfb3c4efp198c11jsn9e62c6cefa3b',
            'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        renderWeather(result, city);
    } catch (error) {
        console.error(error);
    }
}

// To UpperCase 
function capitalFirst(string) {
    // Return an array containing the first letter and the rest of the letters.
    return [string[0].toUpperCase(), string.slice(1)].join('');
}

const renderLoading = function () {
    sunnyCondition.innerText = 'Loading...';
    cardBody.innerHTML = `<div class="spinner"></div>`;
}


searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    renderLoading();
    cityCheck = capitalFirst(formInput.value);
    checkWether(cityCheck);
});

checkAgain.addEventListener('click', function (e) {
    checkWether(cityCheck);
})