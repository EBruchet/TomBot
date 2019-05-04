const Discord = require('discord.js');
const client = new Discord.Client();

import {botSecretToken} from './Hidden';

client.on('ready', () => {
    console.log("Servers: ");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })
});

client.login(botSecretToken);