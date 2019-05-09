const Discord = require('discord.js');
const client = new Discord.Client();

import {botSecretToken} from './Hidden';
import {playCommand, skipCommand} from './src/Voice';


client.login(botSecretToken).then(() => console.log("Successfully logged in."));
client.on('ready', () => {
    console.log('TomBot is now ready.')
});


client.on('message', async message => {
    // Ignore messages not coming from a guild
    // Ignore messages coming from the bot itself
    if (!message.guild || message.author.id === client.user.id)
        return;

    // ignore messages not beginning with the '~' symbol
    if (message.content.startsWith("~"))
        processCommand(message);
});


function processCommand(receivedMsg) {
    let fullCommand = receivedMsg.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
    let receivedArgs = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

    switch (primaryCommand) {
        case ('help'):
            break;
        case('join'):
            break;
        case ('play'):
            playCommand(receivedArgs, receivedMsg)
                .then(() => {});
            break;
        case('skip'):
            skipCommand(receivedMsg)
                .then(() => {});
    }

}