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
    console.log(message.content);
});

client.login(process.env.DISCORD_TOKEN);
