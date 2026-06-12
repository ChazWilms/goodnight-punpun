'use strict';
// Shared story utilities.

PP.S.light = (l) => { if (PP.world.map) PP.world.map.def.light = l; };

// The chant. Uncle Yuichi taught it to him.
PP.S.chant = async function () {
  const S = PP.S;
  await S.n('Punpun closed his eyes, the way Uncle Yuichi taught him.');
  await S.say('Punpun', '(Dear God, dear God, tinkle tinkle hoy.)');
  await S.say('Punpun', '(Dear God, dear God, tinkle tinkle hoy...)');
  PP.flash();
};

// flavor interactable that never gates progress
PP.S.prop = function (spr, x, y, dir, lines, opts = {}) {
  return PP.spawn(spr, x, y, dir, {
    ...opts,
    on: async () => {
      for (const l of lines) {
        if (Array.isArray(l)) await PP.S.say(l[0], l[1]);
        else await PP.S.n(l);
      }
    },
  });
};

// invisible examine spot (uses a tiny blank sprite)
PP.S.spot = function (x, y, lines) {
  if (!PP.sprites.__blank) {
    PP.sprites.__blank = { down: [PP.art.mkCanvas(2, 2)], up: [PP.art.mkCanvas(2, 2)], left: [PP.art.mkCanvas(2, 2)], right: [PP.art.mkCanvas(2, 2)] };
  }
  return PP.spawn('__blank', x, y, 'down', {
    solid: false, noFace: true,
    on: async () => {
      for (const l of lines) {
        if (Array.isArray(l)) await PP.S.say(l[0], l[1]);
        else await PP.S.n(l);
      }
    },
  });
};
