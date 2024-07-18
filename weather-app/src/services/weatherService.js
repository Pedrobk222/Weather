/* O código define uma função getWeather que usa a biblioteca axios para fazer uma requisição a WeatherAPI, 
obtendo a previsão do tempo para uma localização específica baseada em latitude e longitude. 
A função retorna os dados da previsão do tempo. */

import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const getWeather = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: {
      key: API_KEY,
      q: `${lat},${lon}`,
      days: 3,
      aqi: 'no',
      alerts: 'no',
    },
  });
  return response.data;
};
