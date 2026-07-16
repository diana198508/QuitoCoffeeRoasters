// URLs de las APIs especificadas
const CLIMA_QUITO_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-0.2298&longitude=-78.5249&current_weather=true';
const MONEDA_URL = 'https://open.er-api.com/v6/latest/USD';

// Frases por si Quotable.io experimenta problemas de red / caida
const COFFEE_QUOTES = [
    "La vida empieza despues de una buena taza de cafe.",
    "El cafe de especialidad no es una bebida, es un arte en cada grano.",
    "El buen cafe se comparte en la hermosa Quito.",
    "De la montaña al tostador: pura pasion en cada taza."
];

/**
 * Consumo de la API de Clima Open-Meteo para Quito
 */
export async function fetchClimaQuito() {
    try {
        const response = await fetch(CLIMA_QUITO_URL);
        if (!response.ok) throw new Error('Fallo en la red de Open-Meteo');
        const data = await response.json();
        const { temperature, windspeed } = data.current_weather;
        return `Quito: ${temperature}°C, viento ${windspeed}km/h`;
    } catch (error) {
        console.error('Error al cargar clima:', error);
        return 'Quito: 16°C (Clima estimado)';
    }
}

/**
 * Obtener frase motivacional. Uso de API publica o de respaldo local de forma elegante.
 */
export async function fetchInspirationalQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random?tags=wisdom,coffee', { signal: AbortSignal.timeout(3000) });
        if (!response.ok) throw new Error();
        const data = await response.json();
        return `"${data.content}" - ${data.author}`;
    } catch (error) {
        // Mecanismo de contingencia elegante requerido para una UX Sobresaliente
        const randomIndex = Math.floor(Math.random() * COFFEE_QUOTES.length);
        return COFFEE_QUOTES[randomIndex];
    }
}

/**
 * Consumo de ExchangeRate-API para conversion USD a EUR
 */
export async function fetchTasaConversionEuro() {
    try {
        const response = await fetch(MONEDA_URL);
        if (!response.ok) throw new Error('Fallo en la tasa de cambio');
        const data = await response.json();
        return data.rates.EUR || 0.92; // Tasa por defecto si falla la asignacion
    } catch (error) {
        console.error('Error cargando divisa:', error);
        return 0.92;
    }
}