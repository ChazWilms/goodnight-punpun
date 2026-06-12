'use strict';
// CHAPTER 2 — Volume 2: "The Expedition"
// The miso factory. The fire. Mama's balcony. The first broken promise.

PP.registerChapter(2, 'The Expedition', async (S) => {
  S.form('kid');
  await S.card('PART ONE  —  CHAPTER 2', 'T H E   E X P E D I T I O N');
  await S.caption('The next day, after school.', 'Operation: Confirm The Murderer (And Maybe The Alien)');

  // ---------- schoolyard gather ----------
  await S.load('schoolyard', 13, 11, 'up');
  const seki = S.spawn('seki_kid', 12, 8, 'down', { name: 'Seki' });
  const shimizu = S.spawn('shimizu_kid', 13, 8, 'down', { name: 'Shimizu' });
  const harumi = S.spawn('harumi_kid', 14, 8, 'down', { name: 'Harumi' });
  const komatsu = S.spawn('komatsu_kid', 11, 8, 'down', { name: 'Komatsu' });
  const aiko = S.spawn('aiko_kid', 15, 9, 'left', { name: 'Aiko' });
  await S.say('Seki', 'Roll call. Flashlights?');
  await S.say('Komatsu', 'Two!');
  await S.say('Seki', 'Snacks?');
  await S.say('Harumi', 'Rice crackers and one (1) emergency pudding.');
  await S.say('Seki', 'Courage?');
  await S.n('Silence.');
  await S.say('Aiko', "I'm coming too.");
  await S.n("Punpun's heart performed a maneuver banned in most prefectures.");
  await S.say('Seki', "...Fine. But if you scream, you're carrying the pudding.");
  await S.fadeOut(600);

  // ---------- the factory ----------
  await S.load('factory', 12, 11, 'up');
  await S.n('The miso factory had been dead for twenty years. It smelled like rust and old promises.');
  const sekiF = S.spawn('seki_kid', 11, 10, 'up', { name: 'Seki' });
  const shimizuF = S.spawn('shimizu_kid', 13, 10, 'up', { name: 'Shimizu' });
  const harumiF = S.spawn('harumi_kid', 10, 11, 'up', { name: 'Harumi' });
  const komatsuF = S.spawn('komatsu_kid', 14, 11, 'up', { name: 'Komatsu' });
  const aikoF = S.spawn('aiko_kid', 12, 12, 'up', { name: 'Aiko' });
  await S.say('Harumi', 'I would like to re-state, for the record, that this is a terrible idea.');
  await S.say('Seki', 'Recorded. Spread out. Look for... murderer stuff.');

  S.spot(8, 2, ['A rusted vat, big enough to drown a bus in.', 'Something scratched on the side: "1979 SAFETY FIRST".', 'Safety did not, historically, come first.']);
  S.spot(12, 2, ['Old machinery. Levers that connect to nothing anymore.', 'Punpun pulled one anyway. Somewhere, dust fell.']);
  S.spot(2, 6, ['A drum full of rainwater. A mosquito civilization thrives within.']);
  S.spot(21, 5, ['Crates stamped with kanji nobody could read.', ['Komatsu', 'It says "TREASURE". Probably. I can read like forty kanji.']]);

  const camp = S.gate('ch2_camp', async () => {
    await S.n('Behind the machines: a futon. A camp stove. A neat row of empty cup-noodle containers, arranged smallest to largest.');
    await S.say('Harumi', '...Somebody LIVES here.');
    await S.say('Shimizu', 'The noodles are sorted. Murderers sort their noodles.');
    S.sfx('thud');
    await S.n('A shadow detached itself from the dark.');
    const man = S.spawn('man2', 17, 4, 'down', { name: '???' });
    await S.walk(man, 17, 6);
    await S.say('???', '......');
    await S.say('???', "Kids. You shouldn't be here.");
    await S.say('???', 'People who come here... are people with nowhere else. You have somewhere else. Go there.');
    await S.say('Seki', 'D-did you kill your family?! We saw the tape!');
    await S.say('???', '...That tape.');
    await S.say('???', "It's easier to confess to a camera than to a person. I never sent it anywhere. The river must have carried it.");
    await S.n('Punpun could not tell if that was a confession or a eulogy.');
    await S.n('Then Punpun smelled smoke.');
  });
  S.marker(16, 3, { flag: 'ch2_camp', fn: camp });
  await S.explore('ch2_camp', 'Search the factory');

  // ---------- the fire ----------
  S.music('tense');
  S.flash(); S.sfx('crash'); S.shake(900, 3);
  await S.say('Seki', '...Uh.');
  await S.say('Seki', "THE CIGARETTE. I ONLY LIT IT TO LOOK COOL. IT WAS FOR THE AESTHETIC—");
  await S.n('The weeds along the wall went up like they had been waiting years for the invitation.');
  await S.say('???', 'OUT. NOW. THE BACK IS ALREADY GONE—');
  S.flash(); S.shake(700, 4); S.sfx('rumble');
  await S.say('Harumi', 'AIKO! WHERE IS AIKO?!');
  await S.n('Smoke ate the ceiling. A beam came down where Aiko had been standing.');
  await S.n('Punpun did not decide to move. His body filed the decision retroactively.');
  await S.fadeOut(250);
  S.sfx('crash');
  await S.caption('Punpun was nine-tenths legs and one-tenth terror,\nbut he carried her the whole way out.');

  // outside (the field by the river)
  await S.load('riverbank', 14, 6, 'down');
  S.light('evening'); S.stopMusic();
  const aikoOut = S.spawn('aiko_kid', 14, 8, 'up', { name: 'Aiko' });
  S.spawn('seki_kid', 11, 7, 'right', { name: 'Seki' });
  S.spawn('shimizu_kid', 12, 7, 'right', { name: 'Shimizu' });
  S.spawn('harumi_kid', 17, 7, 'left', { name: 'Harumi' });
  S.spawn('komatsu_kid', 18, 7, 'left', { name: 'Komatsu' });
  await S.n('Sirens, far away, getting closer.');
  await S.say('Harumi', "She's breathing. Aiko. AIKO.");
  await S.wait(700);
  await S.say('Aiko', '...the pudding...');
  await S.say('Harumi', 'THE PUDDING IS FINE. YOU ALMOST DIED.');
  await S.say('Aiko', 'Punpun carried me?');
  await S.n('Punpun examined a very interesting blade of grass.');
  await S.say('Aiko', '......Thanks.');
  S.sfx('heart');
  await S.say('Seki', 'Nobody tells ANY adult about the man, got it? He got out. I saw him get out. He waved.');
  await S.say('Shimizu', 'It was a nice wave.');
  await S.caption('The factory burned for six hours.\nThe alien, if it was ever there, did not come up in the news.');

  // ---------- hospital: mama ----------
  await S.card('', 'M A M A');
  await S.load('hospital', 9, 8, 'up');
  const mama = S.spawn('mama', 2, 3, 'down', { name: 'Mama' });
  const nurse = S.spawn('nurse', 10, 6, 'down', { name: 'Nurse' });
  nurse.on = async () => {
    await S.say('Nurse', 'Visiting hours end at six, sweetie.');
  };
  const mamaTalk = S.gate('ch2_mama', async () => {
    await S.walkP(2, 4);
    S.faceP('up');
    await S.say('Mama', '...Oh. You.');
    await S.say('Mama', "Did you eat? Yuichi can't cook. None of the men in this family can do anything.");
    await S.n('There was a long silence with furniture in it.');
    await S.say('Mama', "Punpun. Do you ever wish you'd been born to someone else?");
    const c = await S.choice(['No', 'Sometimes', 'Say nothing']);
    if (c === 0) {
      await S.say('Mama', "...You're a bad liar. You get that from me.");
    } else if (c === 1) {
      await S.say('Mama', "...Ha. At least you're honest. You don't get that from me.");
    } else {
      await S.say('Mama', '...Smart. Silence is the only thing nobody can use against you.');
    }
    await S.say('Mama', 'Go buy yourself a juice. The machine on this floor is broken, use the one downstairs. Take your time.');
  });
  mama.on = mamaTalk;
  await S.explore('ch2_mama', 'Visit Mama');

  await S.fadeOut(700);
  await S.caption("The juice machine took Punpun's coins\nand thought about it for a long time.");
  await S.load('hospital', 9, 8, 'up', { fast: true });
  S.light('dim');
  S.spawn('nurse', 3, 4, 'up', { name: 'Nurse' });
  S.spawn('nurse', 2, 5, 'up', { name: 'Nurse' });
  S.music('sad');
  await S.n('When Punpun came back, the bed was empty and the window at the end of the hall was open.');
  await S.n('Adults moved fast and spoke in the special quiet voice they think children cannot decode.');
  await S.say('Nurse', '(—from the second-floor balcony, the bushes caught most of—)');
  await S.say('Nurse', '(—lucky. If you can call it that—)');
  await S.n('Punpun stood very still and held the juice so hard the can dented.');
  await S.n('Mama was "fine". She had two broken ribs and was "fine".');
  await S.n('Nobody used any other word. There was one other word. Everybody walked around it like roadkill.');
  await S.fadeOut(800);

  // god at night
  await S.load('house', 16, 4, 'down');
  S.light('night'); S.stopMusic();
  await S.n("That night the ceiling of Punpun's room was very far away, then very close.");
  await S.chant();
  S.music('god');
  await S.god("Yo. Twice in one volume. I'm flattered, kid.");
  await S.god("Your mom didn't fall. You know that. You knew it before the nurses did.");
  await S.god('Here is the thing about adults, Punpun: they are children whose excuses got taller.');
  await S.god("You want to fix her. You can't. You're eleven. Your only jobs are: eat, grow, and don't follow her off any balconies. Renew annually.");
  await S.god('...Goodnight, Punpun.');
  S.godLeave();
  S.stopMusic();
  await S.fadeOut(700);

  // ---------- aiko's proposal ----------
  await S.caption('Two weeks later, Mama came home.\nThe house got quieter, which should not have been possible.');
  await S.load('riverbank', 6, 6, 'right');
  S.light('evening'); S.music('aiko');
  const aikoR = S.spawn('aiko_kid', 9, 6, 'left', { name: 'Aiko' });
  await S.say('Aiko', 'I heard about your mom. The real version, not the school version.');
  await S.say('Aiko', "My mom's broken too. Different model, same defect.");
  await S.n('Aiko looked at the river like it owed her money.');
  await S.say('Aiko', "Punpun. Let's go. Tonight. For real.");
  await S.say('Aiko', 'Last bus leaves at 9:40. We ride it to the end, then the morning ferry, then south and south and south until the sea turns the right color.');
  await S.say('Aiko', 'Kagoshima. Like we promised. Ten thousand needles, remember?');
  const c2 = await S.choice(["I'll be there", "I can't tonight"]);
  if (c2 === 0) {
    await S.say('Aiko', '9:40. The stop in front of the rice store.');
    await S.say('Aiko', "Don't be late. I'm bad at waiting. I've had a lot of practice and I'm still bad at it.");
  } else {
    await S.say('Aiko', '...There\'s no such thing as "not tonight", Punpun. Tonight is the only kind of night there is.');
    await S.say('Aiko', "9:40. I'll be there. What you do is up to you.");
  }
  await S.walk(aikoR, 2, 6);
  S.hide(aikoR);
  await S.n('Punpun watched her go and felt the needles already, faintly, like weather.');

  // ---------- the night ----------
  await S.load('house', 8, 4, 'down');
  S.light('night'); S.stopMusic();
  await S.n('8:50 PM.');
  await S.n('Punpun packed: one change of clothes, 3,200 yen, a flashlight (the good one), and the photo of the riverbank sky.');
  await S.n('9:05 PM.');
  const yuichi = S.spawn('yuichi', 5, 5, 'right', { name: 'Yuichi' });
  await S.say('Yuichi', '...Going somewhere, little man?');
  await S.n('Punpun said nothing, which said everything.');
  await S.say('Yuichi', "I'm not going to stop you. I'm just going to tell you one thing, and you can spend it however you want.");
  await S.say('Yuichi', 'Tonight, whatever you choose, will feel like the most important thing in the world. It might even be true.');
  await S.say('Yuichi', "But your mom asked me today if you hate her. First thing she's asked anyone in two weeks.");
  await S.n('9:21 PM.');
  await S.n('Punpun stood in the doorway of his own life with a backpack on.');
  await S.n('9:33 PM.');
  await S.n('He took the backpack off.');
  await S.n("He told himself: just for tonight. We can go tomorrow. Aiko will understand. The sea isn't going anywhere.");
  await S.n('Children believe the sea isn\'t going anywhere. That is the main thing wrong with children.');
  await S.fadeOut(1200);
  await S.caption('9:40 PM came and went,\nin front of the rice store,\nwherever it went.');

  // ---------- after ----------
  await S.load('classroom', 4, 8, 'up');
  S.music('school');
  const aikoC = S.spawn('aiko_kid', 16, 5, 'up', { name: 'Aiko' });
  const sekiC = S.spawn('seki_kid', 9, 8, 'up', { name: 'Seki' });
  sekiC.on = async () => {
    await S.say('Seki', "Factory's gone. They're saying a wiring fault. WIRING. In a building with no electricity.");
    await S.say('Seki', 'Adults will believe anything that lets them stop thinking.');
  };
  const tryAiko = S.gate('ch2_aiko_after', async () => {
    await S.n('Punpun rehearsed eleven different sentences on the way to her desk.');
    await S.say('Aiko', '......');
    await S.n('Aiko looked through him the way you look through a window with nothing outside it.');
    await S.n('She gathered her books and moved to the far seat.');
    await S.n('Punpun never found out if she went to the bus stop that night.');
    await S.n("Aiko never found out he didn't.");
    await S.n('Between them, where a sentence should have gone, a small permanent winter set in.');
  });
  aikoC.on = tryAiko;
  await S.explore('ch2_aiko_after', 'Talk to Aiko');

  await S.fadeOut(900);
  await S.caption('That spring, the divorce papers were finalized.\nMama came home for good. Papa wrote letters Punpun did not open.');
  await S.caption('Punpun decided being a child was a scam,\nand resolved to become an adult\nas soon as one of the openings appeared.');
  await S.caption('END OF CHAPTER 2', 'Vol. 2 — "The sea isn\'t going anywhere."');
});
