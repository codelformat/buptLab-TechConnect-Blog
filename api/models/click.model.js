// /api/models/click.model.js
import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const Click = mongoose.model('Click', clickSchema);

export default Click;
