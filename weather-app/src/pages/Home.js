import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { translateCondition } from '../components/WeatherConditionTranslator'; // Importar a função de tradução

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

RecenterMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
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
    if (windSpeed < 1) return "Calmo";
    if (windSpeed <= 5) return "Aragem leve";
    if (windSpeed <= 11) return "Brisa leve";
    if (windSpeed <= 19) return "Brisa suave";
    if (windSpeed <= 28) return "Brisa moderada";
    if (windSpeed <= 38) return "Brisa fresca";
    if (windSpeed <= 49) return "Brisa forte";
    if (windSpeed <= 61) return "Vento forte";
    if (windSpeed <= 74) return "Ventania";
    if (windSpeed <= 88) return "Ventania forte";
    if (windSpeed <= 102) return "Tempestade";
    if (windSpeed <= 117) return "Tempestade violenta";
    return "Furacão";
  };

  const generateAlerts = (temperature, windSpeed) => {
    const alerts = [];
    const temperatureThreshold = 30; // Exemplo: Temperatura acima de 30°C
    const windSpeedThreshold = 50; // Exemplo: Velocidade do vento acima de 50 km/h

    if (temperature > temperatureThreshold) {
      alerts.push(`Alerta de Alta Temperatura: ${temperature}°C`);
    }

    if (windSpeed > windSpeedThreshold) {
      alerts.push(`Alerta de Ventania: ${windSpeed} km/h`);
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
    <div className="container">
      <h1>Weather App</h1>
      <div>
        <label>
          Pesquise a cidade:
          <AsyncSelect className="async-select-container" cacheOptions loadOptions={fetchCitySuggestions} onChange={handleCityChange} placeholder='Digite a cidade...' isClearable />
        </label>
      </div>
      <div className="button-container">
        <button onClick={() => navigate('/capitals')}>Ver Clima das Capitais</button>
        <button onClick={handleSearch}>Buscar</button>
      </div>
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
            <p>Temperatura Atual: {weather.current.temp_c}°C</p>
            <p>Temperatura Máxima: {weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p>Temperatura Mínima: {weather.forecast.forecastday[0].day.mintemp_c}°C</p>
            <p>Condição: {translateCondition(weather.current.condition.text)}</p> {/* Tradução da condição */}
            <p>Umidade: {weather.current.humidity}%</p>
            <p>Precipitação: {weather.current.precip_mm} mm</p>
            <p>Nuvens: {weather.current.cloud}%</p>
            <p>Índice UV: {weather.current.uv}</p>
            <p>Nascer do Sol: {weather.forecast.forecastday[0].astro.sunrise}</p>
            <p>Pôr do Sol: {weather.forecast.forecastday[0].astro.sunset}</p>
            <p>Velocidade do Vento: {weather.current.wind_kph} km/h</p>
            <p>Descrição do Vento: {beaufortScale(weather.current.wind_kph)}</p>
            <h3>Previsão:</h3>
            {weather.forecast.forecastday.slice(1, 6).map((day) => (
              <div key={day.date}>
                <p>Data: {day.date}</p>
                <p>Temp. Máxima: {day.day.maxtemp_c}°C</p>
                <p>Temp. Mínima: {day.day.mintemp_c}°C</p>
                <p>Condição: {translateCondition(day.day.condition.text)}</p> {/* Tradução da condição */}
              </div>
            ))}
            <div className='chart-container'>
              <h3>Gráfico de Temperatura</h3>
              <Line data={getTemperatureChartData()} />
            </div>
          </div>
        )}
      </div>
      <div id='map' className='map-container'>
        {weather && (
          <div>
            <h3>Mapa</h3>
            <MapContainer center={[weather.location.lat, weather.location.lon]} zoom={13} style={{ height: '400px', width: '100%' }} ref={mapRef}>
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              <Marker position={[weather.location.lat, weather.location.lon]}>
                <Popup>{weather.location.name}</Popup>
              </Marker>
              <RecenterMap lat={weather.location.lat} lon={weather.location.lon} />
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
