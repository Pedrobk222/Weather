// nominatimService.js

/**
 * Busca sugestões de cidades no Brasil usando o serviço Nominatim do OpenStreetMap.
 * @param {string} inputValue - Parte do nome da cidade.
 * @returns {Promise<Array<{value: string, label: string, lat: string, lon: string}>>} - Lista de sugestões de cidades.
 * @throws {Error} - Lança um erro se ocorrer um problema na chamada da API.
 */
export const fetchCitySuggestions = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${inputValue}&country=Brazil&format=json`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

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
  } catch (error) {
    throw new Error(`Error fetching city suggestions: ${error.message}`);
  }
};
