// src/services/nominatimService.js

export const getCoordinates = async (city, state) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`);
  const data = await response.json();
  if (data.length > 0) {
    const exactMatch = data.find((location) => location.display_name.includes(city) && location.display_name.includes(state));
    if (exactMatch) {
      const { lat, lon } = exactMatch;
      return { lat, lon };
    } else {
      // Se não houver correspondência exata, use o primeiro resultado
      const { lat, lon } = data[0];
      return { lat, lon };
    }
  } else {
    throw new Error('Location not found');
  }
};
