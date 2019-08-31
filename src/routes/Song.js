import express from 'express';
import Song from '../models/Song.Model';
const songRouter = express.Router();

// @route GET /api/songs/ByPlaylist
// @desc Request a song by playlist
// @access Public
songRouter.get('/ByPlaylist', (req, res) => {
    if (!req.query.playlist)
        return res
            .status(400)
            .json({ error: 'GETSongByPlaylist: Playlist ID is required.' });

    Song.find({ playlist: req.query.playlist })
        .then(songs => {
            if (songs)
                return res.status(200).json(server);

            // TODO: Consider reworking into actual error message
            return res.status(404).json({ []});
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});

// @route POST /api/songs
// @desc Create a song, and add it to a playlist
// @access Public
songRouter.post('/', (req, res) => {
    if (!req.body.url || !req.body.playlist)
        return res
            .status(400)
            .json({ error: 'POSTSong: Song URL and associated playlist are required.' });

    Song.find({ playlist: req.body.playlist, url: req.body.url })
        .then(song => {
            if (song)
                return res.status(400).json({ error: 'POSTSong: Song already exists in playlist' });

            const newSong = new Song({
                name: req.body.name,
                url: req.body.url,
                length: req.body.length
            });

            //TODO: Add song to list of songs in the playlist
            newSong.save()
                .then(createdSong => {
                    return res.status(201).json({ createdSong });
                })
                .catch(err => {
                    return res.status(500).json({ error: err });
                });

        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});

// @route DELETE /api/songs
// @desc Delete a song
// @access Public
songRouter.delete('/', (req, res) => {
    if (!req.body.name || !req.body.playlist)
        return res
            .status(400)
            .json({ error: 'DELETESong: Song name and associated playlist are required.' });

    Song.findOneAndDelete({ name: req.body.name, req.body.playlist })
        .then(song => {
            if (song)
                return res.status(410).json({ song });

            return res.status(404).json({ error: 'DELETESong: No song found.' });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
});

export default songRouter;