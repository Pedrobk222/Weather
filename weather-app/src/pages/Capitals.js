// src/pages/Capitals.js

import React, { useEffect, useState } from 'react';
import { getWeather } from '../services/weatherService';
import { getTime } from '../services/timeService';
import moment from 'moment-timezone';

const capitals = [
  { name: 'America/New_York', displayName: 'Washington, D.C.', country: 'USA' },
  { name: 'Europe/London', displayName: 'Londres', country: 'Reino Unido' },
  { name: 'Asia/Tokyo', displayName: 'Tóquio', country: 'Japão' },
  { name: 'Europe/Berlin', displayName: 'Berlim', country: 'Alemanha' },
  { name: 'Australia/Sydney', displayName: 'Canberra', country: 'Austrália' },
  { name: 'America/Toronto', displayName: 'Ottawa', country: 'Canadá' },
  { name: 'America/Sao_Paulo', displayName: 'Brasília', country: 'Brasil' },
  { name: 'Asia/Shanghai', displayName: 'Pequim', country: 'China' },
  { name: 'Europe/Moscow', displayName: 'Moscou', country: 'Rússia' },
  { name: 'Europe/Paris', displayName: 'Paris', country: 'França' },
];

const Capitals = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [localTimes, setLocalTimes] = useState({});

  const fetchWeatherData = async () => {
    const data = await Promise.all(
      capitals.map(async (capital) => {
        const weather = await getWeather(capital.displayName);
        return {
          ...capital,
          temperature: weather.current.temp_c,
        };
      })
    );
    setWeatherData(data);
  };

  const fetchLocalTimes = () => {
    const times = {};
    capitals.forEach((capital) => {
      times[capital.name] = getTime(capital.name);
    });
    setLocalTimes(times);
  };

  useEffect(() => {
    fetchWeatherData();
    fetchLocalTimes();
    const interval = setInterval(fetchLocalTimes, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Clima das Capitais</h1>
      <ul>
        {weatherData.map((capital, index) => (
          <li key={index}>
            <h2>
              {capital.displayName}, {capital.country}
            </h2>
            <p>Temperatura: {capital.temperature}°C</p>
            <p>Hora Local: {localTimes[capital.name] ? moment(localTimes[capital.name]).format('HH:mm:ss') : 'Carregando...'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Capitals;
