var path = require("formidable");
var session = require("express-session");
var sd = require("silly-datetime");
var db = require("../model/dbutils.js");
var url = require("url");
// var bodyParser = require('body-parser');

var imgAdress="http://localhost/studentPic/";//图片的地址
/**
 * 验证学生登陆
 * @param req
 * @param res
 */
var identifyStu = function (req, res) {

    db.query("studentInfo", req.query, 1, 1, {},
        function (err, result) {
            if (err)
                res.json({"result": 0});//将错误信息传递回去
            else {
                console.log(req.query);
                if (result == "") {
                    console.log("result null");
                    res.json({"result": 0});
                } else if (result[0].stuStatus === "S") {//停学了，禁止登陆
                    console.log(result[0]);
                    res.json({"result": 2});
                } else {//登陆成功，进入学生首页
                    console.log("result not null:" + result);
                    res.json({"result": 1});//获取成功
                }
            }
        });
}
/**
 * 学生课程查询--返回学生当日所选课程
 * @param req
 * @param res
 */
var getStuCourse = function (req, res) {
    // console.log("getStuCourse:" + JSON.stringify(req.query));
    // console.log("date：" + new Date().toLocaleDateString());
    db.query("stusCourseInfo", req.query, 0, 1, {},//返回全部数据
        function (err, result) {
            if (err)
                res.json({"result": "查询课程出现了问题"});//result为表示出错了
            else {
                if (result == "") {//没有查询到-学生没有选课
                    console.log("the stu havent course！" + result);
                    res.json({"result": "当天没有您的课程信息哦！"});//表示没有选课
                } else {//读取到课程，传送到后台
                    console.log("stu have course!" + result);
                    var nowTime = new Date().toLocaleString().split(" ")[0];//获取当前时间：年月日
                    console.log(result.length + ":rest 的长度");

                    var stuCourseNo = [];//用于存放学生选课的编号
                    for (var i = 0; i < result.length; i++) {
                        //console.log(result[i].classNo);
                        stuCourseNo.push(result[i].classNo);
                    }

                    db.query("classInfo", {//查询这个学生今天的课程
                            classNo: {$in: stuCourseNo},
                            classBeginTime: {$lt: new Date(nowTime + " 23:59:59").toLocaleString(), $gt: nowTime}
                        }, 0, 1, {},
                        function (err, courseRslt) {
                            console.log(new Date(nowTime + " 23:59:59").toLocaleString()+"   "+nowTime);
                            if (err) {//如果出错了
                                console.log("居然没有找到课程信息，有问题！");
                                res.json({"result": "数据出错！没有找到相关课程信息！"});
                                return;
                            }
                            // console.log(new Date(nowTime+" 23:59:59").toLocaleString());
                            if (courseRslt != "") {
                                // console.log(courseRslt);
                                res.json({"stuCourses":courseRslt});
                            }
                        });
                }
            }
        });

    // var filter=[
    //     {$match:req.query},
    //     {
    //         $lookup:{
    //             from:"classInfo",
    //             localField:"classNo",
    //             foreignField:"classNo",
    //             as:"coursesDoc"
    //         }
    //     },
    //     {$match: {
    //         "coursesDoc.classBeginTime":{$lt:new Date(nowTime+" 23:59:59").toLocaleString(),$gt:nowTime}
    //         // coursesDoc: {$elemMatch: {classBeginTime:{$lt:new Date(nowTime+" 23:59:59").toLocaleString(),$gt:nowTime}}}
    //       }
    //     }
    // ];
    // db.aggregateQuery("stusCourseInfo",filter,function (err,rest) {
    //     if(err)
    //         console.log(err);
    //     console.log(rest[0]);
    //
    // })

}

/**
 * 获取指定学号学生 当天 的签到记录
 * @param req
 * @param res
 */
var getSignRecord=function (req,res) {
    var nowTime=new Date().toLocaleDateString();
    console.log(new Date(nowTime + " 23:59:59").toLocaleString());
    // console.log(new Date(nowTime + " 23:59:59").toLocaleString()+"++"+nowTime);
    db.query("stuSignRecord",{stuNo:req.query.stuNo,$or:[{signTime:{$lt: new Date(nowTime + " 23:59:59").toLocaleString(), $gt: nowTime}},{signTime:""}]},0,1,{},
        function (err,signRecords) {
            if(err){
                console.log("获取签到记录失败");
                res.json({"result":"查询签到记录时时出错了"});//出错
            }
            else{
                console.log("获取学生签到信息成功了");
                res.json({"signRecords":signRecords});
                //console.log(signRecords);
            }
        })
}

/**
 * 获取学生全部签到记录
 * @param req
 * @param res
 */
var getAllSignRecords=function (req,res) {
    db.query("stuSignRecord",{stuNo:req.query.stuNo},0,1,{},
        function (err,allSignRecords) {
            if(err){
                console.log("获取签到记录失败");
                res.json({"result":"查询签到记录时时出错了"});//出错
            }
            else{
                console.log("获取学生全部签到信息成功了");
                res.json({"allSignRecords":allSignRecords});
            }
        })
}

/**
 * 增加签到记录
 * @param req
 * @param res
 */
var addSignRecord=function (req,res) {
    console.log("获取签到记录");
    var nowTime=new Date().toLocaleString();//获取当前时间，也就是签到时间
    req.body.signTime=nowTime;//将当前时间插入
    console.log(req.body);
    db.insertOne("stuSignRecord",req.body,function (err,rest) {
        if(err){
            console.log("插入失败！");
        }else {
            console.log("插入成功！");
            res.json({"success":"签到记录插入成功了"})
        }
    })
}


/**
 * 修改出勤分数
 * @param req
 * @param res
 */
var updateAttendScore=function (req,res) {
    console.log("来到修改考勤分");
    // console.log(req.body);
    // console.log(req.body.reduceScore+" "+req.body.stuNo+" "+req.body.classNo);

    db.update("stusCourseInfo",{"stuNo":req.body.stuNo,"classNo":req.body.classNo},{$inc:{attendScore:req.body.reduceScore}},function (cnt) {
        console.log("修改考勤分之后");
        console.log(cnt);
        if(cnt>0)
            res.json({"success":"更新考勤分成功"});
        else
            res.json({"error":"更新失败了"});
    })
}

/**
 * 修改密码
 * @param req
 * @param res
 */
var updatePWD=function (req,res) {
    db.update("studentInfo",{stuNo:req.body.stuNo},{$set:{stuPWD:req.body.stuPWD}},function (cnt) {
        console.log("修改密码：");
        console.log(req.body);
        console.log(cnt);
        if(cnt>0)
            res.json({success:"修改密码成功"});
        else
            res.json({error:"修改密码失败"});
    })
}

/**
 * 获取学生的信息
 * @param req
 * @param res
 */
var showStuInfo=function (req,res) {
    db.query("studentInfo", req.query, 1, 1, {},
        function (err, stuInfo) {
            if (err)
                res.json({"result": "获取学生信息失败"});//将错误信息传递回去
            else {
                console.log(req.query);
                if (stuInfo == "") {
                    console.log("stuinfo result null");
                    res.json({"result": "没有查询到学生信息"});
                } else {//查询到信息
                    stuInfo[0].stuImg=imgAdress+stuInfo[0].stuImg;
                    console.log("stuInfo result not null:" );
                    console.log(stuInfo[0]);
                    res.json({"stuInfo": stuInfo[0]});//获取成功
                }
            }
        });
}

/**
 * 读取数据库签到记录，学生当天课程没有签到记录的，就往签到记录插入缺勤记录
 * 注意：callback函数的异步性
 * @param req
 * @param res
 */

var setAbsenceRecord=function (req,res) {
    var nowTime=new Date().toLocaleString();//获取当前时间
    db.query("studentInfo",{stuStatus:"I"},0,1,{},function (err,students) {//查询在读学生
        for(var i=0;i<students.length;i++){//循环查询学生所选课程
            db.query("stusCourseInfo",{stuNo:students[i].stuNo},0,1,{},function (err,courses) {//该学生所选的课程-再筛选当天的课程
                for(var j=0;j<courses.length;j++){
                    //查询这个学生-当天的课程
                    db.query("classInfo",{classBeginTime: {$lt: new Date(nowTime + " 23:59:59").toLocaleString(), $gt: nowTime},classNo:courses[j].classNo},0,1,{},function (err,todayCourses) {
                        for(var k=0;k<todayCourses.length;k++){//再去查询当天的课程再签到记录中嘛-如果没有就插入记录
                            db.query("stuSignRecord",{stuNo:students[i].stuNo,classNo:todayCourses[j].classNo,classTimes:todayCourses[j].classTimes},0,1,{},function (err,signRecord) {//获取签到记录在进行判断是否为空-_-,如果查询出当前为空，则进行插入缺勤处理
                                if(err){//出错了，
                                    console.log("获取失败了哦");
                                }
                                if(signRecord==""){//没有查询到恰到记录，就开始插入缺勤记录
                                    db.insertOne("stuSignRecord",{
                                        stu:students[i].stuNo,classNo:todayCourses[k].classNo,className:todayCourses[k].className,classTimes:todayCourses[k].classTimes,
                                        classTeacher:todayCourses[k].classTeacher,classBeginTime:todayCourses[k].classBeginTime,classEndTime:todayCourses[k].classEndTime,
                                        signTime:"",attendStatus:"U"
                                    },function (mongoError, p2) {
                                        if(mongoError){
                                            console.log("往数据库中插入签到记录失败了");
                                            res.json({"result":"插入缺勤记录失败了失败了"});
                                        }else{//插入成功，继续更新考勤分
                                            db.update("stusCourseInfo",{"stuNo":students[i].stuNo,"classNo":todayCourses[k].classNo},{$inc:{attendScore:-10}},function (cnt) {
                                                console.log("系统后台自动识别缺勤+修改考勤分");
                                                console.log(cnt);
                                                if(cnt>0){
                                                    console.log("更新成功了");
                                                    res.json({"success":"更新考勤分成功"});
                                                }
                                                else
                                                    res.json({"error":"更新失败了"});
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    });
}

/**
 * 使用学生 来查询课程
 * @param students
 * @param i
 */
function getStudentCourse(students,i) {

}

/**
 * 根据学生选课来查询学生当天的课程
 * @param courses
 * @param j
 */
function getTodayCourse(students,courses,i,j) {

}

/**
 * 判断当前学生 今天的课程是否有签到
 * @param students
 * @param todayCourses
 * @param k
 */
function getStuSignInfo(students,todayCourses,i,j,k) {

}

/**
 * 插入记录
 * @param students
 * @param courses
 * @param i
 * @param k
 */
function insertSignRecord(students,courses,i,k) {

}

var getCourseScore=function (req,res) {
    db.query("stusCourseInfo",req.query,0,1,{},function (err,result) {
        console.log("查询考勤分哦，");
        console.log(req.query);
        if (err){
            console.log("查询考勤分出错了！");
            res.json({"result":"查询考勤分出错了"});
        }else {
            console.log("查询考勤分成功!");
            console.log(result);
            res.json({"courseScore":result});
        }
    })
}

/**
 * 验证教师登陆-根据教师工号密码获取信息进行判断
 * @param req
 * @param res
 */
var identifyTeacher = function (req, res) {
    db.query("teacherInfo", req.query, 1, 1, {},
        function (err, result) {
            if (err)
                res.json({"result": 0});//将错误信息传递回去
            else {
                if (result == "") {
                    console.log("teacher result null");
                    res.json({"result": 0});
                } else {//登陆成功，进入教师首页
                    console.log("result not null:" + result);
                    res.json({"result": 1});//获取成功
                }
            }
        });
}

/**
 * 添加学生信息
 * @param req
 * @param res
 */
var addStu = function (req, res) {
    console.log("add stu in router.addStu!");
    db.insertOne("studentInfo",
        req.query,//表单属性
        function (err, result) {
            if (err) {
                res.json({"errorInfo": err});//没有插入进去,回传错误信息
            } else//插入成功之后返回整个集合的数据
                db.query("studentInfo",
                    {},//filter
                    10,
                    1,
                    {"stuNo": -1},//倒序
                    function (err, result) {
                        res.json(result);
                    }
                );
        }
    );
}
exports.identifyStu = identifyStu;
exports.identifyTeacher = identifyTeacher;
exports.addStu = addStu;
exports.getStuCourse = getStuCourse;
exports.getSignRecord=getSignRecord;
exports.getAllSignRecords=getAllSignRecords;
exports.addSignRecord=addSignRecord;
exports.updateAttendScore=updateAttendScore;
exports.updatePWD=updatePWD;
exports.showStuInfo=showStuInfo;
exports.setAbsenceRecord=setAbsenceRecord;
exports.getCourseScore=getCourseScore;