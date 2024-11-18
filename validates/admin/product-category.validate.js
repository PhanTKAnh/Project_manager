module.exports.createPost= (req,res,next) =>{
    if(!req.body.title){
        req.flash("error","Vui lòng nhập tiêu đề ít nhất 8 ký tự ");
        res.redirect("back");
        return;
    }
    next();
 
}