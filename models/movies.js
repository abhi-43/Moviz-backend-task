import mongoose from "mongoose";

const moviesSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: true
    },
    movies: {
        type: Array,
        default: []
    },
    playlistName: {
        type: String,
    }


}, { timestamps: true });

export default mongoose.model("Movies", moviesSchema);
