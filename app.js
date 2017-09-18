var express=require("express");
var app=express();
var path=require("path");
var router=require("./controller/router.js");//路由
v


var version="/v1";

// app.set("view engine","jade");
// app.set("views",__dirname+"/views/teacherPages");//设置页面路径
// app.locals.pretty=true;//美化作用

app.use(session({
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
}));
//设置静态资源路径
app.use(express.static("public"));

//显示首页
app.get("/",router.toLoginPage);

app.get("/favicon.ico",function (req,res) {
    res.end();
});

app.listen(80,function(){
    console.log("System is running at port 80 ok!");
});
