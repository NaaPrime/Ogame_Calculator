(function () {
'use strict';
const LANG_KEY = 'og_calc_lang_v2';
const RACE_KEY = 'og_calc_houses_race';
const RACES = ['humans', 'rocktal', 'mechas', 'kaelesh'];
const RACE_PREFIX = { humans: 1, rocktal: 2, mechas: 3, kaelesh: 4 };

// ИСПРАВЛЕНО: базовые столбцы теперь свои для каждой расы (P001, P002, P004, P005)
const BASE_COLS = {
    humans: [1001, 1002, 1004, 1005],
    rocktal: [2001, 2002, 2004, 2005],
    mechas: [3001, 3002, 3004, 3005],
    kaelesh: [4001, 4002, 4004, 4005]
};

// ИСПРАВЛЕНО: у kaelesh убран дубль 4002 (теперь в базе), заменён на 4007
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
[72,74,13,9,22,40,11,14628557,38294313546,4978260760,448043468,7271131512]
]
};

// ИСПРАВЛЕНО: добавлены 2005, 3005, 4005; все имена файлов без пробелов
const LF_BUILDING_FILENAMES = {
1001: 'residential_sector.png',
1002: 'biosphere_farm.png',
1003: 'research_center.png',
1004: 'science_academy.png',
1005: 'nerve_calibration_center.png',
1006: 'high_energy_melting.png',
1007: 'food_storage.png',
1008: 'fusion_powered_production.png',
1009: 'skyscraper.png',
1010: 'biotech_lab.png',
1011: 'metropolis.png',
2001: 'meditation_enclave.png',
2002: 'crystal_farm.png',
2003: 'rune_technologium.png',
2004: 'rune_forge.png',
2005: 'orikterium.png',
2006: 'magma_forge.png',
2007: 'chamber_of_rupture.png',
2008: 'megalith.png',
2009: 'crystal_purification.png',
2010: 'deuterium_synthesizer.png',
2011: 'mineral_research_center.png',
3001: 'assembly_line.png',
3002: 'fusion_cell_factory.png',
3003: 'robotics_research_center.png',
3004: 'upgrade_network.png',
3005: 'quantum_computer_center.png',
3006: 'automated_assembly_center.png',
3007: 'high_performance_transformer.png',
3008: 'microchip_line.png',
3009: 'production_assembly_workshop.png',
3010: 'high_performance_synthesizer.png',
3011: 'mass_chip_production.png',
4001: 'sanctuary.png',
4002: 'antimatter_condenser.png',
4003: 'cyclone_chamber.png',
4004: 'hall_of_realization.png',
4005: 'transcendental_forum.png',
4006: 'antimatter_converter.png',
4007: 'cloning_lab.png',
4008: 'chrysalis_accelerator.png',
4009: 'biomodifier.png',
4010: 'psionic_modulator.png',
4011: 'ship_production_hall.png'
};

let currentRace = 'humans';
let initialized = false;

function safeGet(key, def) {
    try {
        const v = localStorage.getItem(key);
        return v !== null ? v : def;
    } catch (e) { return def; }
}
function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
}

const normalizeRace = (r) => (RACES.includes(r) ? r : 'humans');
const getDict = () => (window.getLangDict ? window.getLangDict(safeGet(LANG_KEY, 'ru')) : {});
const normalize = (v) => (window.normalizeLangText ? window.normalizeLangText(v) : String(v ?? '').trim());
const fmt = (n) => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const raceOfPrefix = (p) => RACES.find((r) => RACE_PREFIX[r] === p) || 'humans';
const buildingIcon = (id) => 'images/lifeforms/buildings/' + raceOfPrefix(Math.floor(id / 1000)) + '/' + (LF_BUILDING_FILENAMES[id] || id + '.png');

function icon(src, alt, size) {
    return window.makeIcon ? window.makeIcon(src, alt, size) : document.createElement('span');
}
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
    const img = icon(iconPath, text, 22);
    img.style.display = 'block';
    img.style.margin = '0 auto 4px';
    img.style.width = '22px';
    img.style.height = '22px';
    img.style.objectFit = 'contain';
    t.appendChild(img);
    appendLines(t, text);
    return t;
}

function buildTable(dict) {
    const base = BASE_COLS[currentRace];
    const extras = EXTRA_COLS[currentRace];
    const table = document.createElement('table');
    table.className = 'cost-table houses-table';
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    base.concat(extras).forEach((id) => {
        htr.appendChild(thBuilding(normalize(dict['lf_b_' + id] || id), buildingIcon(id)));
    });
    htr.appendChild(thText(normalize(dict.housesTierPop1 || 'T1 Pop')));
    htr.appendChild(thText(normalize(dict.housesTierPop2 || 'T2 Pop')));
    htr.appendChild(thText(normalize(dict.housesTierPop3 || 'T3 Pop')));
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
        r.slice(5 + extras.length, 8 + extras.length).forEach((v) => tr.appendChild(td(v > 0 ? fmt(v) : '', v > 0 ? 'houses-pop' : 'houses-empty')));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function render() {
    const dict = getDict();
    const select = document.getElementById('housesRaceSelect');
    if (select) {
        select.value = currentRace;
        Array.from(select.options).forEach((o) => { o.textContent = normalize(dict[o.value] || o.value); });
        select.setAttribute('aria-label', normalize(dict.lfSelectLabel || 'Lifeform'));
    }
    const content = document.getElementById('housesContent');
    if (!content) return;
    content.innerHTML = '';
    content.appendChild(buildTable(dict));
}

function initHousesUI() {
    if (!initialized) {
        initialized = true;
        currentRace = normalizeRace(safeGet(RACE_KEY, 'humans'));
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
                    safeSet(RACE_KEY, currentRace);
                    render();
                });
                wrap.appendChild(select);
            }
        }
    }
    render();
}

window.initHousesUI = initHousesUI;
window.updateHousesLang = () => {
    const w = document.getElementById('housesWrapper');
    if (w && w.style.display !== 'none') render();
};
})();