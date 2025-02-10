const User = require("../../models/user.model")
module.exports.infoUser = async (req,res,next) =>{
    if(req.cookies.tokenUser){
        //tra ra thong tin ca nhan
        const user = await User.findOne({
            tokenUser:req.cookies.tokenUser,
            deleted:false,
            status:"active"
        }).select("-password");
        if(user){
        res.locals.user = user;
        }
    
    }
    next();
}