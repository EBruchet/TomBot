import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ServerSchema = new Schema({
    serverID: {
        type: String,
        required: true
    },
    playlists: {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'Playlist'
    }
});

const Server = mongoose.model('Server', ServerSchema);

export default Server;