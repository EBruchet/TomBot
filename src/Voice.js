const ytdl = require('ytdl-core');
const {YoutubeDataAPI} = require("youtube-v3-api");
const api = new YoutubeDataAPI(youtubeApiKey);
import {youtubeApiKey} from '../Hidden';

const streamOptions = {seek: 0, volume: 1};
const YOUTUBE_PREFIX = 'https://www.youtube.com/watch?v=';
let globalMsg;

let channelJukebox =
    {
        active: false,
        songQueue: [],
    };

async function playCommand(args, message) {
    let returned = '';

    if (!message.member.voiceChannelID) {
        message.reply('join a voice channel before requesting a song.');
        return 'PLAY FAIL - request from outside voice channel.';
    } else if (args.length === 0){
        message.reply('mus at least give me a song to play skippy');
        return 'PLAY FAIL - no song provided.';
    }

    globalMsg = message;
    message.member.voiceChannel.join().then(() => {
        channelJukebox.channelID = message.member.voiceChannelID;
        channelJukebox.speaking = true;
    });

    api.searchAll(args.join(' ')).then((returnedList) => {
        let firstResult = returnedList.items[0];
        return {
            title: returnedList.items[0].snippet.title,
            url: YOUTUBE_PREFIX + firstResult.id.videoId,
        };
    }).then((videoInfo) => {
        if(!channelJukebox.active){
            channelJukebox.active = true;
            addToQueue(videoInfo).then(() => {
                playExecute(channelJukebox.songQueue[0], message.member.voiceChannel.connection);
                message.channel.send('Now playing: ' + videoInfo.title + '.');
            });
        } else{
            message.channel.send('Added ' + videoInfo.title + ' to the queue.');
            channelJukebox.songQueue.push(videoInfo);
        }
    }).finally(() =>{return returned});

    return returned;
}

function playExecute(videoInfo, connection){
    // If shifting the array returns undefined, we disconnect the bot as we have reached the end of the queue
    if(!videoInfo){
        connection.disconnect();
        channelJukebox.active = false;
        return;
    }

    const stream = ytdl(videoInfo.url, {
        quality: 'lowestaudio', filter: 'audioonly'
    });
    connection.playStream(stream, streamOptions).on('end', () => {
        channelJukebox.songQueue.shift();
        playExecute(channelJukebox.songQueue[0], connection);
    });
}

async function skipCommand(message) {
    if (!message.member.voiceChannelID) {
        message.reply('join a voice channel before requesting to skip a song.');
        return;
    }

    if(channelJukebox.songQueue.length === 0 || !channelJukebox.active){
        message.reply('to skip, it must have a song in the queue you fish.');
        return 'SKIP FAILED - No songs existing in the queue.';
    }

    message.member.voiceChannel.join().then((connection) => {
        connection.dispatcher.end('Skip command has been used!');
        return 'SKIP SUCCESS - Song skipped.'
    });
}

async function addToQueue(videoInfo){
    return channelJukebox.songQueue.push(videoInfo);
}

export {playCommand, skipCommand};