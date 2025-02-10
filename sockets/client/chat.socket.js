const Chat = require("../../models/chat.model")


const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");

module.exports =(req,res) =>{
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    // Socket Io
    _io.once('connection', (socket) => {
        socket.join(roomChatId);


        socket.on('CLIENT_SEND_MASSAGE', async (data) =>{
            let images = [];
            for(const imageBuffer of data.images){
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }
         
            // luu vao db
            const chat = new Chat({
                user_id:userId,
                room_chat_id:roomChatId,
                content: data.content,
                images: images
            });
            await chat.save();
            // Phát tin nhắn tới tất cả các client
        _io.to(roomChatId).emit('SERVER_RETURN_MASSAGE', {
            userId: userId,
            fullName: fullName,
            content: data.content,
            images:images 
        });
        });

        // Typing
        socket.on("CLIENT_SEND_TYPING",async (type) =>{
            socket.to(roomChatId).emit("SERVER_RETURN_TYPING",{
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
        // end typing
    });
    //END Socket Io
}