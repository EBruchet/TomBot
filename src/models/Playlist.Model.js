import mongoose, { Mongoose } from 'mongoose';
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    server: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Server'
    },
    name: {
        type: String,
        required: true
    }, 
    songs: {
        type: String,
        required: true
    }
});

PlaylistSchema.index({ server: 1, name: 1 }, { unique: true });
const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;