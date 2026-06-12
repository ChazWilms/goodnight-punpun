'use strict';
// All locations. Maps are visual + collision only; story logic lives in chapters.

PP.maps = {};

// ---- Punpun's neighborhood street ----
PP.maps.street = {
  name: 'Street', music: 'home', light: 'day', fill: 'g',
  legend: {
    T: 'tree', g: 'grass', G: 'grass2', f: 'flower', F: 'fence', s: 'swalk',
    r: 'road', l: 'roadL', c: 'cross', R: 'roof', h: 'hwall', w: 'window',
    d: 'doorT', p: 'pole', v: 'vend', b: 'bush', '.': 'grass',
  },
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TRRRRRRRggRRRRRRRgggRRRRRRRT',
    'TRRRRRRRggRRRRRRRgggRRRRRRRT',
    'ThwwhdwhgghwhdwwhggghwdwhwhT',
    'TssssssssssssssssssssssssssT',
    'TrrrrrrrrrrrrrcrrrrrrrrrrrrT',
    'TlllllllllllllcllllllllllllT',
    'TrrrrrrrrrrrrrcrrrrrrrrrrrrT',
    'TssspssssssssssssssssspssssT',
    'TggggggGgggggggggGggggggvggT',
    'TgfgggggggGgggfgggggggggggT',
    'TggggbggggggggggggggGgggbggT',
    'TGgggggggfgggggGggggggggggT',
    'TggggggggggggggggggggfggggT',
    'TTTTTTTTTTTGGGGGGTTTTTTTTTT',
  ],
};

// ---- Punpun's house interior ----
PP.maps.house = {
  name: 'Onodera home', music: 'home', light: 'day', fill: 'f',
  legend: {
    '#': 'iwall', f: 'floor', t: 'tatami', T: 'table', c: 'chair', B: 'bed',
    F: 'fridge', S: 'stove', V: 'tv', s: 'sofa', h: 'shelf', p: 'plant',
  },
  rows: [
    '####################',
    '#fVffffFSffff#hffBB#',
    '#ffffffffffff#fffff#',
    '#fcTTcfffffff#fffff#',
    '#fcTTcfffsfffffffff#',
    '#ffffffffffff#fffff#',
    '#fpffffffffff#fffff#',
    '#ffffffffffff#######',
    '#ffffffffffff#',
    '####ff########',
  ],
};

// ---- elementary classroom ----
PP.maps.classroom = {
  name: 'Classroom', music: 'school', light: 'day', fill: 'f',
  legend: {
    '#': 'iwall', w: 'window', f: 'floor', d: 'desk', c: 'chair', h: 'shelf', T: 'table',
  },
  rows: [
    '#ww#ww#ww#ww#ww#ww##',
    '#ffffffffffffffffff#',
    '#fffffffTTffffffffh#',
    '#ffffffffffffffffff#',
    '#fdfdfdffdfdfdffdfd#',
    '#fcfcfcffcfcfcffcfc#',
    '#ffffffffffffffffff#',
    '#fdfdfdffdfdfdffdfd#',
    '#fcfcfcffcfcfcffcfc#',
    '#ffffffffffffffffff#',
    '#fdfdfdffdfdfdffdfd#',
    '#fcfcfcffcfcfcffcfc#',
    '#ffffffffffffffffff#',
    '########ff##########',
  ],
};

// ---- schoolyard ----
PP.maps.schoolyard = {
  name: 'Schoolyard', music: 'school', light: 'day', fill: 'd',
  legend: {
    F: 'fenceM', d: 'dirt', g: 'grass', T: 'tree', h: 'hwall', w: 'window',
    D: 'doorT', R: 'roof', p: 'path', b: 'bush', t: 'water',
  },
  rows: [
    'FRRRRRRRRRRRRRRRRRRRRRRRRF',
    'FRRRRRRRRRRRRRRRRRRRRRRRRF',
    'FhwwhwwhwwhDhwwhwwhwwhwwhF',
    'FddddddddddpdddddddddddddF',
    'FddddddddddpdddddddddddddF',
    'FgTgddddddddddddddddddgTgF',
    'FggddddddddddddddddddddggF',
    'FddddddddddddddddddddddddF',
    'FddddddddddddddddddddddddF',
    'FgbgddddddddddddddddddgbgF',
    'FggTddddddddddddddddddTggF',
    'FddddddddddddpdddddddddddF',
    'FFFFFFFFFFFFFpFFFFFFFFFFFF',
  ],
};

// ---- riverbank ----
PP.maps.riverbank = {
  name: 'Riverbank', music: 'aiko', light: 'evening', fill: 'g',
  legend: {
    g: 'grass', G: 'grass2', T: 'tree', p: 'path', w: 'water', f: 'flower',
    b: 'bush', r: 'rock', W: 'weed',
  },
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TggggGggggfggggggggGgggggfgggT',
    'TgGgggggggggggGggggggggggggggT',
    'pppppppppppppppppppppppppppppp',
    'GgggggggGggggggggggggGggggggGg',
    'ggfgggggggggggfggggggggggfgggg',
    'gggggGgggWggggggggWgggGggggggg',
    'GggggggggggGggggggggggggggggGg',
    'ggggrggggggggggggggggggrgggggg',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
};

// ---- abandoned factory ----
PP.maps.factory = {
  name: 'Abandoned factory', music: 'tense', light: 'dim', fill: 'u',
  legend: {
    '#': 'hwallD', u: 'rubble', c: 'crate', D: 'drum', m: 'machine', W: 'weed',
    f: 'floor', '.': 'rubble',
  },
  rows: [
    '########################',
    '#uuuuuuuDuuuuuuuucuuuuu#',
    '#uccuuuuuuuummuuuuuuuDu#',
    '#uccuuuuuuuummuuuuuuuuu#',
    '#uuuuuuWuuuuuuuuuuWuuuu#',
    '#uuuuuuuuuuuuuuuuuuuucc#',
    '#uDuuuuuuuuuuuuuuuuuucc#',
    '#uuuuucuuuuWuuuuuuuuuuu#',
    '#uuuuuuuuuuuuuuuuumuuuu#',
    '#uWuuuuuuumuuuuuuuuuuWu#',
    '#uuuuuDuuuuuuuucuuuuuuu#',
    '#uuuuuuuuuuuuuuuuuuuuuu#',
    '###########uu###########',
  ],
};

// ---- shrine ----
PP.maps.shrine = {
  name: 'Shrine', music: null, light: 'evening', fill: 'g',
  legend: {
    g: 'grass', G: 'grass2', T: 'tree', p: 'path', t: 'toriiB', s: 'shrineS',
    l: 'lantern', b: 'bush', f: 'flower',
  },
  rows: [
    'TTTTTTTTTTTTTTTTTT',
    'TggggggGssGggggggT',
    'TgggggggppgggggggT',
    'TggglggggggggleggT'.replace('e', 'g'),
    'TggggggggppgggggT',
    'TgbggggppppggggbT',
    'TggggggggppgggggT',
    'TggggggtppttggggT'.replace('tppt', 'tppt'),
    'TggggggtpptggggGT',
    'TgfggggggppggggfT',
    'TggGgggggppgggggT',
    'TTTTTTTTTppTTTTTT',
  ],
};

// ---- middle school gym ----
PP.maps.gym = {
  name: 'Gymnasium', music: 'school', light: 'day', fill: 'f',
  legend: {
    '#': 'iwallB', f: 'tileF', c: 'chair', l: 'tileD',
  },
  rows: [
    '######################',
    '#ffffffffffffffffffff#',
    '#ffffffffflfffffffffc#',
    '#ffffffffflfffffffffc#',
    '#ffffffffflfffffffffc#',
    '#ffffffffflffffffffff#',
    '#ffffffffflffffffffff#',
    '#ffffffffflfffffffffc#',
    '#ffffffffflfffffffffc#',
    '#ffffffffflfffffffffc#',
    '#ffffffffffffffffffff#',
    '#########ff###########',
  ],
};

// ---- Midori's cafe ----
PP.maps.cafe = {
  name: 'Cafe', music: 'home', light: 'day', fill: 'f',
  legend: {
    '#': 'iwall', f: 'floor', C: 'counter', s: 'stool', T: 'table', c: 'chair',
    h: 'shelf', p: 'plant', w: 'window',
  },
  rows: [
    '#ww##ww##ww##ww##!'.replace('!', '#'),
    '#hhfffffffffffffp#',
    '#CCCCCCCCffffffff#',
    '#fsfsfsfsffffcfff#',
    '#ffffffffffctTtff'.replace('t', 'f') + '#',
    '#fffcTcffffffcfff#',
    '#ffffcfffffffffff#',
    '#fpffffffffffffff#',
    '########ff########',
  ],
};

// ---- high school classroom ----
PP.maps.hs_class = {
  name: 'High school', music: 'school', light: 'day', fill: 'f',
  legend: {
    '#': 'iwall', w: 'window', f: 'floor', d: 'desk', c: 'chair', h: 'shelf', T: 'table',
  },
  rows: [
    '#ww#ww#ww#ww#ww#ww#ww#',
    '#ffffffffffffffffffff#',
    '#ffffffffTTfffffffffh#',
    '#ffffffffffffffffffff#',
    '#fdfdfdfdffdfdffdfdfd#',
    '#fcfcfcfcffcfcffcfcfc#',
    '#fdfdfdfdffdfdffdfdfd#',
    '#fcfcfcfcffcfcffcfcfc#',
    '#fdfdfdfdffdfdffdfdfd#',
    '#fcfcfcfcffcfcffcfcfc#',
    '#ffffffffffffffffffff#',
    '#########ff###########',
  ],
};

// ---- hospital ----
PP.maps.hospital = {
  name: 'Hospital', music: 'sad', light: 'day', fill: 'f',
  legend: {
    '#': 'iwall', f: 'tileF', B: 'bedH', C: 'counter', c: 'chair', p: 'plant', w: 'window',
  },
  rows: [
    '#ww##ww##ww##ww##ww#',
    '#ffffffffffffffffff#',
    '#BBffffBBffffBBffff#',
    '#ffffffffffffffffff#',
    '#ffffffffffffffffff#',
    '#ccffffffffffffffcc#',
    '#ffffffffCCCCffffff#',
    '#fpffffffffffffffpf#',
    '#ffffffffffffffffff#',
    '#########ff#########',
  ],
};

// ---- Punpun's adult apartment ----
PP.maps.apartment = {
  name: 'Apartment', music: 'sad', light: 'dim', fill: 'f',
  legend: {
    '#': 'iwall', f: 'floor', B: 'bed', T: 'table', V: 'tv', F: 'fridge', h: 'shelf', c: 'chair',
  },
  rows: [
    '##############',
    '#BBfffffffFff#',
    '#ffffffffffff#',
    '#ffffTTffffff#',
    '#ffffTTcffffф'.replace('ф', '#'),
    '#fVfffffffhff#',
    '#ffffffffffff#',
    '######ff######',
  ],
};

// ---- bar (Shishido's place) ----
PP.maps.bar = {
  name: 'Bar', music: 'aiko', light: 'dim', fill: 'f',
  legend: {
    '#': 'iwall', f: 'floor', C: 'barC', s: 'stool', h: 'shelf', T: 'table', c: 'chair',
  },
  rows: [
    '################',
    '#hhhhhffffffffф'.replace('ф', '#'),
    '#CCCCCCCfffffff#',
    '#fsfsfsfsffffff#',
    '#ffffffffffcfff#',
    '#fffffffffcTcff#',
    '#ffffffffffcfff#',
    '#######ff#######',
  ],
};

// ---- Sachi's studio ----
PP.maps.sachi_room = {
  name: "Sachi's room", music: 'home', light: 'day', fill: 'c',
  legend: {
    '#': 'iwall', c: 'carpet', d: 'desk', h: 'shelf', T: 'table', s: 'chair',
    p: 'plant', B: 'bed', w: 'window',
  },
  rows: [
    '#ww##ww##ww#####',
    '#hhccccccccccBB#',
    '#cccccccccccccc#',
    '#ddccccTTcccccc#',
    '#csccccTTcccccc#',
    '#ccccccccccccpc#',
    '#cccccccccccccc#',
    '#######cc#######',
  ],
};

// ---- Tokyo city street ----
PP.maps.city = {
  name: 'City', music: 'pegasus', light: 'night', fill: 's',
  legend: {
    C: 'citywall', S: 'screen', s: 'swalk', r: 'road', l: 'roadL', c: 'cross',
    p: 'pole', v: 'vend', n: 'windowN', '.': 'swalk',
  },
  rows: [
    'CCCCCCCCSSCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCSSCCCCCCCCCCCCCCCCCCCC',
    'CnCCnCCCSSCCnCCnCCnCCCnCCnCCnC',
    'ssssssssssssssssssssssssssssss',
    'sspsssssssssssssssssspssssssss',
    'rrrrrrrrrrrrrcrrrrrrrrrrrrrrrr',
    'lllllllllllllclllllllllllllllll',
    'rrrrrrrrrrrrrcrrrrrrrrrrrrrrrr',
    'ssssssssssssssssssssssssssssss',
    'ssvssssspsssssssssssssssspssss',
    'CnCCnCCnCCnCCnCCSSCCnCCnCCnCCC',
    'CCCCCCCCCCCCCCCCSSCCCCCCCCCCCC',
  ],
};

// ---- Aiko's house ----
PP.maps.aiko_house = {
  name: "Aiko's house", music: 'dark', light: 'dark', fill: 't',
  legend: {
    '#': 'iwall', t: 'tatami', h: 'shelf', T: 'table', l: 'lantern', B: 'bed',
    s: 'shrineS', c: 'chair', p: 'plant',
  },
  rows: [
    '##################',
    '#hshsfffffffthffB#'.replace('f', 't').replace('f', 't'),
    '#tttttttttttttttt#',
    '#tlttttttttttttlt#',
    '#ttttttTTtttttttt#',
    '#ttttttTTtttttttt#',
    '#tttttttttttttttt#',
    '#tttttttttttttttt#',
    '#ttttttttttttttht#',
    '########tt########',
  ],
};

// ---- the road south (flight montage) ----
PP.maps.road = {
  name: 'National Route', music: 'run', light: 'evening', fill: 'G',
  legend: {
    G: 'grassN', T: 'treeD', r: 'road', l: 'roadL', s: 'sign', W: 'weed',
    p: 'pole', g: 'grass2', d: 'dirt',
  },
  rows: [
    'TTTGGTTTGGGTTTGGGGTTTTGGGTTTGGGTTTTT',
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    'GGWGGGGsGGGGGGWGGGGGGGGGGGWGGGGGsGGG',
    'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    'ddddddddddddddddddddddddddddddddddd',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'llllllllllllllllllllllllllllllllllll',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'dddddddddddddddddddddddddddddddddddd',
    'GGpGGGGGGGGpGGGGGGGGpGGGGGGGGpGGGGGG',
    'GGWGGGGGGGGGGGGWGGGGGGGGWGGGGGGGGWGG',
    'TTTTGGGTTTTTGGGGTTTTTGGGGTTTTGGGTTTT',
  ],
};

// ---- the sea / Kagoshima beach ----
PP.maps.beach = {
  name: 'The sea', music: 'sea', light: 'day', fill: 'a',
  legend: {
    c: 'cliff', a: 'sand', W: 'sandW', e: 'sea', r: 'rock', g: 'grassN', T: 'treeD',
  },
  rows: [
    'ccccccccccccccccccccccccccc',
    'cggTggggggcccggggggTggggggc',
    'cgggggggggggggggggggggggggc',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaraaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaraaaaa',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'eeeeeeeeeeeeeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeeeeeeeeeeeeee',
  ],
};

// ---- abandoned house on the island ----
PP.maps.island_house = {
  name: 'Old house', music: null, light: 'dim', fill: 't',
  legend: {
    '#': 'iwall', t: 'tatami', h: 'shelf', T: 'table', W: 'weed', u: 'rubble', l: 'lantern',
  },
  rows: [
    '################',
    '#ttttttttttuttt#',
    '#tttttttttttttt#',
    '#ttTTttttttttut#',
    '#tttttttttttttt#',
    '#uttttttttttttt#',
    '#tttttttttltttt#',
    '#######tt#######',
  ],
};

// ---- dream void (God-space) ----
PP.maps.void = {
  name: '???', music: 'god', light: 'day', fill: 'v',
  legend: { v: 'voidF' },
  rows: [
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
    'vvvvvvvvvvvvvvvvvvvv',
  ],
};

// ---- hotel room ----
PP.maps.hotel = {
  name: 'Hotel', music: 'dark', light: 'dim', fill: 'c',
  legend: {
    '#': 'iwall', c: 'carpet', B: 'bed', V: 'tv', T: 'table',
  },
  rows: [
    '############',
    '#BBccccccVc#',
    '#BBcccccccc#',
    '#ccccTTcccc#',
    '#cccccccccc#',
    '#####cc#####',
  ],
};
