var path=require("formidable");
var session=require("express-session");

/**
 * 去登陆界面，如果短时间内已经登陆过，则直接去相关主界面
 * 否者回到登陆界面
 * @param req
 * @param res
 */
var toLoginPage=function (req,res) {
    if(req.session.user){
        console.log(req.session);
    }else{
        res.render("login_page");
    }
}

exports.toLoginPage=toLoginPage;