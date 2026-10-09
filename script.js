(function () {
'use strict';
const CONFIG = {
TM_PER_BOX: 42000,
TM_PACKS: [{ tm: 12500000, priceTRY: 900 }],
METAL_EQ_CRYSTAL: 1.5,
METAL_EQ_DEUT: 3,
TRY_TO_BYN_RATE: 16.01,
CURRENCY_RATES: { BYN: 1, RUB: 23.5, USD: 0.31, EUR: 0.28, TRY: 16.01 },
MAX_LEVEL_SPAN: 99,
MAX_LEVEL: 99,
TM_PER_LEVEL_FACTOR: 2,
TM_INPUT_PLACEHOLDER: '72810'
};
const CURRENCY_SYMBOLS = { BYN: 'Br', RUB: '₽', USD: '$', EUR: '€', TRY: '₺' };
const KEYS = {
LANG: 'og_calc_lang_v2',
TRANSFORM: 'og_calc_transform_v2',
INPUTS_BUILD: 'og_calc_inputs_build_v2',
INPUTS_RESEARCH: 'og_calc_inputs_research_v2',
INPUTS_MOON_BUILD: 'og_calc_inputs_moon_build_v2',
LF_INPUTS_BUILD: 'og_calc_lf_inputs_build_v1',
LF_INPUTS_RESEARCH: 'og_calc_lf_inputs_research_v1',
LF_RACE: 'og_calc_lf_race_v1',
LF_TOTALS: 'og_calc_lf_totals_v1',
TM: 'og_calc_tm_v2',
BOXES: 'og_calc_boxes_v2',
SHIP_QTY: 'og_calc_ship_qty_v2',
ACTIVE_TAB: 'og_calc_active_tab_v2',
SUM_ALL_TABS: 'og_calc_sum_all_tabs',
CURRENCY: 'og_calc_currency_v1',
BASE_CURRENCY: 'og_calc_base_currency_v1',
RESEARCH_DISCOUNTS: 'og_calc_research_discounts_v1',
TRANSPORT_CAPACITY: 'og_calc_transport_capacity_v1'
};
const SETTINGS_KEY = 'og_calc_settings_v1';
const IMG = {
root: 'images/',
buildings: 'images/buildings/',
research: 'images/research/',
ships: 'images/ships/'
};
const LANGUAGES = {
en: 'English', ru: 'Русский', de: 'Deutsch', pl: 'Polski', es: 'Español',
fr: 'Français', it: 'Italiano', nl: 'Nederlands', sk: 'Slovenčina',
tr: 'Türkçe', pt: 'Português', bs: 'Bosanski'
};
const BUILDINGS = [
{ id: 1, img: 'metal_mine.png', base: { m: 60, c: 15, d: 0 }, factor: 1.5 },
{ id: 2, img: 'crystal_mine.png', base: { m: 48, c: 24, d: 0 }, factor: 1.6 },
{ id: 3, img: 'deuterium_synth.png', base: { m: 225, c: 75, d: 0 }, factor: 1.5 },
{ id: 4, img: 'solar_plant.png', base: { m: 75, c: 30, d: 0 }, factor: 1.5 },
{ id: 5, img: 'fusion_plant.png', base: { m: 900, c: 360, d: 180 }, factor: 1.8 },
{ id: 6, img: 'robot_factory.png', base: { m: 400, c: 120, d: 200 }, factor: 2.0 },
{ id: 7, img: 'nanite_factory.png', base: { m: 1000000, c: 500000, d: 100000 }, factor: 2.0 },
{ id: 8, img: 'shipyard.png', base: { m: 400, c: 200, d: 100 }, factor: 2.0 },
{ id: 9, img: 'metal_storage.png', base: { m: 1000, c: 0, d: 0 }, factor: 2.0 },
{ id: 10, img: 'crystal_storage.png', base: { m: 1000, c: 500, d: 0 }, factor: 2.0 },
{ id: 11, img: 'deuterium_tank.png', base: { m: 1000, c: 1000, d: 0 }, factor: 2.0 },
{ id: 17, img: 'anomaly_scanner.png', base: { m: 84, c: 42, d: 14 }, factor: 1.5 },
{ id: 12, img: 'research_lab.png', base: { m: 200, c: 400, d: 200 }, factor: 2.0 },
{ id: 13, img: 'terraformer.png', base: { m: 0, c: 50000, d: 100000 }, factor: 2.0 },
{ id: 14, img: 'alliance_depot.png', base: { m: 20000, c: 40000, d: 0 }, factor: 2.0 },
{ id: 15, img: 'dock.png', base: { m: 200, c: 0, d: 50 }, factor: 5.0 },
{ id: 16, img: 'missile_silo.png', base: { m: 20000, c: 20000, d: 1000 }, factor: 2.0 }
];
const BUILDING_ORDER = [0, 1, 2, 3, 4, 8, 9, 10, 11, 5, 7, 12, 6, 13, 14, 15, 16];
const MRC_BUILDING_IDS = new Set([1, 2, 3]);
const MOON_BUILDINGS = [
{ id: 44, name: 'Фабрика роботов', img: 'robot_factory.png', base: { m: 400, c: 120, d: 200 }, factor: 2.0 },
{ id: 45, name: 'Верфь', img: 'shipyard.png', base: { m: 400000, c: 200000, d: 100000 }, factor: 2.0 },
{ id: 41, name: 'Лунная база', img: 'lunar_base.png', base: { m: 20000, c: 40000, d: 20000 }, factor: 2.0 },
{ id: 42, name: 'Сенсорная фаланга', img: 'sensor_phalanx.png', base: { m: 20000, c: 40000, d: 20000 }, factor: 2.0 },
{ id: 43, name: 'Ворота', img: 'jump_gate.png', base: { m: 2000000, c: 4000000, d: 2000000 }, factor: 2.0 }
];
const RESEARCH = [
{ img: 'spy.png', base: { m: 200, c: 1000, d: 200 }, factor: 2.0 },
{ img: 'computer.png', base: { m: 0, c: 400, d: 600 }, factor: 2.0 },
{ img: 'weapons.png', base: { m: 800, c: 200, d: 0 }, factor: 2.0 },
{ img: 'shield.png', base: { m: 200, c: 600, d: 0 }, factor: 2.0 },
{ img: 'armor.png', base: { m: 1000, c: 0, d: 0 }, factor: 2.0 },
{ img: 'energy.png', base: { m: 0, c: 800, d: 400 }, factor: 2.0 },
{ img: 'hyperspace.png', base: { m: 0, c: 4000, d: 2000 }, factor: 2.0 },
{ img: 'combustion.png', base: { m: 400, c: 0, d: 600 }, factor: 2.0 },
{ img: 'impulse.png', base: { m: 2000, c: 4000, d: 600 }, factor: 2.0 },
{ img: 'hyperdrive.png', base: { m: 10000, c: 20000, d: 6000 }, factor: 2.0 },
{ img: 'laser.png', base: { m: 200, c: 100, d: 0 }, factor: 2.0 },
{ img: 'ion.png', base: { m: 1000, c: 300, d: 100 }, factor: 2.0 },
{ img: 'plasma.png', base: { m: 2000, c: 4000, d: 1000 }, factor: 2.0 },
{ img: 'irn.png', base: { m: 240000, c: 400000, d: 160000 }, factor: 2.0 },
{ img: 'astro.png', base: { m: 4000, c: 8000, d: 4000 }, factor: 1.75 },
{ img: 'graviton.png', base: { m: 0, c: 0, d: 0 }, factor: 3.0 }
];
const SHIPS = [
{ id: 'small_cargo', metal: 2000, crystal: 2000, deut: 0, img: 'maly_transport.png' },
{ id: 'large_cargo', metal: 6000, crystal: 6000, deut: 0, img: 'bolshoy_transport.png' },
{ id: 'light_fighter', metal: 3000, crystal: 1000, deut: 0, img: 'legkiy_istrebitel.png' },
{ id: 'heavy_fighter', metal: 6000, crystal: 4000, deut: 0, img: 'tyazhely_istrebitel.png' },
{ id: 'cruiser', metal: 20000, crystal: 7000, deut: 2000, img: 'kreiser.png' },
{ id: 'battleship', metal: 45000, crystal: 15000, deut: 0, img: 'linkor.png' },
{ id: 'recycler', metal: 10000, crystal: 6000, deut: 2000, img: 'recycler.png' },
{ id: 'bomber', metal: 50000, crystal: 25000, deut: 15000, img: 'bombardirovshik.png' },
{ id: 'destroyer', metal: 60000, crystal: 50000, deut: 15000, img: 'unichtozhitel.png' },
{ id: 'battlecruiser', metal: 30000, crystal: 40000, deut: 15000, img: 'battlecruiser.png' },
{ id: 'death_star', metal: 5000000, crystal: 4000000, deut: 1000000, img: 'death_star.png' },
{ id: 'reaper', metal: 85000, crystal: 55000, deut: 20000, img: 'reaper.png' },
{ id: 'pathfinder', metal: 8000, crystal: 15000, deut: 8000, img: 'pathfinder.png' }
];
const SHIP_MAP = Object.fromEntries(SHIPS.map((s) => [s.id, s]));
const TRANSPORT_DEFAULTS = { small_cargo: 5000, large_cargo: 25000 };
const LF_TECH_COSTS = {
1001:[7,2,0,0,40,1.2,1.2,0,0,1.21],1002:[5,2,0,8,40,1.23,1.23,0,1.02,1.25],
1003:[20000,25000,10000,10,16000,1.3,1.3,1.3,1.08,1.25],1004:[5000,3200,1500,15,16000,1.7,1.7,1.7,1.25,1.6],
1005:[50000,40000,50000,30,64000,1.7,1.7,1.7,1.25,1.7],1006:[9000,6000,3000,40,2000,1.5,1.5,1.5,1.1,1.3],
1007:[25000,13000,7000,0,12000,1.09,1.09,1.09,0,1.17],1008:[50000,25000,15000,80,28000,1.5,1.5,1.5,1.1,1.2],
1009:[75000,20000,25000,50,40000,1.09,1.09,1.09,1.02,1.2],1010:[150000,30000,15000,60,52000,1.12,1.12,1.12,1.03,1.2],
1011:[80000,35000,60000,90,90000,1.5,1.5,1.5,1.05,1.3],1012:[250000,125000,125000,100,95000,1.15,1.15,1.15,1.02,1.2],
1101:[5000,2500,500,0,1000,1.3,1.3,1.3,0,1.2],1102:[7000,10000,5000,0,2000,1.5,1.5,1.5,0,1.3],
1103:[15000,10000,5000,0,2500,1.3,1.3,1.3,0,1.3],1104:[20000,15000,7500,0,3500,1.3,1.3,1.3,0,1.3],
1105:[25000,20000,10000,0,4140,1.3,1.3,1.3,0,1.2],1106:[35000,25000,15000,0,5000,1.5,1.5,1.5,0,1.3],
1107:[70000,40000,20000,0,8000,1.3,1.3,1.3,0,1.3],1108:[80000,50000,20000,0,6000,1.5,1.5,1.5,0,1.3],
1109:[320000,240000,100000,0,6500,1.5,1.5,1.5,0,1.4],1110:[320000,240000,100000,0,7000,1.5,1.5,1.5,0,1.4],
1111:[120000,30000,25000,0,7500,1.5,1.5,1.5,0,1.3],1112:[100000,40000,30000,0,10000,1.3,1.3,1.3,0,1.3],
1113:[200000,100000,100000,0,8500,1.3,1.3,1.3,0,1.3],1114:[160000,120000,50000,0,9000,1.5,1.5,1.5,0,1.4],
1115:[160000,120000,50000,0,9500,1.5,1.5,1.5,0,1.4],1116:[320000,240000,100000,0,10000,1.5,1.5,1.5,0,1.4],
1117:[300000,180000,120000,0,11000,1.5,1.5,1.5,0,1.3],1118:[500000,300000,200000,0,13000,1.3,1.3,1.3,0,1.3],
2001:[9,3,0,0,40,1.2,1.2,0,0,1.21],2002:[7,2,0,10,40,1.2,1.2,0,1.03,1.21],
2003:[40000,10000,15000,15,16000,1.3,1.3,1.3,1.1,1.25],2004:[5000,3800,1000,20,16000,1.7,1.7,1.7,1.35,1.6],
2005:[50000,40000,50000,60,64000,1.65,1.65,1.65,1.3,1.7],2006:[10000,8000,1000,40,2000,1.4,1.4,1.4,1.1,1.3],
2007:[20000,15000,10000,0,16000,1.2,1.2,1.2,0,1.25],2008:[50000,35000,15000,80,40000,1.5,1.5,1.5,1.3,1.4],
2009:[85000,44000,25000,90,40000,1.4,1.4,1.4,1.1,1.2],2010:[120000,50000,20000,90,52000,1.4,1.4,1.4,1.1,1.2],
2011:[250000,150000,100000,120,90000,1.8,1.8,1.8,1.3,1.3],2012:[250000,125000,125000,100,95000,1.5,1.5,1.5,1.1,1.3],
2101:[10000,6000,1000,0,1000,1.5,1.5,1.5,0,1.3],2102:[7500,12500,5000,0,2000,1.5,1.5,1.5,0,1.3],
2103:[15000,10000,5000,0,2500,1.5,1.5,1.5,0,1.3],2104:[20000,15000,7500,0,3500,1.3,1.3,1.3,0,1.4],
2105:[25000,20000,10000,0,4500,1.5,1.5,1.5,0,1.3],2106:[50000,50000,20000,0,5000,1.5,1.5,1.5,0,1.3],
2107:[70000,40000,20000,0,5500,1.5,1.5,1.5,0,1.3],2108:[160000,120000,50000,0,6000,1.5,1.5,1.5,0,1.4],
2109:[75000,55000,25000,0,6500,1.5,1.5,1.5,0,1.3],2110:[85000,40000,35000,0,7000,1.5,1.5,1.5,0,1.3],
2111:[120000,30000,25000,0,7500,1.5,1.5,1.5,0,1.3],2112:[100000,40000,30000,0,8000,1.5,1.5,1.5,0,1.3],
2113:[200000,100000,100000,0,8500,1.2,1.2,1.2,0,1.3],2114:[220000,110000,110000,0,9000,1.3,1.3,1.3,0,1.3],
2115:[240000,120000,120000,0,9500,1.3,1.3,1.3,0,1.3],2116:[250000,250000,250000,0,10000,1.4,1.4,1.4,0,1.4],
2117:[500000,300000,200000,0,13000,1.5,1.5,1.5,0,1.3],2118:[300000,180000,120000,0,11000,1.7,1.7,1.7,0,1.4],
3001:[6,2,0,0,40,1.21,1.21,0,0,1.22],3002:[5,2,0,8,48,1.18,1.18,0,1.02,1.2],
3003:[30000,20000,10000,13,16000,1.3,1.3,1.3,1.08,1.25],3004:[5000,3800,1000,10,16000,1.8,1.8,1.8,1.2,1.6],
3005:[50000,40000,50000,40,64000,1.8,1.8,1.8,1.2,1.7],3006:[7500,7000,1000,0,2000,1.3,1.3,1.3,0,1.3],
3007:[35000,15000,10000,40,16000,1.5,1.5,1.5,1.05,1.4],3008:[50000,20000,30000,40,12000,1.07,1.07,1.07,1.01,1.17],
3009:[100000,10000,3000,80,40000,1.14,1.14,1.14,1.04,1.3],3010:[100000,40000,20000,60,52000,1.5,1.5,1.5,1.1,1.2],
3011:[55000,50000,30000,70,50000,1.5,1.5,1.5,1.05,1.3],3012:[250000,125000,125000,100,95000,1.4,1.4,1.4,1.05,1.4],
3101:[10000,6000,1000,0,1000,1.5,1.5,1.5,0,1.3],3102:[7500,12500,5000,0,2000,1.3,1.3,1.3,0,1.3],
3103:[15000,10000,5000,0,2500,1.5,1.5,1.5,0,1.4],3104:[20000,15000,7500,0,3500,1.3,1.3,1.3,0,1.3],
3105:[160000,120000,50000,0,4500,1.5,1.5,1.5,0,1.4],3106:[50000,50000,20000,0,5000,1.5,1.5,1.5,0,1.3],
3107:[70000,40000,20000,0,5500,1.3,1.3,1.3,0,1.3],3108:[160000,120000,50000,0,6000,1.5,1.5,1.5,0,1.4],
3109:[160000,120000,50000,0,6500,1.5,1.5,1.5,0,1.4],3110:[85000,40000,35000,0,7000,1.2,1.2,1.2,0,1.3],
3111:[120000,30000,25000,0,7500,1.3,1.3,1.3,0,1.3],3112:[160000,120000,50000,0,8000,1.5,1.5,1.5,0,1.4],
3113:[200000,100000,100000,0,8500,1.5,1.5,1.5,0,1.3],3114:[160000,120000,50000,0,9000,1.5,1.5,1.5,0,1.4],
3115:[320000,240000,100000,0,9500,1.5,1.5,1.5,0,1.4],3116:[320000,240000,100000,0,10000,1.5,1.5,1.5,0,1.4],
3117:[500000,300000,200000,0,13000,1.5,1.5,1.5,0,1.3],3118:[300000,180000,120000,0,11000,1.7,1.7,1.7,0,1.4],
4001:[4,3,0,0,40,1.21,1.21,0,0,1.22],4002:[6,3,0,9,40,1.2,1.2,0,1.02,1.22],
4003:[20000,15000,15000,10,16000,1.3,1.3,1.3,1.08,1.25],4004:[7500,5000,800,15,16000,1.8,1.8,1.8,1.3,1.7],
4005:[60000,30000,50000,30,64000,1.8,1.8,1.8,1.3,1.8],4006:[8500,5000,3000,0,2000,1.25,1.25,1.25,0,1.35],
4007:[15000,15000,5000,0,12000,1.2,1.2,1.2,0,1.2],4008:[75000,25000,30000,30,16000,1.05,1.05,1.05,1.03,1.18],
4009:[87500,25000,30000,40,40000,1.2,1.2,1.2,1.02,1.2],4010:[150000,30000,30000,140,52000,1.4,1.4,1.4,1.05,1.8],
4011:[75000,50000,55000,90,90000,1.2,1.2,1.2,1.04,1.3],4012:[500000,250000,250000,100,95000,1.4,1.4,1.4,1.05,1.3],
4101:[10000,6000,1000,0,1000,1.5,1.5,1.5,0,1.4],4102:[7500,12500,5000,0,2000,1.5,1.5,1.5,0,1.3],
4103:[15000,10000,5000,0,2500,1.5,1.5,1.5,0,1.4],4104:[20000,15000,7500,0,3500,1.5,1.5,1.5,0,1.4],
4105:[25000,20000,10000,0,4500,1.5,1.5,1.5,0,1.4],4106:[50000,50000,20000,0,5000,1.3,1.3,1.3,0,1.4],
4107:[70000,40000,20000,0,5500,1.5,1.5,1.5,0,1.3],4108:[80000,50000,20000,0,6000,1.2,1.2,1.2,0,1.2],
4109:[320000,240000,100000,0,6500,1.5,1.5,1.5,0,1.4],4110:[85000,40000,35000,0,7000,1.2,1.2,1.2,0,1.2],
4111:[120000,30000,25000,0,7500,1.5,1.5,1.5,0,1.4],4112:[100000,40000,30000,0,8000,1.5,1.5,1.5,0,1.3],
4113:[200000,100000,100000,0,8500,1.5,1.5,1.5,0,1.3],4114:[160000,120000,50000,0,9000,1.5,1.5,1.5,0,1.4],
4115:[240000,120000,120000,0,9500,1.5,1.5,1.5,0,1.4],4116:[320000,240000,100000,0,10000,1.5,1.5,1.5,0,1.4],
4117:[500000,300000,200000,0,13000,1.5,1.5,1.5,0,1.3],4118:[300000,180000,120000,0,11000,1.7,1.7,1.7,0,1.4]
};
const LF_BUILDING_FILENAMES = {
1001:'residential_sector.png',1002:'biosphere_farm.png',1003:'research_center.png',
1004:'science_academy.png',1005:'nerve_calibration_center.png',1006:'high_energy_melting.png',
1007:'food_storage.png',1008:'fusion_powered_production.png',1009:'skyscraper.png',
1010:'biotech_lab.png',1011:'metropolis.png',1012:'planetary_shield.png',
2001:'meditation_enclave.png',2002:'crystal_farm.png',2003:'rune_technologium.png',
2004:'rune_forge.png',2005:'orikterium.png',2006:'magma_forge.png',
2007:'chamber_of_rupture.png',2008:'megalith.png',2009:'crystal_purification.png',
2010:'deuterium_synthesizer.png',2011:'mineral_research_center.png',2012:'advanced_recycling_unit.png',
3001:'assembly_line.png',3002:'fusion_cell_factory.png',3003:'robotics_research_center.png',
3004:'upgrade_network.png',3005:'quantum_computer_center.png',3006:'automated_assembly_center.png',
3007:'high_performance_transformer.png',3008:'microchip_line.png',3009:'production_assembly_workshop.png',
3010:'high_performance_synthesizer.png',3011:'mass_chip_production.png',3012:'repair_nanobots.png',
4001:'sanctuary.png',4002:'antimatter_condenser.png',4003:'cyclone_chamber.png',
4004:'hall_of_realization.png',4005:'transcendental_forum.png',4006:'antimatter_converter.png',
4007:'cloning_lab.png',4008:'chrysalis_accelerator.png',4009:'biomodifier.png',
4010:'psionic_modulator.png',4011:'ship_production_hall.png',4012:'supra_refractor.png'
};
const LF_RESEARCH_FILENAMES = {
1101:'intergalactic_envoys.png',1102:'high_efficiency_extractors.png',1103:'fusion_drives.png',
1104:'stealth_field_generator.png',1105:'orbital_dock.png',1106:'research_ai.png',
1107:'high_performance_terraformer.png',1108:'enhanced_extraction_technologies.png',1109:'light_fighter_mk_ii.png',
1110:'cruiser_mk_ii.png',1111:'enhanced_laboratory_technology.png',1112:'plasma_terraformer.png',
1113:'low_temperature_drives.png',1114:'bomber_mk_ii.png',1115:'destroyer_mk_ii.png',
1116:'battlecruiser_mk_ii.png',1117:'assistant_robots.png',1118:'supercomputer.png',
2101:'volcanic_batteries.png',2102:'acoustic_scanning.png',2103:'high_energy_supply_systems.png',
2104:'cargo_hold_expansion.png',2105:'magma_powered_production.png',2106:'geothermal_power_plants.png',
2107:'echo_sounding.png',2108:'ion_crystal_enhancement.png',2109:'enhanced_stellarator.png',
2110:'reinforced_diamond_drills.png',2111:'seismic_extraction_technology.png',2112:'magma_powered_supply_systems.png',
2113:'ionized_crystal_modules.png',2114:'optimized_mine_construction.png',2115:'diamond_energy_transmitter.png',
2116:'obsidian_shield_plating.png',2117:'rune_shields.png',2118:'rocktal_collector_enhancement.png',
3101:'catalyst_technology.png',3102:'plasma_drive.png',3103:'efficiency_module.png',
3104:'warehouse_ai.png',3105:'general_repair_light_fighter.png',3106:'automated_transport_lines.png',
3107:'enhanced_drone_ai.png',3108:'experimental_recycling_technology.png',3109:'general_repair_cruiser.png',
3110:'gravitational_maneuver_autopilot.png',3111:'high_temperature_superconductors.png',3112:'general_repair_battleship.png',
3113:'swarm_ai.png',3114:'general_repair_battlecruiser.png',3115:'general_repair_bomber.png',
3116:'general_repair_destroyer.png',3117:'experimental_weapon_technology.png',3118:'mechas_overall_enhancement.png',
4101:'waste_heat_recovery.png',4102:'sulfide_process.png',4103:'psionic_network.png',
4104:'telekinetic_grab_beam.png',4105:'enhanced_sensor_technology.png',4106:'neuromodal_compressor.png',
4107:'neuro_interface.png',4108:'interplanetary_analytical_network.png',4109:'speed_boost_heavy_fighter.png',
4110:'telekinetic_drive.png',4111:'sixth_sense.png',4112:'psycho_harmonizer.png',
4113:'efficient_swarm_intelligence.png',4114:'speed_boost_large_cargo.png',4115:'gravitational_sensors.png',
4116:'speed_boost_battleship.png',4117:'psionic_shield_matrix.png',4118:'kaelesh_explorer_enhancement.png'
};
const RACES = ['humans', 'rocktal', 'mechas', 'kaelesh'];
const RACE_PREFIX = { humans: '1', rocktal: '2', mechas: '3', kaelesh: '4' };
const BONUS_INPUT_IDS = ['megalithLevel', 'mrcLevel', 'runoLevel', 'humansLevel', 'mechasLevel', 'kaeleshLevel'];
const DEFAULT_SETTINGS = {
tmPerBox: 42000,
tmPackSize: 12500000,
packPriceTRY: 900,
rates: { ...CONFIG.CURRENCY_RATES }
};
const MAX_CALC_VALUE = Number.MAX_SAFE_INTEGER;
const clampCalc = (value) => {
if (!Number.isFinite(value)) return MAX_CALC_VALUE;
const rounded = Math.round(value);
if (rounded < 0) return 0;
return rounded > MAX_CALC_VALUE ? MAX_CALC_VALUE : rounded;
};
const addCapped = (a, b) => {
const sum = a + b;
if (!Number.isFinite(sum) || sum > MAX_CALC_VALUE) return MAX_CALC_VALUE;
return sum;
};
const emptyTotals = () => ({ m: 0, c: 0, d: 0, p: 0, total: 0 });
const emptyRaceTotals = () => ({ buildings: emptyTotals(), research: emptyTotals() });
const freshLfTotals = () => Object.fromEntries(RACES.map((r) => [r, emptyRaceTotals()]));
let lfTotals = freshLfTotals();
const TOTALS = {
buildings: emptyTotals(),
moonBuildings: emptyTotals(),
research: emptyTotals(),
fleet: emptyTotals()
};
let fleetInputs = [];
let fleetSummaryCells = {};
let fleetTableBuilt = false;
let cachedAggrRows = null;
let isSumAllTabsMode = false;
let currentLifeformRace = 'humans';
let batchRecalc = false;
let pendingGlobalUpdate = false;
let inputsHandlersAttached = false;
let currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
let researchDiscounts = loadResearchDiscounts();
let transportCapacities = loadTransportCapacities();
function $(id) {
return document.getElementById(id);
}
function safeGet(key, def) {
try {
const v = localStorage.getItem(key);
return v !== null ? v : def;
} catch (e) { return def; }
}
function safeSet(key, value) {
try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
}
function safeRemove(key) {
try { localStorage.removeItem(key); } catch (e) {}
}
function safeJsonParse(value, fallback) {
try {
const parsed = JSON.parse(value);
return parsed === null ? fallback : parsed;
} catch (e) { return fallback; }
}
function migrateKey(oldKey, newKey) {
try {
if (localStorage.getItem(newKey) === null && localStorage.getItem(oldKey) !== null) {
localStorage.setItem(newKey, localStorage.getItem(oldKey));
localStorage.removeItem(oldKey);
}
} catch (e) {}
}
const normalizeRace = (race) => (RACES.includes(race) ? race : 'humans');
const sanitizeInput = (v) => (!v ? '' : String(v).replace(/[^0-9]/g, '').slice(0, 15));
function formatWithDotsRaw(input) {
const digits = String(input ?? '').replace(/[^0-9]/g, '');
return digits ? Number(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}
function formatNumberWithDots(n) {
if (n === null || n === undefined || Number.isNaN(n)) return '0';
const value = Math.round(Number(n) || 0);
if (!Number.isFinite(value)) return '∞';
const abs = Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
return value < 0 ? '-' + abs : abs;
}
function parseNumberInput(s) {
if (s === null || s === undefined) return 0;
const str = String(s).trim();
if (str === '' || str === '-') return 0;
const num = Number(str.replace(/[^0-9]/g, '')) || 0;
if (!Number.isFinite(num)) return 0;
return Math.min(num, Number.MAX_SAFE_INTEGER);
}
function parseInputValue(el) {
if (!el) return 0;
const clean = String(el.value).replace(/[^0-9]/g, '').slice(0, 15);
return Math.min(Number(clean) || 0, Number.MAX_SAFE_INTEGER);
}
function parseSettingsNumber(v, fallback = 0) {
if (v === null || v === undefined || v === '') return fallback;
const str = String(v).trim();
if (str === '') return fallback;
const hasComma = str.includes(',');
const hasDot = str.includes('.');
let cleaned;
if (hasComma && hasDot) {
cleaned = str.lastIndexOf(',') > str.lastIndexOf('.')
? str.replace(/\./g, '').replace(',', '.')
: str.replace(/,/g, '');
} else if (hasComma) {
cleaned = str.replace(/,/g, '.');
} else if (hasDot) {
const dotCount = (str.match(/\./g) || []).length;
if (dotCount > 1) {
cleaned = str.replace(/\./g, '');
} else {
const afterDot = str.slice(str.indexOf('.') + 1);
cleaned = (afterDot.length >= 3 && /^\d+$/.test(afterDot)) ? str.replace(/\./g, '') : str;
}
} else {
cleaned = str;
}
const n = parseFloat(cleaned);
return Number.isFinite(n) && n > 0 ? n : fallback;
}
const convertToMetal = (m, c, d) => (m || 0) + (c || 0) * CONFIG.METAL_EQ_CRYSTAL + (d || 0) * CONFIG.METAL_EQ_DEUT;
function debounce(fn, wait) {
let t = null;
return function (...args) {
clearTimeout(t);
t = setTimeout(() => fn.apply(this, args), wait);
};
}
const currentLang = () => {
const saved = safeGet(KEYS.LANG, 'ru');
return LANGUAGES[saved] ? saved : 'ru';
};
const getDict = () => (window.getLangDict ? window.getLangDict(currentLang()) : {});
function normalizeLocalizedText(value) {
if (window.normalizeLangText) return window.normalizeLangText(value);
return String(value ?? '')
.replace(/\u00A0/g, ' ')
.replace(/\s+/g, ' ')
.replace(/\s+([,.:;!?%])/g, '$1')
.trim();
}
function setTextPreservingChildren(el, text) {
let textNode = null;
el.childNodes.forEach((node) => {
if (!textNode && node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) textNode = node;
});
if (textNode) {
textNode.textContent = text;
} else {
const newNode = document.createTextNode(text);
if (el.firstChild) el.insertBefore(newNode, el.firstChild);
else el.appendChild(newNode);
}
el.normalize();
}
function applyI18nAttributes() {
const dict = getDict();
document.querySelectorAll('[data-i18n]').forEach((el) => {
const key = el.getAttribute('data-i18n');
if (dict[key]) setTextPreservingChildren(el, normalizeLocalizedText(dict[key]));
});
document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
const key = el.getAttribute('data-i18n-ph');
if (dict[key]) el.setAttribute('placeholder', normalizeLocalizedText(dict[key]));
});
document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
const key = el.getAttribute('data-i18n-aria');
if (dict[key]) el.setAttribute('aria-label', normalizeLocalizedText(dict[key]));
});
}
function auditI18nKeys() {
try {
if (safeGet('og_calc_debug_i18n', '0') !== '1') return;
const dict = getDict();
const lang = currentLang();
const required = new Set();
document.querySelectorAll('[data-i18n],[data-i18n-ph],[data-i18n-aria]').forEach((el) => {
['data-i18n', 'data-i18n-ph', 'data-i18n-aria'].forEach((attr) => {
const key = el.getAttribute(attr);
if (key) required.add(key);
});
});
const missing = [...required].filter((key) => !(key in dict));
if (missing.length) console.warn(`[i18n] Missing keys for language "${lang}"`, missing);
else console.info(`[i18n] No missing data-i18n keys for language "${lang}"`);
} catch (e) {
console.warn('i18n audit failed', e);
}
}
function resSpan(cls, n) {
const s = document.createElement('span');
s.className = cls;
s.textContent = formatNumberWithDots(n);
return s;
}
function makeIcon(src, alt, size = 20) {
const img = document.createElement('img');
img.src = src;
img.alt = alt;
img.className = 'icon';
img.width = size;
img.height = size;
img.loading = 'lazy';
img.style.cssText = `width:${size}px;height:${size}px;vertical-align:middle;border-radius:4px;`;
img.addEventListener('error', function handler() {
img.removeEventListener('error', handler);
const fb = document.createElement('span');
fb.className = 'icon-fallback';
fb.setAttribute('aria-hidden', 'true');
fb.textContent = alt ? alt[0] : '—';
img.style.display = 'none';
if (img.parentNode) img.parentNode.insertBefore(fb, img.nextSibling);
}, { once: true });
return img;
}
window.makeIcon = makeIcon;
function updateResourceCell(td, value) {
if (!td) return;
const formatted = formatNumberWithDots(value);
if (td._lastValue === formatted) return;
td._lastValue = formatted;
if (!td._span) {
td._span = td.querySelector('span');
if (!td._span) {
td._span = document.createElement('span');
td.appendChild(td._span);
}
}
td._span.textContent = formatted;
}
class LimitedCache {
constructor(maxSize = 2000) {
this.cache = new Map();
this.maxSize = maxSize;
}
get(key) {
if (!this.cache.has(key)) return undefined;
const v = this.cache.get(key);
this.cache.delete(key);
this.cache.set(key, v);
return v;
}
set(key, value) {
if (this.cache.has(key)) {
this.cache.delete(key);
} else if (this.cache.size >= this.maxSize) {
this.cache.delete(this.cache.keys().next().value);
}
this.cache.set(key, value);
}
clear() { this.cache.clear(); }
}
const calcCache = new LimitedCache(2000);
function cached(key, fn) {
const hit = calcCache.get(key);
if (hit !== undefined) return hit;
const result = fn();
calcCache.set(key, result);
return result;
}
function geomSum(base, factor, from, to) {
return cached(`geom_${base.m}_${base.c}_${base.d}_${factor}_${from}_${to}`, () => {
const count = Math.max(0, to - from);
if (count <= 0) return { m: 0, c: 0, d: 0, points: 0, levels: 0 };
const start = Math.max(0, from);
const sum = (b) => {
if (!b) return 0;
if (factor === 1) return clampCalc(b * count);
if (factor <= 0) return 0;
const value = b * Math.pow(factor, start) * (Math.pow(factor, count) - 1) / (factor - 1);
return clampCalc(value);
};
const m = sum(base.m);
const c = sum(base.c);
const d = sum(base.d);
return { m, c, d, points: clampCalc((m + c + d) / 1000), levels: count };
});
}
function calcBuildCostLF(techId, level, rdc) {
return cached(`build_${techId}_${level}_${rdc}`, () => {
const d = LF_TECH_COSTS[techId];
if (!d || level < 1) return [0, 0, 0];
const k = Math.min(0.99, rdc);
return [0, 1, 2].map((i) => {
const raw = d[i] * level * Math.pow(d[5 + i], level - 1);
const baseCost = Number.isFinite(raw) ? Math.floor(raw) : MAX_CALC_VALUE;
const discounted = Math.floor((1 - k) * baseCost);
if (!Number.isFinite(discounted) || discounted > MAX_CALC_VALUE) return MAX_CALC_VALUE;
return discounted < 0 ? 0 : discounted;
});
});
}
function getBuildCostLF(techId, from, to, rsrRdc, bldRdc = 0) {
return cached(`range_${techId}_${from}_${to}_${rsrRdc}_${bldRdc}`, () => {
const total = [0, 0, 0];
const rdc = techId % 1000 < 100 ? bldRdc : rsrRdc;
for (let lvl = from + 1; lvl <= to; lvl++) {
const c = calcBuildCostLF(techId, lvl, rdc);
for (let i = 0; i < 3; i++) {
total[i] = addCapped(total[i], c[i]);
}
}
return total;
});
}
function loadResearchDiscounts() {
const data = safeJsonParse(safeGet(KEYS.RESEARCH_DISCOUNTS, '{}'), {});
return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}
function saveResearchDiscounts() {
safeSet(KEYS.RESEARCH_DISCOUNTS, JSON.stringify(researchDiscounts));
}
function loadTransportCapacities() {
const data = safeJsonParse(safeGet(KEYS.TRANSPORT_CAPACITY, 'null'), null);
return {
small_cargo: (data && data.small_cargo > 0) ? data.small_cargo : TRANSPORT_DEFAULTS.small_cargo,
large_cargo: (data && data.large_cargo > 0) ? data.large_cargo : TRANSPORT_DEFAULTS.large_cargo
};
}
function saveTransportCapacities() {
safeSet(KEYS.TRANSPORT_CAPACITY, JSON.stringify(transportCapacities));
}
function sanitizeDiscountInput(value) {
let s = String(value ?? '').trim().replace(',', '.');
s = s.replace(/[^0-9.]/g, '');
const dot = s.indexOf('.');
if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
if (s.startsWith('.')) s = '0' + s;
s = s.replace(/^0+(?=\d)/, '');
return s;
}
function getResearchDiscountPct(idx) {
const raw = Number(researchDiscounts[idx]);
if (!Number.isFinite(raw) || raw <= 0) return 0;
return Math.min(99, raw);
}
function getResearchDiscountLabel(idx) {
const pct = getResearchDiscountPct(idx);
if (pct <= 0) return '';
const label = sanitizeDiscountInput(researchDiscounts[idx]);
return parseFloat(label) === pct ? label : String(pct);
}
function formatDiscountChip(label) {
const dot = label.indexOf('.');
return dot === -1 ? label : label.slice(0, dot + 3);
}
function createTableRow({ index, techId, name, iconPath, dataset, showPlanets, planetsType }) {
const tr = document.createElement('tr');
tr.dataset.index = index;
if (techId !== undefined) tr.dataset.techId = techId;
if (dataset) Object.entries(dataset).forEach(([k, v]) => { tr.dataset[k] = v; });
const refs = {};
const tdName = document.createElement('td');
tdName.className = 'name-cell';
refs.icon = makeIcon(iconPath, name, 20);
refs.nameText = document.createTextNode(name);
tdName.appendChild(refs.icon);
tdName.appendChild(refs.nameText);
tr.appendChild(tdName);
const tdFrom = document.createElement('td');
refs.from = document.createElement('input');
refs.from.type = 'text';
refs.from.className = 'lvl-input';
refs.from.dataset.type = 'from';
refs.from.dataset.index = index;
tdFrom.appendChild(refs.from);
tr.appendChild(tdFrom);
const tdTo = document.createElement('td');
refs.to = document.createElement('input');
refs.to.type = 'text';
refs.to.className = 'lvl-input';
refs.to.dataset.type = 'to';
refs.to.dataset.index = index;
tdTo.appendChild(refs.to);
tr.appendChild(tdTo);
if (showPlanets) {
const td = document.createElement('td');
const planetImg = document.createElement('img');
planetImg.src = IMG.root + 'planet.png';
planetImg.className = 'icon';
planetImg.alt = '';
refs.planets = document.createElement('input');
refs.planets.type = 'text';
refs.planets.className = 'planet-input';
refs.planets.dataset.type = planetsType;
refs.planets.dataset.index = index;
refs.planets.value = '1';
td.append(planetImg, refs.planets);
tr.appendChild(td);
}
refs.m = document.createElement('td');
refs.m.className = 'm';
refs.m.appendChild(resSpan('val-metal', 0));
refs.c = document.createElement('td');
refs.c.className = 'c';
refs.c.appendChild(resSpan('val-crystal', 0));
refs.d = document.createElement('td');
refs.d.className = 'd';
refs.d.appendChild(resSpan('val-deut', 0));
refs.p = document.createElement('td');
refs.p.className = 'p';
refs.p.textContent = '0';
tr.append(refs.m, refs.c, refs.d, refs.p);
tr._refs = refs;
return tr;
}
function createTransportNeededRow(shipId, dict, cols, source) {
const tr = document.createElement('tr');
tr.className = 'transport-needed-row';
tr.dataset.transport = shipId;
tr.dataset.source = source;
const ship = SHIP_MAP[shipId];
const name = normalizeLocalizedText(dict['ship_' + shipId] || shipId);
const tdName = document.createElement('td');
tdName.className = 'name-cell transport-name-cell';
const icon = makeIcon(IMG.ships + ship.img, name, 20);
icon.classList.add('transport-icon');
icon.setAttribute('role', 'button');
icon.setAttribute('tabindex', '0');
const nameSpan = document.createElement('span');
nameSpan.className = 'ship-name';
nameSpan.textContent = name;
const chip = document.createElement('span');
chip.className = 'disc-chip transport-capacity-chip';
chip.textContent = formatNumberWithDots(transportCapacities[shipId] || TRANSPORT_DEFAULTS[shipId] || 0);
chip.title = normalizeLocalizedText(dict.transportCapacityLabel || 'Грузоподъёмность');
tdName.append(icon, nameSpan, chip);
const tdCount = document.createElement('td');
tdCount.className = 'transport-count';
tdCount.colSpan = 2;
const countChip = document.createElement('span');
countChip.className = 'transport-count-chip';
countChip.textContent = '0';
tdCount.appendChild(countChip);
const tdEmpty = document.createElement('td');
tdEmpty.colSpan = Math.max(1, cols - 3);
tr.append(tdName, tdCount, tdEmpty);
tr._transportRefs = { icon, chip, count: countChip, nameSpan };
const openEditor = (e) => {
e.stopPropagation();
openTransportCapacityEditor(tr, shipId);
};
icon.addEventListener('click', openEditor);
icon.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEditor(e); }
});
chip.addEventListener('click', openEditor);
return tr;
}
function insertTransportRowsAfterTotal(totalSpanId, dict, cols, source) {
document.querySelectorAll('.transport-needed-row[data-source="' + source + '"]').forEach((r) => r.remove());
const totalSpan = $(totalSpanId);
const totalRow = totalSpan ? totalSpan.closest('tr') : null;
if (!totalRow || !totalRow.parentNode) return;
const table = totalRow.closest('table');
let actualCols = cols;
if (table) {
const headRow = table.tHead && table.tHead.rows[0];
if (headRow) {
actualCols = Array.from(headRow.cells).reduce((n, c) => n + (c.colSpan || 1), 0);
}
}
const parent = totalRow.parentNode;
parent.appendChild(createTransportNeededRow('large_cargo', dict, actualCols, source));
parent.appendChild(createTransportNeededRow('small_cargo', dict, actualCols, source));
}
function openTransportCapacityEditor(tr, shipId) {
if (!tr || tr._transportEditor) return;
const refs = tr._transportRefs;
if (!refs) return;
const td = tr.children[0];
const editor = document.createElement('span');
editor.className = 'disc-editor';
const input = document.createElement('input');
input.type = 'text';
input.className = 'disc-input transport-cap-input';
input.placeholder = formatNumberWithDots(TRANSPORT_DEFAULTS[shipId]);
input.maxLength = 15;
input.value = transportCapacities[shipId] > 0 ? String(transportCapacities[shipId]) : '';
const ok = document.createElement('button');
ok.type = 'button';
ok.className = 'disc-ok';
ok.textContent = '✓';
editor.append(input, ok);
td.appendChild(editor);
refs.chip.style.visibility = 'hidden';
tr._transportEditor = editor;
input.focus();
input.select();
let closed = false;
const close = () => {
if (closed) return;
closed = true;
editor.remove();
tr._transportEditor = null;
refs.chip.style.visibility = '';
};
const commit = () => {
if (closed) return;
const cleaned = sanitizeInput(input.value);
const value = parseNumberInput(cleaned);
transportCapacities[shipId] = value > 0 ? value : TRANSPORT_DEFAULTS[shipId];
saveTransportCapacities();
close();
scheduleGlobalUpdate();
};
input.addEventListener('input', () => {
input.value = sanitizeInput(input.value);
});
input.addEventListener('keydown', (e) => {
if (e.key === 'Enter') commit();
else if (e.key === 'Escape') close();
});
ok.addEventListener('click', commit);
editor.addEventListener('focusout', (e) => {
if (closed) return;
if (!editor.contains(e.relatedTarget)) commit();
});
}
function getTransportSourceTotals(source) {
if (isSumAllTabsMode) {
let m = 0, c = 0, d = 0;
[TOTALS.buildings, TOTALS.moonBuildings, TOTALS.research, TOTALS.fleet].forEach((t) => {
m = addCapped(m, t.m);
c = addCapped(c, t.c);
d = addCapped(d, t.d);
});
Object.values(lfTotals).forEach((race) => {
['buildings', 'research'].forEach((kind) => {
const t = race[kind];
if (!t) return;
m = addCapped(m, t.m || 0);
c = addCapped(c, t.c || 0);
d = addCapped(d, t.d || 0);
});
});
return addCapped(addCapped(m, c), d);
}
let t;
if (source === 'lfBuildings') t = lfTotals[currentLifeformRace].buildings;
else if (source === 'lfResearch') t = lfTotals[currentLifeformRace].research;
else t = TOTALS[source] || emptyTotals();
return addCapped(addCapped(t.m, t.c), t.d);
}
function updateTransportNeededRows() {
document.querySelectorAll('.transport-needed-row').forEach((tr) => {
const shipId = tr.dataset.transport;
const refs = tr._transportRefs;
if (!refs || !shipId) return;
const capacity = transportCapacities[shipId] || TRANSPORT_DEFAULTS[shipId] || 0;
if (refs.chip) {
refs.chip.textContent = formatNumberWithDots(capacity);
}
const totalResources = getTransportSourceTotals(tr.dataset.source);
if (refs.count) {
refs.count.textContent = (capacity > 0 && totalResources > 0)
? formatNumberWithDots(Math.ceil(totalResources / capacity))
: '0';
}
});
}
function scheduleGlobalUpdate() {
if (batchRecalc || pendingGlobalUpdate) return;
pendingGlobalUpdate = true;
requestAnimationFrame(() => {
pendingGlobalUpdate = false;
updateBoxesNeeded();
updateSumAllTabsRows();
updateTransportNeededRows();
});
}
function buildRowsBuildings() {
const tbody = $('tbodyBuildings');
if (!tbody) return;
const names = window.getBuildingNames
? window.getBuildingNames(currentLang())
: ((typeof LANG_BUILDINGS !== 'undefined' && (LANG_BUILDINGS[currentLang()] || LANG_BUILDINGS.ru)) || []);
const frag = document.createDocumentFragment();
BUILDING_ORDER.forEach((i) => {
const b = BUILDINGS[i];
frag.appendChild(createTableRow({
index: i,
name: normalizeLocalizedText(names[i] || `Building ${i + 1}`),
iconPath: IMG.buildings + b.img,
showPlanets: true,
planetsType: 'planets'
}));
});
tbody.replaceChildren(frag);
attachLvlInputHandlers();
insertTransportRowsAfterTotal('sumTotalMetalB', getDict(), 8, 'buildings');
}
function buildRowsResearch() {
const tbody = $('tbodyResearch');
if (!tbody) return;
const names = window.getResearchNames
? window.getResearchNames(currentLang())
: ((typeof LANG_RESEARCH !== 'undefined' && (LANG_RESEARCH[currentLang()] || LANG_RESEARCH.ru)) || []);
const dict = getDict();
const hint = normalizeLocalizedText(dict.researchDiscountHint || 'Double-click a row to set a cost discount');
const frag = document.createDocumentFragment();
RESEARCH.forEach((r, i) => {
const tr = createTableRow({
index: i,
name: normalizeLocalizedText(names[i] || `Research ${i + 1}`),
iconPath: IMG.research + r.img,
showPlanets: false
});
const chip = document.createElement('span');
chip.className = 'disc-chip';
chip.dataset.hint = hint;
chip.title = hint;
tr._refs.chip = chip;
tr.children[0].appendChild(chip);
chip.addEventListener('click', (e) => {
e.stopPropagation();
openDiscountEditor(tr, i);
});
tr.addEventListener('dblclick', (e) => {
if (e.target.closest('input,button')) return;
e.preventDefault();
openDiscountEditor(tr, i);
});
frag.appendChild(tr);
});
tbody.replaceChildren(frag);
attachLvlInputHandlers();
insertTransportRowsAfterTotal('sumTotalMetalR', dict, 7, 'research');
}
function openDiscountEditor(tr, idx) {
if (!tr || tr._discEditor) return;
const refs = tr._refs;
if (!refs || !refs.chip) return;
const td = tr.children[0];
const editor = document.createElement('span');
editor.className = 'disc-editor';
const input = document.createElement('input');
input.type = 'text';
input.className = 'disc-input';
input.placeholder = '0';
input.maxLength = 9;
input.value = getResearchDiscountLabel(idx);
const ok = document.createElement('button');
ok.type = 'button';
ok.className = 'disc-ok';
ok.textContent = '✓';
editor.append(input, ok);
td.appendChild(editor);
refs.chip.style.visibility = 'hidden';
tr._discEditor = editor;
input.focus();
input.select();
let closed = false;
const close = () => {
if (closed) return;
closed = true;
editor.remove();
tr._discEditor = null;
refs.chip.style.visibility = '';
};
const commit = () => {
if (closed) return;
const cleaned = sanitizeDiscountInput(input.value);
const raw = parseFloat(cleaned);
const pct = Number.isFinite(raw) ? Math.max(0, Math.min(99, raw)) : 0;
if (pct > 0) researchDiscounts[idx] = raw === pct ? cleaned : String(pct);
else delete researchDiscounts[idx];
saveResearchDiscounts();
close();
recalcAllResearch();
};
input.addEventListener('input', () => {
input.value = sanitizeDiscountInput(input.value);
});
input.addEventListener('keydown', (e) => {
if (e.key === 'Enter') commit();
else if (e.key === 'Escape') close();
});
ok.addEventListener('click', commit);
editor.addEventListener('focusout', (e) => {
if (closed) return;
if (!editor.contains(e.relatedTarget)) commit();
});
}
function buildRowsMoonBuildings() {
const tbody = $('tbodyMoonBuildings');
if (!tbody) return;
const dict = getDict();
const frag = document.createDocumentFragment();
MOON_BUILDINGS.forEach((b, i) => {
frag.appendChild(createTableRow({
index: i,
name: normalizeLocalizedText(dict['moon_' + b.id] || b.name),
iconPath: IMG.buildings + b.img,
dataset: { buildingId: b.id },
showPlanets: true,
planetsType: 'moons'
}));
});
tbody.replaceChildren(frag);
attachLvlInputHandlers();
insertTransportRowsAfterTotal('sumTotalMetalMoon', dict, 8, 'moonBuildings');
}
function buildRowsLfBuildings() {
const tbody = $('tbodyLfBuildings');
if (!tbody) return;
const prefix = RACE_PREFIX[currentLifeformRace] + '0';
const dict = getDict();
const frag = document.createDocumentFragment();
for (let i = 1; i <= 12; i++) {
const techId = Number(prefix + String(i).padStart(2, '0'));
if (!LF_TECH_COSTS[techId]) continue;
frag.appendChild(createTableRow({
index: i - 1,
techId,
name: normalizeLocalizedText(dict['lf_b_' + techId] || `ID ${techId}`),
iconPath: `images/lifeforms/buildings/${currentLifeformRace}/${LF_BUILDING_FILENAMES[techId] || techId + '.png'}`,
showPlanets: true,
planetsType: 'planets'
}));
}
tbody.replaceChildren(frag);
attachLvlInputHandlers();
insertTransportRowsAfterTotal('sumTotalMetalLfB', dict, 8, 'lfBuildings');
}
function buildRowsLfResearch() {
const tbody = $('tbodyLfResearch');
if (!tbody) return;
const prefix = RACE_PREFIX[currentLifeformRace] + '1';
const dict = getDict();
const frag = document.createDocumentFragment();
for (let i = 1; i <= 18; i++) {
const techId = Number(prefix + String(i).padStart(2, '0'));
if (!LF_TECH_COSTS[techId]) continue;
frag.appendChild(createTableRow({
index: i - 1,
techId,
name: normalizeLocalizedText(dict['lf_r_' + techId] || `ID ${techId}`),
iconPath: `images/lifeforms/research/${currentLifeformRace}/${LF_RESEARCH_FILENAMES[techId] || techId + '.png'}`,
showPlanets: true,
planetsType: 'planets'
}));
}
tbody.replaceChildren(frag);
attachLvlInputHandlers();
insertTransportRowsAfterTotal('sumTotalMetalLfR', dict, 8, 'lfResearch');
}
function updateTableRowNames(tbodyId, namesArray) {
const tbody = $(tbodyId);
if (!tbody) return;
tbody.querySelectorAll('tr[data-index]').forEach((tr) => {
const idx = Number(tr.dataset.index);
const refs = tr._refs;
if (refs && refs.nameText && namesArray[idx] !== undefined) {
refs.nameText.textContent = normalizeLocalizedText(namesArray[idx]);
}
});
}
function updateMoonTableNames() {
const dict = getDict();
const tbody = $('tbodyMoonBuildings');
if (!tbody) return;
tbody.querySelectorAll('tr[data-index]').forEach((tr) => {
const idx = Number(tr.dataset.index);
const refs = tr._refs;
if (refs && refs.nameText && MOON_BUILDINGS[idx]) {
const key = 'moon_' + MOON_BUILDINGS[idx].id;
refs.nameText.textContent = normalizeLocalizedText(dict[key] || MOON_BUILDINGS[idx].name);
}
});
}
function updateFleetTableNames() {
const dict = getDict();
document.querySelectorAll('#shipsTable tbody tr[data-row-id]').forEach((tr) => {
const shipId = tr.dataset.rowId;
const refs = tr._refs;
if (refs && refs.nameSpan && dict['ship_' + shipId]) {
refs.nameSpan.textContent = normalizeLocalizedText(dict['ship_' + shipId]);
}
});
}
function updateLfTableNames(tbodyId, dictKey) {
const tbody = $(tbodyId);
if (!tbody) return;
const dict = getDict();
tbody.querySelectorAll('tr[data-tech-id]').forEach((tr) => {
const techId = tr.dataset.techId;
const refs = tr._refs;
if (refs && refs.nameText && dict[dictKey + techId]) {
refs.nameText.textContent = normalizeLocalizedText(dict[dictKey + techId]);
}
});
}
function updateTransportRowNames() {
const dict = getDict();
document.querySelectorAll('.transport-needed-row').forEach((tr) => {
const refs = tr._transportRefs;
const shipId = tr.dataset.transport;
if (refs && refs.nameSpan && dict['ship_' + shipId]) {
refs.nameSpan.textContent = normalizeLocalizedText(dict['ship_' + shipId]);
}
if (refs && refs.chip) {
refs.chip.title = normalizeLocalizedText(dict.transportCapacityLabel || '');
}
});
}
function updateAllTableNamesOnly() {
const buildingNames = window.getBuildingNames
? window.getBuildingNames(currentLang())
: ((typeof LANG_BUILDINGS !== 'undefined' && (LANG_BUILDINGS[currentLang()] || LANG_BUILDINGS.ru)) || []);
const researchNames = window.getResearchNames
? window.getResearchNames(currentLang())
: ((typeof LANG_RESEARCH !== 'undefined' && (LANG_RESEARCH[currentLang()] || LANG_RESEARCH.ru)) || []);
updateTableRowNames('tbodyBuildings', buildingNames);
updateTableRowNames('tbodyResearch', researchNames);
updateMoonTableNames();
updateFleetTableNames();
updateLfTableNames('tbodyLfBuildings', 'lf_b_');
updateLfTableNames('tbodyLfResearch', 'lf_r_');
updateTransportRowNames();
}
function recalcStandardTable(tbodyId, dataArray, sumIds, isMoon = false) {
const tbody = $(tbodyId);
if (!tbody) return;
if (isSumAllTabsMode && tbodyId === 'tbodyBuildings') return;
let tm = 0, tc = 0, td = 0, tp = 0;
const useMrc = tbodyId === 'tbodyBuildings' && currentLifeformRace === 'rocktal';
const mrcLevel = useMrc ? parseInputValue($('mrcLevel')) : 0;
tbody.querySelectorAll('tr[data-index]').forEach((tr) => {
const refs = tr._refs;
const idx = Number(tr.dataset.index);
const data = dataArray[idx];
if (!data || !refs) return;
const from = parseInputValue(refs.from);
const toRaw = sanitizeInput(refs.to.value);
let to = Math.max(from, toRaw === '' ? from : parseNumberInput(toRaw));
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
const mult = Math.max(1, parseInputValue(refs.planets) || 1);
const sum = geomSum(data.base, data.factor, from, to);
let m = clampCalc(sum.m * mult);
let c = clampCalc(sum.c * mult);
let d = clampCalc(sum.d * mult);
const buildingId = data.id || (idx + 1);
if (useMrc && mrcLevel > 0 && MRC_BUILDING_IDS.has(buildingId)) {
const k = 1 - Math.min(0.99, 0.005 * mrcLevel);
m = Math.floor(m * k);
c = Math.floor(c * k);
d = Math.floor(d * k);
}
const p = clampCalc((m + c + d) / 1000);
updateResourceCell(refs.m, m);
updateResourceCell(refs.c, c);
updateResourceCell(refs.d, d);
refs.p.textContent = formatNumberWithDots(p);
tm = addCapped(tm, m);
tc = addCapped(tc, c);
td = addCapped(td, d);
tp = addCapped(tp, p);
});
const totalMetal = clampCalc(convertToMetal(tm, tc, td));
if (sumIds) {
updateResourceCell($(sumIds.m), tm);
updateResourceCell($(sumIds.c), tc);
updateResourceCell($(sumIds.d), td);
const pEl = $(sumIds.p);
if (pEl) pEl.textContent = formatNumberWithDots(tp);
const totalEl = $(sumIds.total);
if (totalEl) totalEl.textContent = formatNumberWithDots(totalMetal);
}
TOTALS[isMoon ? 'moonBuildings' : 'buildings'] = { m: tm, c: tc, d: td, p: tp, total: totalMetal };
scheduleGlobalUpdate();
}
function recalcLfTable(tbodyId, isBuilding) {
const tbody = $(tbodyId);
if (!tbody) return;
let tm = 0, tc = 0, td = 0, tp = 0;
let megalithLevel = 0, rsrRdc = 0;
if (currentLifeformRace === 'rocktal') {
megalithLevel = parseInputValue($('megalithLevel'));
rsrRdc = 0.0025 * parseInputValue($('runoLevel'));
} else {
const inputId = { humans: 'humansLevel', mechas: 'mechasLevel', kaelesh: 'kaeleshLevel' }[currentLifeformRace];
rsrRdc = 0.0025 * parseInputValue($(inputId));
}
tbody.querySelectorAll('tr[data-index]').forEach((tr) => {
const refs = tr._refs;
if (!refs) return;
const techId = Number(tr.dataset.techId) || 0;
if (!techId || !LF_TECH_COSTS[techId]) {
updateResourceCell(refs.m, 0);
updateResourceCell(refs.c, 0);
updateResourceCell(refs.d, 0);
refs.p.textContent = '0';
return;
}
const fromRaw = sanitizeInput(refs.from.value);
const toRaw = sanitizeInput(refs.to.value);
let from = 0, to = 0;
if (fromRaw === '' && toRaw === '') { from = to = 0; }
else if (toRaw === '') { from = 0; to = parseNumberInput(fromRaw); }
else { from = parseNumberInput(fromRaw); to = Math.max(from, parseNumberInput(toRaw)); }
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
const planets = Math.max(1, parseInputValue(refs.planets) || 1);
let cost = [0, 0, 0], points = 0;
if (isBuilding) {
let bldRdc = 0;
if (currentLifeformRace === 'rocktal') bldRdc = 0.01 * megalithLevel;
if (to > from) {
cost = getBuildCostLF(techId, from, to, 0, bldRdc);
points = clampCalc((cost[0] + cost[1] + cost[2]) / 1000);
}
} else {
cost = getBuildCostLF(techId, from, to, rsrRdc, 0);
points = clampCalc((cost[0] + cost[1] + cost[2]) / 1000);
}
const m = clampCalc(cost[0] * planets);
const c = clampCalc(cost[1] * planets);
const d = clampCalc(cost[2] * planets);
const p = clampCalc(points * planets);
updateResourceCell(refs.m, m);
updateResourceCell(refs.c, c);
updateResourceCell(refs.d, d);
refs.p.textContent = formatNumberWithDots(p);
tm = addCapped(tm, m);
tc = addCapped(tc, c);
td = addCapped(td, d);
tp = addCapped(tp, p);
});
const suf = isBuilding ? 'LfB' : 'LfR';
const totalMetal = clampCalc(convertToMetal(tm, tc, td));
updateResourceCell($('sumMetal' + suf), tm);
updateResourceCell($('sumCrystal' + suf), tc);
updateResourceCell($('sumDeut' + suf), td);
const pEl = $('sumPoints' + suf);
if (pEl) pEl.textContent = formatNumberWithDots(tp);
const totalEl = $('sumTotalMetal' + suf);
if (totalEl) totalEl.textContent = formatNumberWithDots(totalMetal);
lfTotals[currentLifeformRace][isBuilding ? 'buildings' : 'research'] = { m: tm, c: tc, d: td, p: tp, total: totalMetal };
saveLfTotals();
scheduleGlobalUpdate();
}
const recalcAllBuildings = () => recalcStandardTable('tbodyBuildings', BUILDINGS, {
m: 'sumMetalB', c: 'sumCrystalB', d: 'sumDeutB', p: 'sumPointsB', total: 'sumTotalMetalB'
});
const recalcAllMoonBuildings = () => recalcStandardTable('tbodyMoonBuildings', MOON_BUILDINGS, {
m: 'sumMetalMoon', c: 'sumCrystalMoon', d: 'sumDeutMoon', p: 'sumPointsMoon', total: 'sumTotalMetalMoon'
}, true);
const recalcAllLfBuildings = () => recalcLfTable('tbodyLfBuildings', true);
const recalcAllLfResearch = () => recalcLfTable('tbodyLfResearch', false);
function recalcAllResearch() {
const tbody = $('tbodyResearch');
if (!tbody) return;
let sm = 0, sc = 0, sd = 0, sp = 0, totalLevels = 0;
tbody.querySelectorAll('tr[data-index]').forEach((tr) => {
const refs = tr._refs;
const idx = Number(tr.dataset.index) || 0;
const data = RESEARCH[idx];
if (!data || !refs) return;
const from = parseInputValue(refs.from);
const toRaw = sanitizeInput(refs.to.value);
let to = Math.max(from, toRaw === '' ? from : parseNumberInput(toRaw));
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
const sum = geomSum(data.base, data.factor, from, to);
const discPct = getResearchDiscountPct(idx);
const k = discPct / 100;
const m = k > 0 ? Math.floor(sum.m * (1 - k)) : sum.m;
const c = k > 0 ? Math.floor(sum.c * (1 - k)) : sum.c;
const d = k > 0 ? Math.floor(sum.d * (1 - k)) : sum.d;
const p = k > 0 ? Math.floor((m + c + d) / 1000) : sum.points;
updateResourceCell(refs.m, m);
updateResourceCell(refs.c, c);
updateResourceCell(refs.d, d);
refs.p.textContent = formatNumberWithDots(p);
if (refs.chip) {
const hint = refs.chip.dataset.hint || '';
const label = getResearchDiscountLabel(idx);
refs.chip.textContent = label ? `−${formatDiscountChip(label)}%` : '';
refs.chip.title = label ? `${hint} −${label}%`.trim() : hint;
}
sm = addCapped(sm, m);
sc = addCapped(sc, c);
sd = addCapped(sd, d);
sp = addCapped(sp, p);
totalLevels += sum.levels;
});
const totalMetal = clampCalc(convertToMetal(sm, sc, sd));
updateResourceCell($('sumMetalR'), sm);
updateResourceCell($('sumCrystalR'), sc);
updateResourceCell($('sumDeutR'), sd);
const pEl = $('sumPointsR');
if (pEl) pEl.textContent = formatNumberWithDots(sp);
const totalEl = $('sumTotalMetalR');
if (totalEl) totalEl.textContent = formatNumberWithDots(totalMetal);
TOTALS.research = { m: sm, c: sc, d: sd, p: sp, total: totalMetal };
const perLevel = parseInputValue($('tmInput'));
const totalTM = clampCalc(perLevel * totalLevels * CONFIG.TM_PER_LEVEL_FACTOR);
const dict = getDict();
const tmTotalEl = $('tmTotal');
if (tmTotalEl) tmTotalEl.textContent = `${normalizeLocalizedText(dict.totalTMLabel || 'Итого:')} ${formatNumberWithDots(totalTM)}`;
scheduleGlobalUpdate();
}
function recalcAll() {
batchRecalc = true;
recalcAllBuildings();
recalcAllMoonBuildings();
recalcAllResearch();
recalcAllLfBuildings();
recalcAllLfResearch();
computeFleet();
batchRecalc = false;
scheduleGlobalUpdate();
}
function renderTable() {
const tableBody = document.querySelector('#shipsTable tbody');
if (!tableBody) return;
const qtyMap = safeJsonParse(safeGet(KEYS.SHIP_QTY, '{}'), {});
const dict = getDict();
const frag = document.createDocumentFragment();
fleetInputs = [];
fleetSummaryCells = {};
SHIPS.forEach((ship) => {
const row = document.createElement('tr');
row.setAttribute('data-row-id', ship.id);
const refs = {};
const shipName = normalizeLocalizedText(dict['ship_' + ship.id] || ship.id);
const tdName = document.createElement('td');
tdName.style.textAlign = 'left';
tdName.appendChild(makeIcon(IMG.ships + ship.img, shipName, 28));
const nameSpan = document.createElement('span');
nameSpan.className = 'ship-name';
nameSpan.textContent = shipName;
tdName.appendChild(nameSpan);
const tdQty = document.createElement('td');
const qtyInput = document.createElement('input');
qtyInput.type = 'text';
qtyInput.pattern = '[0-9.]';
qtyInput.value = qtyMap[ship.id] ? formatWithDotsRaw(qtyMap[ship.id]) : '';
qtyInput.dataset.id = ship.id;
tdQty.appendChild(qtyInput);
const tdM = document.createElement('td');
tdM.appendChild(resSpan('val-metal', ship.metal));
const tdC = document.createElement('td');
tdC.appendChild(resSpan('val-crystal', ship.crystal));
const tdD = document.createElement('td');
tdD.appendChild(resSpan('val-deut', ship.deut));
const tdP = document.createElement('td');
tdP.className = 'p';
tdP.textContent = '0';
refs.qty = qtyInput;
refs.p = tdP;
refs.nameSpan = nameSpan;
row._refs = refs;
fleetInputs.push(qtyInput);
row.append(tdName, tdQty, tdM, tdC, tdD, tdP);
frag.appendChild(row);
});
const trSum = document.createElement('tr');
trSum.className = 'summary-row regular-total-row';
const tdSumName = document.createElement('td');
tdSumName.style.cssText = 'text-align:left;font-weight:bold;';
tdSumName.textContent = normalizeLocalizedText(dict.total || 'Итого');
const tdSumQty = document.createElement('td');
const tdSM = document.createElement('td');
tdSM.className = 'm';
tdSM.id = 'sumMetalF';
tdSM.appendChild(resSpan('val-metal', 0));
const tdSC = document.createElement('td');
tdSC.className = 'c';
tdSC.id = 'sumCrystalF';
tdSC.appendChild(resSpan('val-crystal', 0));
const tdSD = document.createElement('td');
tdSD.className = 'd';
tdSD.id = 'sumDeutF';
tdSD.appendChild(resSpan('val-deut', 0));
const tdSP = document.createElement('td');
tdSP.className = 'p';
fleetSummaryCells.sumP = tdSP;
trSum.append(tdSumName, tdSumQty, tdSM, tdSC, tdSD, tdSP);
frag.appendChild(trSum);
const trTotal = document.createElement('tr');
trTotal.className = 'total-metal-row regular-total-row';
const tdTotalName = document.createElement('td');
tdTotalName.style.cssText = 'text-align:left;font-weight:bold;';
tdTotalName.textContent = normalizeLocalizedText(dict.totalInMetal || 'Всего в металле');
const tdTotalQty = document.createElement('td');
const tdTotalM = document.createElement('td');
tdTotalM.className = 'm';
tdTotalM.colSpan = 3;
const totalSpan = document.createElement('span');
totalSpan.id = 'sumTotalMetalF';
totalSpan.textContent = '0';
tdTotalM.appendChild(totalSpan);
const tdTotalP = document.createElement('td');
trTotal.append(tdTotalName, tdTotalQty, tdTotalM, tdTotalP);
frag.appendChild(trTotal);
const trSumAll = document.createElement('tr');
trSumAll.className = 'sum-all-tabs-row';
trSumAll.style.display = 'none';
trSumAll.innerHTML = `<td style="text-align:left;font-weight:bold;">${normalizeLocalizedText(dict.sumAllTabs || 'Сумма по всем вкладкам')}</td><td></td><td class="m"><span class="val-metal sum-all-tabs-metal">0</span></td><td class="c"><span class="val-crystal sum-all-tabs-crystal">0</span></td><td class="d"><span class="val-deut sum-all-tabs-deut">0</span></td><td class="p"><span class="sum-all-tabs-points">0</span></td>`;
frag.appendChild(trSumAll);
const trSumAllTotal = document.createElement('tr');
trSumAllTotal.className = 'sum-all-tabs-total-row';
trSumAllTotal.style.display = 'none';
trSumAllTotal.innerHTML = `<td style="text-align:left;font-weight:bold;">${normalizeLocalizedText(dict.totalInMetal || 'Всего в металле')}</td><td></td><td class="m" colspan="3"><span class="sum-all-tabs-total">0</span></td><td class="p"></td>`;
frag.appendChild(trSumAllTotal);
tableBody.replaceChildren(frag);
fleetTableBuilt = true;
cachedAggrRows = null;
insertTransportRowsAfterTotal('sumTotalMetalF', dict, 6, 'fleet');
attachLiveThousandsFormatting('input[data-id]');
if (!tableBody.dataset.fleetInputBound) {
tableBody.dataset.fleetInputBound = '1';
tableBody.addEventListener('input', debounce((e) => {
if (e.target.matches('input[data-id]')) {
saveShipQuantities();
computeFleet();
}
}, 150));
}
}
function restoreFleetQtyInputs() {
const qtyMap = safeJsonParse(safeGet(KEYS.SHIP_QTY, '{}'), {});
fleetInputs.forEach((inp) => {
const q = Number(qtyMap[inp.dataset.id]) || 0;
inp.value = q > 0 ? formatWithDotsRaw(q) : '';
});
}
function computeFleet() {
let fm = 0, fc = 0, fd = 0, fp = 0;
fleetInputs.forEach((inp) => {
const refs = inp.closest('tr')?._refs;
const qty = parseInputValue(inp);
if (qty <= 0) {
inp.value = '';
if (refs) refs.p.textContent = '0';
return;
}
const ship = SHIP_MAP[inp.dataset.id];
if (!ship) return;
fm = addCapped(fm, clampCalc(qty * ship.metal));
fc = addCapped(fc, clampCalc(qty * ship.crystal));
fd = addCapped(fd, clampCalc(qty * ship.deut));
inp.value = formatWithDotsRaw(qty);
const pts = clampCalc(((ship.metal + ship.crystal + ship.deut) / 1000) * qty);
if (refs) refs.p.textContent = formatNumberWithDots(pts);
fp = addCapped(fp, pts);
});
const totalMetal = clampCalc(convertToMetal(fm, fc, fd));
updateResourceCell($('sumMetalF'), fm);
updateResourceCell($('sumCrystalF'), fc);
updateResourceCell($('sumDeutF'), fd);
if (fleetSummaryCells.sumP) fleetSummaryCells.sumP.textContent = formatNumberWithDots(fp);
const totalSpan = $('sumTotalMetalF');
if (totalSpan) totalSpan.textContent = formatNumberWithDots(totalMetal);
TOTALS.fleet = { m: fm, c: fc, d: fd, p: fp, total: totalMetal };
scheduleGlobalUpdate();
}
function saveShipQuantities() {
const qtyMap = {};
fleetInputs.forEach((inp) => {
qtyMap[inp.dataset.id] = parseInputValue(inp);
});
safeSet(KEYS.SHIP_QTY, JSON.stringify(qtyMap));
}
function attachLiveThousandsFormatting(selector) {
document.querySelectorAll(selector).forEach((inp) => {
if (inp.thousandsBound) return;
inp.thousandsBound = true;
const formatAndSetCursor = function () {
const rawBefore = this.value.slice(0, this.selectionStart || 0);
const leftDigits = rawBefore.replace(/[^0-9]/g, '').length;
const raw = sanitizeInput(this.value);
const formatted = formatWithDotsRaw(raw);
this.value = formatted;
let pos = 0, seen = 0;
for (let i = 0; i < formatted.length; i++) {
if (/\d/.test(formatted[i])) seen++;
pos++;
if (seen >= leftDigits) break;
}
try { this.setSelectionRange(pos, pos); } catch (e) {}
};
inp.addEventListener('input', formatAndSetCursor);
inp.addEventListener('blur', function () {
if (this.value === '' || this.value === '-') { this.value = ''; return; }
const num = parseNumberInput(this.value);
this.value = num === 0 ? '' : formatWithDotsRaw(num);
this.dispatchEvent(new Event('change', { bubbles: true }));
});
inp.addEventListener('keydown', function (e) {
if (e.ctrlKey || e.metaKey) return;
const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab', 'Home', 'End'];
if (allowed.includes(e.key) || (e.key >= '0' && e.key <= '9') || ['-', '.', ','].includes(e.key)) return;
e.preventDefault();
});
inp.addEventListener('paste', function (e) {
e.preventDefault();
const clipboard = e.clipboardData || window.clipboardData;
const text = clipboard ? clipboard.getData('text') : '';
const start = this.selectionStart || 0;
const end = this.selectionEnd || start;
const oldLeft = this.value.slice(0, start);
const oldRight = this.value.slice(end);
const inserted = sanitizeInput(text);
const next = formatWithDotsRaw(oldLeft + inserted + oldRight);
this.value = next;
const targetDigits = (oldLeft + inserted).length;
let pos = 0, seen = 0;
while (pos < next.length && seen < targetDigits) {
if (/\d/.test(next[pos])) seen++;
pos++;
}
try { this.setSelectionRange(pos, pos); } catch (err) {}
this.dispatchEvent(new Event('change', { bubbles: true }));
});
});
}
function attachLvlInputHandlers() {
document.querySelectorAll('.lvl-input').forEach((inp) => {
if (inp._lvlBound) return;
inp._lvlBound = true;
const restrict = (el) => {
const val = sanitizeInput(el.value);
if (val === '') return;
const num = Math.min(Number(val), CONFIG.MAX_LEVEL);
el.value = String(num);
};
inp.addEventListener('input', () => restrict(inp));
inp.addEventListener('blur', function () {
restrict(inp);
inp.dispatchEvent(new Event('change', { bubbles: true }));
});
inp.addEventListener('paste', function (e) {
e.preventDefault();
const clipboard = e.clipboardData || window.clipboardData;
const num = Number(sanitizeInput(clipboard ? clipboard.getData('text') : ''));
inp.value = String(Number.isNaN(num) || num < 0 ? 0 : Math.min(num, CONFIG.MAX_LEVEL));
inp.dispatchEvent(new Event('input', { bubbles: true }));
inp.dispatchEvent(new Event('change', { bubbles: true }));
});
});
}
function attachBonusInputHandlers() {
BONUS_INPUT_IDS.forEach((id) => {
const el = $(id);
if (!el || el._bonusBound) return;
const handler = debounce(() => {
if (['humansLevel', 'mechasLevel', 'kaeleshLevel', 'runoLevel'].includes(id)) {
recalcAllLfResearch();
} else if (id === 'megalithLevel') {
recalcAllLfBuildings();
} else if (id === 'mrcLevel') {
recalcAllBuildings();
}
scheduleGlobalUpdate();
safeSet(`og_calc_${id}`, String(parseInputValue(el)));
}, 150);
el.addEventListener('input', handler);
el.addEventListener('change', handler);
el.addEventListener('blur', handler);
el._bonusBound = true;
});
}
function attachInputsHandlers() {
if (inputsHandlersAttached) return;
inputsHandlersAttached = true;
const setupTable = (tbodyId, recalcFn, storageKey) => {
const tbody = $(tbodyId);
if (!tbody) return;
const persist = () => {
const key = typeof storageKey === 'function' ? storageKey() : storageKey;
if (!key) return;
const rows = Array.from(tbody.querySelectorAll('tr[data-index]')).map((tr) => {
const refs = tr._refs || {};
return {
from: parseInputValue(refs.from),
to: parseInputValue(refs.to),
planets: parseInputValue(refs.planets) || 1
};
});
safeSet(key, JSON.stringify(rows));
};
tbody.addEventListener('input', debounce((e) => {
if (e.target.matches('.lvl-input,.planet-input')) {
recalcFn();
persist();
}
}, 150));
};
setupTable('tbodyBuildings', recalcAllBuildings, KEYS.INPUTS_BUILD);
setupTable('tbodyResearch', recalcAllResearch, KEYS.INPUTS_RESEARCH);
setupTable('tbodyMoonBuildings', recalcAllMoonBuildings, KEYS.INPUTS_MOON_BUILD);
setupTable('tbodyLfBuildings', recalcAllLfBuildings, () => `${KEYS.LF_INPUTS_BUILD}_${currentLifeformRace}`);
setupTable('tbodyLfResearch', recalcAllLfResearch, () => `${KEYS.LF_INPUTS_RESEARCH}_${currentLifeformRace}`);
const tmEl = $('tmInput');
if (tmEl) {
tmEl.placeholder = CONFIG.TM_INPUT_PLACEHOLDER;
tmEl.addEventListener('input', debounce(recalcAllResearch, 150));
tmEl.addEventListener('blur', recalcAllResearch);
tmEl.addEventListener('change', () => safeSet(KEYS.TM, tmEl.value));
}
const boxEl = $('boxValue');
if (boxEl) {
const onBoxChange = debounce(() => {
safeSet(KEYS.BOXES, JSON.stringify({ boxValue: parseInputValue(boxEl) }));
scheduleGlobalUpdate();
}, 150);
boxEl.addEventListener('input', onBoxChange);
boxEl.addEventListener('change', onBoxChange);
}
const sel = $('lifeformSelect');
if (sel) {
sel.addEventListener('change', (e) => {
BONUS_INPUT_IDS.forEach((id) => {
const el = $(id);
if (el) safeSet(`og_calc_${id}`, el.value);
});
persistLfInputs();
saveLfTotals();
currentLifeformRace = normalizeRace(e.target.value);
safeSet(KEYS.LF_RACE, currentLifeformRace);
calcCache.clear();
updateLfBonusesVisibility(currentLifeformRace);
buildRowsLfBuildings();
buildRowsLfResearch();
restoreInputRowsFromSelector('#tbodyLfBuildings tr[data-index]', `${KEYS.LF_INPUTS_BUILD}_${currentLifeformRace}`);
restoreInputRowsFromSelector('#tbodyLfResearch tr[data-index]', `${KEYS.LF_INPUTS_RESEARCH}_${currentLifeformRace}`);
attachLiveThousandsFormatting('#tbodyLfBuildings input,#tbodyLfResearch input');
recalcAllLfBuildings();
recalcAllLfResearch();
scheduleGlobalUpdate();
});
}
document.querySelectorAll('#tabsLeft .tab-btn').forEach((btn) => {
btn.addEventListener('click', (ev) => {
ev.stopPropagation();
setActiveTab(btn.dataset.tab);
});
});
document.querySelectorAll('.building-subtab-btn').forEach((btn) => {
btn.addEventListener('click', (ev) => {
ev.stopPropagation();
const tab = btn.dataset.buildingTab;
document.querySelectorAll('.building-subtab-btn').forEach((b) => b.classList.remove('active'));
btn.classList.add('active');
$('planetBuildingsContent')?.classList.toggle('active', tab === 'planet');
$('moonBuildingsContent')?.classList.toggle('active', tab === 'moon');
(tab === 'moon' ? recalcAllMoonBuildings : recalcAllBuildings)();
scheduleGlobalUpdate();
safeSet('og_calc_active_building_tab', tab);
});
});
document.querySelectorAll('.lf-subtab-btn').forEach((btn) => {
btn.addEventListener('click', (ev) => {
ev.stopPropagation();
activateLfSubtab(btn.dataset.subtab);
safeSet('og_calc_active_lf_subtab_v1', btn.dataset.subtab);
});
});
const langToggle = $('langToggle');
const langMenu = $('langDropdownMenu');
if (langToggle && langMenu) {
langMenu.setAttribute('role', 'menu');
langMenu.innerHTML = '';
Object.keys(LANGUAGES).forEach((code) => {
const option = document.createElement('div');
option.className = 'lang-option';
option.dataset.lang = code;
option.setAttribute('role', 'menuitem');
option.setAttribute('tabindex', '0');
const icon = makeIcon(`images/languages/${code}.png`, LANGUAGES[code], 18);
icon.style.marginRight = '6px';
const label = document.createElement('span');
label.className = 'lang-text';
label.textContent = LANGUAGES[code];
option.append(icon, label);
langMenu.appendChild(option);
const activate = (e) => {
e.stopPropagation();
e.preventDefault();
applyLang(code);
toggleLangMenu(false);
};
option.addEventListener('click', activate);
option.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') activate(e);
});
});
setLangLabel(currentLang());
langToggle.addEventListener('click', (e) => {
e.stopPropagation();
e.preventDefault();
toggleLangMenu();
});
document.addEventListener('click', (e) => {
if (!langMenu.contains(e.target) && !langToggle.contains(e.target)) toggleLangMenu(false);
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && langMenu.style.display === 'flex') toggleLangMenu(false);
});
}
attachBonusInputHandlers();
}
function toggleLangMenu(force) {
const langMenu = $('langDropdownMenu');
const langToggle = $('langToggle');
if (!langMenu || !langToggle) return;
const open = force !== undefined ? force : langMenu.style.display !== 'flex';
langMenu.style.display = open ? 'flex' : 'none';
langToggle.setAttribute('aria-expanded', String(open));
}
function setLangLabel(code) {
const el = $('currentLang');
if (!el) return;
el.innerHTML = '';
const icon = makeIcon(`images/languages/${code}.png`, LANGUAGES[code] || code.toUpperCase(), 18);
icon.style.marginRight = '4px';
const label = document.createElement('span');
label.className = 'lang-text';
label.textContent = LANGUAGES[code] || code.toUpperCase();
el.append(icon, label);
}
function saveLfTotals() {
safeSet(KEYS.LF_TOTALS, JSON.stringify(lfTotals));
}
function loadLfTotals() {
const data = safeJsonParse(safeGet(KEYS.LF_TOTALS, 'null'), null);
if (!data || typeof data !== 'object') return;
RACES.forEach((race) => {
if (!data[race]) return;
['buildings', 'research'].forEach((kind) => {
if (data[race][kind]) {
lfTotals[race][kind] = ['m', 'c', 'd', 'p', 'total'].reduce((acc, f) => {
const n = Number(data[race][kind][f]) || 0;
acc[f] = Number.isFinite(n) ? Math.min(Math.max(0, n), MAX_CALC_VALUE) : 0;
return acc;
}, {});
}
});
});
}
function collectRowData(selector) {
return Array.from(document.querySelectorAll(selector)).map((tr) => {
const refs = tr._refs || {};
return {
from: parseInputValue(refs.from),
to: parseInputValue(refs.to),
planets: parseInputValue(refs.planets) || 1
};
});
}
function persistLfInputs() {
safeSet(`${KEYS.LF_INPUTS_BUILD}_${currentLifeformRace}`, JSON.stringify(collectRowData('#tbodyLfBuildings tr[data-index]')));
safeSet(`${KEYS.LF_INPUTS_RESEARCH}_${currentLifeformRace}`, JSON.stringify(collectRowData('#tbodyLfResearch tr[data-index]')));
}
function saveInputRowsFromSelector(selector, key) {
safeSet(key, JSON.stringify(collectRowData(selector)));
}
function saveAllInputsBeforeSwitch() {
saveInputRowsFromSelector('#tbodyBuildings tr[data-index]', KEYS.INPUTS_BUILD);
saveInputRowsFromSelector('#tbodyResearch tr[data-index]', KEYS.INPUTS_RESEARCH);
saveInputRowsFromSelector('#tbodyMoonBuildings tr[data-index]', KEYS.INPUTS_MOON_BUILD);
saveInputRowsFromSelector('#tbodyLfBuildings tr[data-index]', `${KEYS.LF_INPUTS_BUILD}_${currentLifeformRace}`);
saveInputRowsFromSelector('#tbodyLfResearch tr[data-index]', `${KEYS.LF_INPUTS_RESEARCH}_${currentLifeformRace}`);
saveShipQuantities();
safeSet(KEYS.BOXES, JSON.stringify({ boxValue: parseInputValue($('boxValue')) }));
const tmInput = $('tmInput')?.value;
if (tmInput !== undefined) safeSet(KEYS.TM, tmInput);
BONUS_INPUT_IDS.forEach((id) => {
const el = $(id);
if (el) safeSet(`og_calc_${id}`, el.value);
});
}
function restoreInputRowsFromSelector(selector, key) {
const data = safeJsonParse(safeGet(key, 'null'), null);
if (!Array.isArray(data)) return;
document.querySelectorAll(selector).forEach((tr, i) => {
if (!data[i]) return;
const refs = tr._refs || {};
if (refs.from) refs.from.value = data[i].from ? String(Math.min(CONFIG.MAX_LEVEL, data[i].from)) : '';
if (refs.to) refs.to.value = data[i].to ? String(Math.min(CONFIG.MAX_LEVEL, data[i].to)) : '';
if (refs.planets) refs.planets.value = data[i].planets ? formatWithDotsRaw(data[i].planets) : '1';
});
}
function restoreAllInputsAfterSwitch() {
restoreInputRowsFromSelector('#tbodyBuildings tr[data-index]', KEYS.INPUTS_BUILD);
restoreInputRowsFromSelector('#tbodyResearch tr[data-index]', KEYS.INPUTS_RESEARCH);
restoreInputRowsFromSelector('#tbodyMoonBuildings tr[data-index]', KEYS.INPUTS_MOON_BUILD);
restoreInputRowsFromSelector('#tbodyLfBuildings tr[data-index]', `${KEYS.LF_INPUTS_BUILD}_${currentLifeformRace}`);
restoreInputRowsFromSelector('#tbodyLfResearch tr[data-index]', `${KEYS.LF_INPUTS_RESEARCH}_${currentLifeformRace}`);
const shipQty = safeJsonParse(safeGet(KEYS.SHIP_QTY, '{}'), {});
if (shipQty) {
fleetInputs.forEach((inp) => {
if (shipQty[inp.dataset.id]) inp.value = formatWithDotsRaw(shipQty[inp.dataset.id]);
});
}
const boxes = safeJsonParse(safeGet(KEYS.BOXES, '{}'), {});
if (boxes.boxValue) $('boxValue').value = formatWithDotsRaw(boxes.boxValue);
const tmEl = $('tmInput');
if (tmEl) {
tmEl.placeholder = CONFIG.TM_INPUT_PLACEHOLDER;
const tmSaved = safeGet(KEYS.TM, null);
if (tmSaved !== null && tmSaved !== '' && parseNumberInput(tmSaved) > 0) tmEl.value = tmSaved;
}
BONUS_INPUT_IDS.forEach((id) => {
const saved = safeGet(`og_calc_${id}`, null);
if (saved !== null && $(id)) $(id).value = String(parseNumberInput(saved));
});
}
const getActiveTab = () => document.querySelector('.tab-btn.active')?.dataset.tab || 'buildings';
function activateLfSubtab(sub, skipRecalc = false) {
let target = sub;
if (!document.querySelector(`.lf-subtab-btn[data-subtab="${target}"]`)) target = 'lf-buildings';
document.querySelectorAll('.lf-subtab-btn').forEach((b) => b.classList.toggle('active', b.dataset.subtab === target));
$('lf-buildings')?.classList.toggle('active', target === 'lf-buildings');
$('lf-research')?.classList.toggle('active', target === 'lf-research');
if (!skipRecalc) (target === 'lf-research' ? recalcAllLfResearch : recalcAllLfBuildings)();
}
function setActiveTab(tab, skipRecalc = false) {
document.querySelectorAll('.tab-btn').forEach((b) => {
const isActive = b.dataset.tab === tab;
b.classList.toggle('active', isActive);
b.setAttribute('aria-selected', isActive ? 'true' : 'false');
b.setAttribute('tabindex', isActive ? '0' : '-1');
});
const elMap = { buildings: 'tabBuildings', research: 'tabResearch', fleet: 'tabFleet', lifeforms: 'tabLifeforms' };
['buildings', 'research', 'fleet', 'lifeforms'].forEach((t) => {
$(elMap[t])?.classList.toggle('active', t === tab);
});
if (tab === 'lifeforms') {
const activeSub = document.querySelector('.lf-subtab-btn.active')?.dataset.subtab || 'lf-buildings';
activateLfSubtab(activeSub, skipRecalc);
} else if (!skipRecalc) {
if (tab === 'fleet') {
if (!fleetTableBuilt) renderTable();
else restoreFleetQtyInputs();
computeFleet();
} else if (tab === 'buildings') {
recalcAllBuildings();
} else if (tab === 'research') {
recalcAllResearch();
}
}
if (!skipRecalc) {
scheduleGlobalUpdate();
}
safeSet(KEYS.ACTIVE_TAB, tab);
}
function applyLang(lang, skipRebuild = false) {
if (!lang || !LANGUAGES[lang]) return;
if (currentLang() === lang && !skipRebuild) return;
safeSet(KEYS.LANG, lang);
const dict = getDict();
document.documentElement.lang = dict.locale || lang;
applyI18nAttributes();
auditI18nKeys();
document.querySelectorAll('.nav-btn[data-view]').forEach((btn) => {
const key = btn.dataset.view === 'costs' ? 'tabBuildings'
: btn.dataset.view === 'expeditions' ? 'tabExpeditions'
: btn.dataset.view === 'houses' ? 'tabHouses' : '';
if (key && dict[key]) btn.textContent = normalizeLocalizedText(dict[key]);
});
const lfSelect = $('lifeformSelect');
if (lfSelect) {
lfSelect.querySelectorAll('option').forEach((opt) => {
if (dict[opt.value]) opt.textContent = normalizeLocalizedText(dict[opt.value]);
});
if (dict.lfSelectLabel) lfSelect.setAttribute('aria-label', normalizeLocalizedText(dict.lfSelectLabel));
}
setLangLabel(lang);
if (skipRebuild) return;
calcCache.clear();
updateAllTableNamesOnly();
if (isSumAllTabsMode) buildOverviewRows();
updateLfBonusesVisibility(currentLifeformRace);
scheduleGlobalUpdate();
if (typeof window.updateExpeditionsLang === 'function') window.updateExpeditionsLang();
if (typeof window.updateHousesLang === 'function') window.updateHousesLang();
}
function initHousesSafe() {
if (typeof window.initHousesUI === 'function') {
window.initHousesUI();
if (typeof window.forceHousesRender === 'function') window.forceHousesRender();
return true;
}
return false;
}
function switchView(newView) {
document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === newView));
const tableWrapper = $('tableWrapper');
const expWrapper = $('expeditionsWrapper');
const housesWrapper = $('housesWrapper');
if (tableWrapper) tableWrapper.style.display = newView === 'costs' ? 'block' : 'none';
if (expWrapper) expWrapper.style.display = newView === 'expeditions' ? 'block' : 'none';
if (housesWrapper) housesWrapper.style.display = newView === 'houses' ? 'block' : 'none';
if (newView === 'expeditions') {
if (typeof window.initExpeditionUI === 'function') window.initExpeditionUI();
window.panZoomExpeditions?.applyTransform();
} else if (newView === 'houses') {
initHousesSafe();
window.panZoomHouses?.applyTransform();
} else {
window.panZoomMain?.applyTransform();
updateTransportNeededRows();
}
safeSet('og_calc_active_view', newView);
updateBackgroundVideo(newView);
}
function getSumAllTabsMetalValue() {
let total = addCapped(addCapped(addCapped(TOTALS.buildings.total, TOTALS.moonBuildings.total), TOTALS.research.total), TOTALS.fleet.total);
Object.values(lfTotals).forEach((race) => {
total = addCapped(total, race.buildings?.total || 0);
total = addCapped(total, race.research?.total || 0);
});
return total;
}
function getCurrentTotalMetalValue() {
const active = getActiveTab();
if (active === 'buildings') {
const isMoonActive = document.querySelector('.building-subtab-btn.active')?.dataset.buildingTab === 'moon';
return isMoonActive ? TOTALS.moonBuildings.total : TOTALS.buildings.total;
}
if (active === 'research') return TOTALS.research.total;
if (active === 'fleet') return TOTALS.fleet.total;
if (active === 'lifeforms') {
const sub = document.querySelector('.lf-subtab-btn.active')?.dataset.subtab || 'lf-buildings';
const t = lfTotals[currentLifeformRace][sub === 'lf-buildings' ? 'buildings' : 'research'];
return t ? t.total : 0;
}
return 0;
}
function getAggrRows() {
if (!cachedAggrRows) {
cachedAggrRows = {
sumRows: Array.from(document.querySelectorAll('.sum-all-tabs-row,.sum-all-tabs-total-row')),
regularRows: Array.from(document.querySelectorAll('.regular-total-row,.summary-row,.total-metal-row')),
metal: Array.from(document.querySelectorAll('.sum-all-tabs-metal')),
crystal: Array.from(document.querySelectorAll('.sum-all-tabs-crystal')),
deut: Array.from(document.querySelectorAll('.sum-all-tabs-deut')),
points: Array.from(document.querySelectorAll('.sum-all-tabs-points')),
total: Array.from(document.querySelectorAll('.sum-all-tabs-total'))
};
}
return cachedAggrRows;
}
function updateSumAllTabsRows() {
if (batchRecalc) return;
const show = isSumAllTabsMode;
const rows = getAggrRows();
rows.sumRows.forEach((r) => { r.style.display = show ? '' : 'none'; });
rows.regularRows.forEach((r) => { r.style.display = show ? 'none' : ''; });
if (!show) return;
const totals = { m: 0, c: 0, d: 0, p: 0 };
[TOTALS.buildings, TOTALS.moonBuildings, TOTALS.research, TOTALS.fleet].forEach((t) => {
totals.m = addCapped(totals.m, t.m);
totals.c = addCapped(totals.c, t.c);
totals.d = addCapped(totals.d, t.d);
totals.p = addCapped(totals.p, t.p);
});
Object.values(lfTotals).forEach((race) => {
['buildings', 'research'].forEach((kind) => {
const t = race[kind];
if (!t) return;
totals.m = addCapped(totals.m, t.m || 0);
totals.c = addCapped(totals.c, t.c || 0);
totals.d = addCapped(totals.d, t.d || 0);
totals.p = addCapped(totals.p, t.p || 0);
});
});
const totalMetal = clampCalc(convertToMetal(totals.m, totals.c, totals.d));
rows.metal.forEach((el) => { el.textContent = formatNumberWithDots(totals.m); });
rows.crystal.forEach((el) => { el.textContent = formatNumberWithDots(totals.c); });
rows.deut.forEach((el) => { el.textContent = formatNumberWithDots(totals.d); });
rows.points.forEach((el) => { el.textContent = formatNumberWithDots(totals.p); });
rows.total.forEach((el) => { el.textContent = formatNumberWithDots(totalMetal); });
}
let overviewPrevTab = 'buildings';
let overviewPrevBuildingSub = 'planet';
function getLfRaceDiscounts(race) {
const stored = (id) => parseNumberInput(safeGet('og_calc_' + id, '0'));
if (race === 'rocktal') {
return { bld: 0.01 * stored('megalithLevel'), rsr: 0.0025 * stored('runoLevel') };
}
const map = { humans: 'humansLevel', mechas: 'mechasLevel', kaelesh: 'kaeleshLevel' };
return { bld: 0, rsr: 0.0025 * stored(map[race]) };
}
function overviewStoredRows(key, dataArray, order, opts = {}) {
const data = safeJsonParse(safeGet(key, 'null'), null);
if (!Array.isArray(data)) return [];
const dict = getDict();
const names = opts.research
? (window.getResearchNames ? window.getResearchNames(currentLang()) : [])
: (window.getBuildingNames ? window.getBuildingNames(currentLang()) : []);
const useMrc = opts.buildings && !opts.moon && currentLifeformRace === 'rocktal';
const mrcLevel = useMrc ? parseNumberInput(safeGet('og_calc_mrcLevel', '0')) : 0;
const source = opts.moon ? 'moon' : opts.research ? 'research' : 'buildings';
const rows = [];
data.forEach((rec, i) => {
if (!rec) return;
const bIdx = order ? order[i] : i;
const d = dataArray[bIdx];
if (!d) return;
const from = Math.min(Number(rec.from) || 0, CONFIG.MAX_LEVEL);
let to = Math.max(from, Math.min(Number(rec.to) || 0, CONFIG.MAX_LEVEL));
if (to <= 0) return;
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
const mult = Math.max(1, Number(rec.planets) || 1);
const sum = geomSum(d.base, d.factor, from, to);
let m = clampCalc(sum.m * mult);
let c = clampCalc(sum.c * mult);
let d2 = clampCalc(sum.d * mult);
let discount = 0;
let discountLabel = '';
if (opts.research) {
discount = getResearchDiscountPct(bIdx);
if (discount > 0) {
const k = 1 - discount / 100;
m = Math.floor(m * k);
c = Math.floor(c * k);
d2 = Math.floor(d2 * k);
discountLabel = getResearchDiscountLabel(bIdx);
}
}
if (useMrc && mrcLevel > 0 && MRC_BUILDING_IDS.has(d.id)) {
const k = 1 - Math.min(0.99, 0.005 * mrcLevel);
m = Math.floor(m * k);
c = Math.floor(c * k);
d2 = Math.floor(d2 * k);
}
if (m + c + d2 <= 0) return;
const rawName = opts.moon ? (dict['moon_' + d.id] || d.name) : (names[bIdx] || '');
rows.push({
icon: (opts.research ? IMG.research : IMG.buildings) + d.img,
name: normalizeLocalizedText(rawName),
from, to,
planets: opts.research ? null : mult,
discount, discountLabel,
m, c, d: d2,
p: clampCalc((m + c + d2) / 1000),
source, storeIndex: i, dataIdx: bIdx
});
});
return rows;
}
function overviewLfRows(race, isBuilding) {
const key = (isBuilding ? KEYS.LF_INPUTS_BUILD : KEYS.LF_INPUTS_RESEARCH) + '_' + race;
const data = safeJsonParse(safeGet(key, 'null'), null);
if (!Array.isArray(data)) return [];
const dict = getDict();
const prefix = RACE_PREFIX[race] + (isBuilding ? '0' : '1');
const maxItems = isBuilding ? 12 : 18;
const { bld, rsr } = getLfRaceDiscounts(race);
const source = 'lf_' + race + (isBuilding ? '_b' : '_r');
const rows = [];
for (let i = 1; i <= maxItems; i++) {
const techId = Number(prefix + String(i).padStart(2, '0'));
if (!LF_TECH_COSTS[techId]) continue;
const rec = data[i - 1] || {};
const from = Math.min(Number(rec.from) || 0, CONFIG.MAX_LEVEL);
let to = Math.max(from, Math.min(Number(rec.to) || 0, CONFIG.MAX_LEVEL));
if (to <= 0) continue;
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
const planets = Math.max(1, Number(rec.planets) || 1);
const cost = isBuilding
? getBuildCostLF(techId, from, to, 0, bld)
: getBuildCostLF(techId, from, to, rsr, 0);
const m = clampCalc(cost[0] * planets);
const c = clampCalc(cost[1] * planets);
const d = clampCalc(cost[2] * planets);
if (m + c + d <= 0) continue;
rows.push({
icon: isBuilding
? 'images/lifeforms/buildings/' + race + '/' + (LF_BUILDING_FILENAMES[techId] || techId + '.png')
: 'images/lifeforms/research/' + race + '/' + (LF_RESEARCH_FILENAMES[techId] || techId + '.png'),
name: normalizeLocalizedText(dict[(isBuilding ? 'lf_b_' : 'lf_r_') + techId] || String(techId)),
from, to, planets, m, c, d,
p: clampCalc((m + c + d) / 1000),
source, storeIndex: i - 1, techId
});
}
return rows;
}
function overviewFleetRows() {
const qtyMap = safeJsonParse(safeGet(KEYS.SHIP_QTY, '{}'), {});
const dict = getDict();
const rows = [];
SHIPS.forEach((ship) => {
const qty = Number(qtyMap[ship.id]) || 0;
if (qty <= 0) return;
const m = clampCalc(qty * ship.metal);
const c = clampCalc(qty * ship.crystal);
const d = clampCalc(qty * ship.deut);
rows.push({
icon: IMG.ships + ship.img,
name: normalizeLocalizedText(dict['ship_' + ship.id] || ship.id),
from: null, to: null, planets: qty,
m, c, d,
p: clampCalc(((ship.metal + ship.crystal + ship.deut) / 1000) * qty),
source: 'fleet', shipId: ship.id
});
});
return rows;
}
function createOverviewRow(r) {
const tr = document.createElement('tr');
tr.className = 'overview-list-row';
tr.dataset.source = r.source;
const tdName = document.createElement('td');
tdName.className = 'name-cell';
tdName.appendChild(makeIcon(r.icon, r.name, 20));
tdName.appendChild(document.createTextNode(r.name));
if (r.discount > 0 && r.discountLabel) {
const chip = document.createElement('span');
chip.className = 'disc-chip overview-disc';
chip.textContent = '−' + formatDiscountChip(r.discountLabel) + '%';
tdName.appendChild(chip);
}
tr.appendChild(tdName);
const ov = { meta: r };
const isFleet = r.source === 'fleet';
if (isFleet) {
const tdQty = document.createElement('td');
tdQty.className = 'overview-fleet-qty';
tdQty.colSpan = 3;
const qtyInput = document.createElement('input');
qtyInput.type = 'text';
qtyInput.className = 'quantity-input';
qtyInput.tabIndex = 0;
if (r.planets) qtyInput.value = formatWithDotsRaw(r.planets);
tdQty.appendChild(qtyInput);
tr.appendChild(tdQty);
ov.planetsInput = qtyInput;
} else {
const lvlCell = (value) => {
const td = document.createElement('td');
const input = document.createElement('input');
input.type = 'text';
input.className = 'overview-lvl';
input.tabIndex = 0;
if (value) input.value = formatWithDotsRaw(value);
td.appendChild(input);
return { td, input };
};
const fromCell = lvlCell(r.from);
const toCell = lvlCell(r.to);
ov.fromInput = fromCell.input;
ov.toInput = toCell.input;
tr.appendChild(fromCell.td);
tr.appendChild(toCell.td);
const tdPlanets = document.createElement('td');
const planetImg = document.createElement('img');
planetImg.src = IMG.root + 'planet.png';
planetImg.className = 'icon';
planetImg.alt = '';
const planetsInput = document.createElement('input');
planetsInput.type = 'text';
planetsInput.className = 'planet-input';
const planetsEditable = r.planets !== null && r.planets !== undefined;
planetsInput.readOnly = !planetsEditable;
planetsInput.tabIndex = planetsEditable ? 0 : -1;
if (r.planets) planetsInput.value = formatWithDotsRaw(r.planets);
tdPlanets.append(planetImg, planetsInput);
tr.appendChild(tdPlanets);
ov.planetsInput = planetsInput;
}
const tdM = document.createElement('td');
tdM.className = 'm';
tdM.appendChild(resSpan('val-metal', r.m));
const tdC = document.createElement('td');
tdC.className = 'c';
tdC.appendChild(resSpan('val-crystal', r.c));
const tdD = document.createElement('td');
tdD.className = 'd';
tdD.appendChild(resSpan('val-deut', r.d));
const tdP = document.createElement('td');
tdP.className = 'p';
tdP.textContent = formatNumberWithDots(r.p);
tr.append(tdM, tdC, tdD, tdP);
ov.mTd = tdM;
ov.cTd = tdC;
ov.dTd = tdD;
ov.pTd = tdP;
ov.last = { m: r.m, c: r.c, d: r.d, p: r.p };
tr._ov = ov;
return tr;
}
function buildOverviewRows() {
const tbody = $('tbodyBuildings');
if (!tbody) return;
saveAllInputsBeforeSwitch();
const rows = [];
overviewStoredRows(KEYS.INPUTS_BUILD, BUILDINGS, BUILDING_ORDER, { buildings: true }).forEach((r) => rows.push(r));
overviewStoredRows(KEYS.INPUTS_MOON_BUILD, MOON_BUILDINGS, null, { buildings: true, moon: true }).forEach((r) => rows.push(r));
overviewStoredRows(KEYS.INPUTS_RESEARCH, RESEARCH, null, { research: true }).forEach((r) => rows.push(r));
RACES.forEach((race) => {
overviewLfRows(race, true).forEach((r) => rows.push(r));
overviewLfRows(race, false).forEach((r) => rows.push(r));
});
overviewFleetRows().forEach((r) => rows.push(r));
const frag = document.createDocumentFragment();
if (!rows.length) {
const tr = document.createElement('tr');
const td = document.createElement('td');
td.className = 'overview-empty-cell';
td.colSpan = 8;
td.textContent = normalizeLocalizedText(getDict().overviewEmpty || '—');
tr.appendChild(td);
frag.appendChild(tr);
} else {
rows.forEach((r) => frag.appendChild(createOverviewRow(r)));
}
tbody.replaceChildren(frag);
ensureOverviewEditDelegation(tbody);
}
function ensureOverviewEditDelegation(tbody) {
if (!tbody || tbody._overviewBound) return;
tbody._overviewBound = true;
tbody.addEventListener('input', (e) => {
const inp = e.target;
if (!inp.closest('tr.overview-list-row') || inp.readOnly) return;
inp.value = sanitizeInput(inp.value);
if (inp.value !== '' && inp.classList.contains('overview-lvl')) {
inp.value = String(Math.min(Number(inp.value), CONFIG.MAX_LEVEL));
}
});
tbody.addEventListener('change', (e) => {
const inp = e.target;
if (!inp.closest('tr.overview-list-row') || inp.readOnly) return;
const tr = inp.closest('tr.overview-list-row');
if (tr) commitOverviewEdit(tr);
});
}
function overviewStorageKey(meta) {
if (meta.source === 'buildings') return KEYS.INPUTS_BUILD;
if (meta.source === 'moon') return KEYS.INPUTS_MOON_BUILD;
if (meta.source === 'research') return KEYS.INPUTS_RESEARCH;
if (meta.source.startsWith('lf_')) {
const parts = meta.source.split('_');
return (parts[2] === 'b' ? KEYS.LF_INPUTS_BUILD : KEYS.LF_INPUTS_RESEARCH) + '_' + parts[1];
}
return null;
}
function overviewRowCost(meta, from, to, planets) {
let m = 0, c = 0, d = 0;
if (meta.source === 'buildings' || meta.source === 'moon') {
const data = (meta.source === 'moon' ? MOON_BUILDINGS : BUILDINGS)[meta.dataIdx];
if (!data) return { m: 0, c: 0, d: 0, p: 0 };
const sum = geomSum(data.base, data.factor, from, to);
m = clampCalc(sum.m * planets);
c = clampCalc(sum.c * planets);
d = clampCalc(sum.d * planets);
if (meta.source === 'buildings' && currentLifeformRace === 'rocktal') {
const mrcLevel = parseNumberInput(safeGet('og_calc_mrcLevel', '0'));
if (mrcLevel > 0 && MRC_BUILDING_IDS.has(data.id)) {
const k = 1 - Math.min(0.99, 0.005 * mrcLevel);
m = Math.floor(m * k);
c = Math.floor(c * k);
d = Math.floor(d * k);
}
}
} else if (meta.source === 'research') {
const data = RESEARCH[meta.dataIdx];
if (!data) return { m: 0, c: 0, d: 0, p: 0 };
const sum = geomSum(data.base, data.factor, from, to);
m = clampCalc(sum.m * planets);
c = clampCalc(sum.c * planets);
d = clampCalc(sum.d * planets);
const pct = getResearchDiscountPct(meta.dataIdx);
if (pct > 0) {
const k = 1 - pct / 100;
m = Math.floor(m * k);
c = Math.floor(c * k);
d = Math.floor(d * k);
}
} else if (meta.source.startsWith('lf_')) {
const parts = meta.source.split('_');
const { bld, rsr } = getLfRaceDiscounts(parts[1]);
const cost = parts[2] === 'b'
? getBuildCostLF(meta.techId, from, to, 0, bld)
: getBuildCostLF(meta.techId, from, to, rsr, 0);
m = clampCalc(cost[0] * planets);
c = clampCalc(cost[1] * planets);
d = clampCalc(cost[2] * planets);
}
return { m, c, d, p: clampCalc((m + c + d) / 1000) };
}
function refreshOverviewCategoryTotals(source) {
const tbody = $('tbodyBuildings');
if (!tbody) return;
const acc = emptyTotals();
tbody.querySelectorAll('tr.overview-list-row').forEach((row) => {
if (row.dataset.source !== source || !row._ov || !row._ov.last) return;
const l = row._ov.last;
acc.m = addCapped(acc.m, l.m);
acc.c = addCapped(acc.c, l.c);
acc.d = addCapped(acc.d, l.d);
acc.p = addCapped(acc.p, l.p);
});
acc.total = clampCalc(convertToMetal(acc.m, acc.c, acc.d));
if (source === 'buildings') TOTALS.buildings = acc;
else if (source === 'moon') TOTALS.moonBuildings = acc;
else if (source === 'research') TOTALS.research = acc;
else if (source === 'fleet') TOTALS.fleet = acc;
else if (source.startsWith('lf_')) {
const parts = source.split('_');
lfTotals[parts[1]][parts[2] === 'b' ? 'buildings' : 'research'] = acc;
saveLfTotals();
}
}
function commitOverviewEdit(tr) {
const ov = tr._ov;
if (!ov) return;
const meta = ov.meta;
if (meta.source === 'fleet') {
const qty = Math.max(0, parseInputValue(ov.planetsInput));
ov.planetsInput.value = qty > 0 ? formatWithDotsRaw(qty) : '';
meta.planets = qty;
const qtyMap = safeJsonParse(safeGet(KEYS.SHIP_QTY, '{}'), {});
qtyMap[meta.shipId] = qty;
safeSet(KEYS.SHIP_QTY, JSON.stringify(qtyMap));
if (qty <= 0) {
tr.remove();
refreshOverviewCategoryTotals('fleet');
scheduleGlobalUpdate();
return;
}
const ship = SHIP_MAP[meta.shipId];
const cost = {
m: clampCalc(qty * ship.metal),
c: clampCalc(qty * ship.crystal),
d: clampCalc(qty * ship.deut),
p: clampCalc(((ship.metal + ship.crystal + ship.deut) / 1000) * qty)
};
ov.last = cost;
updateResourceCell(ov.mTd, cost.m);
updateResourceCell(ov.cTd, cost.c);
updateResourceCell(ov.dTd, cost.d);
ov.pTd.textContent = formatNumberWithDots(cost.p);
refreshOverviewCategoryTotals('fleet');
scheduleGlobalUpdate();
return;
}
const from = parseInputValue(ov.fromInput);
const toRaw = sanitizeInput(ov.toInput.value);
let to = Math.max(from, toRaw === '' ? from : parseNumberInput(toRaw));
if (to - from > CONFIG.MAX_LEVEL_SPAN) to = from + CONFIG.MAX_LEVEL_SPAN;
ov.fromInput.value = from > 0 ? formatWithDotsRaw(from) : '';
ov.toInput.value = to > 0 ? formatWithDotsRaw(to) : '';
let planets = meta.planets || 1;
const planetsEditable = ov.planetsInput && !ov.planetsInput.readOnly;
if (planetsEditable) {
planets = Math.max(1, parseInputValue(ov.planetsInput));
ov.planetsInput.value = formatWithDotsRaw(planets);
meta.planets = planets;
}
const key = overviewStorageKey(meta);
if (key) {
const arr = safeJsonParse(safeGet(key, 'null'), null);
if (Array.isArray(arr)) {
const rec = arr[meta.storeIndex] || (arr[meta.storeIndex] = {});
rec.from = from;
rec.to = to;
if (planetsEditable) rec.planets = planets;
safeSet(key, JSON.stringify(arr));
}
}
if (to <= 0) {
tr.remove();
refreshOverviewCategoryTotals(meta.source);
scheduleGlobalUpdate();
return;
}
const cost = overviewRowCost(meta, from, to, planets);
ov.last = cost;
updateResourceCell(ov.mTd, cost.m);
updateResourceCell(ov.cTd, cost.c);
updateResourceCell(ov.dTd, cost.d);
ov.pTd.textContent = formatNumberWithDots(cost.p);
refreshOverviewCategoryTotals(meta.source);
scheduleGlobalUpdate();
}
function setOverviewMode(on) {
isSumAllTabsMode = !!on;
const hide = isSumAllTabsMode ? 'none' : '';
const tabsLeft = document.querySelector('.tabs-left');
const subtabs = document.querySelector('.building-subtabs');
const lfToolbar = document.querySelector('.lf-toolbar');
const tmRow = document.querySelector('.tm-row');
if (tabsLeft) tabsLeft.style.display = hide;
if (subtabs) subtabs.style.display = hide;
if (lfToolbar) lfToolbar.style.display = hide;
if (tmRow) tmRow.style.display = hide;
if (isSumAllTabsMode) {
overviewPrevTab = getActiveTab();
overviewPrevBuildingSub = document.querySelector('.building-subtab-btn.active')?.dataset.buildingTab || 'planet';
document.querySelectorAll('#tabsLeft .tab-btn').forEach((b) => {
const active = b.dataset.tab === 'buildings';
b.classList.toggle('active', active);
b.setAttribute('aria-selected', active ? 'true' : 'false');
b.setAttribute('tabindex', active ? '0' : '-1');
});
['tabBuildings', 'tabResearch', 'tabFleet', 'tabLifeforms'].forEach((id) => {
$(id)?.classList.toggle('active', id === 'tabBuildings');
});
$('planetBuildingsContent')?.classList.add('active');
$('moonBuildingsContent')?.classList.remove('active');
buildOverviewRows();
} else {
buildRowsBuildings();
restoreInputRowsFromSelector('#tbodyBuildings tr[data-index]', KEYS.INPUTS_BUILD);
document.querySelectorAll('.building-subtab-btn').forEach((b) => b.classList.toggle('active', b.dataset.buildingTab === overviewPrevBuildingSub));
$('planetBuildingsContent')?.classList.toggle('active', overviewPrevBuildingSub === 'planet');
$('moonBuildingsContent')?.classList.toggle('active', overviewPrevBuildingSub === 'moon');
setActiveTab(overviewPrevTab, true);
restoreFleetQtyInputs();
if (overviewPrevTab === 'fleet') computeFleet();
recalcAllBuildings();
}
updateSumAllTabsRows();
}
function updateBoxesNeeded() {
if (batchRecalc) return;
const boxesNeededEl = $('boxesNeeded');
const boxValue = parseInputValue($('boxValue'));
if (!boxValue || boxValue <= 0) {
if (boxesNeededEl) boxesNeededEl.textContent = '—';
const boxesCost = $('boxesCostTL');
if (boxesCost) boxesCost.innerHTML = '—';
const leftover = $('leftoverTmValue');
if (leftover) leftover.textContent = '—';
return;
}
const targetMetal = isSumAllTabsMode ? getSumAllTabsMetalValue() : getCurrentTotalMetalValue();
if (boxesNeededEl) boxesNeededEl.textContent = formatWithDotsRaw(Math.ceil(targetMetal / boxValue));
updateBoxesCostTL(targetMetal);
}
function updateBoxesCostTL(targetMetal = null) {
const boxesCostEl = $('boxesCostTL');
if (!boxesCostEl) return;
const leftoverEl = $('leftoverTmValue');
const currencyEl = $('currencyValue');
const boxValue = parseInputValue($('boxValue'));
const setEmpty = (txt) => {
boxesCostEl.textContent = txt;
if (leftoverEl) leftoverEl.textContent = txt;
if (currencyEl) currencyEl.textContent = txt === '—' ? '0' : txt;
};
if (boxValue <= 0) return setEmpty('—');
if (targetMetal === null) targetMetal = isSumAllTabsMode ? getSumAllTabsMetalValue() : getCurrentTotalMetalValue();
if (!Number.isFinite(targetMetal) || targetMetal <= 0) return setEmpty('0');
const neededBoxes = Math.ceil(targetMetal / boxValue);
if (neededBoxes > 1e9) return setEmpty('—');
const pack = CONFIG.TM_PACKS[0];
if (!pack || pack.tm <= 0 || pack.priceTRY <= 0) return setEmpty('—');
const packsCount = Math.max(1, Math.ceil(neededBoxes * CONFIG.TM_PER_BOX / pack.tm));
const totalTRY = packsCount * pack.priceTRY;
const leftoverTM = packsCount * pack.tm - neededBoxes * CONFIG.TM_PER_BOX;
const baseCurrency = safeGet(KEYS.BASE_CURRENCY, 'TRY');
const targetCurrency = safeGet(KEYS.CURRENCY, 'BYN');
const amountInBYN = totalTRY / CONFIG.TRY_TO_BYN_RATE;
const rates = currentSettings.rates || CONFIG.CURRENCY_RATES;
const baseRate = rates[baseCurrency] || 1;
const targetRate = rates[targetCurrency] || 1;
boxesCostEl.textContent = formatNumberWithDots(clampCalc(amountInBYN * baseRate));
if (currencyEl) currencyEl.textContent = formatNumberWithDots(clampCalc(amountInBYN * targetRate));
if (leftoverEl) leftoverEl.textContent = leftoverTM > 0 ? formatWithDotsRaw(leftoverTM) : '0';
}
function updateCurrencySymbol() {
const el = $('currencySymbol');
if (!el) return;
const target = safeGet(KEYS.CURRENCY, 'BYN');
el.textContent = CURRENCY_SYMBOLS[target] || target;
}
function updateLfBonusesVisibility(race) {
const box = $('lfBonuses');
if (!box) return;
const current = {};
BONUS_INPUT_IDS.forEach((id) => {
const el = $(id);
if (el && el.value !== '') current[id] = sanitizeInput(el.value);
});
const fields = {
rocktal: [['lfMegalith', 'megalithLevel'], ['lfMineralCenter', 'mrcLevel'], ['lfRunoTech', 'runoLevel']],
humans: [['lf_b_1003', 'humansLevel']],
mechas: [['lf_b_3003', 'mechasLevel']],
kaelesh: [['lf_b_4003', 'kaeleshLevel']]
}[race] || [];
const dict = getDict();
const frag = document.createDocumentFragment();
fields.forEach(([labelKey, inputId]) => {
const fieldDiv = document.createElement('div');
fieldDiv.className = 'field';
const label = document.createElement('label');
label.setAttribute('for', inputId);
label.textContent = normalizeLocalizedText(dict[labelKey] || labelKey);
const input = document.createElement('input');
input.id = inputId;
input.type = 'text';
input.min = '0';
input.max = '100';
input.placeholder = '0';
const value = current[inputId] ?? safeGet(`og_calc_${inputId}`, null);
if (value !== null && value !== '') input.value = formatWithDotsRaw(parseNumberInput(value));
fieldDiv.append(label, input);
frag.appendChild(fieldDiv);
});
box.replaceChildren(frag);
attachBonusInputHandlers();
}
class PanZoomController {
constructor(wrapperId, handleId, storageKey) {
this.wrapper = $(wrapperId);
this.handle = $(handleId);
this.storageKey = storageKey;
if (!this.wrapper || !this.handle) return;
this.state = { x: 0, y: 0, scale: 1 };
this.isDragging = false;
this.minScale = 0.3;
this.maxScale = 3.5;
this.padding = 60;
this.loadState();
this.applyTransform();
this.bindDrag();
}
loadState() {
const data = safeJsonParse(safeGet(this.storageKey, 'null'), null);
if (data) {
this.state = {
x: Number(data.x) || 0,
y: Number(data.y) || 0,
scale: Math.max(this.minScale, Math.min(this.maxScale, Number(data.scale) || 1))
};
}
}
saveState() {
safeSet(this.storageKey, JSON.stringify(this.state));
}
applyTransform() {
if (!this.wrapper) return;
const x = Math.round(this.state.x);
const y = Math.round(this.state.y);
this.wrapper.style.transformOrigin = '0 0';
this.wrapper.style.transform = `translate(${x}px,${y}px) scale(${this.state.scale})`;
}
clampPosition() {
if (!this.wrapper) return;
const rect = this.wrapper.getBoundingClientRect();
const s = this.state.scale;
const baseW = rect.width / s;
const baseH = rect.height / s;
const minX = this.padding - baseW;
const maxX = window.innerWidth - this.padding;
const minY = this.padding - baseH;
const maxY = window.innerHeight - this.padding;
this.state.x = Math.max(minX, Math.min(maxX, this.state.x));
this.state.y = Math.max(minY, Math.min(maxY, this.state.y));
}
zoom(factor, center = null) {
if (!this.wrapper) return;
const oldScale = this.state.scale;
const newScale = Math.max(this.minScale, Math.min(this.maxScale, oldScale * factor));
if (newScale === oldScale) return;
const cx = center ? center.x : window.innerWidth / 2;
const cy = center ? center.y : window.innerHeight / 2;
this.state.x = cx - (cx - this.state.x) * (newScale / oldScale);
this.state.y = cy - (cy - this.state.y) * (newScale / oldScale);
this.state.scale = newScale;
this.applyTransform();
requestAnimationFrame(() => {
this.clampPosition();
this.applyTransform();
this.saveState();
});
}
reset() {
if (!this.wrapper) return;
this.state = { x: 0, y: 0, scale: 1 };
this.applyTransform();
requestAnimationFrame(() => {
const rect = this.wrapper.getBoundingClientRect();
this.state.x = window.innerWidth / 2 - (rect.left + rect.width / 2);
this.state.y = window.innerHeight / 2 - (rect.top + rect.height / 2);
this.clampPosition();
this.applyTransform();
this.saveState();
});
}
bindDrag() {
if (!this.wrapper || !this.handle) return;
this.handle.style.cursor = 'grab';
this._onPointerDown = (e) => {
this.isDragging = true;
this.startPointer = { x: e.clientX, y: e.clientY };
this.startState = { ...this.state };
this.handle.style.cursor = 'grabbing';
this.wrapper.style.zIndex = '2000';
this.wrapper.style.willChange = 'transform';
try { this.handle.setPointerCapture(e.pointerId); } catch (e2) {}
};
this._onPointerMove = (e) => {
if (!this.isDragging) return;
this.state.x = this.startState.x + (e.clientX - this.startPointer.x);
this.state.y = this.startState.y + (e.clientY - this.startPointer.y);
this.applyTransform();
};
this._stopDrag = (e) => {
if (!this.isDragging) return;
this.isDragging = false;
this.handle.style.cursor = 'grab';
this.wrapper.style.zIndex = '1000';
this.wrapper.style.willChange = 'auto';
this.clampPosition();
this.applyTransform();
this.saveState();
try { this.handle.releasePointerCapture(e.pointerId); } catch (e2) {}
};
this.handle.addEventListener('pointerdown', this._onPointerDown);
document.addEventListener('pointermove', this._onPointerMove);
document.addEventListener('pointerup', this._stopDrag);
document.addEventListener('pointercancel', this._stopDrag);
}
destroy() {
document.removeEventListener('pointermove', this._onPointerMove);
document.removeEventListener('pointerup', this._stopDrag);
document.removeEventListener('pointercancel', this._stopDrag);
this.handle?.removeEventListener('pointerdown', this._onPointerDown);
}
}
let panZoomMain = null;
let panZoomExpeditions = null;
let panZoomHouses = null;
function initPanZoom() {
if (panZoomMain) panZoomMain.destroy();
if (panZoomExpeditions) panZoomExpeditions.destroy();
if (panZoomHouses) panZoomHouses.destroy();
panZoomMain = new PanZoomController('tableWrapper', 'dragHandle', KEYS.TRANSFORM);
panZoomExpeditions = new PanZoomController('expeditionsWrapper', 'dragHandleExpeditions', 'og_calc_expeditions_transform');
panZoomHouses = new PanZoomController('housesWrapper', 'dragHandleHouses', 'og_calc_houses_transform');
window.panZoomMain = panZoomMain;
window.panZoomExpeditions = panZoomExpeditions;
window.panZoomHouses = panZoomHouses;
}
function initZoomControls() {
const getActiveController = () => {
const expWrapper = $('expeditionsWrapper');
if (expWrapper && expWrapper.style.display !== 'none') return window.panZoomExpeditions;
const housesWrapper = $('housesWrapper');
if (housesWrapper && housesWrapper.style.display !== 'none') return window.panZoomHouses;
return window.panZoomMain;
};
$('globalZoomIn')?.addEventListener('click', () => getActiveController()?.zoom(1.15));
$('globalZoomOut')?.addEventListener('click', () => getActiveController()?.zoom(1 / 1.15));
$('globalZoomReset')?.addEventListener('click', () => {
const expWrapper = $('expeditionsWrapper');
const housesWrapper = $('housesWrapper');
const isExp = expWrapper && expWrapper.style.display !== 'none';
const isHouses = housesWrapper && housesWrapper.style.display !== 'none';
if (!isExp && !isHouses) fullResetToZero();
getActiveController()?.reset();
});
}
function fullResetToZero() {
const lfSelect = $('lifeformSelect');
const originalRace = normalizeRace(lfSelect ? lfSelect.value : 'humans');
isSumAllTabsMode = false;
const checkbox = $('sumAllTabsCheckbox');
if (checkbox) checkbox.checked = false;
setOverviewMode(false);
const preservedKeys = [KEYS.TRANSFORM, KEYS.LANG];
Object.values(KEYS).forEach((k) => {
if (!preservedKeys.includes(k)) safeRemove(k);
});
['og_calc_active_view', 'og_calc_active_building_tab', 'og_calc_active_lf_subtab_v1', 'options_expeditions', 'og_expeditions_accordion_expanded', 'og_calc_expeditions_transform', 'og_calc_houses_race', 'og_calc_houses_transform'].forEach((k) => {
safeRemove(k);
});
try {
Object.keys(localStorage)
.filter((k) => k.startsWith('og_calc_lf_inputs') || BONUS_INPUT_IDS.some((id) => k === `og_calc_${id}`))
.forEach((k) => localStorage.removeItem(k));
} catch (e) {}
researchDiscounts = {};
transportCapacities = { ...TRANSPORT_DEFAULTS };
saveTransportCapacities();
lfTotals = freshLfTotals();
TOTALS.buildings = emptyTotals();
TOTALS.moonBuildings = emptyTotals();
TOTALS.research = emptyTotals();
TOTALS.fleet = emptyTotals();
const boxValueEl = $('boxValue');
if (boxValueEl) boxValueEl.value = '';
const tmInputEl = $('tmInput');
if (tmInputEl) tmInputEl.value = '';
['#tbodyBuildings', '#tbodyResearch', '#tbodyMoonBuildings'].forEach((sel) => {
document.querySelectorAll(`${sel} input[data-type="from"],${sel} input[data-type="to"]`).forEach((inp) => { inp.value = ''; });
document.querySelectorAll(`${sel} input[data-type="planets"],${sel} input[data-type="moons"]`).forEach((inp) => { inp.value = '1'; });
});
RACES.forEach((race) => {
currentLifeformRace = race;
calcCache.clear();
buildRowsLfBuildings();
buildRowsLfResearch();
document.querySelectorAll('#tbodyLfBuildings input[data-type="from"],#tbodyLfBuildings input[data-type="to"],#tbodyLfResearch input[data-type="from"],#tbodyLfResearch input[data-type="to"]').forEach((inp) => { inp.value = ''; });
document.querySelectorAll('#tbodyLfBuildings input[data-type="planets"],#tbodyLfResearch input[data-type="planets"]').forEach((inp) => { inp.value = '1'; });
saveInputRowsFromSelector('#tbodyLfBuildings tr[data-index]', `${KEYS.LF_INPUTS_BUILD}_${race}`);
saveInputRowsFromSelector('#tbodyLfResearch tr[data-index]', `${KEYS.LF_INPUTS_RESEARCH}_${race}`);
recalcAllLfBuildings();
recalcAllLfResearch();
});
currentLifeformRace = originalRace;
if (lfSelect) lfSelect.value = originalRace;
safeSet(KEYS.LF_RACE, originalRace);
safeSet(KEYS.BASE_CURRENCY, 'TRY');
safeSet(KEYS.CURRENCY, 'BYN');
const baseCurrencySelector = $('baseCurrencySelector');
if (baseCurrencySelector) baseCurrencySelector.value = 'TRY';
const currencySelector = $('currencySelector');
if (currencySelector) currencySelector.value = 'BYN';
updateCurrencySymbol();
fleetTableBuilt = false;
calcCache.clear();
buildRowsBuildings();
buildRowsResearch();
buildRowsMoonBuildings();
buildRowsLfBuildings();
buildRowsLfResearch();
renderTable();
recalcAll();
updateLfBonusesVisibility(currentLifeformRace);
['sumPointsB', 'sumPointsR', 'sumPointsLfB', 'sumPointsLfR'].forEach((id) => {
const el = $(id);
if (el) el.textContent = '0';
});
const boxesNeeded = $('boxesNeeded');
if (boxesNeeded) boxesNeeded.textContent = '—';
const boxesCost = $('boxesCostTL');
if (boxesCost) boxesCost.innerHTML = '—';
const leftover = $('leftoverTmValue');
if (leftover) leftover.textContent = '—';
const currencyValue = $('currencyValue');
if (currencyValue) currencyValue.textContent = '0';
if (typeof window.clearFleet === 'function') window.clearFleet();
if (typeof window.updateExpeditionsLang === 'function') window.updateExpeditionsLang();
if (typeof window.updateHousesLang === 'function') window.updateHousesLang();
scheduleGlobalUpdate();
saveLfTotals();
switchView('costs');
setActiveTab('buildings');
}
function updateBackgroundVideo(view) {
const bgVideo = $('bgVideo');
if (!bgVideo) return;
const targetSrc = view === 'expeditions' ? 'images/background2.webm' : 'images/background.webm';
if (bgVideo.currentSrc && bgVideo.currentSrc.includes(targetSrc)) {
if (bgVideo.paused && !document.hidden) bgVideo.play().catch(() => {});
return;
}
bgVideo.pause();
bgVideo.src = targetSrc;
bgVideo.load();
if (!document.hidden) bgVideo.play().catch(() => {});
}
function loadSettings() {
const data = safeJsonParse(safeGet(SETTINGS_KEY, 'null'), null);
if (!data) {
currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
return;
}
currentSettings = {
tmPerBox: parseSettingsNumber(data.tmPerBox, DEFAULT_SETTINGS.tmPerBox),
tmPackSize: parseSettingsNumber(data.tmPackSize, DEFAULT_SETTINGS.tmPackSize),
packPriceTRY: parseSettingsNumber(data.packPriceTRY, DEFAULT_SETTINGS.packPriceTRY),
rates: {
BYN: 1,
RUB: parseSettingsNumber(data.rates?.RUB, DEFAULT_SETTINGS.rates.RUB),
USD: parseSettingsNumber(data.rates?.USD, DEFAULT_SETTINGS.rates.USD),
EUR: parseSettingsNumber(data.rates?.EUR, DEFAULT_SETTINGS.rates.EUR),
TRY: parseSettingsNumber(data.rates?.TRY, DEFAULT_SETTINGS.rates.TRY)
}
};
}
function saveSettings() {
safeSet(SETTINGS_KEY, JSON.stringify(currentSettings));
}
function applySettingsToConfig() {
CONFIG.TM_PER_BOX = Math.round(currentSettings.tmPerBox);
CONFIG.TRY_TO_BYN_RATE = currentSettings.rates.TRY || 16.01;
CONFIG.CURRENCY_RATES = { BYN: 1, ...currentSettings.rates };
if (CONFIG.TM_PACKS[0]) {
CONFIG.TM_PACKS[0].tm = Math.round(currentSettings.tmPackSize);
CONFIG.TM_PACKS[0].priceTRY = Math.round(currentSettings.packPriceTRY);
}
}
function populateSettingsInputs() {
const setVal = (id, val, isDecimal = false) => {
const el = $(id);
if (!el) return;
if (id === 'cfgRateBYN') {
el.value = (val !== undefined && val !== null) ? String(val) : '';
return;
}
const num = parseSettingsNumber(val, 0);
if (num <= 0) { el.value = ''; return; }
el.value = isDecimal ? String(num) : formatNumberWithDots(Math.round(num));
};
setVal('cfgTmPerBox', currentSettings.tmPerBox);
setVal('cfgTmPackSize', currentSettings.tmPackSize);
setVal('cfgPackPriceTRY', currentSettings.packPriceTRY);
setVal('cfgRateBYN', 1, true);
setVal('cfgRateRUB', currentSettings.rates.RUB, true);
setVal('cfgRateUSD', currentSettings.rates.USD, true);
setVal('cfgRateEUR', currentSettings.rates.EUR, true);
setVal('cfgRateTRY', currentSettings.rates.TRY, true);
}
function readSettingsFromInputs() {
currentSettings.tmPerBox = parseSettingsNumber($('cfgTmPerBox')?.value, DEFAULT_SETTINGS.tmPerBox);
currentSettings.tmPackSize = parseSettingsNumber($('cfgTmPackSize')?.value, DEFAULT_SETTINGS.tmPackSize);
currentSettings.packPriceTRY = parseSettingsNumber($('cfgPackPriceTRY')?.value, DEFAULT_SETTINGS.packPriceTRY);
currentSettings.rates.RUB = parseSettingsNumber($('cfgRateRUB')?.value, DEFAULT_SETTINGS.rates.RUB);
currentSettings.rates.USD = parseSettingsNumber($('cfgRateUSD')?.value, DEFAULT_SETTINGS.rates.USD);
currentSettings.rates.EUR = parseSettingsNumber($('cfgRateEUR')?.value, DEFAULT_SETTINGS.rates.EUR);
currentSettings.rates.TRY = parseSettingsNumber($('cfgRateTRY')?.value, DEFAULT_SETTINGS.rates.TRY);
currentSettings.rates.BYN = 1;
}
function openSettingsModal() {
const modal = $('settingsModal');
if (!modal) return;
populateSettingsInputs();
modal.classList.add('open');
$('settingsToggle')?.classList.add('active');
}
function closeSettingsModal() {
const modal = $('settingsModal');
if (!modal) return;
modal.classList.remove('open');
$('settingsToggle')?.classList.remove('active');
}
function saveAndApplySettings() {
readSettingsFromInputs();
saveSettings();
applySettingsToConfig();
updateBoxesCostTL();
scheduleGlobalUpdate();
closeSettingsModal();
}
function resetSettingsToDefaults() {
currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
populateSettingsInputs();
}
function initSettingsPanel() {
const toggleBtn = $('settingsToggle');
const modal = $('settingsModal');
if (modal) {
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
}
if (toggleBtn) {
toggleBtn.addEventListener('click', (e) => {
e.stopPropagation();
if (modal?.classList.contains('open')) closeSettingsModal();
else openSettingsModal();
});
}
$('settingsModalClose')?.addEventListener('click', closeSettingsModal);
modal?.querySelector('.settings-modal__backdrop')?.addEventListener('click', closeSettingsModal);
$('settingsSave')?.addEventListener('click', saveAndApplySettings);
$('settingsReset')?.addEventListener('click', resetSettingsToDefaults);
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && modal?.classList.contains('open')) closeSettingsModal();
});
loadSettings();
applySettingsToConfig();
}
function restoreFromStorage() {
RACES.forEach((race) => {
migrateKey(`og_calc_inputs_research_v1_${race}`, `${KEYS.LF_INPUTS_RESEARCH}_${race}`);
});
loadLfTotals();
currentLifeformRace = normalizeRace(safeGet(KEYS.LF_RACE, 'humans'));
buildRowsBuildings();
buildRowsResearch();
buildRowsMoonBuildings();
buildRowsLfBuildings();
buildRowsLfResearch();
renderTable();
restoreAllInputsAfterSwitch();
const lfSel = $('lifeformSelect');
if (lfSel) lfSel.value = currentLifeformRace;
updateLfBonusesVisibility(currentLifeformRace);
const savedSumAllTabs = safeGet(KEYS.SUM_ALL_TABS, null);
if (savedSumAllTabs !== null) {
const checkbox = $('sumAllTabsCheckbox');
if (checkbox) checkbox.checked = savedSumAllTabs === 'true';
}
updateSumAllTabsRows();
}
function initApp() {
initSettingsPanel();
attachLiveThousandsFormatting('#boxValue');
attachInputsHandlers();
applyLang(currentLang(), true);
restoreFromStorage();
applyI18nAttributes();
initPanZoom();
initZoomControls();
const savedLfSubtab = safeGet('og_calc_active_lf_subtab_v1', 'lf-buildings');
activateLfSubtab(savedLfSubtab, true);
const savedBuildingTab = safeGet('og_calc_active_building_tab', 'planet');
document.querySelectorAll('.building-subtab-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.buildingTab === savedBuildingTab));
$('planetBuildingsContent')?.classList.toggle('active', savedBuildingTab === 'planet');
$('moonBuildingsContent')?.classList.toggle('active', savedBuildingTab === 'moon');
const sumAllTabsCheckbox = $('sumAllTabsCheckbox');
if (sumAllTabsCheckbox) {
sumAllTabsCheckbox.addEventListener('change', function () {
safeSet(KEYS.SUM_ALL_TABS, String(this.checked));
setOverviewMode(this.checked);
scheduleGlobalUpdate();
});
}
const savedView = safeGet('og_calc_active_view', 'costs');
switchView(savedView);
document.querySelectorAll('.nav-btn').forEach((btn) => {
btn.addEventListener('click', () => switchView(btn.dataset.view));
});
window.addEventListener('load', () => {
const view = safeGet('og_calc_active_view', 'costs');
if (view === 'houses') {
initHousesSafe();
window.panZoomHouses?.applyTransform();
} else if (view === 'expeditions') {
if (typeof window.initExpeditionUI === 'function') window.initExpeditionUI();
window.panZoomExpeditions?.applyTransform();
}
});
const baseCurrencySelector = $('baseCurrencySelector');
if (baseCurrencySelector) {
baseCurrencySelector.value = safeGet(KEYS.BASE_CURRENCY, 'TRY');
baseCurrencySelector.addEventListener('change', function () {
safeSet(KEYS.BASE_CURRENCY, this.value);
updateBoxesCostTL();
});
}
const currencySelector = $('currencySelector');
if (currencySelector) {
currencySelector.value = safeGet(KEYS.CURRENCY, 'BYN');
currencySelector.addEventListener('change', function () {
safeSet(KEYS.CURRENCY, this.value);
updateBoxesCostTL();
updateCurrencySymbol();
});
}
updateCurrencySymbol();
window.addEventListener('beforeunload', () => {
saveAllInputsBeforeSwitch();
});
document.addEventListener('visibilitychange', () => {
const bgVideo = $('bgVideo');
if (!bgVideo) return;
if (document.hidden) bgVideo.pause();
else bgVideo.play().catch(() => {});
});
setActiveTab(safeGet(KEYS.ACTIVE_TAB, 'buildings'), true);
recalcAll();
const sumCheckbox = $('sumAllTabsCheckbox');
if (sumCheckbox && sumCheckbox.checked) setOverviewMode(true);
}
if (document.readyState !== 'loading') initApp();
else document.addEventListener('DOMContentLoaded', initApp);
})();
