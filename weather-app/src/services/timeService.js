/* O código define uma função getTime que usa a biblioteca moment-timezone para obter e retornar a hora atual em um fuso horário específico, 
formatada como uma string no formato 'YYYY-MM-DD HH:mm:ss'. A função é exportada para que possa ser utilizada em outras partes do projeto.
import moment from 'moment-timezone'; */

import moment from 'moment-timezone';

export const getTime = (timezone) => {
  const currentTime = moment.tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  return currentTime;
};
