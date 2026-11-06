(function () {
'use strict';
const LANG_KEY = 'og_calc_lang_v2';
const STORAGE_KEY = 'options_expeditions';
const ACCORDION_KEY = 'og_expeditions_accordion_expanded';
const RACE_KEY = 'og_calc_houses_race';
const RACES = ['humans', 'rocktal', 'mechas', 'kaelesh'];
const RACE_PREFIX = { humans: 1, rocktal: 2, mechas: 3, kaelesh: 4 };
const SHIPS = Object.freeze([
['small-cargo', 5000, 'SC'], ['large-cargo', 25000, 'LC'],
['light-fighter', 50, 'LF'], ['heavy-fighter', 100, 'HF'],
['pathfinder', 10000, 'PA'], ['cruiser', 800, 'CR'],
['battleship', 1500, 'BS'], ['battlecruiser', 750, 'BC'],
['colony-ship', 7500, 'CS'], ['recycler', 20000, 'RC'],
['esp-probe', 0, 'EP'], ['bomber', 500, 'BM'],
['destroyer', 2000, 'DR'], ['death-star', 1000000, 'DS'],
['reaper', 10000, 'RE']
]);
const SHIP_IMAGE_MAP = Object.freeze({
'small-cargo': 'maly_transport.png',
'large-cargo': 'bolshoy_transport.png',
'light-fighter': 'legkiy_istrebitel.png',
'heavy-fighter': 'tyazhely_istrebitel.png',
'pathfinder': 'pathfinder.png',
'cruiser': 'kreiser.png',
'battleship': 'linkor.png',
'battlecruiser': 'battlecruiser.png',
'colony-ship': 'colony_ship.png',
'recycler': 'recycler.png',
'esp-probe': 'espionage_probe.png',
'bomber': 'bombardirovshik.png',
'destroyer': 'unichtozhitel.png',
'death-star': 'death_star.png',
'reaper': 'reaper.png'
});
const SHIP_PROPERTIES = Object.freeze([
['RC', 16000], ['CS', 30000], ['DS', 9000000], ['EP', 1000],
['SC', 4000], ['LF', 4000], ['LC', 12000], ['HF', 10000],
['CR', 27000], ['PA', 23000], ['BS', 60000], ['BC', 70000],
['BM', 75000], ['DR', 110000], ['RE', 140000]
]);
const FLEET_CODE_MAP = Object.freeze({
SC: '202', LC: '203', LF: '204', HF: '205', PA: '219',
CR: '206', BS: '207', BC: '215', CS: '208', RC: '209',
EP: '210', BM: '211', DR: '213', DS: '214', RE: '218'
});
const HIGH_TOP_VALUES = Object.freeze([40000, 500000, 1200000, 1800000, 2400000, 3000000, 3600000, 4200000, 5000000]);
const BONUSES_ORDER = Object.freeze([0, 1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 7, 14, 4]);
const LF_BONUS_COUNT = 15;
const FINDABLE_FROM_INDEX = 3;
const LIMITS = Object.freeze({
HYPER: 999, PERCENT: 999, DM: 9999, BOOSTER: 40,
MAX_CALC: Number.MAX_SAFE_INTEGER
});
const BASE_COLS = {
humans: [1001, 1002, 1004, 1005],
rocktal: [2001, 2002, 2004, 2005],
mechas: [3001, 3002, 3004, 3005],
kaelesh: [4001, 4002, 4004, 4005]
};
const EXTRA_COLS = {
humans: [1007, 1009, 1010],
rocktal: [2008, 2011],
mechas: [3008, 3009],
kaelesh: [4007, 4008, 4010]
};
const TIER_SIZE = 6;
const ROWS = {
humans: [
[22,20,0,0,0,0,0,2886,206166,0,0,81474],
[23,22,0,0,0,0,0,4108,308761,0,0,118321],
[23,24,0,0,0,0,0,5803,404104,0,0,158251],
[24,25,0,0,0,0,0,6880,509340,0,0,202905],
[27,26,0,0,0,0,0,8144,750291,0,0,315271],
[27,28,0,0,0,0,0,11369,1010607,0,0,422190],
[42,43,5,0,2,1,2,135442,27487759,1374387,0,16019888],
[44,45,7,0,2,3,2,184021,42912828,3003897,0,28552675],
[47,47,7,0,3,3,3,260895,71598238,5011876,0,44032779],
[48,48,8,0,3,3,3,303617,87669708,7013576,0,57709578],
[49,49,8,0,4,3,4,368543,113135728,9050858,0,70598871],
[50,49,8,0,9,4,6,399255,137996740,11039739,0,83717540],
[61,59,11,7,17,11,14,2322664,1692584448,186184289,13032900,845303165],
[63,60,12,8,25,16,16,2850318,2708600877,325032105,26002568,1325874551],
[66,62,13,9,26,19,19,4144536,4818380742,626389496,56375054,2247179833],
[69,65,13,9,31,19,20,6597649,9582077027,1245670013,112110301,3533520416],
[71,66,14,10,38,27,23,8207926,16032062891,2244488804,224448880,5584803170],
[74,68,15,10,42,29,27,12007340,29876158439,4481423765,448142376,8924970882]
],
rocktal: [
[21,21,0,0,0,0,2068,200284,0,0,87024],
[23,23,0,0,0,0,2932,317479,0,0,140644],
[24,25,0,0,0,0,4128,409672,0,0,197876],
[25,26,0,0,0,0,4886,518088,0,0,249507],
[27,27,0,0,0,0,5777,782034,0,0,355621],
[28,29,0,0,0,0,8044,1039033,0,0,493811],
[43,44,5,0,0,0,86134,28473119,1423655,0,13478419],
[45,46,7,0,1,0,116915,43211722,3024820,0,23288004],
[47,48,8,0,1,0,158409,65460749,5236859,0,37290265],
[48,50,8,0,2,0,214271,87720063,7017605,0,47443941],
[50,51,8,0,2,0,249058,121677420,9734193,0,61105857],
[51,52,8,0,2,0,289387,149493774,11959501,0,72811294],
[62,64,10,8,6,2,1709917,1631968949,163196894,13055751,793028221],
[64,66,12,9,7,2,2290584,2444300008,293316000,26398440,1291153147],
[67,69,14,9,8,3,3545553,4473006243,626220874,56359878,2288267765],
[70,72,14,10,9,3,5478017,8170451987,1143863278,114386327,3794233967],
[72,75,15,11,10,4,8449454,14090384280,2113557642,232491340,6341545952],
[75,78,16,11,10,5,13012380,25654177446,4104668391,451513523,10649887816]
],
mechas: [
[17,20,0,0,0,0,4659,214300,0,0,31392],
[19,21,0,0,0,0,5466,301835,0,0,45415],
[20,23,0,0,0,0,7480,432796,0,0,64852],
[21,24,0,0,0,0,8727,529078,0,0,82044],
[23,26,0,0,0,0,11823,786971,0,0,130255],
[24,28,0,0,0,0,15930,1097991,0,0,183090],
[41,49,3,0,0,1,296743,44801069,1344032,0,10596316],
[43,50,5,0,1,2,345779,60927850,3046392,0,15516547],
[44,52,6,0,2,2,459593,84855495,5091329,0,22400821],
[45,53,7,0,2,2,524457,101462390,7102367,0,29759537],
[46,54,7,0,4,4,621280,130786249,9155037,0,37381941],
[47,55,7,0,4,5,708485,159170866,11141960,0,44498736],
[59,69,10,6,12,11,4969253,2169009561,216900956,13014057,584573108],
[61,71,11,7,16,13,6825176,3378106535,371591718,26011420,943564214],
[64,74,11,8,21,16,10745116,6409757448,705073319,56405865,1660879545],
[67,77,12,8,25,18,16584464,11726394875,1407167385,112573390,2766334662],
[69,80,13,9,30,21,24196131,19251413645,2502683773,225241539,4575650108],
[72,83,14,9,30,22,37603042,35559502319,4978330324,448049729,7700685543]
],
kaelesh: [
[20,20,0,0,0,0,0,3463,217668,0,0,58514],
[21,22,0,0,0,0,0,4929,301200,0,0,85670],
[23,23,0,0,0,0,0,5864,429303,0,0,122196],
[24,24,0,0,0,0,0,6963,536395,0,0,155243],
[25,26,0,0,0,0,0,9773,763040,0,0,222766],
[27,27,0,0,0,0,0,11555,1036765,0,0,313759],
[43,45,3,0,0,1,0,200750,40715875,1221476,0,13748776],
[44,46,6,0,0,1,0,233831,50385895,3023153,0,20164331],
[46,48,6,0,2,3,2,316818,83406429,5004385,0,31006891],
[47,49,7,0,2,3,2,368543,103028825,7212017,0,40969374],
[48,50,7,0,3,4,2,428542,129713860,9079970,0,49179421],
[49,51,7,0,3,4,2,498117,158689826,11108287,0,57972945],
[60,62,10,6,13,18,6,2550483,2177502604,217750260,13065015,668802445],
[62,64,11,7,15,18,7,3419834,3380757146,371883286,26031830,1054060858],
[65,67,11,8,15,21,7,5300479,6381502397,701965263,56157221,1776838211],
[67,69,12,8,19,30,9,7091106,11678171877,1401380625,112110450,2825789807],
[69,71,13,9,19,34,11,9478905,19145853807,2488960995,224006489,4543894426],
[72,74,13,9,22,40,11,14628557,38294313546,4978330324,448043468,7271131512]
]
};
const clamp = (v, min, max) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
const clampCalc = (value) => {
if (!Number.isFinite(value)) return LIMITS.MAX_CALC;
const rounded = Math.floor(value);
return rounded < 0 ? 0 : (rounded > LIMITS.MAX_CALC ? LIMITS.MAX_CALC : rounded);
};
const addCapped = (a, b) => {
const sum = a + b;
return (!Number.isFinite(sum) || sum > LIMITS.MAX_CALC) ? LIMITS.MAX_CALC : sum;
};
const numToOGame = (n) => {
if (n === null || n === undefined || Number.isNaN(n)) return '0';
const val = Math.floor(Math.abs(n));
if (val < 1000) return String(val);
return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const cleanDecimal = (value) => {
let s = String(value ?? '').replace(',', '.').replace(/[^0-9.]/g, '');
const dot = s.indexOf('.');
if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
return s;
};
const parseDecimal = (input) => {
if (!input?.value) return 0;
const v = parseFloat(cleanDecimal(input.value));
return Number.isFinite(v) ? v : 0;
};
const parseInput = (input) => {
if (!input?.value) return 0;
const clean = String(input.value).replace(/[^0-9]/g, '');
if (!clean) return 0;
return Math.min(parseInt(clean, 10) || 0, LIMITS.MAX_CALC);
};
const storage = {
get(key, def) {
try { return localStorage.getItem(key) ?? def; } catch (e) { return def; }
},
set(key, val) {
try { localStorage.setItem(key, val); return true; } catch (e) { return false; }
},
jsonParse(val, fb) {
try { const p = JSON.parse(val); return p === null ? fb : p; } catch (e) { return fb; }
}
};
const normalizeText = (value) => window.normalizeLangText
? window.normalizeLangText(value)
: String(value ?? '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
const getDict = () => (window.getLangDict ? window.getLangDict(storage.get(LANG_KEY, 'ru')) : {});
const createIcon = (src, alt, size) => {
if (window.makeIcon) return window.makeIcon(src, alt, size);
const img = document.createElement('img');
img.src = src;
img.alt = alt;
img.className = 'icon';
img.width = size;
img.height = size;
img.loading = 'lazy';
img.style.cssText = 'border-radius:4px;vertical-align:middle;width:' + size + 'px;height:' + size + 'px;';
img.onerror = function () {
const fb = document.createElement('span');
fb.className = 'icon-fallback';
fb.setAttribute('aria-hidden', 'true');
fb.textContent = alt ? String(alt)[0] : '\u2014';
this.style.display = 'none';
if (this.parentNode) this.parentNode.insertBefore(fb, this.nextSibling);
};
return img;
};
const state = {
prm: {
universeSpeed: 1,
highTop: 40000,
highTopIndex: 0,
playerClass: 0,
hyperTechLevel: 0,
percentRes: 0,
percentShips: 0,
classBonusCollector: 0,
classBonusDiscoverer: 0,
darkMatterDiscoveryBonus: 0,
resourceDiscoveryBooster: 0,
fleet: '{}',
lfShipsBonuses: Array(LF_BONUS_COUNT).fill(0)
},
load() {
const saved = storage.jsonParse(storage.get(STORAGE_KEY, null), null);
if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
Object.assign(this.prm, saved);
if (!Array.isArray(this.prm.lfShipsBonuses) || this.prm.lfShipsBonuses.length !== LF_BONUS_COUNT) {
this.prm.lfShipsBonuses = Array(LF_BONUS_COUNT).fill(0);
} else {
this.prm.lfShipsBonuses = this.prm.lfShipsBonuses.map(v => Math.max(0, parseFloat(v) || 0));
}
this.prm.highTopIndex = clamp(Math.floor(this.prm.highTopIndex) || 0, 0, HIGH_TOP_VALUES.length - 1);
this.prm.highTop = HIGH_TOP_VALUES[this.prm.highTopIndex];
this.prm.universeSpeed = clamp(parseInt(this.prm.universeSpeed, 10) || 1, 1, 10);
this.prm.playerClass = clamp(parseInt(this.prm.playerClass, 10) || 0, 0, 2);
this.prm.hyperTechLevel = clamp(Math.floor(parseInt(this.prm.hyperTechLevel, 10) || 0), 0, LIMITS.HYPER);
this.prm.percentRes = clamp(parseFloat(this.prm.percentRes) || 0, 0, LIMITS.PERCENT);
this.prm.percentShips = clamp(parseFloat(this.prm.percentShips) || 0, 0, LIMITS.PERCENT);
this.prm.classBonusCollector = clamp(parseFloat(this.prm.classBonusCollector) || 0, 0, LIMITS.PERCENT);
this.prm.classBonusDiscoverer = clamp(parseFloat(this.prm.classBonusDiscoverer) || 0, 0, LIMITS.PERCENT);
this.prm.darkMatterDiscoveryBonus = clamp(parseFloat(this.prm.darkMatterDiscoveryBonus) || 0, 0, LIMITS.DM);
const booster = parseInt(this.prm.resourceDiscoveryBooster, 10);
this.prm.resourceDiscoveryBooster = clamp(Number.isInteger(booster) ? booster : 0, 0, LIMITS.BOOSTER);
if (typeof this.prm.fleet !== 'string') {
try { this.prm.fleet = JSON.stringify(this.prm.fleet || {}); } catch (e) { this.prm.fleet = '{}'; }
}
},
save() {
storage.set(STORAGE_KEY, JSON.stringify(this.prm));
}
};
let saveTimer = null;
const scheduleSave = () => {
if (saveTimer) clearTimeout(saveTimer);
saveTimer = setTimeout(() => { saveTimer = null; state.save(); }, 400);
};
const els = {};
let lfBonusInputs = [];
const cacheElements = () => {
SHIPS.forEach(ship => {
els['num' + ship[2]] = document.getElementById('num' + ship[2]);
els['can' + ship[2]] = document.getElementById('can' + ship[2]);
els['find' + ship[2]] = document.getElementById('find' + ship[2]);
});
[
'player-class', 'universe-speed', 'highTop', 'resource-discovery-booster',
'tech_hyper-level', 'percent-resources', 'percent-ships',
'class-bonus-collector', 'class-bonus-discoverer', 'dark-matter-discovery-bonus',
'max_points', 'storageCapacity', 'maxFindMet', 'maxFindCry', 'maxFindDeu',
'darkMatterFind', 'expeditionsFleetBody', 'clearFleet', 'lf-ships-bonuses'
].forEach(id => { els[id] = document.getElementById(id); });
};
const cacheLfBonusInputs = () => {
lfBonusInputs = Array.from(document.querySelectorAll('#lf-ships-bonuses input'));
};
const getShipName = (key) => normalizeText(getDict()['ship_' + key.replace(/-/g, '_')] || key.replace(/-/g, ' '));
const cargoCache = { key: null, single: new Map() };
function unitCapacity(idx) {
const p = state.prm;
const base = SHIPS[idx][1];
if (base <= 0) return 0;
let cap = base * (1 + 0.05 * Math.max(0, p.hyperTechLevel));
if (p.playerClass === 1 && idx < 2) {
cap += Math.floor(base * 0.25 * (1 + p.classBonusCollector / 100));
} else if (p.playerClass === 2) {
const key = SHIPS[idx][0];
if (key === 'recycler' || key === 'pathfinder') cap += base * 0.2;
}
const lf = p.lfShipsBonuses[idx] || 0;
if (lf > 0) cap += Math.floor(base * lf / 100);
return Math.floor(cap);
}
function getCargoCapacity(abbr) {
const p = state.prm;
const paramsKey = p.hyperTechLevel + '|' + p.playerClass + '|' + p.classBonusCollector + '|' + p.lfShipsBonuses.join(',');
if (cargoCache.key !== paramsKey) {
cargoCache.key = paramsKey;
cargoCache.single.clear();
}
if (abbr) {
if (cargoCache.single.has(abbr)) return cargoCache.single.get(abbr);
const idx = SHIPS.findIndex(s => s[2] === abbr);
if (idx === -1) return 0;
const cap = unitCapacity(idx);
cargoCache.single.set(abbr, cap);
return cap;
}
let total = 0;
for (let i = 0; i < SHIPS.length; i++) {
const count = parseInput(els['num' + SHIPS[i][2]]);
if (count > 0) total = addCapped(total, count * unitCapacity(i));
}
return clampCalc(total);
}
const ensureLfShipBonuses = () => {
if (!Array.isArray(state.prm.lfShipsBonuses) || state.prm.lfShipsBonuses.length !== LF_BONUS_COUNT) {
state.prm.lfShipsBonuses = Array(LF_BONUS_COUNT).fill(0);
}
};
const readLfShipBonuses = () => {
ensureLfShipBonuses();
if (lfBonusInputs.length === 0) return;
lfBonusInputs.forEach(inp => {
const idx = parseInt(inp.dataset.index, 10);
if (idx >= 0 && idx < LF_BONUS_COUNT) {
state.prm.lfShipsBonuses[idx] = Math.max(0, parseFloat(inp.value) || 0);
}
});
};
const createFleetJSON = () => {
const json = {};
for (const [abbr, code] of Object.entries(FLEET_CODE_MAP)) {
json[code] = parseInput(els['num' + abbr]);
}
return json;
};
const populateFleetFromJSON = (json = {}) => {
if (!json || typeof json !== 'object') return;
const rev = Object.fromEntries(Object.entries(FLEET_CODE_MAP).map(([a, c]) => [c, a]));
for (const [code, val] of Object.entries(json)) {
const abbr = rev[code];
if (abbr && els['num' + abbr]) {
els['num' + abbr].value = val > 0 ? numToOGame(val) : '';
}
}
};
const clearFleet = () => {
SHIPS.forEach(ship => {
const inp = els['num' + ship[2]];
if (inp) inp.value = '';
});
compute();
};
let computeTimeout = null;
const computeDebounced = () => {
if (computeTimeout) clearTimeout(computeTimeout);
computeTimeout = setTimeout(compute, 100);
};
function compute() {
const p = state.prm;
const playerClassEl = els['player-class'];
if (playerClassEl) p.playerClass = parseInt(playerClassEl.value, 10) || playerClassEl.selectedIndex || 0;
const speedEl = els['universe-speed'];
if (speedEl) {
const parsed = parseInt(speedEl.value, 10);
p.universeSpeed = Number.isNaN(parsed) ? (speedEl.selectedIndex + 1) : parsed;
}
p.hyperTechLevel = clamp(parseInput(els['tech_hyper-level']), 0, LIMITS.HYPER);
p.percentRes = clamp(parseDecimal(els['percent-resources']), 0, LIMITS.PERCENT);
p.percentShips = clamp(parseDecimal(els['percent-ships']), 0, LIMITS.PERCENT);
p.classBonusCollector = clamp(parseDecimal(els['class-bonus-collector']), 0, LIMITS.PERCENT);
p.classBonusDiscoverer = clamp(parseDecimal(els['class-bonus-discoverer']), 0, LIMITS.PERCENT);
p.darkMatterDiscoveryBonus = clamp(parseDecimal(els['dark-matter-discovery-bonus']), 0, LIMITS.DM);
p.resourceDiscoveryBooster = parseInt(els['resource-discovery-booster']?.value, 10) || 0;
readLfShipBonuses();
try { p.fleet = JSON.stringify(createFleetJSON()); } catch (e) { p.fleet = '{}'; }
const tbody = els['expeditionsFleetBody'];
if (!tbody) return;
const canFind = new Array(SHIP_PROPERTIES.length).fill(false);
let foundShips = false;
let maxTier = FINDABLE_FROM_INDEX - 1;
for (let d = FINDABLE_FROM_INDEX; d < SHIP_PROPERTIES.length; d++) {
if (parseInput(els['num' + SHIP_PROPERTIES[d][0]]) > 0) {
foundShips = true;
maxTier = Math.max(maxTier, Math.min(d + 1, SHIP_PROPERTIES.length - 1));
}
}
for (let j = FINDABLE_FROM_INDEX; j <= maxTier; j++) canFind[j] = true;
SHIP_PROPERTIES.forEach((prop, i) => {
const el = els['can' + prop[0]];
if (el) {
const can = canFind[i];
el.textContent = can ? (getDict().expeditionsYes || 'Yes') : (getDict().expeditionsNo || 'No');
el.className = can ? 'bolder-label can-be-found-yes' : 'can-be-found-no';
}
});
const highTopEl = els['highTop'];
const highTopIndex = highTopEl ? highTopEl.selectedIndex : 0;
p.highTopIndex = highTopIndex;
p.highTop = HIGH_TOP_VALUES[highTopIndex] || HIGH_TOP_VALUES[0];
const totalCapacity = getCargoCapacity();
const hasPathfinder = parseInput(els['numPA']) > 0;
const factor = hasPathfinder
? (p.playerClass === 0 ? 3 * p.universeSpeed : 2)
: (p.playerClass === 0 ? 1.5 * p.universeSpeed : 1);
const discovererBonus = p.playerClass === 0 ? (1 + p.classBonusDiscoverer / 100) : 1;
const base = clampCalc(factor * p.highTop);
const maxPoints = clampCalc(base * (1 + p.percentRes / 100) * discovererBonus);
const singleLCCap = getCargoCapacity('LC');
const minLC = singleLCCap > 0 ? Math.ceil(maxPoints / singleLCCap) : 0;
const dict = getDict();
if (els['max_points']) {
const label = normalizeText(dict.expeditionsPointsLabel || 'Expedition points:');
els['max_points'].textContent = label + ' ' + numToOGame(maxPoints) + ' (' + minLC + ' ' + getShipName('large-cargo') + ')';
}
const shipFindPool = foundShips ? Math.max(10000, Math.min(totalCapacity, base)) : 0;
let resourcePool = Math.max(1000 * base, 200000) * 0.001;
resourcePool *= (1 + p.percentRes / 100) * discovererBonus * (1 + p.resourceDiscoveryBooster / 100);
const metal = totalCapacity > 0 ? clampCalc(Math.min(resourcePool, totalCapacity)) : 0;
const crystal = totalCapacity > 0 ? clampCalc(Math.min(resourcePool / 2, totalCapacity)) : 0;
const deut = totalCapacity > 0 ? clampCalc(Math.min(resourcePool / 3, totalCapacity)) : 0;
if (els['storageCapacity']) {
els['storageCapacity'].textContent = numToOGame(totalCapacity);
els['storageCapacity'].style.fontStyle = resourcePool > totalCapacity ? 'italic' : 'normal';
}
if (els['maxFindMet']) els['maxFindMet'].textContent = numToOGame(metal);
if (els['maxFindCry']) els['maxFindCry'].textContent = numToOGame(crystal);
if (els['maxFindDeu']) els['maxFindDeu'].textContent = numToOGame(deut);
for (let d = FINDABLE_FROM_INDEX; d < SHIP_PROPERTIES.length; d++) {
const abbr = SHIP_PROPERTIES[d][0];
const findEl = els['find' + abbr];
if (!findEl) continue;
const found = shipFindPool / SHIP_PROPERTIES[d][1];
const maxShips = canFind[d] ? clampCalc(found * (1 + p.percentShips / 100)) : 0;
findEl.textContent = numToOGame(maxShips);
findEl.className = maxShips > 0 ? 'bolder-label can-be-found-yes' : '';
}
const darkMatter = clampCalc(1800 * (1 + p.darkMatterDiscoveryBonus / 100));
if (els['darkMatterFind']) els['darkMatterFind'].textContent = numToOGame(darkMatter);
scheduleSave();
}
function initExpeditionsTable() {
const tbody = document.getElementById('expeditionsFleetBody');
if (!tbody) return;
const dict = getDict();
const locNo = normalizeText(dict.expeditionsNo || 'No');
if (tbody.children.length === 0) {
const frag = document.createDocumentFragment();
SHIPS.forEach((ship, i) => {
const tr = document.createElement('tr');
tr.className = i % 2 === 0 ? 'odd' : 'even';
const nameCell = document.createElement('td');
nameCell.className = 'first-column';
const wrap = document.createElement('span');
wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
wrap.appendChild(createIcon('images/ships/' + SHIP_IMAGE_MAP[ship[0]], getShipName(ship[0]), 20));
wrap.appendChild(document.createTextNode(getShipName(ship[0])));
nameCell.appendChild(wrap);
const qtyCell = document.createElement('td');
qtyCell.className = 'quantity-cell';
qtyCell.style.textAlign = 'center';
const input = document.createElement('input');
input.id = 'num' + ship[2];
input.type = 'text';
input.placeholder = '0';
input.className = 'quantity-input';
input.maxLength = 9;
input.setAttribute('aria-label', getShipName(ship[0]) + ' quantity');
qtyCell.appendChild(input);
const canCell = document.createElement('td');
canCell.style.textAlign = 'center';
const canSpan = document.createElement('span');
canSpan.id = 'can' + ship[2];
canSpan.textContent = locNo;
canSpan.className = 'can-be-found-no';
canCell.appendChild(canSpan);
const maxCell = document.createElement('td');
maxCell.style.textAlign = 'center';
const maxSpan = document.createElement('span');
maxSpan.id = 'find' + ship[2];
maxSpan.textContent = '0';
maxCell.appendChild(maxSpan);
tr.append(nameCell, qtyCell, canCell, maxCell);
frag.appendChild(tr);
});
const addSummaryRow = (cls, labelHtml, valId, valIds = []) => {
const tr = document.createElement('tr');
tr.className = cls;
let html = '<td colspan="2">' + labelHtml + '</td>';
html += '<td style="text-align:right;">' + valIds.map(id => '<span id="' + id + '">0</span>').join('<br>') + '</td>';
html += '<td style="text-align:right;"><span id="' + valId + '">0</span></td>';
tr.innerHTML = html;
return tr;
};
frag.appendChild(addSummaryRow('storage-row', normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity:'), 'storageCapacity'));
const resLabel = normalizeText(dict.expeditionsMaxResourcesLabel || 'Resource find (max):') + '<br>' +
normalizeText(dict.metal || 'Metal') + '<br>' + normalizeText(dict.crystal || 'Crystal') + '<br>' + normalizeText(dict.deut || 'Deuterium');
const resTr = document.createElement('tr');
resTr.className = 'resources-row';
resTr.innerHTML = '<td colspan="2">' + resLabel + '</td><td style="text-align:right;"></td><td style="text-align:right;"><span id="maxFindMet">0</span><br><span id="maxFindCry">0</span><br><span id="maxFindDeu">0</span></td>';
frag.appendChild(resTr);
frag.appendChild(addSummaryRow('dark-matter-row', normalizeText(dict.expeditionsDarkMatterFindLabel || 'Dark Matter find (max):'), 'darkMatterFind'));
tbody.appendChild(frag);
}
if (!tbody._bound) {
tbody._bound = true;
tbody.addEventListener('input', e => {
if (e.target.matches('.quantity-input')) {
e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
computeDebounced();
}
});
tbody.addEventListener('focusout', e => {
if (e.target.matches('.quantity-input')) {
const num = parseInput(e.target);
e.target.value = num > 0 ? numToOGame(num) : '';
computeDebounced();
}
});
}
cacheElements();
const clearBtn = document.getElementById('clearFleet');
if (clearBtn && !clearBtn._bound) {
clearBtn._bound = true;
clearBtn.addEventListener('click', e => { e.preventDefault(); clearFleet(); });
}
populateFleetFromJSON(storage.jsonParse(state.prm.fleet, {}));
restoreExpeditionSettings();
}
function restoreExpeditionSettings() {
const p = state.prm;
const setVal = (id, val) => { if (els[id]) els[id].value = val; };
const setSel = (id, val, fb) => {
const el = els[id];
if (!el) return;
el.value = String(val);
if (el.value !== String(val) && fb !== undefined) el.selectedIndex = fb;
};
setSel('player-class', p.playerClass, p.playerClass);
setSel('universe-speed', p.universeSpeed, p.universeSpeed - 1);
setSel('highTop', p.highTop, p.highTopIndex);
setSel('resource-discovery-booster', p.resourceDiscoveryBooster, Math.round(p.resourceDiscoveryBooster / 5));
setVal('tech_hyper-level', p.hyperTechLevel > 0 ? numToOGame(p.hyperTechLevel) : '');
setVal('percent-resources', p.percentRes > 0 ? String(p.percentRes) : '');
setVal('percent-ships', p.percentShips > 0 ? String(p.percentShips) : '');
setVal('class-bonus-collector', p.classBonusCollector > 0 ? String(p.classBonusCollector) : '');
setVal('class-bonus-discoverer', p.classBonusDiscoverer > 0 ? String(p.classBonusDiscoverer) : '');
setVal('dark-matter-discovery-bonus', p.darkMatterDiscoveryBonus > 0 ? String(p.darkMatterDiscoveryBonus) : '');
// NB: the LF bonus inputs are created later by initBonusesPanel(), which reads
// the saved values itself - restoring them here was a no-op.
}
function initBonusesPanel() {
const container = els['lf-ships-bonuses'];
if (!container) return;
ensureLfShipBonuses();
if (!container._bound) {
container._bound = true;
container.addEventListener('input', e => {
if (e.target.matches('.lf-bonus-input')) {
e.target.value = cleanDecimal(e.target.value);
computeDebounced();
}
});
container.addEventListener('focusout', e => {
if (e.target.matches('.lf-bonus-input')) {
const idx = parseInt(e.target.dataset.index, 10);
if (idx >= 0 && idx < LF_BONUS_COUNT) {
ensureLfShipBonuses();
const val = Math.max(0, parseFloat(e.target.value) || 0);
state.prm.lfShipsBonuses[idx] = val;
e.target.value = val;
state.save();
computeDebounced();
}
}
});
}
if (container.querySelector('table')) {
cacheLfBonusInputs();
updateBonusesPanelLang();
return;
}
const dict = getDict();
container.innerHTML = '<table><thead><tr>' +
'<th style="text-align:left;padding:2px 4px;">' + normalizeText(dict.shipType || 'Ship Type') + '</th>' +
'<th style="text-align:center;padding:2px 4px;">' + normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity') + '</th>' +
'</tr></thead><tbody></tbody></table>';
const tbody = container.querySelector('tbody');
const frag = document.createDocumentFragment();
BONUSES_ORDER.forEach((shipIdx, row) => {
const ship = SHIPS[shipIdx];
const tr = document.createElement('tr');
tr.className = row % 2 === 0 ? 'odd' : 'even';
const nameTd = document.createElement('td');
nameTd.style.cssText = 'text-align:left;padding:2px 4px;';
const wrap = document.createElement('span');
wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
wrap.appendChild(createIcon('images/ships/' + SHIP_IMAGE_MAP[ship[0]], getShipName(ship[0]), 20));
wrap.appendChild(document.createTextNode(getShipName(ship[0])));
nameTd.appendChild(wrap);
const bonusTd = document.createElement('td');
bonusTd.style.cssText = 'text-align:center;padding:2px 4px;';
const input = document.createElement('input');
input.type = 'text';
input.className = 'lf-bonus-input quantity-input';
input.value = state.prm.lfShipsBonuses[shipIdx] || 0;
input.dataset.index = shipIdx;
input.setAttribute('aria-label', getShipName(ship[0]) + ' bonus');
bonusTd.appendChild(input);
tr.append(nameTd, bonusTd);
frag.appendChild(tr);
});
tbody.appendChild(frag);
cacheLfBonusInputs();
}
function updateBonusesPanelLang() {
const container = els['lf-ships-bonuses'];
if (!container) return;
const dict = getDict();
const ths = container.querySelectorAll('th');
if (ths[0]) ths[0].textContent = normalizeText(dict.shipType || 'Ship Type');
if (ths[1]) ths[1].textContent = normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity');
const rows = container.querySelectorAll('tbody tr');
BONUSES_ORDER.forEach((shipIdx, row) => {
const tr = rows[row];
if (tr && SHIPS[shipIdx]) {
const name = getShipName(SHIPS[shipIdx][0]);
const wrap = tr.querySelector('td span');
if (wrap && wrap.lastChild) wrap.lastChild.textContent = name;
const img = wrap?.querySelector('img');
if (img) img.alt = name;
const input = tr.querySelector('input');
if (input) input.setAttribute('aria-label', name + ' bonus');
}
});
}
function initAccordion() {
const header = document.querySelector('#lf-bonuses-accordion .ui-accordion-header');
const content = document.getElementById('accordion-lf-prm');
if (!header || !content || header.bound) return;
header.bound = true;
header.addEventListener('click', e => {
e.preventDefault();
const isVisible = content.style.display === 'block';
content.style.display = isVisible ? 'none' : 'block';
const icon = header.querySelector('.ui-icon');
if (icon) icon.className = 'ui-icon ui-icon-triangle-1-' + (isVisible ? 'e' : 's');
storage.set(ACCORDION_KEY, JSON.stringify(!isVisible));
});
const isExpanded = storage.jsonParse(storage.get(ACCORDION_KEY, 'false'), false);
content.style.display = isExpanded ? 'block' : 'none';
const icon = header.querySelector('.ui-icon');
if (icon) icon.className = 'ui-icon ui-icon-triangle-1-' + (isExpanded ? 's' : 'e');
}
function bindEvents() {
['player-class', 'universe-speed', 'highTop', 'resource-discovery-booster'].forEach(id => {
if (els[id]) els[id].addEventListener('change', computeDebounced);
});
[
'tech_hyper-level', 'percent-resources', 'percent-ships',
'class-bonus-collector', 'class-bonus-discoverer', 'dark-matter-discovery-bonus'
].forEach(id => {
const el = els[id];
if (!el) return;
el.addEventListener('input', function () {
this.value = id === 'tech_hyper-level'
? this.value.replace(/[^0-9]/g, '')
: cleanDecimal(this.value);
computeDebounced();
});
el.addEventListener('blur', function () {
let max, parsed;
if (id === 'tech_hyper-level') { max = LIMITS.HYPER; parsed = parseInput(this); }
else if (id === 'dark-matter-discovery-bonus') { max = LIMITS.DM; parsed = parseDecimal(this); }
else { max = LIMITS.PERCENT; parsed = parseDecimal(this); }
const v = clamp(parsed, 0, max);
this.value = v > 0 ? String(v) : '';
computeDebounced();
});
});
}
function updateExpeditionsLang() {
const dict = getDict();
const setTitle = (sel, key) => {
const el = document.querySelector(sel);
if (el) el.textContent = normalizeText(dict[key] || el.textContent);
};
setTitle('#lf-bonuses-accordion .ui-accordion-header a span', 'expeditionsShipBonuses');
setTitle('#settings-panel .settings-title', 'expeditionsSettingsTitle');
const labelMap = {
'player-class': 'expeditionsPlayerClass',
'universe-speed': 'expeditionsUniverseSpeed',
'tech_hyper-level': 'expeditionsHyperTech',
'percent-resources': 'expeditionsResourceBonus',
'percent-ships': 'expeditionsShipBonus',
'class-bonus-collector': 'expeditionsCollectorBonus',
'class-bonus-discoverer': 'expeditionsDiscovererBonus',
'dark-matter-discovery-bonus': 'expeditionsDarkMatterBonus',
'resource-discovery-booster': 'expeditionsResourceBooster'
};
for (const [id, key] of Object.entries(labelMap)) {
const lbl = document.querySelector('label[for="' + id + '"]');
if (lbl && dict[key]) lbl.textContent = normalizeText(dict[key]);
}
const highTopSel = els['highTop'];
if (highTopSel) {
for (let i = 0; i < highTopSel.options.length; i++) {
const k = dict['expeditionsHighTop' + (i + 1)];
if (k) highTopSel.options[i].textContent = normalizeText(k);
}
}
const classSel = els['player-class'];
if (classSel && classSel.options.length >= 3) {
if (dict.expeditionsClassDiscoverer) classSel.options[0].textContent = normalizeText(dict.expeditionsClassDiscoverer);
if (dict.expeditionsClassCollector) classSel.options[1].textContent = normalizeText(dict.expeditionsClassCollector);
if (dict.expeditionsClassGeneral) classSel.options[2].textContent = normalizeText(dict.expeditionsClassGeneral);
}
const headers = document.querySelectorAll('#data-table th');
if (headers.length > 0) {
if (headers[0] && dict.shipType) headers[0].textContent = normalizeText(dict.shipType);
if (headers[1]) {
headers[1].textContent = '';
headers[1].appendChild(document.createTextNode(normalizeText(dict.qty || 'Quantity')));
const clearBtn = document.getElementById('clearFleet');
if (clearBtn) headers[1].appendChild(clearBtn);
}
if (headers[2] && dict.canBeFound) headers[2].textContent = normalizeText(dict.canBeFound);
if (headers[3] && dict.maxCanBeFound) headers[3].textContent = normalizeText(dict.maxCanBeFound);
}
document.querySelectorAll('#expeditionsFleetBody .first-column').forEach((cell, i) => {
if (SHIPS[i]) {
const name = getShipName(SHIPS[i][0]);
const wrap = cell.querySelector('span');
if (wrap && wrap.lastChild) wrap.lastChild.textContent = name;
const img = wrap?.querySelector('img');
if (img) img.alt = name;
}
});
initBonusesPanel();
const setTxt = (sel, key) => {
const el = document.querySelector(sel);
if (el) el.textContent = normalizeText(dict[key] || el.textContent);
};
setTxt('.storage-row td:first-child', 'expeditionsCargoCapacity');
const resCell = document.querySelector('.resources-row td:first-child');
if (resCell) {
resCell.textContent = '';
[normalizeText(dict.expeditionsMaxResourcesLabel || 'Resource find (max):'),
normalizeText(dict.metal || 'Metal'),
normalizeText(dict.crystal || 'Crystal'),
normalizeText(dict.deut || 'Deuterium')].forEach((line, i) => {
if (i) resCell.appendChild(document.createElement('br'));
resCell.appendChild(document.createTextNode(line));
});
}
setTxt('.dark-matter-row td:first-child', 'expeditionsDarkMatterFindLabel');
// The points line embeds translated text, so it must be recomputed too.
computeDebounced();
}
let isInit = false;
function initExpeditionUI() {
if (isInit) { computeDebounced(); return; }
isInit = true;
state.load();
initExpeditionsTable();
initBonusesPanel();
initAccordion();
bindEvents();
updateExpeditionsLang();
compute();
}
const normalizeRace = (r) => (RACES.includes(r) ? r : 'humans');
const raceOfPrefix = (p) => RACES.find((r) => RACE_PREFIX[r] === p) || 'humans';
const buildingIcon = (id) => {
const names = window.LF_BUILDING_FILENAMES || {};
return 'images/lifeforms/buildings/' + raceOfPrefix(Math.floor(id / 1000)) + '/' + (names[id] || id + '.png');
};
function td(text, cls) {
const c = document.createElement('td');
if (cls) c.className = cls;
c.textContent = text;
return c;
}
function tdTier(text, cls, tierLabel) {
const c = document.createElement('td');
if (cls) c.className = cls;
if (tierLabel) {
const b = document.createElement('span');
b.className = 'tier-badge';
b.textContent = tierLabel;
c.appendChild(b);
}
c.appendChild(document.createTextNode(text));
return c;
}
function splitName(name) {
const parts = String(name).trim().split(' ');
if (parts.length === 1) return [name];
return [parts[0], parts.slice(1).join(' ')];
}
function appendLines(th, text) {
splitName(text).forEach((line) => {
const s = document.createElement('span');
s.className = 'th-line';
s.textContent = line;
th.appendChild(s);
});
}
function thText(text) {
const t = document.createElement('th');
appendLines(t, text);
return t;
}
function thBuilding(text, iconPath) {
const t = document.createElement('th');
const img = createIcon(iconPath, text, 22);
img.style.display = 'block';
img.style.margin = '0 auto 4px';
img.style.width = '22px';
img.style.height = '22px';
img.style.objectFit = 'contain';
t.appendChild(img);
appendLines(t, text);
return t;
}
let currentRace = 'humans';
let initialized = false;
let lastRenderKey = null;
let firstRender = true;
function buildTable(dict) {
const base = BASE_COLS[currentRace];
const extras = EXTRA_COLS[currentRace];
const table = document.createElement('table');
table.className = 'cost-table houses-table';
const thead = document.createElement('thead');
const htr = document.createElement('tr');
base.concat(extras).forEach((id) => {
htr.appendChild(thBuilding(normalizeText(dict['lf_b_' + id] || id), buildingIcon(id)));
});
htr.appendChild(thText(normalizeText(dict.housesTierPop1 || 'T1 Pop')));
htr.appendChild(thText(normalizeText(dict.housesTierPop2 || 'T2 Pop')));
htr.appendChild(thText(normalizeText(dict.housesTierPop3 || 'T3 Pop')));
thead.appendChild(htr);
table.appendChild(thead);
const tbody = document.createElement('tbody');
ROWS[currentRace].forEach((r, idx) => {
const tier = Math.floor(idx / TIER_SIZE);
const isTierStart = idx % TIER_SIZE === 0;
const tr = document.createElement('tr');
tr.className = 'houses-row t' + (tier + 1) + (isTierStart ? ' tier-start' : '');
r.slice(0, 4 + extras.length).forEach((v, i) => {
const label = (isTierStart && i === 0) ? 'T' + (tier + 1) : null;
tr.appendChild(tdTier(String(v), v > 0 ? 'houses-lv' : 'houses-zero', label));
});
r.slice(5 + extras.length, 8 + extras.length).forEach((v) =>
tr.appendChild(td(v > 0 ? numToOGame(v) : '', v > 0 ? 'houses-pop' : 'houses-empty'))
);
tbody.appendChild(tr);
});
table.appendChild(tbody);
return table;
}
function render() {
const dict = getDict();
const lang = storage.get(LANG_KEY, 'ru');
const renderKey = currentRace + '_' + lang;
if (renderKey === lastRenderKey) return;
const select = document.getElementById('housesRaceSelect');
if (select) {
select.value = currentRace;
Array.from(select.options).forEach((o) => {
o.textContent = normalizeText(dict[o.value] || o.value);
});
select.setAttribute('aria-label', normalizeText(dict.lfSelectLabel || 'Lifeform'));
}
const content = document.getElementById('housesContent');
if (!content) return;
lastRenderKey = renderKey;
const panel = document.getElementById('houses-panel');
if (panel) {
if (firstRender) panel.classList.remove('houses-no-anim');
else panel.classList.add('houses-no-anim');
}
content.innerHTML = '';
content.appendChild(buildTable(dict));
firstRender = false;
}
function initHousesUI() {
if (!initialized) {
initialized = true;
currentRace = normalizeRace(storage.get(RACE_KEY, 'humans'));
const panel = document.getElementById('houses-panel');
if (panel) panel.querySelectorAll('.settings-title').forEach((el) => el.remove());
const wrap = document.getElementById('housesRaceSwitch');
if (wrap) {
wrap.classList.add('houses-select-wrap');
if (!wrap.querySelector('select')) {
const select = document.createElement('select');
select.id = 'housesRaceSelect';
select.className = 'lifeform-select houses-race-select';
RACES.forEach((r) => {
const opt = document.createElement('option');
opt.value = r;
select.appendChild(opt);
});
select.addEventListener('change', () => {
currentRace = normalizeRace(select.value);
storage.set(RACE_KEY, currentRace);
lastRenderKey = null;
render();
});
wrap.appendChild(select);
if (window.enhanceRaceSelect) window.enhanceRaceSelect(select);
}
}
}
render();
const raceSel = document.getElementById('housesRaceSelect');
if (raceSel && raceSel._raceMenuRefresh) raceSel._raceMenuRefresh();
}
window.initExpeditionUI = initExpeditionUI;
window.updateExpeditionsLang = updateExpeditionsLang;
window.clearFleet = clearFleet;
window.initHousesUI = initHousesUI;
window.forceHousesRender = () => {
lastRenderKey = null;
render();
};
window.updateHousesLang = () => {
lastRenderKey = null;
render();
};
document.addEventListener('visibilitychange', () => {
if (document.hidden) {
if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
state.save();
}
});
})();