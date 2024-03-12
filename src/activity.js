document.addEventListener('DOMContentLoaded', function () {
    const createBtn = document.getElementById('createBtn');
    const readBtn = document.getElementById('readBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
    const cityInput = document.getElementById('cityInput');
    const countryInput = document.getElementById('countryInput');
    const locationInput = document.getElementById('locationInput');
    const weatherInfo = document.getElementById('weatherInfo');

    createBtn.addEventListener('click', function () {
        // Implement logic for creating or saving weather data
        alert('Weather data created! City: ' + cityInput.value + ', Country: ' + countryInput.value);
    });

    readBtn.addEventListener('click', function () {
        // Implement logic for reading or displaying weather data
        alert('Weather data read! City: ' + cityInput.value + ', Country: ' + countryInput.value);
    });

    updateBtn.addEventListener('click', function () {
        // Implement logic for updating weather data
        alert('Weather data updated! City: ' + cityInput.value + ', Country: ' + countryInput.value);
    });

    deleteBtn.addEventListener('click', function () {
        // Implement logic for deleting weather data
        alert('Weather data deleted! City: ' + cityInput.value + ', Country: ' + countryInput.value);
    });
    // Example JavaScript for button actions
document.getElementById('createBtn').addEventListener('click', () => {
    // Logic to capture weather data and location, then save it
    saveWeatherData(location, weatherData);
});

document.getElementById('updateBtn').addEventListener('click', () => {
    // Logic to enable editing mode and allow users to modify weather data
    enableEditMode();
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    // Logic to prompt for confirmation and delete weather data
    if (confirm('Are you sure you want to delete?')) {
        deleteWeatherData(location);
    }
});


    fetchWeatherBtn.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const city = cityInput.value.trim();
        const country = countryInput.value.trim();

        if (city && country) {
            try {
                const weatherData = await fetchWeatherData(city, country);
                updateWeatherInfo(weatherData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please try again.');
            }
        } else {
            alert('Please enter both city and country.');
        }
    });

    const fetchWeatherData = async (city, country) => {
        const apiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error fetching weather data. Please try again.');
        }
    };

    const updateWeatherInfo = (weatherData) => {
        // Update weather information here (e.g., display temperature, description, etc.)
        const dateTimeElement = document.getElementById('dateTime');
        dateTimeElement.textContent = formatDateTime(new Date(weatherData.dt * 1000));

        const locationElement = document.getElementById('location');
        const locationDetailsElement = document.getElementById('locationDetails');
        const temperatureElement = document.getElementById('temperature');
        const weatherIconElement = document.getElementById('weatherIcon');
        const windSpeedElement = document.getElementById('windSpeed');
        const dewPointElement = document.getElementById('dewPoint');
        const humidityElement = document.getElementById('humidity');
        const uvIndexElement = document.getElementById('uvIndex');

        // Update other weather information
        locationElement.textContent = weatherData.name;
        locationDetailsElement.textContent = `${weatherData.weather[0].description}, ${weatherData.sys.country}`;
        temperatureElement.textContent = `Temperature: ${weatherData.main.temp} °C`;
        weatherIconElement.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        windSpeedElement.textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
        dewPointElement.textContent = `Dew Point: ${calculateDewPoint(weatherData.main.temp, weatherData.main.humidity)} °C`;
        humidityElement.textContent = `Humidity: ${weatherData.main.humidity}%`;
        uvIndexElement.textContent = `UV Index: ${weatherData.uvi}`;
    };

    const formatDateTime = (dateTime) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return dateTime.toLocaleDateString('en-US', options);
    };

    const calculateDewPoint = (temperature, humidity) => {
        // Dew Point Calculation (approximate)
        const a = 17.27;
        const b = 237.7;
        const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
        return Math.round((b * alpha) / (a - alpha));
    };
});
