var express=require("express");
var app=express();
var session=require("express-session");
var path=require("path");
var router=require("./controller/router.js");//路由
var bodyParser=require("body-parser");
var schedule=require("node-schedule");

var version="/v1";

// app.set("view engine","jade");
// app.set("views",__dirname+"/views/teacherPages");//设置页面路径
// app.locals.pretty=true;//美化作用
app.use(express.static("upload"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
}));
//设置静态资源路径
app.use(express.static("public"));

app.all('*', function(req, res, next) {
    console.log("access control here!");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next();
});

app.get("/favicon.ico",function (req,res) {
    res.end();
});
//学生登陆
app.get("/v1/stu/idenStu",router.identifyStu);

//获取学生 当日 课程列表
app.get("/v1/stu/course",router.getStuCourse);

//获取学生 当天 签到记录
app.get("/v1/stu/signRecord",router.getSignRecord);

//获取学生全部签到记录
app.get("/v1/stu/getAllSignRecords",router.getAllSignRecords);

//插入签到记录
app.post("/v1/stu/addSignRecord",router.addSignRecord);

//更新出勤分数
app.post("/v1/stu/updateAttendScore",router.updateAttendScore);

//学生修改密码
app.post("/v1/stu/updatePWD",router.updatePWD);

//学生查看个人信息
app.get("/v1/stu/showStuInfo",router.showStuInfo);

//获取当前学生所有选课信息=考勤分
app.get("/v1/stu/showStuCourse",router.getCourseScore);


//教师登陆
app.get("/v1/teacher/idenTeac",router.identifyTeacher);

//需要一个找不到任何界面
// app.use(router.showNotFoundErr);

app.listen(80,function(){
    console.log("System is running at port 80 ok!");
});

/**
 * 定时器，检查插入
 * @type {schedule.RecurrenceRule}
 */
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];//每周1到周日执行
rule.hour = 22;//时间是22：00
rule.minute = 00;
var j = schedule.scheduleJob(rule, function(){
    router.setAbsenceRecord();//查询当天并插入旷课学生记录
});