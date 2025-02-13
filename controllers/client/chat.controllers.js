const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

const chatSocket = require("../../sockets/client/chat.socket")

//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;

    // Socket Io
    chatSocket(req,res);
    //END Socket Io


    // Lay data tu database
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    });
    for (const chat of chats) {
        const inforUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.inforUser = inforUser;
    }

    // End Lay data tu database
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
}