import express from 'express';
import mongoose from 'mongoose';
import songRouter from './routes/Song';
import serverRouter from './routes/Server';
import playlistRouter from './routes/Playlist';
import { dbInfo } from '../Hidden';

const app = express();

function databaseConnect() {
    mongoose.connect(dbInfo.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
        .then(() => {
            console.log('Successfully connected to MongoDB instance.');
        })
        .catch(err => console.log('Error Connecting: ', err));


    app.use('/api/songs', songRouter);
    app.use('/api/servers', serverRouter);
    app.use('/api/playlists', playlistRouter);

    app.listen(3000, 'localhost', () => {
        console.log(`Server running on Port 3000.`);
    });
}

export default databaseConnect;
