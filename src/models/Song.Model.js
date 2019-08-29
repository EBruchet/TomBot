import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    url: {
        type: String,
        unique: true,
        required: true
    },
    length: {
        type: Number,
        unique: true,
        required: true
    }
});

SongSchema.index({name: 1, url: 1}, {unique: true});
const Song = mongoose.model('Song', SongSchema);

export default Song;
