import Message from "../../models/Messages.js"
export async function deleteAllMessages (req, res) {
    try {
        await Message.deleteMany();
        res.status(200).json({ message: "All messages have been deleted." });
    } catch (error) {
        res.status(500).json({ error });
    }
}