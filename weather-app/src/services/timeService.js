// src/services/timeService.js
import moment from 'moment-timezone';

export const getTime = (timezone) => {
  const currentTime = moment.tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  return currentTime;
};
