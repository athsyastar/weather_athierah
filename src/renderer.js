document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('locationInput');
    const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add this code after your map initialization
    const mapContainer = document.getElementById('map');
    mapContainer.addEventListener('click', function () {
    window.location.href = 'maps.html';
});


    fetchWeatherBtn.addEventListener('click', async function () {
        const location = locationInput.value.trim();

        if (location) {
            try {
                const weatherData = await fetchWeatherData(location);
                updateWeatherInfo(weatherData);
                updateMap(location);
            } catch (error) {
                alert('Error fetching weather data. Please try again.');
                console.error('Error fetching weather data:', error);
            }
        } else {
            alert('Please enter a location.');
        }
    });

    const fetchWeatherData = async (location) => {
        const apiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Error fetching weather data. Please try again.');
        }
    };


    const updateWeatherInfo = (weatherData) => {
        // Update date and time
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

        const cityName = weatherData.name;
        const temperature = weatherData.main.temp;
        const weatherIconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;


        // Update other weather information
        locationElement.textContent = cityName;
        locationDetailsElement.textContent = `${weatherData.weather[0].description}, ${weatherData.sys.country}`;
        temperatureElement.textContent = `Temperature: ${temperature} K`;
        weatherIconElement.src = weatherIconUrl;
        windSpeedElement.textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
        dewPointElement.textContent = `Dew Point: ${calculateDewPoint(temperature, weatherData.main.humidity)} K`;
        humidityElement.textContent = `Humidity: ${weatherData.main.humidity}%`;
        uvIndexElement.textContent = `UV Index: ${weatherData.uvi}`;
    };

    const updateMap = (location) => {
        // Add your code to update the map based on the location
        // Example: L.marker([latitude, longitude]).addTo(map).bindPopup('City Name: Temperature');
        // Make sure you have a map object initialized before using this function
        // You can reuse the existing map initialization code
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Example marker
        L.marker([0, 0]).addTo(map).bindPopup('City Name: Temperature');
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

    const fetchWeatherMapData = async (locations) => {
        const apiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
        const promises = locations.map(async (location) => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
                const data = await response.json();
                return { location, data };
            } catch (error) {
                console.error(`Error fetching weather data for ${location}:`, error);
                return null;
            }
        });

        const weatherDataList = await Promise.all(promises);
        return weatherDataList.filter((weatherData) => weatherData !== null);
    };
});
