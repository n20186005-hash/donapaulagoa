import {FORECAST_URL,MARINE_URL,normalizeWeather,adviceFor,weatherText} from './weather-model.js';
const KEY='dp-wx-cache',get=id=>document.getElementById(id);
const show=(id,text)=>{const element=get(id);if(element)element.textContent=text;};
const rounded=value=>typeof value==='number'&&Number.isFinite(value)?`${Math.round(value)}`:'—';
function row(label,value){const wrapper=document.createElement('div'),term=document.createElement('dt'),definition=document.createElement('dd');term.textContent=label;definition.textContent=value;wrapper.append(term,definition);return wrapper;}
function list(id,items){const element=get(id);if(!element)return;element.replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
export function renderWeather(model,cached=false){
 const {current,days,marine}=model;
 show('wx-now',`${rounded(current.temperature_2m)}°C · ${weatherText(current.weather_code)}`);
 get('wx-now-extra')?.replaceChildren(row('Feels like',`${rounded(current.apparent_temperature)}°C`),row('Wind',`${rounded(current.wind_speed_10m)} km/h`),row('Humidity',`${rounded(current.relative_humidity_2m)}%`),row('UV today',rounded(days[0].uv)),...(marine?[row('Modelled waves',marine.wave===null?'Unavailable':`${marine.wave.toFixed(1)} m`),row('Sea temperature',marine.sea===null?'Unavailable':`${rounded(marine.sea)}°C`)]:[]));
 const forecast=get('wx-forecast');
 if(forecast)forecast.replaceChildren(...days.map(day=>{const li=document.createElement('li');const date=document.createElement('b'),conditions=document.createElement('span'),temperature=document.createElement('span');date.textContent=new Date(day.time*1000).toLocaleDateString('en-IN',{weekday:'short',timeZone:'Asia/Kolkata'});conditions.textContent=weatherText(day.code)+(typeof day.rain==='number'?` · rain ${day.rain}%`:'');temperature.textContent=`${rounded(day.high)}° / ${rounded(day.low)}°`;li.append(date,conditions,temperature);return li;}));
 const advice=adviceFor(model);list('wx-dress',advice.dress);list('wx-plan',advice.plan);list('wx-items',advice.items);show('wx-risk',advice.risks.join(' '));if(get('wx-risk'))get('wx-risk').hidden=advice.risks.length===0;
 show('wx-status',`${cached?'Recent cached forecast':'Forecast loaded'} · observation ${new Date(current.time*1000).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} IST`);
 show('wx-marine-status',marine?'Sea values are model estimates, not a water-safety assessment.':'Sea-state data unavailable. Do not infer safe water conditions.');
}
function failure(){show('wx-now','Weather unavailable');show('wx-status','Weather could not be refreshed. Check a current local forecast before travelling.');list('wx-plan',adviceFor(null).plan);}
async function json(url){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('Weather request failed');return await response.json();}finally{clearTimeout(timer);}}
export async function loadWeather(){
 try{const raw=sessionStorage.getItem(KEY);if(raw){const cache=JSON.parse(raw);if(Date.now()-cache.saved>=0&&Date.now()-cache.saved<1800000){const model=normalizeWeather(cache.forecast,cache.marine);renderWeather(model,true);return;}}}catch{}
 show('wx-status','Refreshing forecast…');
 try{const [forecast,marine]=await Promise.all([json(FORECAST_URL),json(MARINE_URL).catch(()=>null)]);const model=normalizeWeather(forecast,marine);renderWeather(model);try{sessionStorage.setItem(KEY,JSON.stringify({saved:Date.now(),forecast,marine}));}catch{}}catch{failure();}
}
if(get('wx-now'))loadWeather();
