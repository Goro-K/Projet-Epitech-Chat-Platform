import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    roles: [{ type: String }] // Tableau de chaînes pour les rôles
});

const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    users: [userRoleSchema], // Utiliser le sous-schema ici
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message' // Supposant que vous avez un modèle 'Message'
      }],
}, 
{ timestamps: true });

channelSchema.index({ name: 1, server: 1 }, { unique: true });
const Channel = mongoose.model("Channel", channelSchema);

export default Channel;