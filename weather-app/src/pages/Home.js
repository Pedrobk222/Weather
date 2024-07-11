import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
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
import { translateCondition } from '../components/WeatherConditionTranslator';

// Registrar componentes do ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Configurar ícones padrão do Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Componente para recentralizar o mapa
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
  // Estado para armazenar a cidade selecionada
  const [city, setCity] = useState(null);
  // Estado para armazenar os dados do tempo
  const [weather, setWeather] = useState(null);
  // Estado para armazenar alertas de clima
  const [alerts, setAlerts] = useState([]);
  // Referência para o mapa
  const mapRef = useRef();

  // Função para tratar a mudança de cidade selecionada
  const handleCityChange = (selectedOption) => {
    setCity(selectedOption);
  };

  // Função para buscar sugestões de cidades
  const fetchCitySuggestions = async (inputValue) => {
    if (!inputValue) return [];
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${inputValue}&country=Brazil&format=json`);
    const data = await response.json();
    return data.map((location) => {
      const address = location.display_name.split(',');
      const city = address[0].trim();
      const state = address[1].trim();
      return {
        value: location.display_name,
        label: `${city}, ${state}`,
        lat: location.lat,
        lon: location.lon,
      };
    });
  };

  // Função para buscar dados do tempo da cidade selecionada
  const handleSearch = useCallback(async () => {
    if (city) {
      try {
        const { lat, lon, label } = city;
        const weatherData = await getWeather(lat, lon);
        setWeather({ ...weatherData, location: { ...weatherData.location, name: label } });
        generateAlerts(weatherData.current.temp_c, weatherData.current.wind_kph);
      } catch (error) {
        console.error('Erro ao buscar dados do tempo:', error);
      }
    }
  }, [city]);

  // Função para traduzir a velocidade do vento para a escala de Beaufort
  const beaufortScale = (windSpeed) => {
    if (windSpeed < 1) return 'Calmo';
    if (windSpeed <= 5) return 'Aragem leve';
    if (windSpeed <= 11) return 'Brisa leve';
    if (windSpeed <= 19) return 'Brisa suave';
    if (windSpeed <= 28) return 'Brisa moderada';
    if (windSpeed <= 38) return 'Brisa fresca';
    if (windSpeed <= 49) return 'Brisa forte';
    if (windSpeed <= 61) return 'Vento forte';
    if (windSpeed <= 74) return 'Ventania';
    if (windSpeed <= 88) return 'Ventania forte';
    if (windSpeed <= 102) return 'Tempestade';
    if (windSpeed <= 117) return 'Tempestade violenta';
    return 'Furacão';
  };

  // Função para gerar alertas com base na temperatura e velocidade do vento
  const generateAlerts = (temperature, windSpeed) => {
    const alerts = [];
    const temperatureThreshold = 30;
    const windSpeedThreshold = 50;

    if (temperature > temperatureThreshold) {
      alerts.push(`Alerta de Alta Temperatura: ${temperature}°C`);
    }

    if (windSpeed > windSpeedThreshold) {
      alerts.push(`Alerta de Ventania: ${windSpeed} km/h`);
    }

    setAlerts(alerts);
  };

  // Função para obter dados do gráfico de temperatura
  const getTemperatureChartData = () => {
    if (!weather) return {};
    const labels = weather.forecast.forecastday[0].hour.map((hour) => hour.time.split(' ')[1]);
    const temperatures = weather.forecast.forecastday[0].hour.map((hour) => hour.temp_c);

    return {
      labels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temperatures,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    };
  };

  // Efeito para atualizar automaticamente os dados de temperatura a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (city) {
        handleSearch();
      }
    }, 300000); // 300000 ms = 5 minutos

    return () => clearInterval(interval);
  }, [city, handleSearch]);

  return (
    <div className='container'>
      <h1>Weather App Brasil</h1>
      <label>Pesquise a cidade:</label>
      <AsyncSelect className='async-select-container' cacheOptions loadOptions={fetchCitySuggestions} onChange={handleCityChange} placeholder='Digite o nome completo da cidade...' isClearable />
      <div className='button-container'>
        <a href='/capitals' target='_blank'>
          <button>Ver Clima das Capitais</button>
        </a>
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
            <div className='forecast-today'>
              <h2>{weather.location.name}</h2>
              <h3>Previsão Hoje</h3>
              <div className='forecast-today-card'>
                <p>
                  <strong>Temperatura Atual:</strong> {weather.current.temp_c}°C
                </p>
                <p>
                  <strong>Temperatura Máxima:</strong> {weather.forecast.forecastday[0].day.maxtemp_c}°C
                </p>
                <p>
                  <strong>Temperatura Mínima:</strong> {weather.forecast.forecastday[0].day.mintemp_c}°C
                </p>
                <p>
                  <strong>Condição:</strong> {translateCondition(weather.current.condition.text)}
                </p>
                <p>
                  <strong>Umidade:</strong> {weather.current.humidity}%
                </p>
                <p>
                  <strong>Precipitação:</strong> {weather.current.precip_mm} mm
                </p>
                <p>
                  <strong>Nuvens:</strong> {weather.current.cloud}%
                </p>
                <p>
                  <strong>Índice UV:</strong> {weather.current.uv}
                </p>
                <p>
                  <strong>Nascer do Sol:</strong> {weather.forecast.forecastday[0].astro.sunrise}
                </p>
                <p>
                  <strong>Pôr do Sol:</strong> {weather.forecast.forecastday[0].astro.sunset}
                </p>
                <p>
                  <strong>Velocidade do Vento:</strong> {weather.current.wind_kph} km/h
                </p>
                <p>
                  <strong>Descrição do Vento:</strong> {beaufortScale(weather.current.wind_kph)}
                </p>
              </div>
            </div>
            <div className='chart-container card'>
              <h3>Previsão Horária</h3>
              <Line data={getTemperatureChartData()} />
            </div>
            <div className='map-container card'>
              <h3>Mapa</h3>
              <MapContainer center={[weather.location.lat, weather.location.lon]} zoom={13} style={{ height: '400px', width: '100%' }} ref={mapRef}>
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                <Marker position={[weather.location.lat, weather.location.lon]}>
                  <Popup>{weather.location.name}</Popup>
                </Marker>
                <RecenterMap lat={weather.location.lat} lon={weather.location.lon} />
              </MapContainer>
            </div>
            <div className='forecast-daily'>
              <h3>Previsão Diária</h3>
              <div className='forecast-daily-cards'>
                {weather.forecast.forecastday.map((day, index) => {
                  // Crie uma nova data a partir da string e ajuste para o formato correto
                  const date = new Date(day.date + 'T00:00:00');
                  const formattedDate = date.toLocaleDateString('pt-BR');

                  return (
                    <div className='forecast-card' key={day.date}>
                      <p>
                        <strong>Data:</strong> {formattedDate}
                      </p>
                      <p>
                        <strong>Temp. Máxima:</strong> {day.day.maxtemp_c}°C
                      </p>
                      <p>
                        <strong>Temp. Mínima:</strong> {day.day.mintemp_c}°C
                      </p>
                      <p>
                        <strong>Condição:</strong> {translateCondition(day.day.condition.text)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
