import React, { useEffect, useState } from 'react';
import { getWeather } from '../services/weatherService';
import { getTime } from '../services/timeService';
import moment from 'moment-timezone';

// Lista de capitais com seus respectivos fusos horários e nomes para exibição
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
  const [weatherData, setWeatherData] = useState([]); // Estado para armazenar dados meteorológicos das capitais
  const [localTimes, setLocalTimes] = useState({}); // Estado para armazenar os horários locais das capitais

  // Função para buscar dados meteorológicos de todas as capitais
  const fetchWeatherData = async () => {
    const data = await Promise.all(
      capitals.map(async (capital) => {
        const weather = await getWeather(capital.displayName); // Busca dados meteorológicos de cada capital
        return {
          ...capital,
          temperature: weather.current.temp_c, // Armazena a temperatura atual da capital
        };
      })
    );
    setWeatherData(data);
  };

  // Função para buscar os horários locais de todas as capitais
  const fetchLocalTimes = () => {
    const times = {};
    capitals.forEach((capital) => {
      times[capital.name] = getTime(capital.name); // Armazena o horário local de cada capital
    });
    setLocalTimes(times);
  };

  // useEffect para buscar dados meteorológicos e horários locais quando o componente é montado
  useEffect(() => {
    fetchWeatherData();
    fetchLocalTimes();
    const interval = setInterval(fetchLocalTimes, 1000); // Atualiza os horários locais a cada segundo

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  return (
    <div>
      <h1>Clima e Hora das Capitais</h1>
      <ul className='capital-list'>
        {weatherData.map((capital, index) => (
          <li key={index}>
            <h2>
              {capital.displayName}, {capital.country}
            </h2>
            <p>
              <span>Temperatura:</span> {capital.temperature}°C
            </p>
            <p>
              <span>Horário Local:</span> {localTimes[capital.name] ? moment(localTimes[capital.name]).format('HH:mm:ss') : 'Carregando...'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Capitals;
