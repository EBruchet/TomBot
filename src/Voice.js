const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const {YoutubeDataAPI} = require("youtube-v3-api");
import {youtubeApiKey} from '../Hidden';

const api = new YoutubeDataAPI(youtubeApiKey);
const streamOptions = {seek: 0, volume: 1};
let songQueue = [];

let channelJukeBox =
    {
        channelID: '',
        songQueue: [],
    };


async function playCommand(args, message) {

    if(!message.member.voiceChannelID) {
        message.reply('join a voice channel before requesting a song.');
        return;
    }

    //TODO: Check that the bot isn't already in the voice channel of the requester


    message.member.voiceChannel.join().then(connection => {

    });

    let joinedArgs = args.join(' ');
    let firstVideoId;

    api.searchAll(joinedArgs, 5).then((returnedList) => {
        console.log(returnedList.items[0].id);
        firstVideoId = returnedList.items[0].id.videoId;
    }).then(() => {
        console.log('https://www.youtube.com/watch?v=' + firstVideoId);
        if (message.member.voiceChannelID) {
            message.member.voiceChannel.join().then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=' + firstVideoId, {
                    filter : 'audioonly'});
                connection.playStream(stream, streamOptions);
            }).catch(console.error);
        } else {
            message.reply('Join a voice channel before requesting a song.');
        }
    });
    return 0;
}

export {playCommand};