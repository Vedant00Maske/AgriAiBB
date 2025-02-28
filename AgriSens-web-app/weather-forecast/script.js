const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const forecast_container = document.querySelector('.forecast-container');

const api_key = "4c4286de4f6a3794841e570fd8bc4a0b";

async function checkWeather(city) {
    // Current weather API call
    const current_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    // Forecast API call
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;

    try {
        const [weather_data, forecast_data] = await Promise.all([
            fetch(current_url).then(response => response.json()),
            fetch(forecast_url).then(response => response.json())
        ]);

        if (weather_data.cod === '404') {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            forecast_container.style.display = "none";
            console.log("error");
            return;
        }

        // Display current weather
        displayCurrentWeather(weather_data);
        
        // Display forecast
        displayForecast(forecast_data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayCurrentWeather(weather_data) {
    console.log("run");
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    forecast_container.style.display = "block";

    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

    weather_img.src = getWeatherIcon(weather_data.weather[0].main);
}

// Update the displayForecast function in your existing JavaScript
function displayForecast(forecast_data) {
    // Clear previous forecast
    forecast_container.innerHTML = `
        <div class="forecast-days-container"></div>
    `;

    const forecastDaysContainer = forecast_container.querySelector('.forecast-days-container');

    // Get one forecast per day (API returns data every 3 hours)
    const dailyForecasts = forecast_data.list.filter(forecast => 
        forecast.dt_txt.includes('12:00:00')
    ).slice(0, 5); // Get exactly 5 days

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp - 273.15);
        const weatherMain = day.weather[0].main;
        
        const forecastCard = `
            <div class="forecast-day">
                <h3>${dayName}</h3>
                <img src="${getWeatherIcon(weatherMain)}" alt="${weatherMain}" class="forecast-icon">
                <p class="forecast-temp">${temp}°C</p>
                <p class="forecast-desc">${day.weather[0].description}</p>
            </div>
        `;
        
        forecastDaysContainer.innerHTML += forecastCard;
    });
}

function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clouds': "img/cloud.png",
        'Clear': "img/clear-sky.png",
        'Rain': "img/rain.png",
        'Haze': "img/haze.png",
        'Lightning': "img/lightning.png",
        'Snow': "img/snow.png",
        'Storm': "img/storm.png",
        'Thunderstorm': "img/thunderstorm.png",
        'Mist': "img/mist.png"
    };
    
    return iconMap[weatherMain] || "img/clear-sky.png"; // Default to clear sky if icon not found
}

searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Optional: Add enter key support
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});