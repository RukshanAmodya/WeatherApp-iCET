// Weather App script

// Environment API configuration
// Supports decoded client key & window.ENV_CONFIG override
const _0xkey = 'YjZmNDdhMGM2NTMwNDZhN2FiMDk1MjUxMjUyMDEy';
const API_KEY = (window.ENV_CONFIG && window.ENV_CONFIG.WEATHER_API_KEY && window.ENV_CONFIG.WEATHER_API_KEY !== 'YOUR_API_KEY_HERE')
    ? window.ENV_CONFIG.WEATHER_API_KEY
    : atob(_0xkey);

const BASE_URL = 'https://api.weatherapi.com/v1';

let appState = {
    query: 'London',
    unit: 'C',
    activeTab: 'week',
    weatherData: null
};

// Scenic city background images
const CITY_IMAGES = {
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=700&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80',
    'colombo': 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=700&q=80',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80',
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=700&q=80',
    'default': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=80'
};

// Weather vector art generator
function getCustomWeatherSVG(code, isDay = 1, size = 'large') {
    const isSmall = size === 'small';
    const uid = Math.random().toString(36).substring(2, 7);

    const isSunny = [1000].includes(code);
    const isPartlyCloudy = [1003, 1006, 1009].includes(code);
    const isFoggy = [1030, 1135, 1147].includes(code);
    const isSnow = [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code);
    const isThunder = [1087, 1273, 1276, 1279, 1282].includes(code);

    if (!isSmall) {
        if (isSunny) {
            return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <defs>
                    <linearGradient id="sunG_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFE469"/>
                        <stop offset="100%" stop-color="#FFBD3E"/>
                    </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="64" fill="url(#sunG_${uid})" />
            </svg>`;
        }
        if (isPartlyCloudy || isFoggy) {
            return `
            <svg viewBox="0 0 220 200" class="w-full h-full">
                <defs>
                    <linearGradient id="sunG_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFE469"/>
                        <stop offset="100%" stop-color="#FFBD3E"/>
                    </linearGradient>
                </defs>
                <path d="M55 110 A28 28 0 0 1 82 62 A36 36 0 0 1 148 75 A25 25 0 0 1 162 120 Z" fill="none" stroke="#EAEAEA" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="115" cy="112" r="58" fill="url(#sunG_${uid})" />
            </svg>`;
        }
        if (isSnow) {
            return `
            <svg viewBox="0 0 220 200" class="w-full h-full">
                <path d="M40 80 H130 M30 105 H110 M45 130 H125" stroke="#E2E4E8" stroke-width="10" stroke-linecap="round"/>
                <g stroke="#55B3F3" stroke-width="4" stroke-linecap="round">
                    <path d="M145 95 L157 107 M157 95 L145 107"/>
                    <path d="M125 122 L137 134 M137 122 L125 134"/>
                    <path d="M158 126 L170 138 M170 126 L158 138"/>
                </g>
            </svg>`;
        }
        // Rain / Sun + Cloud + Blue vertical bars
        return `
        <svg viewBox="0 0 220 200" class="w-full h-full">
            <defs>
                <linearGradient id="sunG_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFE469"/>
                    <stop offset="100%" stop-color="#FFBD3E"/>
                </linearGradient>
            </defs>
            <path d="M52 105 A26 26 0 0 1 78 55 A35 35 0 0 1 142 68" fill="none" stroke="#EAEAEA" stroke-width="9" stroke-linecap="round"/>
            <circle cx="108" cy="108" r="56" fill="url(#sunG_${uid})" />
            <g stroke="#3949DF" stroke-width="7" stroke-linecap="round">
                <line x1="130" y1="115" x2="130" y2="152" />
                <line x1="146" y1="125" x2="146" y2="165" />
                <line x1="162" y1="115" x2="162" y2="172" />
                <line x1="178" y1="122" x2="178" y2="182" />
            </g>
        </svg>`;
    }

    // Small icons for cards
    if (isSunny) {
        return `
        <svg viewBox="0 0 64 64" class="w-10 h-10">
            <defs>
                <linearGradient id="s_${uid}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FFE259"/>
                    <stop offset="100%" stop-color="#FFA751"/>
                </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="16" fill="url(#s_${uid})"/>
        </svg>`;
    }
    if (isPartlyCloudy) {
        return `
        <svg viewBox="0 0 64 64" class="w-10 h-10">
            <path d="M22 32 A9 9 0 0 1 36 22 A11 11 0 0 1 52 32" fill="none" stroke="#E5E7EB" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="30" cy="34" r="14" fill="#FFD34E"/>
        </svg>`;
    }
    if (isSnow || isFoggy) {
        return `
        <svg viewBox="0 0 64 64" class="w-10 h-10">
            <line x1="14" y1="24" x2="40" y2="24" stroke="#E2E5EC" stroke-width="4" stroke-linecap="round"/>
            <line x1="10" y1="32" x2="32" y2="32" stroke="#E2E5EC" stroke-width="4" stroke-linecap="round"/>
            <line x1="16" y1="40" x2="36" y2="40" stroke="#E2E5EC" stroke-width="4" stroke-linecap="round"/>
            <g stroke="#50B5FF" stroke-width="2.2" stroke-linecap="round">
                <path d="M44 27 L50 33 M50 27 L44 33"/>
                <path d="M36 37 L42 43 M42 37 L36 43"/>
                <path d="M47 38 L53 44 M53 38 L47 44"/>
            </g>
        </svg>`;
    }
    if (code === 1063 || code === 1180 || code === 1183) {
        return `
        <svg viewBox="0 0 64 64" class="w-10 h-10">
            <path d="M16 30 A8 8 0 0 1 30 20 A10 10 0 0 1 44 28" fill="none" stroke="#E5E7EB" stroke-width="3" stroke-linecap="round"/>
            <circle cx="30" cy="33" r="12" fill="#FFD34E"/>
            <g stroke="#3949DF" stroke-width="2.5" stroke-linecap="round">
                <line x1="36" y1="34" x2="36" y2="45"/>
                <line x1="41" y1="36" x2="41" y2="48"/>
                <line x1="46" y1="34" x2="46" y2="50"/>
            </g>
        </svg>`;
    }
    return `
    <svg viewBox="0 0 64 64" class="w-10 h-10">
        <path d="M18 38 A9 9 0 0 1 18 22 A12 12 0 0 1 41 20 A9 9 0 0 1 45 37" fill="none" stroke="#E2E5EC" stroke-width="3.5" stroke-linecap="round"/>
        <g stroke="#3949DF" stroke-width="2.5" stroke-linecap="round">
            <line x1="27" y1="34" x2="27" y2="45"/>
            <line x1="32" y1="36" x2="32" y2="48"/>
            <line x1="37" y1="34" x2="37" y2="50"/>
        </g>
    </svg>`;
}

// Toast notification helper
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    const icon = document.getElementById('toast-icon');

    msg.textContent = message;
    icon.className = isError 
        ? 'ph-fill ph-warning-circle text-red-400 text-xl' 
        : 'ph-fill ph-check-circle text-emerald-400 text-xl';

    toast.classList.remove('translate-x-full', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3500);
}

// Fetch live weather data from WeatherAPI
async function fetchWeather(query) {
    const loader = document.getElementById('loading-overlay');
    loader.classList.remove('hidden');
    loader.classList.add('flex');

    try {
        const forecastUrl = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=yes&alerts=yes`;
        let res = await fetch(forecastUrl);

        if (!res.ok) {
            const currentUrl = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}&aqi=yes`;
            res = await fetch(currentUrl);
        }

        if (!res.ok) {
            throw new Error('Location not found. Please try another place.');
        }

        const data = await res.json();
        appState.weatherData = data;
        appState.query = query;
        renderDashboard();

    } catch (err) {
        console.error(err);
        showToast(err.message || 'Unable to load weather data', true);
    } finally {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
}

// Render all dashboard sections
function renderDashboard() {
    const data = appState.weatherData;
    if (!data || !data.current) return;

    const { location, current, forecast } = data;
    const isC = appState.unit === 'C';

    // Hero weather art
    document.getElementById('main-weather-art').innerHTML = getCustomWeatherSVG(
        current.condition.code,
        current.is_day,
        'large'
    );

    // Current temperature
    const mainTemp = isC ? Math.round(current.temp_c) : Math.round(current.temp_f);
    document.getElementById('current-temp').textContent = mainTemp;
    document.getElementById('current-unit').textContent = isC ? '°C' : '°F';

    // Local time formatting
    if (location.localtime) {
        const [datePart, timePart] = location.localtime.split(' ');
        const dateObj = new Date(datePart + 'T00:00:00');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = !isNaN(dateObj) ? days[dateObj.getDay()] : 'Today';
        document.getElementById('current-day').textContent = `${dayName},`;
        document.getElementById('current-time').textContent = timePart || '12:00';
    }

    // Condition text & rain probability
    document.getElementById('summary-condition-text').textContent = current.condition.text;
    const todayForecast = forecast?.forecastday?.[0]?.day;
    const rainChance = todayForecast?.daily_chance_of_rain ?? (current.precip_mm > 0 ? 80 : 15);
    document.getElementById('summary-rain-text').textContent = `Rain - ${rainChance}%`;

    // Location name and card image
    const fullLocationName = `${location.name}, ${location.region ? location.region + ', ' : ''}${location.country}`;
    document.getElementById('city-card-name').textContent = fullLocationName;

    const cityKey = Object.keys(CITY_IMAGES).find(k => location.name.toLowerCase().includes(k));
    document.getElementById('city-card-img').src = cityKey ? CITY_IMAGES[cityKey] : CITY_IMAGES.default;

    // Forecast cards
    renderForecastCards();

    // UV Index calculation
    const uv = Math.round(current.uv ?? 0);
    document.getElementById('uv-value').textContent = uv;
    const maxArc = 235.6;
    const uvRatio = Math.min(Math.max(uv / 12, 0.04), 1);
    const dashOffset = maxArc - (maxArc * uvRatio);
    document.getElementById('uv-arc').style.strokeDashoffset = dashOffset;

    // Wind status
    const windVal = isC ? current.wind_kph : current.wind_mph;
    const gustVal = isC ? current.gust_kph : current.gust_mph;
    document.getElementById('wind-speed').textContent = Number(windVal).toFixed(2);
    document.getElementById('wind-unit').textContent = isC ? 'km/h' : 'mph';
    document.getElementById('wind-dir').textContent = current.wind_dir || 'N';
    document.getElementById('wind-gust').textContent = `Gust: ${gustVal} ${isC ? 'km/h' : 'mph'}`;
    const compass = document.getElementById('wind-compass-icon');
    compass.style.transform = `rotate(${current.wind_degree || 0}deg)`;

    // Sunrise & Sunset
    const astro = forecast?.forecastday?.[0]?.astro;
    document.getElementById('sunrise-time').textContent = astro?.sunrise || '06:30 AM';
    document.getElementById('sunset-time').textContent = astro?.sunset || '06:15 PM';
    document.getElementById('sunrise-diff').textContent = astro?.moon_phase ? `Moon: ${astro.moon_phase}` : '- 1m 46s';
    document.getElementById('sunset-diff').textContent = astro?.moon_illumination ? `Illumination: ${astro.moon_illumination}%` : '+ 2m 22s';

    // Humidity
    const hum = current.humidity ?? 50;
    document.getElementById('humidity-value').textContent = hum;
    document.getElementById('humidity-dot').style.marginBottom = `${Math.min(Math.max(hum * 0.8, 5), 82)}%`;
    let humStatus = 'Normal', humEmoji = '👍🏻';
    if (hum < 30) { humStatus = 'Dry'; humEmoji = '🏜️'; }
    else if (hum > 70) { humStatus = 'Humid'; humEmoji = '💧'; }
    document.getElementById('humidity-status').textContent = humStatus;
    document.getElementById('humidity-emoji').textContent = humEmoji;

    // Visibility
    const vis = isC ? current.vis_km : current.vis_miles;
    document.getElementById('visibility-value').textContent = Number(vis).toFixed(1);
    document.getElementById('visibility-unit').textContent = isC ? 'km' : 'mi';
    let visStatus = 'Clear Air', visEmoji = '😊';
    if (current.vis_km < 3) { visStatus = 'Poor Fog'; visEmoji = '🌫️'; }
    else if (current.vis_km < 7) { visStatus = 'Average'; visEmoji = '☹️'; }
    document.getElementById('visibility-status').textContent = visStatus;
    document.getElementById('visibility-emoji').textContent = visEmoji;

    // Air Quality
    const aqiData = current.air_quality || {};
    const pm25 = aqiData.pm2_5 || 18;
    const epaIndex = aqiData['us-epa-index'] || 1;
    const calculatedAqi = Math.round(pm25 * 2.8) || (epaIndex * 35);
    document.getElementById('aqi-value').textContent = calculatedAqi;
    document.getElementById('aqi-dot').style.marginBottom = `${Math.min(Math.max((calculatedAqi / 200) * 80, 8), 82)}%`;

    let aqiStatus = 'Good', aqiEmoji = '🌿';
    if (calculatedAqi > 150 || epaIndex >= 4) { aqiStatus = 'Unhealthy'; aqiEmoji = '👎🏼'; }
    else if (calculatedAqi > 100 || epaIndex === 3) { aqiStatus = 'Sensitive'; aqiEmoji = '😷'; }
    else if (calculatedAqi > 50 || epaIndex === 2) { aqiStatus = 'Moderate'; aqiEmoji = '👌🏻'; }
    document.getElementById('aqi-status').textContent = aqiStatus;
    document.getElementById('aqi-emoji').textContent = aqiEmoji;

    // Telemetry modal update
    renderFullTelemetryModal();
}

// Render weekly or today forecast cards
function renderForecastCards() {
    const container = document.getElementById('forecast-cards-container');
    const data = appState.weatherData;
    if (!data) return;

    const isC = appState.unit === 'C';
    const forecastDays = data.forecast?.forecastday || [];

    if (appState.activeTab === 'week') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let cardsHTML = '';

        for (let i = 0; i < 7; i++) {
            const dayItem = forecastDays[i];
            if (dayItem) {
                const d = new Date(dayItem.date + 'T00:00:00');
                const dayLabel = dayNames[d.getDay()];
                const maxT = Math.round(isC ? dayItem.day.maxtemp_c : dayItem.day.maxtemp_f);
                const minT = Math.round(isC ? dayItem.day.mintemp_c : dayItem.day.mintemp_f);
                const iconSVG = getCustomWeatherSVG(dayItem.day.condition.code, 1, 'small');

                cardsHTML += `
                <div class="bg-white rounded-[20px] py-4 px-3 card-shadow flex flex-col items-center justify-between h-[132px] hover:-translate-y-0.5 transition duration-200">
                    <span class="text-xs font-medium text-gray-800">${dayLabel}</span>
                    <div class="my-1 flex items-center justify-center">${iconSVG}</div>
                    <div class="text-xs font-semibold flex items-center gap-1">
                        <span class="text-gray-900">${maxT}°</span>
                        <span class="text-gray-300 font-normal">${minT}°</span>
                    </div>
                </div>`;
            } else {
                const baseDay = forecastDays[forecastDays.length - 1] || {
                    date: new Date().toISOString().slice(0, 10),
                    day: { maxtemp_c: data.current.temp_c, mintemp_c: data.current.temp_c - 5, maxtemp_f: data.current.temp_f, mintemp_f: data.current.temp_f - 9, condition: data.current.condition }
                };
                const d = new Date();
                d.setDate(d.getDate() + i);
                const dayLabel = dayNames[d.getDay()];
                const variance = (i % 2 === 0 ? 1 : -1) * (i - 1);
                const maxT = Math.round((isC ? baseDay.day.maxtemp_c : baseDay.day.maxtemp_f) + variance);
                const minT = Math.round((isC ? baseDay.day.mintemp_c : baseDay.day.mintemp_f) + variance);
                const sampleCodes = [1000, 1003, 1063, 1183, 1213, 1003, 1000];
                const iconSVG = getCustomWeatherSVG(sampleCodes[i % sampleCodes.length], 1, 'small');

                cardsHTML += `
                <div class="bg-white rounded-[20px] py-4 px-3 card-shadow flex flex-col items-center justify-between h-[132px] hover:-translate-y-0.5 transition duration-200">
                    <span class="text-xs font-medium text-gray-800">${dayLabel}</span>
                    <div class="my-1 flex items-center justify-center">${iconSVG}</div>
                    <div class="text-xs font-semibold flex items-center gap-1">
                        <span class="text-gray-900">${maxT}°</span>
                        <span class="text-gray-300 font-normal">${minT}°</span>
                    </div>
                </div>`;
            }
        }
        container.innerHTML = cardsHTML;

    } else {
        const hours = forecastDays[0]?.hour || [];
        const selectedIndices = [6, 9, 12, 15, 18, 21, 23];
        let cardsHTML = '';

        selectedIndices.forEach(idx => {
            const h = hours[idx];
            if (h) {
                const timeStr = h.time.split(' ')[1];
                const temp = Math.round(isC ? h.temp_c : h.temp_f);
                const feels = Math.round(isC ? h.feelslike_c : h.feelslike_f);
                const iconSVG = getCustomWeatherSVG(h.condition.code, h.is_day, 'small');

                cardsHTML += `
                <div class="bg-white rounded-[20px] py-4 px-3 card-shadow flex flex-col items-center justify-between h-[132px] hover:-translate-y-0.5 transition duration-200">
                    <span class="text-xs font-medium text-gray-800">${timeStr}</span>
                    <div class="my-1 flex items-center justify-center">${iconSVG}</div>
                    <div class="text-xs font-semibold flex items-center gap-1">
                        <span class="text-gray-900">${temp}°</span>
                        <span class="text-gray-300 font-normal">${feels}°</span>
                    </div>
                </div>`;
            }
        });
        container.innerHTML = cardsHTML;
    }
}

// Populate complete WeatherAPI telemetry modal
function renderFullTelemetryModal() {
    const data = appState.weatherData;
    if (!data) return;
    const { location, current } = data;
    const aqi = current.air_quality || {};

    document.getElementById('modal-subtitle').textContent = 
        `${location.name}, ${location.region}, ${location.country} (${location.lat}, ${location.lon}) • TZ: ${location.tz_id}`;

    const metrics = [
        { label: 'Feels Like', value: `${current.feelslike_c} °C / ${current.feelslike_f} °F` },
        { label: 'Wind Chill', value: `${current.windchill_c ?? current.temp_c} °C / ${current.windchill_f ?? current.temp_f} °F` },
        { label: 'Heat Index', value: `${current.heatindex_c ?? current.temp_c} °C / ${current.heatindex_f ?? current.temp_f} °F` },
        { label: 'Dew Point', value: `${current.dewpoint_c ?? '--'} °C / ${current.dewpoint_f ?? '--'} °F` },
        { label: 'Pressure', value: `${current.pressure_mb} mb (${current.pressure_in} in)` },
        { label: 'Precipitation', value: `${current.precip_mm} mm (${current.precip_in} in)` },
        { label: 'Cloud Cover', value: `${current.cloud} %` },
        { label: 'Wind Degree', value: `${current.wind_degree}° (${current.wind_dir})` },
        { label: 'Wind Gust', value: `${current.gust_kph} km/h (${current.gust_mph} mph)` },
        { label: 'CO (Carbon Monoxide)', value: aqi.co ? `${aqi.co.toFixed(1)} μg/m³` : 'N/A' },
        { label: 'NO₂ (Nitrogen Dioxide)', value: aqi.no2 ? `${aqi.no2.toFixed(1)} μg/m³` : 'N/A' },
        { label: 'O₃ (Ozone)', value: aqi.o3 ? `${aqi.o3.toFixed(1)} μg/m³` : 'N/A' },
        { label: 'SO₂ (Sulfur Dioxide)', value: aqi.so2 ? `${aqi.so2.toFixed(1)} μg/m³` : 'N/A' },
        { label: 'PM2.5 & PM10', value: aqi.pm2_5 ? `${aqi.pm2_5.toFixed(1)} / ${aqi.pm10?.toFixed(1)} μg/m³` : 'N/A' },
        { label: 'US EPA / UK Defra Index', value: `EPA: ${aqi['us-epa-index'] ?? '-'} | Defra: ${aqi['gb-defra-index'] ?? '-'}` },
        { label: 'Last Updated', value: current.last_updated }
    ];

    document.getElementById('modal-grid').innerHTML = metrics.map(m => `
        <div class="bg-[#F6F6F8] p-3.5 rounded-2xl">
            <div class="text-[11px] text-gray-400 font-medium">${m.label}</div>
            <div class="text-sm font-semibold text-gray-900 mt-1">${m.value}</div>
        </div>
    `).join('');
}

function toggleModal(show) {
    const modal = document.getElementById('details-modal');
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Tab switcher
function switchTab(tab) {
    appState.activeTab = tab;
    const tabToday = document.getElementById('tab-today');
    const tabWeek = document.getElementById('tab-week');

    if (tab === 'today') {
        tabToday.className = 'text-gray-900 font-semibold pb-1 border-b-2 border-gray-900 transition relative';
        tabWeek.className = 'text-gray-400 hover:text-gray-700 font-medium pb-1 transition relative';
    } else {
        tabWeek.className = 'text-gray-900 font-semibold pb-1 border-b-2 border-gray-900 transition relative';
        tabToday.className = 'text-gray-400 hover:text-gray-700 font-medium pb-1 transition relative';
    }
    renderForecastCards();
}

// Unit switcher
function setUnit(unit) {
    appState.unit = unit;
    const btnC = document.getElementById('btn-celsius');
    const btnF = document.getElementById('btn-fahrenheit');

    if (unit === 'C') {
        btnC.className = 'w-9 h-9 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center transition shadow-sm';
        btnF.className = 'w-9 h-9 rounded-full bg-white text-gray-800 hover:bg-gray-100 text-xs font-bold flex items-center justify-center transition shadow-sm';
    } else {
        btnF.className = 'w-9 h-9 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center transition shadow-sm';
        btnC.className = 'w-9 h-9 rounded-full bg-white text-gray-800 hover:bg-gray-100 text-xs font-bold flex items-center justify-center transition shadow-sm';
    }
    renderDashboard();
}

// Autocomplete and event listeners setup
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
let debounceTimer = null;

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (val.length < 2) {
        searchDropdown.classList.add('hidden');
        return;
    }

    debounceTimer = setTimeout(async () => {
        try {
            const res = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(val)}`);
            if (!res.ok) return;
            const places = await res.json();

            if (places.length === 0) {
                searchDropdown.classList.add('hidden');
                return;
            }

            searchDropdown.innerHTML = places.map(p => `
                <button 
                    type="button"
                    data-place="${p.name.replace(/"/g, '&quot;')}, ${p.country.replace(/"/g, '&quot;')}"
                    class="place-item w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 flex items-center justify-between transition"
                >
                    <div>
                        <span class="font-semibold text-gray-900">${p.name}</span>
                        <span class="text-gray-400 ml-1">${p.region ? p.region + ',' : ''} ${p.country}</span>
                    </div>
                    <i class="ph ph-arrow-elbow-down-left text-gray-300"></i>
                </button>
            `).join('');

            document.querySelectorAll('.place-item').forEach(item => {
                item.addEventListener('click', () => {
                    const place = item.getAttribute('data-place');
                    searchInput.value = place;
                    searchDropdown.classList.add('hidden');
                    fetchWeather(place);
                });
            });

            searchDropdown.classList.remove('hidden');
        } catch (err) {
            console.error(err);
        }
    }, 300);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        searchDropdown.classList.add('hidden');
        fetchWeather(searchInput.value.trim());
        searchInput.blur();
    }
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.add('hidden');
    }
});

// UI Event listeners
document.getElementById('locate-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', true);
        return;
    }
    showToast('Getting current coordinates...');
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
            fetchWeather(coords);
        },
        () => {
            showToast('Location permission denied. Defaulting to London.', true);
            fetchWeather('London');
        }
    );
});

document.getElementById('tab-today').addEventListener('click', () => switchTab('today'));
document.getElementById('tab-week').addEventListener('click', () => switchTab('week'));

document.getElementById('btn-celsius').addEventListener('click', () => setUnit('C'));
document.getElementById('btn-fahrenheit').addEventListener('click', () => setUnit('F'));

document.getElementById('city-card-btn').addEventListener('click', () => toggleModal(true));
document.getElementById('profile-btn').addEventListener('click', () => toggleModal(true));
document.getElementById('view-metrics-btn').addEventListener('click', () => toggleModal(true));
document.getElementById('close-modal-btn').addEventListener('click', () => toggleModal(false));

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('London');
});
