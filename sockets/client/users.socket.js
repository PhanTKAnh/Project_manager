const User = require("../../models/user.model")
const RoomChat = require("../../models/room-chat.model")


module.exports = async (res) =>{
    // Socket Io
    _io.once('connection', (socket) => {
        // Chức năng gửi yêu cầu
        socket.on('CLIENT_ADD_FRIEND', async (userId) =>{
            const myUserId = res.locals.user.id;
            // console.log(myUserId) // Id cua A
            // console.log(userId) // id cua B

            // Thêm id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(!existAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $push:{acceptFriends: myUserId}
                });
            }

            // Thêm id của B vào requestFriends của A 

            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(!existBinA){
                await User.updateOne(
                    { _id: myUserId },
                    { $push: { requestFriends: userId } }
                )
            }

            // Lấy ra độ dái của acceptFriends của B và trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // Lấy info của A trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND",{
                userId: userId,
               infoUserA: infoUserA
            });

            
        });

        // chức năng hủy kết bạn
        socket.on('CLIENT_CANCEL_FRIEND', async (userId) =>{
            const myUserId = res.locals.user.id;

            // console.log(myUserId) // Id cua A
            // console.log(userId) // id cua B


            // Xóa id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(existAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull:{acceptFriends: myUserId}
                });
            };
             // Xóa id của B vào requestFriends của A 

             const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(existBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull:{requestFriends: userId}
                });
            };
            
            // Lấy ra độ dái của acceptFriends của B và trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lấy Id của A và trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userIdB: userId,
                userIdA:myUserId
            });

        });

        // chức năng từ chối kết bạn
        socket.on('CLIENT_REFUSE_FRIEND', async (userId) =>{
            const myUserId = res.locals.user.id;

            // console.log(myUserId) // Id cua A
            // console.log(userId) // id cua B


            // Xóa id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id:  myUserId,
                acceptFriends:userId
            });

            if(existAinB){
                await User.updateOne({
                    _id:  myUserId
                },{
                    $pull:{acceptFriends: userId}
                });
            };
             // Xóa id của B vào requestFriends của A 

             const existBinA = await User.findOne({
                _id:userId ,
                requesttFriends: myUserId
            });

            if(existBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $pull:{requestFriends: myUserId}
                });
            };
        });

        // chức năng kết bạn
        socket.on('CLIENT_ACCEPT_FRIEND', async (userId) =>{
            const myUserId = res.locals.user.id;

            // console.log(myUserId) // Id cua A
            // console.log(userId) // id cua B

            // Check exist
            const existAinB = await User.findOne({
                _id:  myUserId,
                acceptFriends:userId
            });

            const existBinA = await User.findOne({
                _id:userId ,
                requestFriends: myUserId
            });


            // End check exist

            // tạo phòng chat chung cho 2 người 
            let roomChat;


            if(existAinB && existBinA ){
                const dataRoom = {
                    typeRoom:"friend",
                    status: String,
                    users:[
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        },
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                    ]
                };
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }
           
            
            //Hết tạo phòng chat chung cho 2 người 


            // Thêm {user_id, rôm_chat_id} của A vào friendsList của B
            // Xóa id của A vào acceptFriends của B
            if(existAinB){
                await User.updateOne({
                    _id:  myUserId
                },{
                    $push: {
                        friendList:{
                        user_id:userId,
                        room_chat_id: roomChat.id
                    }},
                    $pull:{acceptFriends: userId}
                });
            };

             // Thêm {user_id, rôm_chat_id} của B vào friendsList của A
             // Xóa id của B vào requestFriends của A 
            if(existBinA){
                await User.updateOne(
                    { _id: userId },
                    {
                        $push: {
                            friendList: {
                                user_id: myUserId, // Nên là `myUserId`, không phải `userId`
                                room_chat_id: roomChat.id // Nên xử lý giá trị thực
                            }
                        },
                        $pull: {
                            requestFriends: myUserId // Đúng logic, nếu tên trường đúng
                        }
                    }
                );
                
            };
        });
    });

    //END Socket Io
}