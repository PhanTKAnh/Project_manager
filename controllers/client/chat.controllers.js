//[GET] /chat/
module.exports.index = async (req, res) => {
    // Socket Io
    _io.on('connection', (socket) => {
        console.log('a user connected',socket.id);});
    //END Socket Io
    res.render("client/pages/chat/index",{
        pageTitle:"Chat",
    });
}