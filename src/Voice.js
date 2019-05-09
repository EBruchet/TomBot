const ytdl = require('ytdl-core');
const {YoutubeDataAPI} = require("youtube-v3-api");
import {youtubeApiKey} from '../Hidden';

const api = new YoutubeDataAPI(youtubeApiKey);
const streamOptions = {seek: 0, volume: 1};
const YOUTUBE_PREFIX = 'https://www.youtube.com/watch?v=';

let channelJukebox =
    {
        voiceChannelID: '',
        active: false,
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
        return YOUTUBE_PREFIX + returnedList.items[0].id.videoId;
    }).then((url) => {
        let connection = message.member.voiceChannel.connection;
        if(!channelJukebox.active){
            channelJukebox.active = true;
            channelJukebox.songQueue.push(url);
            playExecute(channelJukebox.songQueue[0], connection);
        } else{
            channelJukebox.songQueue.push(url);
        }
    });


}


function playExecute(url, connection){
    // If shifting the array returns undefined, we disconnect the bot as we have reached the end of the queue
    if(!url){
        connection.disconnect();
        channelJukebox.active = false;
        return;
    }

    console.log("Play Execute Queue: ", channelJukebox.songQueue);
    console.log("Play Execute Connection: ", connection);

    const stream = ytdl(url, {
        quality: 'lowestaudio', filter: 'audioonly'
    });
    connection.playStream(stream, streamOptions).on('end', (reason) => {
        console.log("Reason: ", reason);
        channelJukebox.songQueue.shift();
        playExecute(channelJukebox.songQueue[0], connection);
    });

}

async function skipCommand(message) {
    if (!message.member.voiceChannelID) {
        message.reply('join a voice channel before requesting to skip a song.');
        return;
    }

    message.member.voiceChannel.join().then((connection) => {
        connection.dispatcher.end('Skip command has been used!');
    });
}

export {playCommand, skipCommand};