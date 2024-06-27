// src/services/weatherService.js

import axios from 'axios';

const API_KEY = 'f50db686537646e7a8f125646242706';
const BASE_URL = 'http://api.weatherapi.com/v1';

export const getWeather = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: {
      key: API_KEY,
      q: `${lat},${lon}`,
      days: 6, 
      aqi: 'no',
      alerts: 'no',
    },
  });
  return response.data;
};
