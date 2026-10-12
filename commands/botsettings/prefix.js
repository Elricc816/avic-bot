const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database');

const DEFAULT_PREFIX = ',';
const MAX_PREFIXES = 5;
const MAX_PREFIX_LENGTH = 3;
const PREFIX_KEY = guildId => `server_prefixes_${guildId}`;

function helpEmbed() {
  return new EmbedBuilder()
    .setColor('#D3D3D3')
    .setTitle('Prefix Commands')
    .setDescription(
      '`,prefix` — show these commands\n' +
      '`,prefix show` — show this server’s active prefixes\n' +
      '`,prefix set <prefix>` — replace all active prefixes with one\n' +
      '`,prefix add <prefix>` — add a prefix without removing the others\n' +
      '`,prefix remove <prefix>` — remove one active prefix\n' +
      '`,prefix reset` — use only the default prefix `,`\n\n' +
      '-# Max 5 prefixes per server, each up to 3 characters. Use `prefix set` to override all.\n' +
      '-# Users with No Prefix enabled do not require these prefixes.'
    );
}

function showPrefixesEmbed(prefixes) {
  const lines = prefixes.map((prefix, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `**[\`${number}\`]** → \`${prefix}\``;
  });

  return new EmbedBuilder()
    .setColor('#D3D3D3')
    .setDescription(
      `### Server Prefixes [${prefixes.length}]\n` +
      lines.join('\n') +
      '\n\n' +
      '-# Max 5 prefixes per server, each up to 3 characters. Use `prefix set` to override all.\n' +
      '-# Users with No Prefix enabled do not require these prefixes.'
    );
}

module.exports = {
  name: 'prefix',

  async execute(message, args) {
    const reply = (text, color = '#D3D3D3') =>
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription(text)
        ]
      });

    if (!message.guild || !message.member) {
      return reply('Use this command inside a server.', '#ED4245');
    }

    const action = (args[0] || 'help').toLowerCase();
    const key = PREFIX_KEY(message.guild.id);
    const savedPrefixes = await db.get(key);

    let prefixes =
      Array.isArray(savedPrefixes) && savedPrefixes.length > 0
        ? savedPrefixes
        : [DEFAULT_PREFIX];

    if (action === 'help') {
      return message.reply({ embeds: [helpEmbed()] });
    }

    if (action === 'show') {
      return message.reply({ embeds: [showPrefixesEmbed(prefixes)] });
    }

    const canManagePrefixes =
      message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
      message.member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!canManagePrefixes) {
      return reply('Only server admins can change this server’s prefixes.', '#ED4245');
    }

    if (action === 'reset') {
      const onlyDefault =
        prefixes.length === 1 && prefixes[0] === DEFAULT_PREFIX;

      if (onlyDefault) {
        return reply('**There are no custom prefixes configured to reset.**');
      }

      await db.delete(key);
      return reply(
        `Prefixes reset. Only the default prefix \`${DEFAULT_PREFIX}\` works in this server now.`,
        '#57F287'
      );
    }

    if (!['set', 'add', 'remove'].includes(action)) {
      return message.reply({ embeds: [helpEmbed()] });
    }

    const value = args.slice(1).join(' ').trim();

    if (!value) {
      return reply(`Give me a prefix. Example: \`,prefix ${action} !\``, '#ED4245');
    }

    if (Array.from(value).length > MAX_PREFIX_LENGTH || /[\s@`]/u.test(value)) {
      return reply('A prefix must be 1–3 characters and cannot contain spaces.', '#ED4245');
    }

    if (action === 'set') {
      if (value === DEFAULT_PREFIX) {
        await db.delete(key);
        return reply(
          `This server now uses only the default prefix \`${DEFAULT_PREFIX}\`.`,
          '#57F287'
        );
      }

      await db.set(key, [value]);
      return reply(
        `This server’s only active prefix is now \`${value}\`.`,
        '#57F287'
      );
    }

    if (action === 'add') {
      if (prefixes.includes(value)) {
        return reply(`\`${value}\` is already active in this server.`, '#ED4245');
      }

      if (prefixes.length >= MAX_PREFIXES) {
        return reply(`A server can have up to ${MAX_PREFIXES} active prefixes.`, '#ED4245');
      }

      prefixes.push(value);
      await db.set(key, prefixes);

      return reply(
        `Added \`${value}\`. Active prefixes: ${prefixes.map(prefix => `\`${prefix}\``).join(', ')}.`,
        '#57F287'
      );
    }

    if (!prefixes.includes(value)) {
      return reply(`\`${value}\` is not active in this server.`, '#ED4245');
    }

    if (prefixes.length === 1) {
      return reply(
        'You cannot remove the last active prefix. Add another prefix first, or use `prefix reset` to restore the default.',
        '#ED4245'
      );
    }

    prefixes = prefixes.filter(prefix => prefix !== value);

    if (prefixes.length === 1 && prefixes[0] === DEFAULT_PREFIX) {
      await db.delete(key);
    } else {
      await db.set(key, prefixes);
    }

    return reply(
      `Removed \`${value}\`. Remaining prefixes: ${prefixes.map(prefix => `\`${prefix}\``).join(', ')}.`,
      '#57F287'
    );
  }
};
