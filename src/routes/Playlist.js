import express from 'express';
import Playlist from '../models/Playlist.Model';
const playlistRouter = express.Router();

// @route GET /api/playlists/ByServerAndName
// @desc Request a playlist by its Server and Name
// @access Public
playlistRouter.get('/ByServerAndName', (req, res) => {
    if (!req.query.server || !req.query.name)
        return res
            .status(400)
            .json({ error: 'GETPlaylistByID: Discord Server ID and Playlist name are required.' });

    Playlist.findOne({ server: req.query.server })
        .then(server => {
            if (server)
                return res.status(200).json(server);

            return res.status(404).json({ error: 'GetPlaylistByServerAndName: Playlist not found.' });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});


// @route POST /api/playlists
// @desc Create Playlist object
// @access Public
playlistRouter.post('/', (req, res) => {
    if (!req.body.name || !req.body.server)
        return res
            .status(400)
            .json({ error: 'POSTPlaylist: Discord Server ID and Playlist name are required.' });
    Playlist.find({ name: req.body.name, server: req.body.server })
        .then(playlist => {
            if (playlist)
                return res.status(400).json({ error: 'POSTPlaylist: A playlist with this name already exists' });

            /** 
             * TODO: Add server-side validation for the playlist names
             * Will not tolerate racist, homophobic slurs, overly long names
             * or those with special characters. Latter argument subject to change.
             * **/
            const newPlaylist = new Playlist({
                name: req.body.name,
                server: req.body.server
            });


            newPlaylist.save()
                .then(createdPlaylist => {
                    return res.status(201).json({ createdPlaylist });
                })
                .catch(err => {
                    return res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
});

// @route PUT /api/playlists
// @desc Update Playlist object
// @access Public
playlistRouter.put('/', (req, res) => {
    if (!req.body.name || !req.body.server)
        return res
            .status(400)
            .json({ error: 'PUTPlaylist: Discord Server ID and Playlist name are required.' });
    Playlist.findOneAndUpdate(
        { name: req.body.name, server: req.body.server },
        req.body,
        { new: true, userFindAndModify: false })
        .then(playlist => {
            if (playlist)
                return res.status(200).json({ playlist });
            return res.status(404).json({ error: 'PUTServer: Playlist does not exist.' })
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});

// @route DELETE /api/playlists
// @desc Delete Playlist object
// @access Public
playlistRouter.delete('/', (req, res) => {
    if (!req.body.name || !req.body.server)
        return res
            .status(400)
            .json({ error: 'DELETEPlaylist: Discord Server ID and Playlist name are required.' });

    Playlist.findOneAndDelete({ name: req.body.name, server: req.body.server })
        .then(playlist => { return res.status(410).json(playlist) })
        .catch(err => res.status(500).json({ error: err }))
});

export default playlistRouter;