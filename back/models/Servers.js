import mongoose from "mongoose";
const Schema = mongoose.Schema;

const serverSchema = new Schema({
    serverName: {
        type: String,
        required: true,
        unique: true
    },
    serverAdmin: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
}, 
{ timestamps: true });


const Server = mongoose.model("Server", serverSchema);

export default Server;