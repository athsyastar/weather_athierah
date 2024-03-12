
const { app, BrowserWindow, ipcMain } = require('electron');
const fetch = require('node-fetch');

let mainWindow;

app.on('ready', () => {
  createWindow();

  // Open DevTools only in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle IPC communication for fetching weather data
  ipcMain.on('fetch-weather', async (event, city) => {
    const weatherData = await fetchWeatherData(city);
    event.reply('weather-data', weatherData);
  });
});

// Function to create the main window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
};

// Function to fetch weather data from OpenWeatherMap API
const fetchWeatherData = async (city) => {
  const apiKey = "e24d599fb5d739efd4f8a45a0bc438e7y";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
  
};
