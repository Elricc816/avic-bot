const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database');

const GLOBAL_PREFIX = ',';
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
    const storedPrefixes = await db.get(key);
    let prefixes = Array.isArray(storedPrefixes) ? storedPrefixes : [];

    const action = (args[0] || 'show').toLowerCase();
    const value = args.slice(1).join(' ').trim();

    if (action === 'show') {
      const serverPrefixes = prefixes.length
        ? prefixes.map(prefix => `\`${prefix}\``).join(', ')
        : 'None set';

      return reply(
        `Global prefix: \`${GLOBAL_PREFIX}\` (always works)\n` +
        `Extra prefixes for this server: ${serverPrefixes}\n\n` +
        'Use `,prefix set <prefix>`, `,prefix add <prefix>`, ' +
        '` ,prefix remove <prefix>`, or `,prefix reset`.'
      );
    }

    if (action === 'reset') {
      await db.delete(key);
      return reply(
        `This server’s extra prefixes have been reset. The global prefix \`${GLOBAL_PREFIX}\` still works.`,
        '#57F287'
      );
    }

    if (!['set', 'add', 'remove'].includes(action)) {
      return reply(
        'Commands: `,prefix show`, `,prefix set <prefix>`, `,prefix add <prefix>`, `,prefix remove <prefix>`, `,prefix reset`.'
      );
    }

    if (!value) {
      return reply(`Give me a prefix. Example: \`,prefix ${action} !\``, '#ED4245');
    }

    if (value.length > MAX_PREFIX_LENGTH || /[\s@`]/u.test(value)) {
      return reply('A prefix must be 1–10 characters, with no spaces.', '#ED4245');
    }

    if (value === GLOBAL_PREFIX) {
      return reply(
        `\`${GLOBAL_PREFIX}\` is the global prefix and cannot be added or removed.`,
        '#ED4245'
      );
    }

    if (action === 'set') {
      prefixes = [value];
      await db.set(key, prefixes);

      return reply(
        `This server’s extra prefix is now \`${value}\`. The global prefix \`${GLOBAL_PREFIX}\` still works.`,
        '#57F287'
      );
    }

    if (action === 'add') {
      if (prefixes.includes(value)) {
        return reply(`\`${value}\` is already set for this server.`, '#ED4245');
      }

      if (prefixes.length >= MAX_CUSTOM_PREFIXES) {
        return reply(`A server can have up to ${MAX_CUSTOM_PREFIXES} extra prefixes.`, '#ED4245');
      }

      prefixes.push(value);
      await db.set(key, prefixes);

      return reply(`Added \`${value}\` for this server.`, '#57F287');
    }

    if (!prefixes.includes(value)) {
      return reply(`\`${value}\` is not set as an extra prefix for this server.`, '#ED4245');
    }

    prefixes = prefixes.filter(prefix => prefix !== value);

    if (prefixes.length) {
      await db.set(key, prefixes);
    } else {
      await db.delete(key);
    }

    return reply(`Removed \`${value}\` from this server. The global prefix still works.`, '#57F287');
  }
};
