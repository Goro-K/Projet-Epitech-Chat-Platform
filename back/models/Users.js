import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        },
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    password: {
        type: String,
        required: true
    },
    adminServer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    adminChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, 
{ timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;