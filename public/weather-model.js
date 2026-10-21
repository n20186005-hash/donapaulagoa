export const LAT = 15.4506125, LON = 73.8029961;
export const FORECAST_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=Asia/Kolkata&timeformat=unixtime&forecast_days=7`;
export const MARINE_URL = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=wave_height,sea_surface_temperature&timezone=Asia/Kolkata&timeformat=unixtime&forecast_days=2`;
const finite = value => typeof value === 'number' && Number.isFinite(value);
export function weatherText(code) {
 const names={0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',82:'Heavy showers',85:'Snow showers',86:'Snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'};
 return names[code] || 'Conditions not classified';
}
export function marineAt(data, nowMs=Date.now()) {
 const hourly=data?.hourly;
 if (!Array.isArray(hourly?.time)) return null;
 const now=nowMs/1000;
 const index=hourly.time.findLastIndex(time => finite(time) && time<=now && now-time<=3*3600);
 if(index<0)return null;
 const wave=hourly.wave_height?.[index],sea=hourly.sea_surface_temperature?.[index];
 return {wave:finite(wave)?wave:null,sea:finite(sea)?sea:null,time:hourly.time[index]};
}
export function normalizeWeather(data, marine=null, nowMs=Date.now()) {
 const current=data?.current,daily=data?.daily;
 if (!finite(current?.time) || Math.abs(nowMs/1000-current.time)>7200 || !finite(current.temperature_2m) || !finite(current.weather_code) || !finite(current.wind_speed_10m)) throw new Error('Weather observation unavailable or stale');
 const dates=daily?.time;
 if(!Array.isArray(dates)||dates.length<7)throw new Error('Forecast unavailable');
 const days=dates.slice(0,7).map((time,index)=>({time,code:daily.weather_code?.[index],high:daily.temperature_2m_max?.[index],low:daily.temperature_2m_min?.[index],rain:daily.precipitation_probability_max?.[index],uv:daily.uv_index_max?.[index],wind:daily.wind_speed_10m_max?.[index]}));
 if(days.some(day=>!finite(day.time)||!finite(day.high)||!finite(day.low)||!finite(day.code)))throw new Error('Incomplete forecast');
 if(Math.abs(days[0].time+43200-nowMs/1000)>86400)throw new Error('Forecast out of date');
 return {current,days,marine:marineAt(marine,nowMs)};
}
export function adviceFor(model) {
 const dress=['Light, breathable clothes and secure footwear.'],items=['Drinking water and sun protection.'];
 const plan=[],risks=[];
 if(!model)return {dress,items,plan:['Current conditions are unavailable. Check a current local forecast before leaving.'],risks:[]};
 const {current,days,marine}=model,today=days[0];
 if(current.weather_code>=95 || today.code>=95)risks.push('Thunderstorms forecast or observed: postpone exposed coastal walks and follow official warnings.');
 else if([63,65,66,67,80,81,82].includes(current.weather_code))risks.push('Rain may make exposed paths slippery. Reconsider the visit and follow on-site advice.');
 if(current.wind_speed_10m>=40 || today.wind>=40)risks.push('Strong wind: avoid exposed edges and follow local restrictions.');
 if(marine?.wave>=1.5)risks.push('Modelled rough seas: stay away from rocks and the water edge.');
 if(today.rain>=60){plan.push('Rain is likely; allow for shelter and changes to your plans.');items.push('A raincoat.');}
 if(today.high>=32)plan.push('Hot conditions: limit time in direct sun and take breaks.');
 if(today.uv>=5)items.push('A hat, sunglasses and sunscreen.');
 if(!plan.length)plan.push(risks.length?'Consider postponing exposed outdoor stops.':'Use this forecast to plan your visit, and check conditions on arrival.');
 return {dress,items,plan,risks};
}
