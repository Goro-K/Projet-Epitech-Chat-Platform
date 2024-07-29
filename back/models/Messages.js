import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
        type: String
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
      },
    private: {
        type: Boolean,
        default: false
    }
}, 
{ timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;