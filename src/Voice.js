const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const {YoutubeDataAPI} = require("youtube-v3-api");
import {youtubeApiKey} from '../Hidden';

const api = new YoutubeDataAPI(youtubeApiKey);
const streamOptions = {seek: 0, volume: 1};
const YOUTUBE_PREFIX = 'https://www.youtube.com/watch?v=';

let channelJukebox =
    {
        voiceChannelID: '',
        speaking: false,
        songQueue: [],
    };


async function playCommand(args, message) {

    if (!message.member.voiceChannelID) {
        message.reply('join a voice channel before requesting a song.');
        return;
    }

    message.member.voiceChannel.join().then(() => {
        channelJukebox.channelID = message.member.voiceChannelID;
        channelJukebox.speaking = true; // TODO: Is this necessary?
        console.log('Connected to ' + message.member.voiceChannel.name);
    });

    // TODO: Check the user has actually passed additional arguments

    api.searchAll(args.join(' ')).then((returnedList) => {
        let url = YOUTUBE_PREFIX + returnedList.items[0].id.videoId;
        channelJukebox.songQueue.push(url);
        return url;
    }).then((url) => {
        let connection = message.member.voiceChannel.connection;
        playExecute(url, connection);
        // message.member.voiceChannel.join().then(connection => {
        //     const stream = ytdl(url, {
        //         quality: 'lowestaudio', filter: 'audioonly'
        //     });
        //     connection.playStream(stream, streamOptions);
        // }).catch(console.error);
    });
}


function playExecute(url, connection){
    // If shifting the array returns undefined, we disconnect the bot as we have reached the end of the queue
    if(!url){
        connection.disconnect();
        return;
    }

    if(channelJukebox.songQueue.length === 1){
        const stream = ytdl(url, {
            quality: 'lowestaudio', filter: 'audioonly'
        });
        connection.playStream(stream, streamOptions).on('end', (reason) => {
            console.log("Reason: ", reason);
            playExecute(channelJukebox.songQueue.shift(), connection);
        });
    } else {
        console.log('Queued up another song.');
        channelJukebox.songQueue.push(url);
    }


    console.log();

}

async function skipCommand(message) {

}

export {playCommand};