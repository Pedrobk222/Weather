/* O código define uma função getWeather que usa a biblioteca axios para fazer uma requisição a WeatherAPI, 
obtendo a previsão do tempo para uma localização específica baseada em latitude e longitude. 
A função retorna os dados da previsão do tempo. */

import axios from 'axios';

const API_KEY = 'f50db686537646e7a8f125646242706';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const getWeather = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: {
      key: API_KEY,
      q: `${lat},${lon}`,
      days: 8,
      aqi: 'no',
      alerts: 'no',
    },
  });
  return response.data;
};
