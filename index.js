require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const { shortenUrl, deleteShortUrl, getOriginalUrl } = require('./utils/shortener.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const originalUrl = await getOriginalUrl(shortId);

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === 'ping') {
    message.reply({ content: 'Pong!' });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create') {
    const url = interaction.options.getString('url');

    if (!url) return interaction.reply('Please provide a URL.');
    if (!url.startsWith('http')) return interaction.reply('Please provide a valid URL.');

    try {
      const shortUrl = await shortenUrl(url);
      return interaction.reply(`Here is your short URL: ${shortUrl}`);
    } catch (e) {
      console.error(e);
      return interaction.reply('Failed to create short URL.');
    }
  }

  if (interaction.commandName === 'delete') {
    const shortId = interaction.options.getString('shortId');
    if (!shortId) return interaction.reply('Please provide a short ID to delete.');

    try {
      const success = await deleteShortUrl(shortId);
      if (success) {
        return interaction.reply(`Deleted short URL with ID: ${shortId}`);
      } else {
        return interaction.reply('Short URL not found or already deleted.');
      }
    } catch (e) {
      console.error(e);
      return interaction.reply('Failed to delete short URL.');
    }
  }

  if (interaction.commandName === 'visit') {
    let input = interaction.options.getString('shorturl');
    let shortId;

    try {
      const urlObj = new URL(input);
      shortId = urlObj.pathname.slice(1); // remove leading '/'
    } catch {
      shortId = input; // treat input as shortId directly
    }

    try {
      const originalUrl = await getOriginalUrl(shortId);
      if (originalUrl) {
        return interaction.reply(`Original URL: ${originalUrl}`);
      } else {
        return interaction.reply('Sorry, that short URL was not found.');
      }
    } catch (e) {
      console.error(e);
      return interaction.reply('Failed to retrieve the original URL.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
