'use strict';
// CHAPTER 1 — Volume 1: "Aiko Tanaka"
// Elementary school. The transfer student. The fight at home. God. The videotape.

PP.registerChapter(1, 'Aiko Tanaka', async (S) => {
  S.form('kid');
  await S.card('PART ONE  —  CHAPTER 1', 'A I K O   T A N A K A');
  await S.caption('A small town, flat as a dropped futon,\nsomewhere in Japan.', 'The eleventh summer of Punpun Onodera.');

  // ---------- classroom: the transfer student ----------
  await S.load('classroom', 4, 8, 'up');
  const teacher = S.spawn('teacher', 8, 1, 'down', { name: 'Teacher' });
  const harumi = S.spawn('harumi_kid', 2, 8, 'up', { name: 'Harumi' });
  const seki = S.spawn('seki_kid', 9, 8, 'up', { name: 'Seki' });
  const shimizu = S.spawn('shimizu_kid', 11, 8, 'up', { name: 'Shimizu' });
  const komatsu = S.spawn('komatsu_kid', 6, 11, 'up', { name: 'Komatsu' });

  await S.n('Punpun was thinking about aliens when the door opened.');
  await S.say('Teacher', "Settle down. We have a transfer student joining us today.");
  const aiko = S.spawn('aiko_kid', 8, 13, 'up', { name: 'Aiko' });
  await S.walk(aiko, 8, 3);
  S.face(aiko, 'down');
  await S.say('Teacher', 'This is Aiko Tanaka. Be nice to her, or at least pretend convincingly.');
  await S.say('Aiko', "...I'm Aiko Tanaka.");
  await S.say('Aiko', 'Nice to meet you, I guess.');
  await S.wait(400);
  S.sfx('heart');
  await S.n('Punpun thought she was the prettiest girl he had ever seen in his entire life.');
  await S.n('His entire life was eleven years long, but still. The data felt conclusive.');
  await S.say('Seki', '(Oi, Punpun. Your face is doing something embarrassing.)');
  await S.say('Teacher', "Tanaka-san, take the seat by the window. Everyone else, pretend to open your textbooks.");
  await S.walk(aiko, 16, 5);
  S.face(aiko, 'up');
  await S.n('The morning crawled by like a wet caterpillar.');
  await S.n('Punpun did not learn a single thing.');
  S.flag('classFree');

  // ---------- free roam: talk to Aiko ----------
  await S.fadeOut(300);
  // lunch break layout
  S.face(teacher, 'down'); teacher.x = 2 * 16 + 8; teacher.y = 2 * 16 + 8;
  seki.x = 9 * 16 + 8; seki.y = 5 * 16 + 8; seki.dir = 'right';
  shimizu.x = 11 * 16 + 8; shimizu.y = 5 * 16 + 8; shimizu.dir = 'left';
  harumi.x = 3 * 16 + 8; harumi.y = 6 * 16 + 8; harumi.dir = 'down';
  komatsu.x = 6 * 16 + 8; komatsu.y = 11 * 16 + 8;
  await S.fadeIn(300);
  await S.n('Lunch break. A once-in-a-day chance to say literally anything to her.');

  harumi.on = async () => {
    await S.say('Harumi', "The new girl? She came from the next town over, I heard.");
    await S.say('Harumi', "You should say hi, Punpun. You have the face of someone who wants to say hi.");
  };
  seki.on = async () => {
    await S.say('Seki', "Listen. Shimizu's cousin says there's a VIDEO. An adult video. Hidden somewhere in this town.");
    await S.say('Shimizu', 'A legendary video...', {});
    await S.say('Seki', "When we find it, we'll be men. Real men, Punpun.");
  };
  shimizu.on = async () => {
    await S.say('Shimizu', 'This morning a cloud followed me to school.');
    await S.say('Shimizu', "It's outside the window right now. Waiting.");
    await S.n('Punpun looked. It was, indeed, a cloud.');
  };
  komatsu.on = async () => {
    await S.say('Komatsu', "I'm gonna marry the new girl. I decided just now.");
    await S.say('Komatsu', '...What? Why is your face like that?');
  };
  S.spot(8, 2, ['A blackboard. Today\'s kanji: "future".', 'Somebody drew a small penis next to it. The classics never die.']);
  S.spot(18, 2, ['The class bookshelf. Mostly dictionaries nobody has ever opened.']);

  aiko.on = S.gate('ch1_aiko', async () => {
    await S.say('Aiko', '...What.');
    await S.n('Every word Punpun had ever learned chose this moment to evacuate his body.');
    await S.say('Aiko', "You're Punpun, right? Weird name.");
    await S.say('Aiko', 'Hey, Punpun. Do you like this town?');
    const c = await S.choice(['I like it', 'Not really', '...']);
    if (c === 0) {
      await S.say('Aiko', 'Huh. Then you must not have looked at it very hard.');
    } else if (c === 1) {
      await S.say('Aiko', '...Yeah. Me neither.');
    } else {
      await S.say('Aiko', "Wow. Deep.");
    }
    await S.say('Aiko', "I hate it here. It smells like ditch water and everyone's eyes are dead.");
    await S.say('Aiko', "When I'm grown up, I'm going to Kagoshima. My uncle lives there. The sea is so blue it makes your chest hurt.");
    await S.say('Aiko', '...Want to come with me?');
    const c2 = await S.choice(["I'll come", "I can't"]);
    if (c2 === 0) {
      S.sfx('heart');
      await S.say('Aiko', 'Okay. Promise.');
      await S.n("She held out her little finger like it was a legal document.");
      await S.say('Aiko', 'If you break it, you swallow ten thousand needles. Standard terms.');
      await S.n('Punpun promised. Somewhere far away, ten thousand needles were minted in his name.');
    } else {
      await S.say('Aiko', '...You will, though.');
      await S.n('She said it like a weather report. Punpun suspected she was right.');
      await S.n('He promised anyway, thirty seconds later, with his whole heart.');
    }
    await S.say('Aiko', "Walk home with me. You live past the bridge too, right?");
  });
  await S.explore('ch1_aiko', 'Talk to the transfer student');

  // ---------- street, evening: walking home ----------
  await S.load('street', 3, 9, 'right');
  S.light('evening');
  const aikoSt = S.spawn('aiko_kid', 5, 9, 'right', { name: 'Aiko' });
  await S.n('They walked the long way without agreeing to.');
  await S.walkP(8, 9); await S.walk(aikoSt, 10, 9);
  await S.say('Aiko', 'My mom says this whole town is under a curse. She says a lot of things.');
  await S.walkP(13, 9); await S.walk(aikoSt, 15, 9);
  S.face(aikoSt, 'left');
  await S.n('Punpun told her about the alien.');
  await S.n('Last year, from the riverbank, he saw a light do three impossible things and then drop behind the factory chimney.');
  await S.say('Aiko', '...An alien. Behind the old miso factory.');
  const believed = await S.choice(['It was real', 'Maybe a plane']);
  if (believed === 0) {
    await S.say('Aiko', "I believe you. The world's too boring otherwise.");
  } else {
    await S.say('Aiko', "No. It was an alien. I've decided, so don't take it back.");
  }
  await S.say('Aiko', "Show me someday. If it comes back, we'll ask it to take us to Kagoshima. Cut out the middleman.");
  S.sfx('heart');
  await S.n('Punpun nodded so hard his vision rattled.');
  await S.say('Aiko', 'See you, Punpun. Don\'t die before tomorrow, okay?');
  await S.walk(aikoSt, 25, 9);
  S.hide(aikoSt);
  await S.n('Punpun stood in the orange light for a while, being extremely in love.');

  // ---------- home, night: the fight ----------
  await S.load('house', 5, 3, 'left');
  S.light('night');
  S.music('home');
  const mama = S.spawn('mama', 2, 3, 'right', { name: 'Mama' });
  await S.say('Mama', "You're late. Wash your hands.");
  await S.say('Mama', '...What are you smiling about? Creepy kid.');
  await S.n('Dinner was fried fish and the sound of the refrigerator.');
  await S.n('Papa came home late, smelling like the inside of an izakaya.');
  const papa = S.spawn('papa', 4, 8, 'up', { name: 'Papa' });
  await S.walk(papa, 4, 5);
  await S.say('Papa', '...What. Why is everyone looking at me.');
  await S.say('Mama', 'Nobody is looking at you. That is the problem, isn\'t it?');
  await S.fadeOut(600);
  await S.n('Punpun went to his room and put his head under the blanket.');
  await S.n('The walls of the house were thin. The voices were not.');
  S.sfx('thud'); S.shake(500, 2);
  await S.wait(700);
  S.sfx('crash'); S.shake(800, 3);
  await S.wait(900);
  S.sfx('thud');
  await S.n('Something fell. Something broke. Someone made a sound Punpun had never heard a person make.');
  await S.n('Then it was very, very quiet, which was worse.');
  await S.caption('Punpun counted prime numbers until morning.\nHe got to 113 before he stopped believing in them.');

  // ---------- morning after ----------
  S.hide(mama);
  PP.world.player.x = 16 * 16 + 8; PP.world.player.y = 3 * 16 + 8;
  papa.x = 5 * 16 + 8; papa.y = 3 * 16 + 8; papa.dir = 'down'; S.show(papa);
  S.light('day');
  await S.fadeIn(600);
  await S.walkP(8, 4);
  await S.n('Mama was not in the kitchen. The kitchen looked like a question nobody would answer.');
  await S.say('Papa', '...Punpun.');
  await S.say('Papa', "Mama's going to rest at the hospital for a while. It's nothing. Adults break sometimes, like washing machines.");
  await S.say('Papa', 'Hey. When things calm down... wanna go see a baseball game? Just us two.');
  const bb = await S.choice(['...Okay', '...']);
  if (bb === 0) await S.n('Punpun said okay, because Papa\'s eyes were asking for something bigger than baseball.');
  else await S.n('Punpun said nothing. Papa nodded anyway, as if he had.');
  await S.say('Papa', "It's a promise, then.");
  await S.fadeOut(800);
  await S.caption('Papa did not keep the promise.\n\nTwo days later, men in uniforms came,\nand Papa went somewhere far away.', 'The adults would not say where.');

  // ---------- God ----------
  await S.load('house', 16, 4, 'down', { stayDark: false });
  S.light('night');
  S.stopMusic();
  await S.n('Night again. The house was so empty it echoed when Punpun blinked.');
  await S.n('He remembered something Uncle Yuichi taught him, for emergencies only.');
  await S.n('"When life gets scary, say: Dear God, dear God, tinkle tinkle hoy."');
  await S.chant();
  S.music('god');
  await S.god('YO. You called?');
  await S.god("Punpun. My man. You look terrible. I mean that with divine love.");
  await S.god("Your mom? She'll live. Your dad? Gone-zo. That's the news, kid. I don't write it, I just read it.");
  await S.god('Listen. The world is a giant washing machine and everyone you love is a sock. Sometimes socks go missing. Nobody knows where. Not even me.');
  await S.god("...Don't cry. Ugh. Fine. Cry. Whatever. It's free.");
  await S.god("Here's my one tip, no charge: fall in love with something. Anything. A girl, a planet, a bus schedule. It won't save you. But it'll give the drowning a direction.");
  await S.god('Goodnight, Punpun.');
  S.godLeave();
  S.stopMusic();
  await S.n('Punpun decided to fall in love with Aiko Tanaka.');
  await S.n('Technically, he had already filed the paperwork.');
  await S.fadeOut(700);

  // ---------- Yuichi moves in ----------
  await S.caption('Three days later.');
  await S.load('house', 8, 5, 'down');
  S.light('day');
  S.music('home');
  const yuichi = S.spawn('yuichi', 4, 8, 'up', { name: 'Yuichi' });
  await S.walk(yuichi, 5, 5);
  await S.say('Yuichi', 'Yo, Punpun. Heard you could use a roommate.');
  await S.n('Uncle Yuichi was Mama\'s little brother. He smelled like cigarettes and unfinished sentences.');
  await S.say('Yuichi', "I'll handle rice and existential dread. You handle school. Deal?");
  await S.say('Yuichi', '...It gets better, little man. I am legally required to say that. But sometimes it\'s even true.');

  // ---------- schoolyard: the videotape ----------
  await S.load('schoolyard', 12, 11, 'up');
  await S.n('At school, Seki was vibrating with criminal energy.');
  const sekiY = S.spawn('seki_kid', 12, 7, 'down', { name: 'Seki' });
  const shimizuY = S.spawn('shimizu_kid', 13, 7, 'down', { name: 'Shimizu' });
  const harumiY = S.spawn('harumi_kid', 11, 7, 'down', { name: 'Harumi' });
  const komatsuY = S.spawn('komatsu_kid', 14, 8, 'left', { name: 'Komatsu' });
  await S.walkP(12, 9);
  await S.say('Seki', 'Emergency meeting. Shimizu. Tell them.');
  await S.say('Shimizu', 'I found a videotape in the storm drain by the factory. We watched it at my house.');
  await S.say('Shimizu', 'It was not the legendary adult video.');
  await S.say('Seki', 'It was a guy. Just a guy, talking to the camera. Saying he... did stuff. To his family.');
  await S.say('Harumi', "It's a prank. It has to be a prank. People don't just confess on tapes and throw them in drains.");
  await S.say('Seki', "He said he's living at the old miso factory now. Where nobody ever comes.");
  await S.wait(400);
  await S.n('The old miso factory. Where Punpun\'s alien went down.');
  await S.say('Komatsu', "So we're going, right? Tell me we're going.");
  await S.say('Seki', "Tomorrow. After school. Bring a flashlight and don't tell any adults.");
  await S.say('Harumi', 'I want it noted that I think this is a terrible idea.');
  await S.say('Seki', 'Noted. Bring snacks.');
  await S.n('Punpun thought about the alien, and about Kagoshima, and about how Aiko would look at him if he found either one.');
  await S.n('He decided to bring two flashlights.');
  await S.fadeOut(800);
  await S.caption('END OF CHAPTER 1', 'Vol. 1 — "Punpun Onodera is a normal 11-year-old kid."');
});
