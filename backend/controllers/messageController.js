import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user.id;
    const message = new Message({ from, to, text });
    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 