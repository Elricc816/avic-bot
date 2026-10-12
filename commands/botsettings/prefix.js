const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database');

const DEFAULT_PREFIX = ',';
const MAX_PREFIX_LENGTH = 10;
const MAX_CUSTOM_PREFIXES = 5;
const PREFIX_KEY = guildId => `server_prefixes_${guildId}`;

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

    const canManagePrefixes =
      message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
      message.member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!canManagePrefixes) {
      return reply('Only server admins can change this server’s prefix.', '#ED4245');
    }

    const key = PREFIX_KEY(message.guild.id);
    const savedPrefixes = await db.get(key);
    let prefixes = Array.isArray(savedPrefixes) ? savedPrefixes : [];

    const action = (args[0] || 'show').toLowerCase();
    const value = args.slice(1).join(' ').trim();

    if (action === 'show') {
      const activePrefixes = prefixes.length ? prefixes : [DEFAULT_PREFIX];

      return reply(
        `Active prefix${activePrefixes.length === 1 ? '' : 'es'}: ` +
        activePrefixes.map(prefix => `\`${prefix}\``).join(', ')
      );
    }

    if (action === 'reset') {
      if (prefixes.length === 0) {
        return reply('**There are no custom prefixes configured to reset.**');
      }

      await db.delete(key);
      return reply(
        `Custom prefixes reset. The default prefix \`${DEFAULT_PREFIX}\` now works in this server.`,
        '#57F287'
      );
    }

    if (!['set', 'add', 'remove'].includes(action)) {
      return reply(
        'Use `,prefix show`, `,prefix set <prefix>`, `,prefix add <prefix>`, ' +
        '` ,prefix remove <prefix>`, or `,prefix reset`.'
      );
    }

    if (!value) {
      return reply(`Give me a prefix. Example: \`,prefix ${action} !\``, '#ED4245');
    }

    if (value.length > MAX_PREFIX_LENGTH || /[\s@`]/u.test(value)) {
      return reply('A prefix must be 1–10 characters and cannot contain spaces.', '#ED4245');
    }

    if (value === DEFAULT_PREFIX) {
      return reply(
        `\`${DEFAULT_PREFIX}\` is the default prefix. Use \`,prefix reset\` to return to it.`,
        '#ED4245'
      );
    }

    if (action === 'set') {
      await db.set(key, [value]);

      return reply(
        `This server’s only prefix is now \`${value}\`. The default prefix is off in this server.`,
        '#57F287'
      );
    }

    if (action === 'add') {
      if (prefixes.includes(value)) {
        return reply(`\`${value}\` is already set for this server.`, '#ED4245');
      }

      if (prefixes.length >= MAX_CUSTOM_PREFIXES) {
        return reply(`A server can have up to ${MAX_CUSTOM_PREFIXES} custom prefixes.`, '#ED4245');
      }

      prefixes.push(value);
      await db.set(key, prefixes);

      return reply(
        `Added \`${value}\`. The active prefixes are ${prefixes.map(prefix => `\`${prefix}\``).join(', ')}.`,
        '#57F287'
      );
    }

    if (prefixes.length === 0) {
      return reply('There are no custom prefixes set for this server.', '#ED4245');
    }

    if (!prefixes.includes(value)) {
      return reply(`\`${value}\` is not set for this server.`, '#ED4245');
    }

    prefixes = prefixes.filter(prefix => prefix !== value);

    if (prefixes.length > 0) {
      await db.set(key, prefixes);
      return reply(
        `Removed \`${value}\`. Remaining prefixes: ${prefixes.map(prefix => `\`${prefix}\``).join(', ')}.`,
        '#57F287'
      );
    }

    await db.delete(key);
    return reply(
      `Removed \`${value}\`. No custom prefixes remain, so the default \`${DEFAULT_PREFIX}\` works again.`,
      '#57F287'
    );
  }
};
