/* A função getCoordinates busca as coordenadas geográficas de uma cidade e estado no Brasil usando o serviço Nominatim do OpenStreetMap. 
Ela retorna as coordenadas da correspondência exata, se encontrada, ou do primeiro resultado, se não houver uma correspondência exata. 
Se não houver resultados, a função retorna um erro. */

export const getCoordinates = async (city, state) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`);
  const data = await response.json();
  if (data.length > 0) {
    const exactMatch = data.find((location) => location.display_name.includes(city) && location.display_name.includes(state));
    if (exactMatch) {
      const { lat, lon } = exactMatch;
      return { lat, lon };
    } else {
      // Se não houver correspondência exata, usar o primeiro resultado
      const { lat, lon } = data[0];
      return { lat, lon };
    }
  } else {
    throw new Error('Location not found');
  }
};
