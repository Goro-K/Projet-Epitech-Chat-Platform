import Message from "../../models/Messages.js";
import Channel from "../../models/Channels.js";

export async function getMessagesFromChannel (req, res) {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channel: channelId })
    .populate('from', 'username')
    .populate('to', 'username')
    .sort({ createdAt: 1 });

    // Formatter chaque message pour inclure uniquement le username dans from
    const formattedMessages = messages.map((msg) => ({
      ...msg.toObject(), 
      from: msg.from.username, 
      to: msg.to?.username
    }));
    
    res.status(200).json(formattedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
};

export async function deleteAllChannels (req, res) {
  try {
    await Channel.deleteMany();
    res.status(200).json({ message: "All channels have been deleted" });
  } catch (error) {
    res.status(500).json({ message: `Error Channel : ${error} `});
  }
}