const apiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
const map = L.map('map').setView([30, -20], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const addLayerToMap = (layerName) => {
    L.tileLayer(`https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: '© OpenWeatherMap'
    }).addTo(map);
};

const fetchDataAndDisplay = async (layer, cities) => {
    try {
        // Iterate through the array of cities
        for (const city of cities) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&${layer}`);
            const data = await response.json();

            // Extract relevant information
            const cityName = data.name;
            const temperature = data.main.temp;

            // Find color based on temperature range
            const color = getColorForValue(temperature, buttons.find(btn => btn.layer === layer).colorRange);

            // Display information on the map
            L.circle([data.coord.lat, data.coord.lon], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: 50000  // Adjust radius as needed
            }).addTo(map).bindPopup(`${cityName}: ${temperature} °C`);

            // Add a marker with a popup containing city name and temperature
            L.marker([data.coord.lat, data.coord.lon]).addTo(map)
                .bindPopup(`${cityName}: ${temperature} °C`)
                .openPopup();
        }
    } catch (error) {
        console.error(`Error fetching ${layer} data:`, error);
    }
};

// Example array of cities
const cities = ['Seremban','London', 'Paris', 'New York', 'Tokyo', 'Sydney', 'Kuala Lumpur','Jakarta','Bangkok','Manila','Singapore','Vientiane','Bandar Seri Begawan','Riyadh','Istanbul','Amman','Seoul','Hong Kong','Macau','Omsk','Kazan','Ufa','Berlin','Amsterdam','Lagos','Tunis','Cairo','Auckland','Perth','Dakar'];

// Call the function with the desired layer and array of cities
fetchDataAndDisplay('temp_new', cities);

const getColorForValue = (value) => {
    if (value >= 30) {
        return 'red';
    } else if (value >= 20) {
        return 'orange';
    } else {
        return 'blue';
    }
};

const buttons = [
    { layer: 'temp_new', label: 'Temperature' },
    { layer: 'pressure_new', label: 'Pressure' },
    { layer: 'wind_new', label: 'Wind Speed' },
    { layer: 'clouds_new', label: 'Clouds' },
    { layer: 'precipitation_new', label: 'Global Precipitation' }
];

const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttons-container');

buttons.forEach(button => {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('map-button');
    buttonElement.textContent = button.label;
    buttonElement.setAttribute('data-layer', button.layer);
    buttonElement.addEventListener('click', () => {
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        addLayerToMap(button.layer);
        fetchDataAndDisplay(button.layer);
    });
    buttonsContainer.appendChild(buttonElement);
});

document.body.appendChild(buttonsContainer);

document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([0, 0], 2); // Initial view, adjust as needed

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const searchButton = document.getElementById('fetchWeatherBtn');
    const locationInput = document.getElementById('locationInput');

    searchButton.addEventListener('click', function () {
        const location = locationInput.value;

        if (location) {
            fetchWeatherData(location);
        } else {
            alert('Please enter a location.');
        }
    });

    const fetchWeatherData = async (location) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_OPENWEATHERMAP_API_KEY`);
            const data = await response.json();

            // Extract relevant information
            const cityName = data.name;
            const temperature = data.main.temp;

            // Update map with marker
            updateMap([data.coord.lat, data.coord.lon], cityName, temperature);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        }
    };

    const updateMap = (coordinates, cityName, temperature) => {
        map.setView(coordinates, 10); // Adjust zoom level as needed

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add marker for the searched location
        L.marker(coordinates).addTo(map)
            .bindPopup(`${cityName}: ${temperature} K`)
            .openPopup();
    };
});
