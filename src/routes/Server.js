import express from 'express';
import Server from '../models/Server.Model';
const serverRouter = express.Router();

// @route GET /api/servers/ByServerID
// @desc Request a server by its given Discord Server ID
// @access Public
serverRouter.get('/ByServerID', (req, res) => {
    if (!req.query.serverID)
        return res
            .status(400)
            .json({ error: 'GETServerByID: Discord Server ID is required.' });

    Server.findOne({ serverID: req.query.serverID })
        .then(server => {
            if (server)
                return res.status(200).json(server);

            return res.status(404).json({ error: 'GETServerByID: Server not found.' });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});


// @route GET /api/servers/All
// @desc Request all servers
// @access Public
serverRouter.get('/All', (req, res) => {
    Server.find({})
        .then(servers => {
            if (servers)
                return res.status(200).json(servers);
            return res.status(404).json([]);
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
});

// @route POST /api/servers
// @desc Create Server object
// @access Public
serverRouter.post('/', (req, res) => {
    if (!req.body)
        return res
            .status(400)
            .json({ error: 'POSTServer: Discord Server Body required.' });

    Server.find({ serverID: req.body.serverID })
        .then(server => {
            if (server)
                return res.status(400).json({ error: 'POSTServer: Discord serverID already exists.' });

            return res.status(200).json(server);
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })

});


// @route PUT /api/servers
// @desc Update Server object
// @access Public
serverRouter.put('/', (req, res) => {
    if (!req.body.serverID)
        return res
            .status(400).json({ error: 'PUTServer: Discord Server Body required.' });

    Server.findOneAndUpdate(
        { serverID: req.body.serverID },
        req.body,
        { new: true, useFindAndModify: false }
    )
        .then(server => {
            if (server)
                return res.status(201).json(prediction);
            return res.status(404).json({ error: 'PUTServer: Discord ServerID does not exist.' });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        })
})



export default serverRouter;