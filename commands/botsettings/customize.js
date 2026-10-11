const {
  EmbedBuilder,
  PermissionsBitField
} = require('discord.js');

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]);
const DISCORD_CDN_HOSTS = new Set([
  'cdn.discordapp.com',
  'media.discordapp.net'
]);

function errorEmbed(text) {
  return new EmbedBuilder()
    .setColor('#ED4245')
    .setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

function helpEmbed() {
  return new EmbedBuilder()
    .setColor('#D3D3D3')
    .setTitle('Server-only bot profile')
    .setDescription(
      'These settings affect the bot only in this server. Its global Discord profile will not change.\n\n' +
      '`,customize` — show this help\n' +
      '`,customize bio <text>` — set the server bio\n' +
      '`,customize avatar` — attach an image to set the server avatar\n' +
      '`,customize banner` — attach an image to set the server banner\n' +
      '`,customize nick <name>` — set the bot’s nickname in this server\n' +
      '`,customize reset <avatar|banner|bio|nick|all>` — reset one or all server settings'
    );
}

async function attachmentToDataUri(attachment) {
  if (attachment.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 8 MB or smaller.');
  }

  const imageUrl = new URL(attachment.url);
  if (
    imageUrl.protocol !== 'https:' ||
    !DISCORD_CDN_HOSTS.has(imageUrl.hostname)
  ) {
    throw new Error('Please attach an image directly to your message.');
  }

  const response = await fetch(imageUrl, {
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error('I could not download that image. Please try uploading it again.');
  }

  const contentType = (response.headers.get('content-type') || '')
    .split(';')[0]
    .trim()
    .toLowerCase();

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new Error('Use a PNG, JPG, WEBP, or GIF image.');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('I could not read that image. Please try uploading it again.');
  }

  const chunks = [];
  let totalSize = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalSize += value.byteLength;
    if (totalSize > MAX_IMAGE_SIZE) {
      await reader.cancel();
      throw new Error('Images must be 8 MB or smaller.');
    }

    chunks.push(Buffer.from(value));
  }

  return `data:${contentType};base64,${Buffer.concat(chunks).toString('base64')}`;
}

module.exports = {
  name: 'customize',
  aliases: ['customise'],

  async execute(message, args, client) {
    if (!message.guild || !message.member) {
      return message.reply({
        embeds: [errorEmbed('Use this command inside a server.')]
      });
    }

    const hasPermission =
      message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
      message.member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!hasPermission) {
      return message.reply({
        embeds: [errorEmbed('Only server admins can change the bot’s server profile.')]
      });
    }

    const action = (args[0] || '').toLowerCase();

    if (!action || action === 'help') {
      return message.reply({ embeds: [helpEmbed()] });
    }

    let body;
    let successText;

    if (action === 'avatar' || action === 'banner') {
      const attachment = message.attachments.first();

      if (!attachment) {
        return message.reply({
          embeds: [
            errorEmbed(`Attach an image to the command message to set the server ${action}.`)
          ]
        });
      }

      try {
        body = { [action]: await attachmentToDataUri(attachment) };
      } catch (error) {
        return message.reply({
          embeds: [errorEmbed(error.message || 'I could not use that image.')]
        });
      }

      successText = `The bot’s server ${action} has been updated. Its global profile is unchanged.`;
    } else if (action === 'bio') {
      const bio = args.slice(1).join(' ').trim();

      if (bio.toLowerCase() === 'clear') {
        body = { bio: null };
        successText = 'The bot’s bio has been cleared for this server.';
      } else {
        if (!bio) {
          return message.reply({
            embeds: [errorEmbed('Use `,customize bio <text>` to set a bio, or `,customize reset bio` to clear it.')]
          });
        }

        if (bio.length > 190) {
          return message.reply({
            embeds: [errorEmbed('The server bio can be up to 190 characters.')]
          });
        }

        body = { bio };
        successText = 'The bot’s bio has been updated for this server.';
      }
    } else if (action === 'nick') {
      const nick = args.slice(1).join(' ').trim();

      if (nick.toLowerCase() === 'clear') {
        body = { nick: null };
        successText = 'The bot’s nickname has been cleared for this server.';
      } else {
        if (!nick) {
          return message.reply({
            embeds: [errorEmbed('Use `,customize nick <name>` to set a nickname, or `,customize reset nick` to clear it.')]
          });
        }

        if (nick.length > 32) {
          return message.reply({
            embeds: [errorEmbed('The bot’s server nickname can be up to 32 characters.')]
          });
        }

        body = { nick };
        successText = 'The bot’s nickname has been updated for this server.';
      }
    } else if (action === 'reset') {
      const target = (args[1] || '').toLowerCase();

      const resetBodies = {
        avatar: { avatar: null },
        banner: { banner: null },
        bio: { bio: null },
        nick: { nick: null },
        all: { avatar: null, banner: null, bio: null, nick: null }
      };

   if (!resetBodies[target]) {
  return message.reply({
    embeds: [
      errorEmbed(
        'Use `,customize reset <avatar|banner|bio|nick|all>`.\n' +
        'Example: `,customize reset bio`'
      )
    ]
  });
   }

      body = resetBodies[target];
      successText = target === 'all'
        ? 'All of the bot’s server profile settings have been reset. Its global profile is unchanged.'
        : `The bot’s server ${target} has been reset.`;
    } else {
      return message.reply({ embeds: [helpEmbed()] });
    }

    try {
      // This endpoint changes the bot's profile only in the current server.
      await client.rest.patch(`/guilds/${message.guild.id}/members/@me`, { body });
    } catch (error) {
      console.error('SERVER PROFILE UPDATE ERROR:', error);
      return message.reply({
        embeds: [
          errorEmbed('Discord could not update the server profile. Check the image or text and try again.')
        ]
      });
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#57F287')
          .setDescription(`<:Tick:1514714190500335677> ${successText}`)
      ]
    });
  }
};
