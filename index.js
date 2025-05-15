//code reference from discord.js documentation
require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, //for getting message content 
    ]
});

client.on('messageCreate', (message) => {
    // console.log(message.content);
    if(message.author.bot) return; //ignore bot messages
    if(message.content === 'ping') {
        message.reply(
            {content: "Pong!"}
        );
    }
    if(message.content === 'hello') {
        message.reply(
            {content: "Hello!"}
        );
    }
    if(message.content === 'hi') {
        message.reply(
            {content: "Hi!"}
        );
    }
    if(message.content === 'hey') {
        message.reply(
            {content: "Hey!"}
        );
    }
});

client.login(process.env.DISCORD_TOKEN);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create') {
    const url = interaction.options.getString('url');

    if (!url) {
      return interaction.reply('Please provide a URL.');
    }

    if (!url.startsWith('http')) {
      return interaction.reply('Please provide a valid URL.');
    }
    //logic using mongodb
    return interaction.reply(`Creating a new short URL for ${url}`);
  }

  if (interaction.commandName === 'ping') {
    return interaction.reply('Pong!');
  }
});