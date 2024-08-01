document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const cityInput = document.querySelector('.city-input');
    const startDateInput = document.querySelector('#start-date');
    const endDateInput = document.querySelector('#end-date');
    const weatherDataContainer = document.querySelector('.weather-data');
    const forecastContainer = document.querySelector('.forecast');
  
    searchBtn.addEventListener('click', async () => {
      const city = cityInput.value.trim();
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
  
      if (city && startDate && endDate) {
        try {
          // Fetch location key
          const locationKey = await getLocationKey(city);
          if (!locationKey) {
            alert('City not found. Please try another city.');
            return;
          }
  
          // Fetch current weather
          const currentWeather = await getCurrentWeather(locationKey);
  
          // Fetch weather forecast
          const forecast = await getForecast(locationKey);
  
          // Update current weather section
          weatherDataContainer.querySelector('.current-weather .temperature').textContent = `Temperature: ${currentWeather.Temperature.Metric.Value}°C`;
          weatherDataContainer.querySelector('.current-weather .condition').textContent = `Condition: ${currentWeather.WeatherText}`;
          weatherDataContainer.querySelector('.current-weather .humidity').textContent = `Humidity: ${currentWeather.RelativeHumidity}%`;
          weatherDataContainer.querySelector('.current-weather .wind').textContent = `Wind Speed: ${currentWeather.Wind.Speed.Metric.Value} ${currentWeather.Wind.Speed.Metric.Unit}`;
  
          // Update forecast section
          forecastContainer.innerHTML = '<h3>Weather Forecast</h3>';
          forecast.DailyForecasts.forEach(day => {
            forecastContainer.innerHTML += `
              <div class="forecast-item">
                <p class="date">Date: ${new Date(day.Date).toLocaleDateString()}</p>
                <p class="temperature">Temperature: ${day.Temperature.Maximum.Value}°C / ${day.Temperature.Minimum.Value}°C</p>
                <p class="condition">Condition: ${day.Day.IconPhrase}</p>
              </div>
            `;
          });
        } catch (error) {
          console.error('Error fetching weather data:', error);
          alert('Error fetching weather data. Please try again.');
        }
      } else {
        alert('Please enter a city name and select start and end dates.');
      }
    });
  
    async function getLocationKey(city) {
      const apiKey = 'r9Mt5CtZ1ZnxNECiYB7Ki4rbm6bawMkU';
      const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`);
      const data = await response.json();
      return data[0]?.Key; // Return the first result's key
    }
  
    async function getCurrentWeather(locationKey) {
      const apiKey = 'r9Mt5CtZ1ZnxNECiYB7Ki4rbm6bawMkU';
      const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`);
      const data = await response.json();
      return data[0];
    }
  
    async function getForecast(locationKey) {
      const apiKey = 'r9Mt5CtZ1ZnxNECiYB7Ki4rbm6bawMkU';
      const response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`);
      const data = await response.json();
      return data;
    }
  });
  