"use strict";

angular.module("stuModule")
    .controller("stuSignCtrl", ["$scope", "$location", "$rootScope", "$http", function ($scope, $location, $rootScope, $http) {

        $(function () {

            if(!(sessionStorage.userNo && sessionStorage.userPWD)){
                $location.path("/loginPage");
            }
        });

        var signRecords = [];//签到记录
        var courses = [];
        $scope.attendCnt = $scope.lateCnt = $scope.truantCnt = 0;//初始化
        //console.log(new Date().toLocaleString());
        $http({
            method: "GET",
            url: "http://localhost/v1/stu/course?stuNo=" + sessionStorage.userNo
        }).then(
            function (resp) {//查询成功
                // console.log("123124");
                if(resp.data==""){
                    console.log("查出的课程信息为空！");
                    setErrorMessage("今天没有课程哦，可以好好放松一下");
                }else {
                    courses = resp.data.stuCourses;
                    getStuSignCourse(courses);//传送读取另外一个http
                    //$scope.courses=resp.data.stuCourses;//获取学生课程
                }

            },
            function (resp) {//查询失败
                console.log("查询课程信息失败");
                //在页面显示该学生貌似没有选择任何课程
                 setErrorMessage("今天没有课程哦，可以好好放松一下");
            }
        );

        /**
         * 再次调用$http服务进行获取签到记录
         * @param data
         */
        function getStuSignCourse(data) {
            $scope.courses = data;

            //这里获取签到记录
            $http({
                method: "GET",
                url: "http://localhost/v1/stu/signRecord?stuNo=" + sessionStorage.userNo
            }).then(
                function (resp) {//获取签到记录成功

                    setStuCoursePage(data, resp.data);
                },
                function (resp) {//获取签到记录失败
                    console.log("获取签到数据失败！");
                    setErrorMessage("获取签到数据失败！");
                }
            );
        }

        /**
         * 展示errorMessage
         */
        function setErrorMessage(info) {
            console.log("设置错误信息："+info);
            //$scope.errorMessage = true;
            $scope.errorInfo = info;
            console.log($scope.errorInfo);
        }

        /**
         * 根据获取到的courses，signData来设置页面参数
         * @param courses
         * @param signData
         */
        function setStuCoursePage(courses, signData) {
            // console.log(signData);
            signRecords = signData.signRecords;//将签到记录保存
            var nowTimes = new Date().toLocaleString();//获取当前年月日时分秒
            // if(signRecords){//不为空就开始进行判断,有签到记录就先看记录

            for (var i = 0; i < courses.length; i++) {
                if (signRecords) {
                    for (var j = 0; j < signRecords.length; j++) {
                        //console.log(courses[i].classNo+" and "+signRecords[j].classNo);
                        if (courses[i].classNo == signRecords[j].classNo && courses[i].classTimes == signRecords[j].classTimes) {//如果签到记录中有该课程,
                            courses[i].courseStatus = signRecords[j].attendStatus;
                            courses[i].attendStatus = signRecords[j].attendStatus;
                        }
                    }
                }
                if (courses[i].attendStatus === undefined) {//没有在记录中找到课程的-都没有签到
                    // console.log(courses[i].classEndTime+"   " +nowTimes);
                    // console.log(new Date("2015-5-05 9:12").toLocaleString());
                    // console.log(moment("2017-9-12").format("YYYY-MM-DD HH:mm:ss"));
                    var truantTime=moment(courses[i].classBeginTime).add(1,"h").format("YYYY-M-DD HH:mm:ss");//逃课、迟到判断时间
                    var attendTime=moment(courses[i].classBeginTime).subtract(15,"m").format("YYYY-M-DD HH:mm:ss");//正常签到时间
                    // console.log(attendTime+"  "+courses[i].classBeginTime);
                    if (truantTime < nowTimes) {//当前时间大于开课一个小时时间-逃课了
                        courses[i].courseStatus = "U";
                        courses[i].attendStatus = "U";
                    } else if (toFormatDate(courses[i].classBeginTime) < nowTimes && truantTime >= nowTimes) {//迟到了
                        console.log(courses[i].classBeginTime);
                        courses[i].courseStatus = "L";
                        courses[i].attendStatus = "N"
                    } else if (attendTime > nowTimes) {//课程还没开始签到
                        courses[i].courseStatus = "B";
                        courses[i].attendStatus = "B";
                    } else {
                        courses[i].courseStatus = "N";
                        courses[i].attendStatus = "N";
                    }
                }
            }
            // }else {//当天还没有签到记录-就开始根据签到时间来进行设置
            //     for(var i=0;i<courses.length;i++){
            //         if(toFormatDate(courses[i].classEndTime)<nowTimes){//没有到上课时间-不允许签到
            //             courses[i].courseStatus="U";
            //             courses[i].attendStatus="N";
            //         }else if(toFormatDate(courses[i].classBeginTime)<nowTimes && toFormatDate(courses[i].classEndTime)>nowTimes){//迟到了
            //             console.log(courses[i].classBeginTime);
            //             courses[i].courseStatus="L";
            //             courses[i].attendStatus="N"
            //         }else {//否则就是可以签到
            //             courses[i].courseStatus="N";
            //             courses[i].attendStatus = "N";
            //         }
            //     }
            // }
        }

        /**
         * 日期转换函数
         * @param dataStr
         * @returns {string}
         */
        function toFormatDate(dataStr) {
            return new Date(dataStr).toLocaleString();
        }

        //获取全部签到记录的http
        $http({
            method: "GET",
            url: "http://localhost/v1/stu/getAllSignRecords?stuNo=" + sessionStorage.userNo
        }).then(
            function (resp) {
                var allSignRecords = resp.data.allSignRecords;
                console.log("查询页面数据");
                $scope.allSignRecords=allSignRecords;
                $scope.attendRecord=[];//出勤记录-用于页面显示
                $scope.lateRecord=[];//迟到记录
                $scope.truantRecord=[];//旷课记录
                // console.log(allSignRecords);
                //查询签到记录进行统计次数
                if (allSignRecords) {
                    for (var j = 0; j < allSignRecords.length; j++) {
                        //统计签到次数的判断
                        if (allSignRecords[j].attendStatus === "A") {//出席了{
                            $scope.attendRecord.push(allSignRecords[j]);
                            $scope.attendCnt++;
                        }else if(allSignRecords[j].attendStatus === "L"){
                            $scope.lateRecord.push(allSignRecords[j]);
                            $scope.lateCnt++;
                        }else{
                            $scope.truantRecord.push(allSignRecords[j]);
                            $scope.truantCnt++;
                        }
                    }
                }
            },
            function (resp) {//查询失败
                console.log("获取签到数据失败！");
                // setErrorMessage("获取签到数据失败！");
                alert("查询全部签到记录失败");
            }
        );

    }]);