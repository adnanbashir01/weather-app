// import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

// Access the elements
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

// Render Weatehr 
const renderWeather = function (weather) {
    temp.innerText = weather.temp;
    feelsLike.innerText = weather.feelsLike;
    maxTemp.innerText = weather.maxTemp;
    minTemp.innerText = weather.minTemp;
    humidity.innerText = weather.humidity;
    cloudCover.innerText = weather.cloudCover;
    windSpeed.innerText = weather.wind
    city.innerText = weather.city;

    // Compute the sunny condition
    // sunnyCondition.innerText = weather.cloudCover
    if (weather.cloudCover < 20) sunnyCondition.innerText = 'Sunny 🌞'
    if (weather.cloudCover >= 20 && weather.cloudCover <= 50) sunnyCondition.innerText = 'Mostly Sunny 🌤'
    if (weather.cloudCover >= 51 && weather.cloudCover <= 75) sunnyCondition.innerText = 'Mostly Cloudy 🌥';
    if (weather.cloudCover >= 75) sunnyCondition.innerText = 'Cloudy ☁';
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
        const sunset = new Date(result.sunset);
        console.log(sunset);

        // Save the result in Object
        const cityWeather = {
            city: city,
            temp: result.temp,
            minTemp: result.min_temp,
            maxTemp: result.max_temp,
            humidity: result.humidity,
            feelsLike: result.feels_like,
            sunrise: result.sunrise,
            sunset: result.sunset,
            wind: result.wind_speed,
            cloudCover: result.cloud_pct
        }

        renderWeather(cityWeather);
        console.log(cityWeather);
    } catch (error) {
        console.error(error);
    }
}

// To UpperCase 
function capitalFirst(string) {
    // Return an array containing the first letter and the rest of the letters.
    return [string[0].toUpperCase(), string.slice(1)].join('');
}

checkWether('Multan');
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = capitalFirst(formInput.value);
    checkWether(city);
});