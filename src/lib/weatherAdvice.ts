/**
 * Shared weather-advice logic for the Dona Paula visitor page.
 *
 * Pure functions used both at build time (server render) and in the browser
 * (live refresh), so the advice a visitor sees is identical whether or not
 * JavaScript has run. All strings are visitor-facing and written in plain,
 * non-technical language; no API or provider names are exposed.
 */

export function wmoText(code: number): string {
  const m: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
    85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  };
  return m[code] ?? 'Variable';
}

export function wmoIcon(code: number, isDay = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '🌤️' : '☁️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code >= 71 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌧️';
}

export interface WeatherInput {
  temp?: number;
  code?: number;
  isDay?: boolean;
  wind?: number;        // km/h, current
  gust?: number;        // km/h, current
  humidity?: number;    // %
  apparent?: number;    // feels-like °C
  tmax?: number;
  tmin?: number;
  precipProb?: number;  // % today max
  uvMax?: number;       // today max
  windMax?: number;     // km/h today max
  waveHeight?: number;  // m (marine)
  seaTemp?: number;     // °C (marine)
}

export interface Advice {
  dress: string[];
  plan: string[];
  items: string[];
  risks: string[];
}

export function computeAdvice(d: WeatherInput = {}): Advice {
  const dress: string[] = [];
  const plan: string[] = [];
  const items: string[] = [];
  const risks: string[] = [];

  const { code = 0, wind = 0, tmax, tmin, precipProb = 0, uvMax = 0, windMax = 0, waveHeight, seaTemp } = d;

  // Precipitation
  if (precipProb >= 60) {
    plan.push('Likely to rain — bring rain gear and prefer indoor stops; delay seaside or cliff-edge walks.');
    items.push('Umbrella / raincoat');
  }
  if (code >= 51 && code <= 57) {
    plan.push('Light rain — paths can be slippery, watch your step.');
    items.push('Foldable umbrella');
  }
  if ((code >= 63 && code <= 67) || (code >= 80 && code <= 82)) {
    risks.push('Steady to heavy rain — avoid low-lying spots; boat trips and open-air rides may pause.');
    items.push('Raincoat (skip long umbrellas in wind)');
  }
  if (code >= 95) {
    risks.push('Thunderstorms — no hill climbs, no swimming, don’t shelter under trees; water activities likely closed.');
  }

  // Heat & UV
  if (typeof tmax === 'number' && tmax >= 32) {
    plan.push('Hot — avoid midday outdoors and shorten time in the sun.');
    items.push('Sunscreen, plenty of water, heat relief');
  }
  if (uvMax >= 5) {
    plan.push('Strong sun — protect your skin.');
    items.push('Sunscreen, sunglasses, hat');
  }

  // Cool / swing
  if (typeof tmax === 'number' && typeof tmin === 'number' && tmax - tmin > 8) {
    dress.push('Big day–night temperature swing — pack a light layer you can add or remove.');
  }
  if (typeof tmax === 'number' && tmax <= 10) {
    dress.push('Cool — dress warm.');
    items.push('Warm jacket, scarf');
  }

  // Wind
  if (windMax >= 50) {
    risks.push('Strong wind — keep clear of cliffs and rocks; sea activities likely closed.');
  } else if (windMax >= 29) {
    plan.push('Breezy — ferries and some open-air rides may pause; secure hats, avoid loose long skirts.');
  }

  // Sea state (coastal viewpoint)
  if (typeof waveHeight === 'number') {
    if (waveHeight >= 1.5) {
      risks.push('Rough seas — stay back from the water’s edge; no swimming.');
      plan.push('Admire the sea from the railings; rough water is dangerous up close.');
    } else if (waveHeight >= 0.8) {
      plan.push('Moderate waves — keep a safe distance from wet rocks.');
    }
  }

  // Clear / overcast
  if (code <= 2 && !(typeof tmax === 'number' && tmax >= 32)) {
    plan.push('Clear and pleasant — good for outdoor views and sunrise/sunset.');
    items.push('Sunscreen');
  }
  if (code === 3) {
    plan.push('Soft, overcast light — great for photos and long outdoor walks.');
  }

  // Fog
  if (code === 45 || code === 48) {
    risks.push('Poor visibility — ferries and flights may delay; not ideal for sea or distant views.');
    items.push('Mask');
  }

  // Sensible defaults so the blocks are never empty
  if (dress.length === 0) dress.push('Light, breathable clothes suit the coastal climate.');
  if (plan.length === 0) plan.push('Good conditions for a relaxed visit — enjoy the viewpoint and promenade.');
  if (items.length === 0) items.push('Water and sun protection are always worth carrying.');

  return { dress, plan, items, risks };
}
