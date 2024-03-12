document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
    let homeCity = ''; // Variable to store the home location

    const setHomeBtn = document.getElementById('setHomeBtn');
    setHomeBtn.addEventListener('click', function () {
        // You can implement a method to get the user's current location or let them input a city
        homeCity = prompt('Enter your home city:');
        if (homeCity) {
            fetchHourlyForecast(homeCity);
        }
    });

    // Function to fetch hourly forecast data and render the line chart
    const fetchHourlyForecast = (city) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const hourlyData = data.list.map(item => ({
                    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                    temperature: Math.round(item.main.temp),
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed,
                    description: item.weather[0].description
                }));

                // Call the function to render the line chart
                renderLineChart(hourlyData);
            })
            .catch(error => console.error('Error fetching hourly forecast data:', error));
    };

    // Function to render the line chart
    const renderLineChart = (hourlyData) => {
        const ctx = document.getElementById('hourlyChart').getContext('2d');

        new Chart(ctx, {
            type: 'line', // Set the chart type to 'line'
            data: {
                labels: hourlyData.map(item => item.time),
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: hourlyData.map(item => item.temperature),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Humidity (%)',
                        data: hourlyData.map(item => item.humidity),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Wind Speed (m/s)',
                        data: hourlyData.map(item => item.windSpeed),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    };
});
