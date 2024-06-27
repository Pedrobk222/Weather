// src/pages/Home.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeather } from '../services/weatherService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AsyncSelect from 'react-select/async';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  map.flyTo([lat, lon], 13);
  return null;
};

const Home = () => {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const mapRef = useRef();

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption);
  };

  const fetchCitySuggestions = async (inputValue) => {
    if (!inputValue) return [];
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${inputValue}&country=Brazil&format=json`);
    const data = await response.json();
    return data.map((location) => ({
      value: location.display_name,
      label: location.display_name,
      lat: location.lat,
      lon: location.lon,
    }));
  };

  const handleSearch = async () => {
    if (city) {
      try {
        const { lat, lon, label } = city;
        const weatherData = await getWeather(lat, lon);
        setWeather({ ...weatherData, location: { ...weatherData.location, name: label } });
        generateAlerts(weatherData.current.temp_c, weatherData.current.wind_kph);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

  const beaufortScale = (windSpeed) => {
    if (windSpeed < 1) return 'Calm';
    if (windSpeed <= 5) return 'Light air';
    if (windSpeed <= 11) return 'Light breeze';
    if (windSpeed <= 19) return 'Gentle breeze';
    if (windSpeed <= 28) return 'Moderate breeze';
    if (windSpeed <= 38) return 'Fresh breeze';
    if (windSpeed <= 49) return 'Strong breeze';
    if (windSpeed <= 61) return 'Near gale';
    if (windSpeed <= 74) return 'Gale';
    if (windSpeed <= 88) return 'Severe gale';
    if (windSpeed <= 102) return 'Storm';
    if (windSpeed <= 117) return 'Violent storm';
    return 'Hurricane';
  };

  const generateAlerts = (temperature, windSpeed) => {
    const alerts = [];
    const temperatureThreshold = 30; // Exemplo: Temperatura acima de 30°C
    const windSpeedThreshold = 50; // Exemplo: Velocidade do vento acima de 50 km/h

    if (temperature > temperatureThreshold) {
      alerts.push(`Alerta de Alta Temperatura: ${temperature}°C`);
    }

    if (windSpeed > windSpeedThreshold) {
      alerts.push(`Alerta de Ventania: ${windSpeed} km/h (${beaufortScale(windSpeed)})`);
    }

    setAlerts(alerts);
  };

  const getTemperatureChartData = () => {
    if (!weather) return {};
    const labels = weather.forecast.forecastday[0].hour.map((hour) => hour.time.split(' ')[1]);
    const temperatures = weather.forecast.forecastday[0].hour.map((hour) => hour.temp_c);

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    };
  };

  return (
    <div>
      <h1>Weather App</h1>
      <div>
        <label>
          City:
          <AsyncSelect cacheOptions loadOptions={fetchCitySuggestions} onChange={handleCityChange} placeholder='Search for a city...' isClearable />
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
      <button onClick={() => navigate('/capitals')}>View Capitals Weather</button>
      {alerts.length > 0 && (
        <div className='alerts'>
          {alerts.map((alert, index) => (
            <div key={index} className='alert'>
              {alert}
            </div>
          ))}
        </div>
      )}
      <div id='weather-info'>
        {weather && (
          <div>
            <h2>{weather.location.name}</h2>
            <p>Temperature: {weather.current.temp_c}°C</p>
            <p>Max Temperature: {weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p>Min Temperature: {weather.forecast.forecastday[0].day.mintemp_c}°C</p>
            <p>Condition: {weather.current.condition.text}</p>
            <p>Humidity: {weather.current.humidity}%</p>
            <p>Precipitation: {weather.current.precip_mm} mm</p>
            <p>Cloud: {weather.current.cloud}%</p>
            <p>UV Index: {weather.current.uv}</p>
            <p>Sunrise: {weather.forecast.forecastday[0].astro.sunrise}</p>
            <p>Sunset: {weather.forecast.forecastday[0].astro.sunset}</p>
            <p>Wind Speed: {weather.current.wind_kph} km/h</p>
            <p>Wind Description: {beaufortScale(weather.current.wind_kph)}</p>
            <h3>Forecast:</h3>
            {weather.forecast.forecastday.map((day) => (
              <div key={day.date}>
                <p>Date: {day.date}</p>
                <p>Max Temp: {day.day.maxtemp_c}°C</p>
                <p>Min Temp: {day.day.mintemp_c}°C</p>
                <p>Condition: {day.day.condition.text}</p>
              </div>
            ))}
            <div className='chart-container'>
              <Line data={getTemperatureChartData()} />
            </div>
          </div>
        )}
      </div>
      <div id='map' className='map-container'>
        {weather && (
          <MapContainer center={[weather.location.lat, weather.location.lon]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <Marker position={[weather.location.lat, weather.location.lon]}>
              <Popup>{weather.location.name}</Popup>
            </Marker>
            <RecenterMap lat={weather.location.lat} lon={weather.location.lon} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Home;
