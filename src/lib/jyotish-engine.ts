import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);
const sweph = require("sweph");

const SE = (sweph as any).constants || {};
const SE_SUN = SE.SE_SUN ?? 0;
const SE_MOON = SE.SE_MOON ?? 1;
const SE_MARS = SE.SE_MARS ?? 4;
const SE_MERCURY = SE.SE_MERCURY ?? 2;
const SE_JUPITER = SE.SE_JUPITER ?? 5;
const SE_VENUS = SE.SE_VENUS ?? 3;
const SE_SATURN = SE.SE_SATURN ?? 6;
const SE_MEAN_NODE = SE.SE_MEAN_NODE ?? 10;
const SE_TRUE_NODE = SE.SE_TRUE_NODE ?? 11;
const SEFLG_SPEED = SE.SEFLG_SPEED ?? 256;
const SEFLG_SIDEREAL = SE.SEFLG_SIDEREAL ?? 65536;

const rev = (x: number) => ((x % 360) + 360) % 360;
const EPHE_PATH = path.join(process.cwd(), "public/ephe");
let initialized = false;

function initSweph() {
  if (initialized) return;
  sweph.set_ephe_path(EPHE_PATH);
  sweph.set_sid_mode(1, 0, 0); // Lahiri Chitrapaksha
  initialized = true;
}

// ── Names ──
const NAKS: string[] = [
  "Aśvinī","Bharaṇī","Kṛttikā","Rohiṇī","Mṛgaśirā","Ārdrā",
  "Punarvasu","Puṣya","Āśleṣā","Maghā","Pūrva Phalgunī","Uttara Phalgunī",
  "Hasta","Citrā","Svātī","Viśākhā","Anurādhā","Jyeṣṭhā",
  "Mūla","Pūrvāṣāḍhā","Uttarāṣāḍhā","Śravaṇa","Dhaniṣṭhā","Śatabhiṣā",
  "Pūrva Bhādrapadā","Uttara Bhādrapadā","Revatī"
];

export const RASI_NAMES: string[] = [
  "Meṣa","Vṛṣabha","Mithuna","Karkaṭaka","Siṃha","Kanyā",
  "Tulā","Vṛścika","Dhanuṣ","Makara","Kumbha","Mīna"
];
export const RASI_EN: string[] = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
export const GRAHA_NAMES: string[] = ["Sūrya","Candra","Maṅgala","Budha","Guru","Śukra","Śani","Rāhu","Ketu"];
export const GRAHA_EN: string[] = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
export const SYMBOLS: Record<string,string> = {"Sūrya":"☉","Candra":"☽","Maṅgala":"♂","Budha":"☿","Guru":"♃","Śukra":"♀","Śani":"♄","Rāhu":"☊","Ketu":"☋"};

const BODY_IDS = [SE_SUN, SE_MOON, SE_MARS, SE_MERCURY, SE_JUPITER, SE_VENUS, SE_SATURN, SE_MEAN_NODE];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // Ketu,Venus,Sun,Moon,Mars,Rahu,Jupiter,Saturn,Mercury
const DASHA_LORDS = ["Ketu","Śukra","Sūrya","Candra","Maṅgala","Rāhu","Guru","Śani","Budha"];
const DASHA_LORDS_SK = ["Ketu","Śukra","Sūrya","Candra","Maṅgala","Rāhu","Guru","Śani","Budha"];

// ── Nakshatra ──
function nakData(lon: number): { nak: string; nakIdx: number; pada: number } {
  const nakSpan = 360 / 27; // 13°20' = 13.333...
  const idx = Math.floor(rev(lon) / nakSpan);
  const pada = Math.floor((rev(lon) - idx * nakSpan) / (nakSpan / 4)) + 1;
  return { nak: NAKS[Math.min(idx, 26)], nakIdx: idx, pada: Math.min(pada, 4) };
}

// ── Navamsa (D-9) ──
function navamsa(lon: number): number {
  const sidLon = rev(lon);
  const sign = Math.floor(sidLon / 30);
  const deg = sidLon % 30;
  const navamsaIdx = Math.floor(deg / (30 / 9));
  return (sign * 9 + navamsaIdx) % 12;
}

// ── Divisional charts (Parashari / BPHS) ──
function divisionalSign(lon: number, division: number): number {
  const sidLon = rev(lon);
  const sign = Math.floor(sidLon / 30);
  const deg = sidLon % 30;

  if (division === 30) {
    if (sign % 2 === 0) { 
      if (deg < 5)  return 0;   
      if (deg < 10) return 10;  
      if (deg < 18) return 8;   
      if (deg < 25) return 2;   
      return 1;                  
    } else {              
      if (deg < 5)  return 1;   
      if (deg < 12) return 5;   
      if (deg < 20) return 11;  
      if (deg < 25) return 9;   
      return 7;                  
    }
  }

  const portion = Math.floor(deg / (30 / division));

  switch (division) {
    case 1:   return sign;
    case 2:   return (sign % 2 === 0) ? (deg < 15 ? 4 : 3) : (deg < 15 ? 3 : 4);
    case 3:   return (sign + (portion * 4)) % 12;
    case 4:   return (sign + (portion * 3)) % 12;
    case 7:   return (sign + portion) % 12;
    case 9:   return (sign * 9 + portion) % 12;
    case 10:  return (sign % 2 === 0 ? sign : (sign + 8)) % 12 + portion; 
    case 12:  return (sign + portion) % 12;
    case 16:  return (sign + portion) % 12;
    case 20:  return (sign % 2 === 0 ? 0 : 8) + portion;
    case 24:  return (sign % 2 === 0 ? 4 : 3) + portion;
    case 27:  return (sign + portion) % 12;
    case 40:  return (sign % 2 === 0 ? 0 : 5) + portion;
    case 45:  return (sign % 2 === 0 ? 0 : 1) + portion;
    case 60:  return (sign + portion) % 12;
    default:  return (sign + portion) % 12;
  }
}

export function computeChart(year: number, month: number, day: number, hour: number, offset: number, lat: number, lng: number) {
  initSweph();
  const utc = hour - offset;
  const jd = sweph.calc_ut(sweph.julday(year, month, day, utc, 1), 0, 0).julianDayNumber;
  const planets = BODY_IDS.map(id => {
    const res = sweph.calc_ut(jd, id, SEFLG_SIDEREAL | SEFLG_SPEED);
    return { id, name: GRAHA_NAMES[BODY_IDS.indexOf(id)], lon: res.longitude, lat: res.latitude, speed: res.distanceSpeed };
  });

  const houses = sweph.houses_ex(jd, SEFLG_SIDEREAL, lat, lng, "P");
  const lagna = houses.ascendant;
  const lagnaRasi = Math.floor(lagna / 30);
  
  return { jd, planets, lagna, lagnaRasi, nakshatra: nakData(planets[1].lon) };
}

export function calcDashas(chart: any) {
  const moonLon = chart.planets[1].lon;
  const nakSpan = 360/27;
  const elapsed = (moonLon % nakSpan) / nakSpan;
  const firstLordIdx = Math.floor(moonLon / nakSpan) % 9;
  
  return DASHA_YEARS.map((y, i) => {
    const idx = (firstLordIdx + i) % 9;
    return { lord: DASHA_LORDS[idx], years: y };
  });
}

export function calcAspects(planets: any[], lagnaRasi: number) { return []; }
export function calcAshtakavarga(chart: any) { return []; }
export function calcYogas(chart: any) { return []; }
export function calcTransits() { return []; }
export function computeDivisional(chart: any, division: number) { return {}; }
export function calcPanchanga(jd: number, lat: number, lng: number) { return {}; }
export function calcKarakas(chart: any) { return []; }
export function calcShadBala(chart: any) { return {}; }
export function calcArudhas(chart: any) { return []; }
export function calcBhriguBindu(chart: any) { return 0; }
export function buildChartPoints(chart: any, arudhas: any, bb: number) { return []; }
export function calcUpagrahas(chart: any, lat: number, lng: number) { return []; }
export function calcSpecialLagnas(chart: any, lat: number, lng: number) { return []; }
