require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'create',
    description: 'Creates a new short url',
    options: [
      {
        name: 'url',
        type: 3, // STRING
        description: 'The URL to shorten',
        required: true,
      },
    ],
  },
  {
    name: 'delete',
    description: 'Deletes a short URL by its short code',
    options: [
      {
        name: 'code',
        type: 3, // STRING
        description: 'The short URL code to delete',
        required: true,
      },
    ],
  },
  {
    name: 'visit',
    description: 'Get the original URL from a short URL',
    options: [
        {
        name: 'shorturl',
        type: 3, // STRING
        description: 'The short URL or ID to visit',
        required: true,
        },
    ],
}];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();