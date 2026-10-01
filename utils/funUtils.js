const { EmbedBuilder } = require('discord.js');

const WAIFU = new Set([
  'airkiss','angrystare','bite','bonk','brofist','cuddle','handhold','hug','kiss','lick','nom','nuzzle','pat','pinch','poke','punch','slap','smack','stare','tickle','wave','bleh','blush','celebrate','cheers','clap','confused','cool','cry','dance','drool','evillaugh','facepalm','happy','headbang','huh','laugh','love','mad','nervous','no','nosebleed','nyah','peek','pout','roll','run','sad','scared','shout','shrug','shy','sigh','sing','sip','sleep','slowclap','smile','smug','sneeze','sorry','stop','surprised','sweat','thumbsup','tired','wink','yawn','yay','yes'
]);

const WAIFU_ALIASES = {
  airkiss: 'blowkiss',
  angrystare: 'angry',
  brofist: 'highfive',
  handhold: 'handholding',
  evillaugh: 'evil',
  slowclap: 'clap',
  thumbsup: 'thumbs',
  yes: 'happy',
  no: 'no',
  nosebleed: 'bleed',
  nyah: 'nya'
};

const ENDPOINTS = new Set([
  'hug','kiss','pat','poke','punch','slap','cuddle','bite','bonk',
  'lick','nom','nuzzle','tickle','wave','blush','cry','dance',
  'happy','laugh','love','no','pout','run','sad','smile','smug',
  'stare','wink','thumbs','highfive','angry','clap','bleed','nya',
  'handholding','blowkiss'
]);

async function waifu(action) {
  const endpoint = WAIFU_ALIASES[action] || action;

  if (!ENDPOINTS.has(endpoint)) return null;

  const res = await fetch(
    `https://api.waifu.pics/sfw/${endpoint}`,
    {
      headers: {
        'User-Agent': 'FareBot/1.0'
      }
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data.url || null;
}

function target(message, args) {
  return (
    message.mentions.users.first() ||
    (args.length ? args.join(' ') : null)
  );
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function embed(title, description, image) {
  const e = new EmbedBuilder()
    .setColor('#D3D3D3')
    .setTitle(title)
    .setDescription(description);

  if (image) e.setImage(image);

  return e;
}

const eight = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes — definitely.',
  'You may rely on it.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Don’t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];

async function runFun(name, message, args) {
  const t = target(message, args);

  if (WAIFU.has(name)) {
    const url = await waifu(name).catch(() => null);

    const actionText = name.replace(
      /([a-z])([A-Z])/g,
      '$1 $2'
    );

    const who = t
      ? (
          typeof t === 'string'
            ? `**${t}**`
            : `<@${t.id}>`
        )
      : 'everyone';

    return message.reply({
      embeds: [
        embed(
          `✨ ${name}`,
          `${message.author} **${name}** ${who}.`,
          url
        )
      ]
    });
  }

  switch (name) {
    case 'eightball':
      return message.reply(pick(eight));

    case 'reverse':
      return message.reply(
        args.length
          ? args.join(' ').split('').reverse().join('')
          : 'Usage: `,reverse <text>`'
      );

    case 'mock':
      return message.reply(
        args.length
          ? args.join(' ')
              .split('')
              .map((c, i) =>
                /[a-z]/i.test(c)
                  ? (
                      i % 2
                        ? '_' + c.toUpperCase() + '_'
                        : c.toLowerCase()
                    )
                  : c
              )
              .join('')
          : 'Usage: `,mock <text>`'
      );

    case 'doublestruck':
      return message.reply(
        args.length
          ? args.join(' ')
              .split('')
              .map(c =>
                /[A-Za-z]/.test(c)
                  ? String.fromCodePoint(
                      c.toLowerCase().charCodeAt(0) +
                      0x1d400 -
                      97
                    )
                  : c
              )
              .join('')
          : 'Usage: `,doublestruck <text>`'
      );

    case 'emojipasta':
      return message.reply(
        args.length
          ? args.join(' ')
              .split('')
              .map(c =>
                /[a-z]/i.test(c)
                  ? `:${c.toLowerCase()}:`
                  : c
              )
              .join('')
          : 'Usage: `,emojipasta <text>`'
      );

    case 'morse': {
      const map = {
        a: '.-',
        b: '-...',
        c: '-.-.',
        d: '-..',
        e: '.',
        f: '..-.',
        g: '--.',
        h: '....',
        i: '..',
        j: '.---',
        k: '-.-',
        l: '.-..',
        m: '--',
        n: '-.',
        o: '---',
        p: '.--.',
        q: '--.-',
        r: '.-.',
        s: '...',
        t: '-',
        u: '..-',
        v: '...-',
        w: '.--',
        x: '-..-',
        y: '-.--',
        z: '--..',
        '1': '.----',
        '2': '..---',
        '3': '...--',
        '4': '....-',
        '5': '.....',
        '6': '-....',
        '7': '--...',
        '8': '---..',
        '9': '----.',
        '0': '-----'
      };

      return message.reply(
        args.length
          ? args.join(' ')
              .toLowerCase()
              .split('')
              .map(c =>
                c === ' '
                  ? '/'
                  : (map[c] || c)
              )
              .join(' ')
          : 'Usage: `,morse <text>`'
      );
    }

    case 'pickup':
      return message.reply(
        pick([
          'Are you Wi-Fi? Because I’m feeling a connection.',
          'You must be a command, because you have my full attention.',
          'Are you a Discord notification? Because I can’t ignore you.'
        ])
      );

    case 'showerthought':
      return message.reply(
        pick([
          'If tomatoes are a fruit, ketchup is technically a smoothie.',
          'Your future self is watching you through memories.',
          'Why do we press harder on a remote when the batteries are dying?'
        ])
      );

    case 'joke':
      return message.reply(
        pick([
          'Why did the developer go broke? Because he used up all his cache.',
          'Why do programmers prefer dark mode? Because light attracts bugs.',
          'I told my bot a joke. It said: 500 Internal Server Error.'
        ])
      );

    case 'fact':
      return message.reply(
        pick([
          'Honey never spoils when properly stored.',
          'Octopuses have three hearts.',
          'Bananas are botanically berries.'
        ])
      );

    case 'truth':
      return message.reply(
        pick([
          'What is your most embarrassing recent moment?',
          'Who was the last person you stalked online?',
          'What is a secret you have never told your friends?'
        ])
      );

    case 'dare':
      return message.reply(
        pick([
          'Send the fifth photo in your gallery.',
          'Change your status to “I love pineapple pizza” for 10 minutes.',
          'Type your next message with your eyes closed.'
        ])
      );

    case 'caption':
      return message.reply(
        pick([
          'main character energy.',
          'quietly becoming better.',
          'no explanation needed.',
          'caught somewhere between chaos and calm.'
        ])
      );

    case 'quote':
      return message.reply(
        pick([
          '“The secret of getting ahead is getting started.”',
          '“Success is the sum of small efforts repeated day in and day out.”',
          '“Do what you can, with what you have, where you are.”'
        ])
      );

    case 'opinion':
      return message.reply(
        args.length
          ? `My completely unbiased opinion: **${args.join(' ')}** is ${pick([
              'interesting.',
              'questionable.',
              'actually pretty good.',
              'chaotic.'
            ])}.`
          : 'Usage: `,opinion <topic>`'
      );

    case 'couldread':
      return message.reply(
        args.length
          ? `I could read **${args.join(' ')}** all day.`
          : 'Usage: `,couldread <text>`'
      );

    case 'alert':
      return message.reply({
        content: `🚨 ${
          args.length
            ? args.join(' ')
            : 'Alert triggered!'
        }`
      });

    case 'supreme':
      return message.reply(
        pick([
          'SUPREME.',
          'Absolutely supreme.',
          'Peak behavior.'
        ])
      );

    case 'whowouldwin':
      return message.reply(
        t
          ? `${message.author} vs ${
              typeof t === 'string'
                ? t
                : `<@${t.id}>`
            } — **${pick([
              'you never know.',
              '50/50.',
              'the chaos wins.'
            ])}**`
          : 'Usage: `,whowouldwin @user`'
      );

    case 'jokeoverhead':
      return message.reply(
        '⚠️ Joke overhead. Please duck.'
      );

    case 'caution':
      return message.reply(
        '⚠️ Proceed with caution.'
      );

    case 'gun':
      return message.reply(
        '🔫 Pew pew. Keep it fictional and harmless.'
      );

    case 'drip':
      return message.reply(
        `${t
          ? (
              typeof t === 'string'
                ? t
                : `<@${t.id}>`
            )
          : message.author} has been inspected for drip. 💧`
      );

    case 'blur':
      return message.reply(
        '🫥 Blur filter activated — imagine everything slightly out of focus.'
      );

    case 'invert':
      return message.reply(
        '🔄 Invert filter activated.'
      );

    case 'greyscale':
      return message.reply(
        '⬛ Greyscale filter activated.'
      );

    case 'advertise':
      return message.reply(
        '📢 Fare — Minimal. Powerful. Built for modern Discord communities.'
      );

    case 'mnm':
      return message.reply(
        '🍫 M&M mode: enabled.'
      );

    case 'clown':
      return message.reply(
        `${t
          ? (
              typeof t === 'string'
                ? t
                : `<@${t.id}>`
            )
          : message.author} 🤡 certified clown.`
      );

    case 'jailed':
      return message.reply(
        `${t
          ? (
              typeof t === 'string'
                ? t
                : `<@${t.id}>`
            )
          : message.author} has been sent to the meme jail. 🔒`
      );

    case 'wanted':
      return message.reply(
        `🚨 WANTED: ${
          t
            ? (
                typeof t === 'string'
                  ? t
                  : `<@${t.id}>`
              )
            : message.author
        }`
      );

    case 'pet':
      return message.reply(
        `🐾 ${message.author} pets ${
          t
            ? (
                typeof t === 'string'
                  ? t
                  : `<@${t.id}>`
              )
            : 'the air'
        }.`
      );

    case 'nokia':
      return message.reply(
        '📱 Nokia durability test: **passed.**'
      );

    case 'uncover':
      return message.reply(
        '🕵️ Something was uncovered. Unfortunately, it was another Discord message.'
      );

    case 'huerotate':
      return message.reply(
        '🌈 Hue rotated successfully.'
      );

    case 'colorify':
      return message.reply(
        '🌈 Colorify activated.'
      );

    case 'cat': {
      const r = await fetch(
        'https://cataas.com/cat?json=true'
      ).catch(() => null);

      const d =
        r && r.ok
          ? await r.json().catch(() => null)
          : null;

      return message.reply({
        embeds: [
          embed(
            '🐱 Cat',
            'Here is your cat.',
            d?.url || 'https://cataas.com/cat'
          )
        ]
      });
    }

    case 'hack':
      return message.reply(
        `💻 Hacking ${
          t
            ? (
                typeof t === 'string'
                  ? t
                  : `<@${t.id}>`
              )
            : 'the mainframe'
        }...\n${pick([
          '[██████████] 100%',
          'Access denied 😭',
          'Totally hacked. Trust me.'
        ])}`
      );

    case 'token':
      return message.reply(
        '🔐 Nice try. Fare will never expose Discord tokens or secrets.'
      );

    case 'biden':
      return message.reply(
        '🇺🇸 Meme command executed.'
      );

    case 'pikachu':
      return message.reply(
        '⚡ Pika pika!'
      );

    case 'oogway':
      return message.reply(
        '🐢 There are no accidents.'
      );

    case 'drake':
      return message.reply(
        '🙅 Drake says no.\n👉 Drake says yes.'
      );

    case 'pooh':
      return message.reply(
        '🍯 Pooh approves.'
      );

    case 'sadcat':
      return message.reply(
        '😿 *sad cat noises*'
      );

    case 'factsmeme':
      return message.reply(
        '📚 FACTS: you are currently using Fare.'
      );

    case 'unforgivable':
      return message.reply(
        '🚫 That was unforgivable.'
      );

    case 'cool':
      return message.reply(
        '😎 Cool detected.'
      );

    default:
      return message.reply(
        'Fun command executed!'
      );
  }
}

module.exports = { runFun };
