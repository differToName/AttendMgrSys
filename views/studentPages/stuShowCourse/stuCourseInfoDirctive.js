"use strict";

angular.module("stuModule")
    .directive("stuSignCourse",["$http",function ($http) {
        return {
            restrict:"AE",
            templateUrl:"studentPages/stuShowCourse/stuCourseInfoTemplate.html",
            replace:true,
            controller:"stuSignCtrl",
            link:function (scope,el,attrs,ctrl) {

                $(function () {
                    $('[data-toggle="popover"]').popover()
                })

                // console.log(scope.attendCnt);
                //查看出勤记录
                scope.checkAttendInfo=function (cnt,attendRecord) {
                    scope.signRecordTitle="总出勤记录";
                    if(attendRecord==""){
                        scope.showRec=false;
                    }else{
                        scope.showRec=true;
                        attendRecord.sort(function (obj1,obj2) {
                            var va1=obj1.signTime;
                            var va2=obj2.signTime;
                            if(va1<va2)
                                return 1;
                            else if(va1>va2)
                                return -1;
                            else
                                return 0;
                        });
                        scope.differRecords=attendRecord;
                    }
                    console.log(attendRecord);
                }

                //查看迟到记录
                scope.checkLateInfo=function (cnt,lateRecord) {

                    scope.signRecordTitle="总迟到记录";
                    if(lateRecord==""){
                        scope.showRec=false;
                    }else{
                        scope.showRec=true;
                        lateRecord.sort(function (obj1,obj2) {
                            var va1=obj1.signTime;
                            var va2=obj2.signTime;
                            if(va1<va2)
                                return 1;
                            else if(va1>va2)
                                return -1;
                            else
                                return 0;
                        });
                        console.log("迟到记录不为空");
                        scope.differRecords=lateRecord;
                    }
                }

                //查看缺勤记录
                scope.checkTruantInfo=function (cnt,truantRecord) {
                    scope.signRecordTitle="总旷课记录";
                    // console.log(truantRecord);
                    if(truantRecord==""){//如果没有旷课记录
                        scope.showRec=false;
                    }else{
                        scope.showRec=true;
                        truantRecord.sort(function (obj1,obj2) {//排序
                            var va1=obj1.signTime;
                            var va2=obj2.signTime;
                            if(va1<va2)
                                return 1;
                            else if(va1>va2)
                                return -1;
                            else
                                return 0;
                        });
                        scope.differRecords=truantRecord;
                    }
                }
                var upCourse;//用于保存页面传输数据
                /**
                 * 中转函数，无用
                 * @param courses
                 */
                scope.toSetUpCourse=function (course) {
                    upCourse=course;
                    $('#myModal').modal('toggle');//打开模态窗
                }

                /**
                 * 验证课程密码
                 */
                scope.toSignCourseToDb=function () {
                    console.log(new Date().toLocaleString());
                    if(scope.inputPwd===upCourse.classPWD) {//如果输入密码正确
                        if (upCourse.attendStatus === "N" && upCourse.courseStatus == "N") {//正常出勤
                            upCourse.attendStatus = "A";
                            upCourse.courseStatus="A";
                            // console.log(upCourse);
                            addSignRecord(getDataJson(upCourse));//去登记签到了
                            history.go(0);
                        } else if (upCourse.attendStatus === "N" && upCourse.courseStatus == "L") {//迟到
                            upCourse.attendStatus="L";//改为已签到但是迟到了
                            console.log("迟到这边");
                            addSignRecord(getDataJson(upCourse));
                            history.go(0);
                        }
                        $('#myModal').modal('toggle');//成功之后才关闭
                    }else{
                        scope.identifyPWD="输入密码错误";
                    }
                }

                /**
                 * 将签到记录转换成json字串
                 * @param dataObj
                 * @returns {{stuNo: *, stu}}
                 */
                function  getDataJson(dataObj) {
                    var data = {
                        "stuNo": sessionStorage.userNo,
                        "classNo":dataObj.classNo,
                        "className":dataObj.className,
                        "classTeacher":dataObj.classTeacher,
                        "classTimes":dataObj.classTimes,
                        "classBeginTime":dataObj.classBeginTime,
                        "classEndTime":dataObj.classEndTime,
                        "attendStatus":dataObj.courseStatus
                    };
                    return data;
                }

                /**
                 * 添加签到记录
                 * @param data
                 */
                function addSignRecord(data) {
                    $http({
                        method:"POST",
                        data:data,
                        url:"http://localhost/v1/stu/addSignRecord"
                    }).then(
                        function (resp) {
                            console.log("增加签到记录成功");
                            updateAtendScore({"stuNo":sessionStorage.userNo,"classNo":upCourse.classNo,"reduceScore":-5});
                            // history.go(0);
                        },
                        function (resp) {//增加失败了
                            console.log("增加签到记录失败了");

                        }
                    );
                }

                /**
                 * 更新考勤分，用于缺勤和迟到
                 */
                function updateAtendScore(data) {
                    $http({
                        method:"POST",
                        data:data,
                        url:"http://localhost/v1/stu/updateAttendScore"
                    }).then(
                        function (resp) {
                            console.log("更新考勤分成功了");
                            console.log(resp.data);
                            return ;
                        },
                        function (resp) {//增加失败了
                            console.log("更新考勤分失败了");
                            return resp.data;
                        }
                    );
                }

            }
            
            
        }
    }]);