(function () {
'use strict';
const LANG_KEY = 'og_calc_lang_v2';
const STORAGE_KEY = 'options_expeditions';
const ACCORDION_KEY = 'og_expeditions_accordion_expanded';
const ACTIVE_VIEW_KEY = 'og_calc_active_view';
const SHIPS = [
['small-cargo', 5000, 'SC'],
['large-cargo', 25000, 'LC'],
['light-fighter', 50, 'LF'],
['heavy-fighter', 100, 'HF'],
['pathfinder', 10000, 'PA'],
['cruiser', 800, 'CR'],
['battleship', 1500, 'BS'],
['battlecruiser', 750, 'BC'],
['colony-ship', 7500, 'CS'],
['recycler', 20000, 'RC'],
['esp-probe', 0, 'EP'],
['bomber', 500, 'BM'],
['destroyer', 2000, 'DR'],
['death-star', 1000000, 'DS'],
['reaper', 10000, 'RE']
];
const SHIP_IMAGE_MAP = {
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
};
const SHIP_PROPERTIES = [
['RC', 16000], ['CS', 30000], ['DS', 9000000], ['EP', 1000],
['SC', 4000], ['LF', 4000], ['LC', 12000], ['HF', 10000],
['CR', 27000], ['PA', 23000], ['BS', 60000], ['BC', 70000],
['BM', 75000], ['DR', 110000], ['RE', 140000]
];
const FLEET_CODE_MAP = {
SC: '202', LC: '203', LF: '204', HF: '205', PA: '219',
CR: '206', BS: '207', BC: '215', CS: '208', RC: '209',
EP: '210', BM: '211', DR: '213', DS: '214', RE: '218'
};
const HIGH_TOP_VALUES = [40000, 500000, 1200000, 1800000, 2400000, 3000000, 3600000, 4200000, 5000000];
const BONUSES_ORDER = [0, 1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 7, 14, 4];
const LF_BONUS_COUNT = 15;
const FINDABLE_FROM_INDEX = 3;
const LIMIT_HYPER = 999;
const LIMIT_PERCENT = 999;
const LIMIT_DM = 9999;
const LIMIT_BOOSTER = 40;
const MAX_CALC_VALUE = Number.MAX_SAFE_INTEGER;
const clamp = (v, min, max) => {
if (!Number.isFinite(v)) return min;
return Math.min(max, Math.max(min, v));
};
const clampCalc = (value) => {
if (!Number.isFinite(value)) return MAX_CALC_VALUE;
const rounded = Math.floor(value);
if (rounded < 0) return 0;
return rounded > MAX_CALC_VALUE ? MAX_CALC_VALUE : rounded;
};
const addCapped = (a, b) => {
const sum = a + b;
if (!Number.isFinite(sum) || sum > MAX_CALC_VALUE) return MAX_CALC_VALUE;
return sum;
};
const cleanDecimal = (value) => {
let s = String(value ?? '').replace(',', '.').replace(/[^0-9.]/g, '');
const dot = s.indexOf('.');
if (dot !== -1) {
s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/./g, '');
}
return s;
};
const parseDecimal = (input) => {
if (!input || !input.value) return 0;
const v = parseFloat(cleanDecimal(input.value));
return Number.isFinite(v) ? v : 0;
};
const parseInput = (input) => {
if (!input || !input.value) return 0;
const clean = String(input.value).replace(/[^0-9]/g, '');
if (!clean) return 0;
return Math.min(parseInt(clean, 10) || 0, Number.MAX_SAFE_INTEGER);
};
function safeGet(key, defaultValue) {
try {
const value = localStorage.getItem(key);
return value !== null ? value : defaultValue;
} catch (e) { return defaultValue; }
}
function safeSet(key, value) {
try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
}
function safeJsonParse(value, fallback) {
try {
const parsed = JSON.parse(value);
return parsed === null ? fallback : parsed;
} catch (e) { return fallback; }
}
const normalizeText = (value) => {
if (window.normalizeLangText) return window.normalizeLangText(value);
return String(value ?? '')
.replace(/\u00A0/g, ' ')
.replace(/\s+/g, ' ')
.replace(/\s+([,.:;!?%])/g, '$1')
.trim();
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
const saved = safeJsonParse(safeGet(STORAGE_KEY, null), null);
if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
Object.assign(this.prm, saved);
if (!Array.isArray(this.prm.lfShipsBonuses) || this.prm.lfShipsBonuses.length !== LF_BONUS_COUNT) {
this.prm.lfShipsBonuses = Array(LF_BONUS_COUNT).fill(0);
} else {
this.prm.lfShipsBonuses = this.prm.lfShipsBonuses.map(v => Math.max(0, parseFloat(v) || 0));
}
if (!Number.isInteger(this.prm.highTopIndex) || this.prm.highTopIndex < 0 || this.prm.highTopIndex >= HIGH_TOP_VALUES.length) {
this.prm.highTopIndex = 0;
}
this.prm.highTop = HIGH_TOP_VALUES[this.prm.highTopIndex] || HIGH_TOP_VALUES[0];
const speed = parseInt(this.prm.universeSpeed, 10);
this.prm.universeSpeed = Number.isInteger(speed) && speed >= 1 && speed <= 10 ? speed : 1;
const playerClass = parseInt(this.prm.playerClass, 10);
this.prm.playerClass = Number.isInteger(playerClass) && playerClass >= 0 && playerClass <= 2 ? playerClass : 0;
this.prm.hyperTechLevel = clamp(Math.floor(parseInt(this.prm.hyperTechLevel, 10) || 0), 0, LIMIT_HYPER);
this.prm.percentRes = clamp(parseFloat(this.prm.percentRes) || 0, 0, LIMIT_PERCENT);
this.prm.percentShips = clamp(parseFloat(this.prm.percentShips) || 0, 0, LIMIT_PERCENT);
this.prm.classBonusCollector = clamp(parseFloat(this.prm.classBonusCollector) || 0, 0, LIMIT_PERCENT);
this.prm.classBonusDiscoverer = clamp(parseFloat(this.prm.classBonusDiscoverer) || 0, 0, LIMIT_PERCENT);
this.prm.darkMatterDiscoveryBonus = clamp(parseFloat(this.prm.darkMatterDiscoveryBonus) || 0, 0, LIMIT_DM);
const booster = parseInt(this.prm.resourceDiscoveryBooster, 10);
this.prm.resourceDiscoveryBooster = Number.isInteger(booster) && booster >= 0 && booster <= LIMIT_BOOSTER ? booster : 0;
if (typeof this.prm.fleet !== 'string') {
try { this.prm.fleet = JSON.stringify(this.prm.fleet || {}); } catch (e) { this.prm.fleet = '{}'; }
}
},
save() { safeSet(STORAGE_KEY, JSON.stringify(this.prm)); }
};
let saveTimer = null;
function scheduleSave() {
if (saveTimer) clearTimeout(saveTimer);
saveTimer = setTimeout(() => {
saveTimer = null;
state.save();
}, 400);
}
let LOCA_YES = 'Yes';
let LOCA_NO = 'No';
const els = {};
let lfBonusInputs = [];
const byId = (id) => document.getElementById(id);
function cacheElements() {
SHIPS.forEach(ship => {
els['num' + ship[2]] = byId('num' + ship[2]);
els['can' + ship[2]] = byId('can' + ship[2]);
els['find' + ship[2]] = byId('find' + ship[2]);
});
[
'player-class', 'universe-speed', 'highTop', 'resource-discovery-booster',
'tech_hyper-level', 'percent-resources', 'percent-ships',
'class-bonus-collector', 'class-bonus-discoverer', 'dark-matter-discovery-bonus',
'max_points', 'storageCapacity', 'maxFindMet', 'maxFindCry', 'maxFindDeu',
'darkMatterFind', 'expeditionsFleetBody', 'clearFleet', 'lf-ships-bonuses'
].forEach(id => { els[id] = byId(id); });
}
function cacheLfBonusInputs() {
lfBonusInputs = Array.from(document.querySelectorAll('#lf-ships-bonuses input'));
}
const getLang = () => (window.getLangDict ? window.getLangDict(safeGet(LANG_KEY, 'ru')) : {});
const numToOGame = (n) => {
if (n === null || n === undefined || Number.isNaN(n)) return '0';
return Math.floor(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const validateAndFormatInput = (input) => {
const num = parseInput(input);
input.value = num > 0 ? numToOGame(num) : '';
};
const getShipName = (shipKey) => {
const dict = getLang();
return normalizeText(dict['ship_' + shipKey.replace(/-/g, '_')] || shipKey.replace(/-/g, ' '));
};
const getShipAbbreviation = (abbr) => {
const ship = SHIPS.find(s => s[2] === abbr);
if (!ship) return abbr;
return getShipName(ship[0]);
};
const createShipIcon = (src, alt, size = 32) => {
if (window.makeIcon) return window.makeIcon(src, alt, size);
const img = document.createElement('img');
img.src = src; img.alt = alt; img.className = 'icon';
img.width = size; img.height = size; img.loading = 'lazy';
img.style.cssText = `border-radius:4px;vertical-align:middle;width:${size}px;height:${size}px;`;
img.addEventListener('error', function handler() {
img.removeEventListener('error', handler);
const fb = document.createElement('span');
fb.className = 'icon-fallback';
fb.setAttribute('aria-hidden', 'true');
fb.textContent = alt ? String(alt)[0] : '\u2014';
img.style.display = 'none';
if (img.parentNode) img.parentNode.insertBefore(fb, img.nextSibling);
}, { once: true });
return img;
};
const cargoCache = { key: null, single: new Map() };
function unitCapacity(idx) {
const p = state.prm;
const base = SHIPS[idx][1];
if (base <= 0) return 0;
let cap = base * (1 + 0.05 * Math.max(0, p.hyperTechLevel));
if (p.playerClass === 1 && idx < 2) {
cap += Math.floor(base * 0.25 * (1 + p.classBonusCollector / 100));
}
if (p.playerClass === 2) {
const key = SHIPS[idx][0];
if (key === 'recycler' || key === 'pathfinder') cap += base * 0.2;
}
const lf = p.lfShipsBonuses[idx] || 0;
if (lf > 0) cap += Math.floor(base * lf / 100);
return Math.floor(cap);
}
function getCargoCapacity(abbr) {
const p = state.prm;
const paramsKey = [
p.hyperTechLevel, p.playerClass, p.classBonusCollector, p.lfShipsBonuses.join(',')
].join('|');
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
function ensureLfShipBonuses() {
if (!Array.isArray(state.prm.lfShipsBonuses) || state.prm.lfShipsBonuses.length !== LF_BONUS_COUNT) {
state.prm.lfShipsBonuses = Array(LF_BONUS_COUNT).fill(0);
}
}
function readLfShipBonuses() {
ensureLfShipBonuses();
lfBonusInputs.forEach(inp => {
const idx = parseInt(inp.dataset.index, 10);
if (!Number.isInteger(idx) || idx < 0 || idx >= LF_BONUS_COUNT) return;
const value = Math.max(0, parseFloat(inp.value) || 0);
state.prm.lfShipsBonuses[idx] = value;
});
}
const createFleetJSON = () => {
const json = {};
for (const [abbr, code] of Object.entries(FLEET_CODE_MAP)) {
json[code] = parseInput(els['num' + abbr]);
}
return json;
};
const populateFleetFromJSON = (json = {}) => {
if (!json || typeof json !== 'object' || Array.isArray(json)) return;
const rev = Object.fromEntries(Object.entries(FLEET_CODE_MAP).map(([abbr, code]) => [code, abbr]));
for (const [code, val] of Object.entries(json)) {
const abbr = rev[code];
if (!abbr) continue;
const input = els['num' + abbr];
if (input) input.value = val > 0 ? numToOGame(val) : '';
}
};
const restoreExpeditionSettings = () => {
const p = state.prm;
const setTextInput = (id, val) => {
const e = els[id];
if (!e || val === undefined || val === null) return;
e.value = val;
};
const setSelectValue = (id, val, fallbackIndex) => {
const e = els[id];
if (!e || val === undefined || val === null) return;
const str = String(val);
e.value = str;
if (e.value === str) return;
for (let i = 0; i < e.options.length; i++) {
const opt = e.options[i];
if (opt.value === str || parseInt(opt.value, 10) === val || parseInt(opt.textContent, 10) === val) {
e.selectedIndex = i; return;
}
}
if (Number.isInteger(fallbackIndex) && fallbackIndex >= 0 && fallbackIndex < e.options.length) {
e.selectedIndex = fallbackIndex;
}
};
setSelectValue('player-class', p.playerClass, p.playerClass);
setSelectValue('universe-speed', p.universeSpeed, p.universeSpeed - 1);
const highTopEl = els['highTop'];
if (highTopEl) {
if (Number.isInteger(p.highTopIndex) && p.highTopIndex >= 0 && p.highTopIndex < highTopEl.options.length) {
highTopEl.selectedIndex = p.highTopIndex;
} else {
setSelectValue('highTop', p.highTop, 0);
}
}
setSelectValue('resource-discovery-booster', p.resourceDiscoveryBooster, Math.round((p.resourceDiscoveryBooster || 0) / 5));
setTextInput('tech_hyper-level', p.hyperTechLevel > 0 ? numToOGame(p.hyperTechLevel) : '');
const fmtPct = (v) => (v > 0 ? String(v) : '');
setTextInput('percent-resources', fmtPct(p.percentRes));
setTextInput('percent-ships', fmtPct(p.percentShips));
setTextInput('class-bonus-collector', fmtPct(p.classBonusCollector));
setTextInput('class-bonus-discoverer', fmtPct(p.classBonusDiscoverer));
setTextInput('dark-matter-discovery-bonus', fmtPct(p.darkMatterDiscoveryBonus));
ensureLfShipBonuses();
lfBonusInputs.forEach(inp => {
const idx = parseInt(inp.dataset.index, 10);
if (!Number.isInteger(idx) || idx < 0 || idx >= LF_BONUS_COUNT) return;
if (p.lfShipsBonuses[idx] > 0) inp.value = p.lfShipsBonuses[idx];
});
};
const clearFleet = () => {
SHIPS.forEach(ship => {
const input = els['num' + ship[2]];
if (input) input.value = '';
});
compute();
};
let computeTimeout = null;
const computeDebounced = () => {
if (computeTimeout) clearTimeout(computeTimeout);
computeTimeout = setTimeout(compute, 100);
};
function getSelectInt(id, fallback) {
const e = els[id];
if (!e) return fallback;
const parsed = parseInt(e.value, 10);
return Number.isNaN(parsed) ? fallback : parsed;
}
function setCanCell(abbr, can) {
const canEl = els['can' + abbr];
if (!canEl) return;
canEl.textContent = can ? LOCA_YES : LOCA_NO;
canEl.className = can ? 'bolder-label can-be-found-yes' : 'can-be-found-no';
}
function compute() {
const p = state.prm;
const playerClassEl = els['player-class'];
if (playerClassEl) {
const parsed = parseInt(playerClassEl.value, 10);
p.playerClass = Number.isNaN(parsed) ? playerClassEl.selectedIndex : parsed;
} else {
p.playerClass = 0;
}
const universeSpeedEl = els['universe-speed'];
if (universeSpeedEl) {
const parsed = parseInt(universeSpeedEl.value, 10);
const speed = Number.isNaN(parsed) ? universeSpeedEl.selectedIndex + 1 : parsed;
p.universeSpeed = speed > 0 ? speed : 1;
} else {
p.universeSpeed = 1;
}
p.hyperTechLevel = clamp(parseInput(els['tech_hyper-level']), 0, LIMIT_HYPER);
p.percentRes = clamp(parseDecimal(els['percent-resources']), 0, LIMIT_PERCENT);
p.percentShips = clamp(parseDecimal(els['percent-ships']), 0, LIMIT_PERCENT);
p.classBonusCollector = clamp(parseDecimal(els['class-bonus-collector']), 0, LIMIT_PERCENT);
p.classBonusDiscoverer = clamp(parseDecimal(els['class-bonus-discoverer']), 0, LIMIT_PERCENT);
p.darkMatterDiscoveryBonus = clamp(parseDecimal(els['dark-matter-discovery-bonus']), 0, LIMIT_DM);
p.resourceDiscoveryBooster = getSelectInt('resource-discovery-booster', 0);
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
SHIP_PROPERTIES.forEach((prop, i) => setCanCell(prop[0], canFind[i]));
const highTopEl = els['highTop'];
const highTopIndex = highTopEl ? highTopEl.selectedIndex : 0;
p.highTopIndex = highTopIndex;
const highTop = HIGH_TOP_VALUES[highTopIndex] || HIGH_TOP_VALUES[0];
p.highTop = highTop;
const totalCapacity = getCargoCapacity();
const hasPathfinder = parseInput(els['numPA']) > 0;
const factor = hasPathfinder
? (p.playerClass === 0 ? 3 * p.universeSpeed : 2)
: (p.playerClass === 0 ? 1.5 * p.universeSpeed : 1);
const discovererBonus = p.playerClass === 0 ? 1 + p.classBonusDiscoverer / 100 : 1;
const base = clampCalc(factor * highTop);
const maxPoints = clampCalc(base * (1 + p.percentRes / 100) * discovererBonus);
const singleLCCap = getCargoCapacity('LC');
const minLC = singleLCCap > 0 ? Math.ceil(maxPoints / singleLCCap) : 0;
const dict = getLang();
const lcShipName = getShipAbbreviation('LC');
const maxPointsEl = els['max_points'];
if (maxPointsEl) {
const label = normalizeText(dict.expeditionsPointsLabel || dict.expeditionsMaxPointsLabel || 'Expedition points:');
maxPointsEl.textContent = `${label} ${numToOGame(maxPoints)} (${minLC} ${lcShipName})`;
}
const shipFindPool = foundShips ? Math.max(10000, Math.min(totalCapacity, base)) : 0;
let resourcePool = Math.max(1000 * base, 200000) * 0.001;
resourcePool *= (1 + p.percentRes / 100) * discovererBonus * (1 + p.resourceDiscoveryBooster / 100);
const metal = totalCapacity > 0 ? clampCalc(Math.min(resourcePool, totalCapacity)) : 0;
const crystal = totalCapacity > 0 ? clampCalc(Math.min(resourcePool / 2, totalCapacity)) : 0;
const deut = totalCapacity > 0 ? clampCalc(Math.min(resourcePool / 3, totalCapacity)) : 0;
const storageEl = els['storageCapacity'];
if (storageEl) {
storageEl.textContent = numToOGame(totalCapacity);
storageEl.style.fontStyle = resourcePool > totalCapacity ? 'italic' : 'normal';
}
const maxFindMetEl = els['maxFindMet'];
const maxFindCryEl = els['maxFindCry'];
const maxFindDeuEl = els['maxFindDeu'];
if (maxFindMetEl) maxFindMetEl.textContent = numToOGame(metal);
if (maxFindCryEl) maxFindCryEl.textContent = numToOGame(crystal);
if (maxFindDeuEl) maxFindDeuEl.textContent = numToOGame(deut);
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
const darkMatterFindEl = els['darkMatterFind'];
if (darkMatterFindEl) darkMatterFindEl.textContent = numToOGame(darkMatter);
scheduleSave();
}
function sanitizeDecimalInput(input) {
if (!input) return;
input.value = cleanDecimal(input.value);
}
function ensureBonusPanelDelegation(container) {
if (!container || container._bound) return;
container._bound = true;
container.addEventListener('input', e => {
const input = e.target;
if (!input.matches('.lf-bonus-input')) return;
sanitizeDecimalInput(input);
computeDebounced();
});
container.addEventListener('focusout', e => {
const input = e.target;
if (!input.matches('.lf-bonus-input')) return;
const idx = parseInt(input.dataset.index, 10);
if (!Number.isInteger(idx) || idx < 0 || idx >= LF_BONUS_COUNT) return;
ensureLfShipBonuses();
const value = Math.max(0, parseFloat(input.value) || 0);
state.prm.lfShipsBonuses[idx] = value;
input.value = value;
state.save();
computeDebounced();
});
}
function updateBonusesPanelLang() {
const container = els['lf-ships-bonuses'];
if (!container) return;
const dict = getLang();
const ths = container.querySelectorAll('th');
if (ths[0]) ths[0].textContent = normalizeText(dict.shipType || 'Ship Type');
if (ths[1]) ths[1].textContent = normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity');
const rows = container.querySelectorAll('tbody tr');
BONUSES_ORDER.forEach((shipIdx, row) => {
const tr = rows[row];
if (!tr || !SHIPS[shipIdx]) return;
const name = getShipName(SHIPS[shipIdx][0]);
const nameCell = tr.querySelector('td');
if (nameCell) {
nameCell.childNodes.forEach(node => {
if (node.nodeType === Node.TEXT_NODE) node.textContent = name;
});
const img = nameCell.querySelector('img');
if (img) img.alt = name;
}
const input = tr.querySelector('input');
if (input) input.setAttribute('aria-label', name + ' bonus');
});
}
function initBonusesPanel() {
const container = els['lf-ships-bonuses'];
if (!container) return;
ensureBonusPanelDelegation(container);
ensureLfShipBonuses();
if (container.querySelector('table')) {
cacheLfBonusInputs();
updateBonusesPanelLang();
return;
}
if (lfBonusInputs.length) {
readLfShipBonuses();
}
const dict = getLang();
container.innerHTML =
`<table><thead><tr>` +
`<th style="text-align:left;padding:2px 4px;">${normalizeText(dict.shipType || 'Ship Type')}</th>` +
`<th style="text-align:center;padding:2px 4px;">${normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity')}</th>` +
`</tr></thead><tbody></tbody></table>`;
const tbody = container.querySelector('tbody');
const frag = document.createDocumentFragment();
BONUSES_ORDER.forEach((shipIdx, row) => {
const ship = SHIPS[shipIdx];
const tr = document.createElement('tr');
tr.className = row % 2 === 0 ? 'odd' : 'even';
const nameCell = document.createElement('td');
nameCell.style.cssText = 'text-align:left;padding:2px 4px;display:flex;align-items:center;gap:8px;';
nameCell.appendChild(createShipIcon(`images/ships/${SHIP_IMAGE_MAP[ship[0]]}`, getShipName(ship[0]), 32));
nameCell.appendChild(document.createTextNode(getShipName(ship[0])));
const bonusCell = document.createElement('td');
bonusCell.style.cssText = 'text-align:center;padding:2px 4px;';
const input = document.createElement('input');
input.type = 'text';
input.value = state.prm.lfShipsBonuses[shipIdx] || 0;
input.dataset.index = shipIdx;
input.className = 'lf-bonus-input quantity-input';
input.setAttribute('aria-label', `${getShipName(ship[0])} bonus`);
bonusCell.appendChild(input);
tr.append(nameCell, bonusCell);
frag.appendChild(tr);
});
tbody.appendChild(frag);
cacheLfBonusInputs();
}
function ensureFleetTableDelegation(tbody) {
if (!tbody || tbody._bound) return;
tbody._bound = true;
tbody.addEventListener('input', e => {
const input = e.target;
if (!input.matches('.quantity-input')) return;
input.value = input.value.replace(/[^0-9]/g, '').slice(0, 9);
computeDebounced();
});
tbody.addEventListener('focusout', e => {
const input = e.target;
if (!input.matches('.quantity-input')) return;
validateAndFormatInput(input);
computeDebounced();
});
}
let tableInitAttempts = 0;
function initExpeditionsTable() {
const tbody = byId('expeditionsFleetBody');
if (!tbody) {
if (++tableInitAttempts < 20) setTimeout(initExpeditionsTable, 100);
return;
}
tableInitAttempts = 0;
const dict = getLang();
LOCA_YES = normalizeText(dict.expeditionsYes || 'Yes');
LOCA_NO = normalizeText(dict.expeditionsNo || 'No');
if (tbody.children.length === 0) {
const frag = document.createDocumentFragment();
SHIPS.forEach((ship, i) => {
const tr = document.createElement('tr');
tr.className = i % 2 === 0 ? 'odd' : 'even';
const nameCell = document.createElement('td');
nameCell.className = 'first-column';
nameCell.style.cssText = 'display:flex;align-items:center;gap:8px;';
nameCell.appendChild(createShipIcon(`images/ships/${SHIP_IMAGE_MAP[ship[0]]}`, getShipName(ship[0]), 32));
nameCell.appendChild(document.createTextNode(getShipName(ship[0])));
const qtyCell = document.createElement('td');
qtyCell.style.cssText = 'text-align:center;';
qtyCell.className = 'quantity-cell';
const input = document.createElement('input');
input.id = 'num' + ship[2];
input.type = 'text';
input.placeholder = '0';
input.className = 'quantity-input';
input.maxLength = 9;
input.setAttribute('aria-label', `${getShipName(ship[0])} quantity`);
qtyCell.appendChild(input);
const canCell = document.createElement('td');
canCell.style.cssText = 'text-align:center;';
const canSpan = document.createElement('span');
canSpan.id = 'can' + ship[2];
canSpan.textContent = LOCA_NO;
canSpan.className = 'can-be-found-no';
canCell.appendChild(canSpan);
const maxCell = document.createElement('td');
maxCell.style.cssText = 'text-align:center;';
const maxSpan = document.createElement('span');
maxSpan.id = 'find' + ship[2];
maxSpan.textContent = '0';
maxCell.appendChild(maxSpan);
tr.append(nameCell, qtyCell, canCell, maxCell);
frag.appendChild(tr);
});
tbody.appendChild(frag);
const capRow = document.createElement('tr');
capRow.className = 'storage-row';
capRow.innerHTML =
`<td colspan="2">${normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity:')}</td>` +
`<td colspan="2" style="text-align:right;"><span id="storageCapacity">0</span></td>`;
tbody.appendChild(capRow);
const resRow = document.createElement('tr');
resRow.className = 'resources-row';
resRow.innerHTML =
`<td colspan="2">${normalizeText(dict.expeditionsMaxResourcesLabel || 'Resource find (max):')}</td>` +
`<td style="text-align:right;">${normalizeText(dict.metal || 'Metal')}<br>${normalizeText(dict.crystal || 'Crystal')}<br>${normalizeText(dict.deut || 'Deuterium')}</td>` +
`<td style="text-align:right;"><span id="maxFindMet">0</span><br><span id="maxFindCry">0</span><br><span id="maxFindDeu">0</span></td>`;
tbody.appendChild(resRow);
const dmRow = document.createElement('tr');
dmRow.className = 'dark-matter-row';
dmRow.innerHTML =
`<td colspan="2">${normalizeText(dict.expeditionsDarkMatterFindLabel || 'Dark Matter find (max):')}</td>` +
`<td colspan="2" style="text-align:right;"><span id="darkMatterFind">0</span></td>`;
tbody.appendChild(dmRow);
}
ensureFleetTableDelegation(tbody);
cacheElements();
bindClearButton();
const fleet = safeJsonParse(state.prm.fleet, {});
populateFleetFromJSON(fleet);
restoreExpeditionSettings();
}
function bindClearButton() {
const clearBtn = byId('clearFleet');
if (clearBtn && !clearBtn._bound) {
clearBtn._bound = true;
clearBtn.addEventListener('click', e => {
e.preventDefault();
e.stopPropagation();
clearFleet();
});
}
}
let accordionBound = false;
function initAccordion() {
const header = document.querySelector('#lf-bonuses-accordion .ui-accordion-header');
const content = byId('accordion-lf-prm');
if (!header || !content || accordionBound) return;
accordionBound = true;
const newHeader = header.cloneNode(true);
header.parentNode.replaceChild(newHeader, header);
newHeader.addEventListener('click', function (e) {
e.preventDefault();
e.stopPropagation();
const isVisible = content.style.display === 'block';
content.style.display = isVisible ? 'none' : 'block';
const icon = this.querySelector('.ui-icon');
if (icon) icon.className = `ui-icon ui-icon-triangle-1-${isVisible ? 'e' : 's'}`;
safeSet(ACCORDION_KEY, JSON.stringify(!isVisible));
});
const isExpanded = safeJsonParse(safeGet(ACCORDION_KEY, 'false'), false);
content.style.display = isExpanded ? 'block' : 'none';
const icon = newHeader.querySelector('.ui-icon');
if (icon) icon.className = `ui-icon ui-icon-triangle-1-${isExpanded ? 's' : 'e'}`;
}
function bindEvents() {
['player-class', 'universe-speed', 'highTop', 'resource-discovery-booster'].forEach(id => {
const e = els[id];
if (e) e.addEventListener('change', computeDebounced);
});
[
'tech_hyper-level',
'percent-resources', 'percent-ships',
'class-bonus-collector', 'class-bonus-discoverer',
'dark-matter-discovery-bonus'
].forEach(id => {
const e = els[id];
if (!e) return;
e.addEventListener('input', function () {
if (this.id === 'tech_hyper-level') {
this.value = this.value.replace(/[^0-9]/g, '');
} else {
this.value = cleanDecimal(this.value);
}
computeDebounced();
});
e.addEventListener('blur', function () {
let max, parsed;
if (this.id === 'tech_hyper-level') {
max = LIMIT_HYPER;
parsed = parseInput(this);
} else if (this.id === 'dark-matter-discovery-bonus') {
max = LIMIT_DM;
parsed = parseDecimal(this);
} else {
max = LIMIT_PERCENT;
parsed = parseDecimal(this);
}
const v = clamp(parsed, 0, max);
this.value = v > 0 ? String(v) : '';
computeDebounced();
});
});
bindClearButton();
}
function updateExpeditionsLang() {
const dict = getLang();
LOCA_YES = normalizeText(dict.expeditionsYes || 'Yes');
LOCA_NO = normalizeText(dict.expeditionsNo || 'No');
const accordionHeaderSpan = document.querySelector('#lf-bonuses-accordion .ui-accordion-header a span');
if (accordionHeaderSpan) {
accordionHeaderSpan.textContent = normalizeText(dict.expeditionsShipBonuses || 'Ships stats bonuses (%)');
}
const settingsTitle = document.querySelector('#settings-panel .settings-title');
if (settingsTitle) settingsTitle.textContent = normalizeText(dict.expeditionsSettingsTitle || 'OGame Expeditions Calculator');
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
const label = document.querySelector(`label[for="${id}"]`);
if (label && dict[key]) label.textContent = normalizeText(dict[key]);
}
const highTopSelect = els['highTop'];
if (highTopSelect) {
for (let i = 0; i < highTopSelect.options.length; i++) {
const key = dict[`expeditionsHighTop${i + 1}`];
if (key) highTopSelect.options[i].textContent = normalizeText(key);
}
}
const playerClassSelect = els['player-class'];
if (playerClassSelect && playerClassSelect.options.length >= 3) {
if (dict.expeditionsClassDiscoverer) playerClassSelect.options[0].textContent = normalizeText(dict.expeditionsClassDiscoverer);
if (dict.expeditionsClassCollector) playerClassSelect.options[1].textContent = normalizeText(dict.expeditionsClassCollector);
if (dict.expeditionsClassGeneral) playerClassSelect.options[2].textContent = normalizeText(dict.expeditionsClassGeneral);
}
const headers = document.querySelectorAll('#data-table th');
if (headers.length > 0) {
if (headers[0] && dict.shipType) headers[0].textContent = normalizeText(dict.shipType);
if (headers[1]) {
const existingClear = byId('clearFleet');
headers[1].textContent = '';
headers[1].appendChild(document.createTextNode(normalizeText(dict.qty || 'Количество')));
if (existingClear) {
headers[1].appendChild(existingClear);
els.clearFleet = existingClear;
} else {
const clearBtn = document.createElement('button');
clearBtn.id = 'clearFleet';
clearBtn.type = 'button';
clearBtn.className = 'clear-fleet-mini';
clearBtn.textContent = '✕';
headers[1].appendChild(clearBtn);
els.clearFleet = clearBtn;
bindClearButton();
}
}
if (headers[2] && dict.canBeFound) headers[2].textContent = normalizeText(dict.canBeFound);
if (headers[3] && dict.maxCanBeFound) headers[3].textContent = normalizeText(dict.maxCanBeFound);
}
document.querySelectorAll('#expeditionsFleetBody .first-column').forEach((cell, i) => {
if (!SHIPS[i]) return;
const name = getShipName(SHIPS[i][0]);
cell.childNodes.forEach(node => {
if (node.nodeType === Node.TEXT_NODE) node.textContent = name;
});
const img = cell.querySelector('img');
if (img) img.alt = name;
});
initBonusesPanel();
const storageRow = document.querySelector('.storage-row td:first-child');
if (storageRow) storageRow.textContent = normalizeText(dict.expeditionsCargoCapacity || 'Storage Capacity:');
const resourceRow = document.querySelector('.resources-row td:first-child');
if (resourceRow) resourceRow.textContent = normalizeText(dict.expeditionsMaxResourcesLabel || 'Resource find (max):');
const darkMatterRow = document.querySelector('.dark-matter-row td:first-child');
if (darkMatterRow) darkMatterRow.textContent = normalizeText(dict.expeditionsDarkMatterFindLabel || 'Dark Matter find (max):');
}
function onLanguageChanged() {
updateExpeditionsLang();
computeDebounced();
}
let isExpeditionsInit = false;
function initExpeditionUI() {
if (isExpeditionsInit) {
computeDebounced();
return;
}
isExpeditionsInit = true;
state.load();
initExpeditionsTable();
initBonusesPanel();
initAccordion();
bindEvents();
updateExpeditionsLang();
compute();
document.removeEventListener('languageChanged', onLanguageChanged);
document.addEventListener('languageChanged', onLanguageChanged);
}
window.initExpeditionUI = initExpeditionUI;
window.updateExpeditionsLang = updateExpeditionsLang;
window.clearFleet = clearFleet;
window.compute = compute;
document.addEventListener('visibilitychange', () => {
if (document.hidden) {
if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
state.save();
}
});
})();