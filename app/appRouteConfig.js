"use strict";

angular.module("attendApp")
    .config(["$routeProvider",function ($routeProvider) {
        var routes=[
            {
                // 登陆界面
                url:"/loginPage",
                config:{
                    template:"<login-page></login-page>"
                }
            },

            {
                // 课程签到
                url:"/signCourse",
                config:{
                    template:"<stu-sign-course></stu-sign-course>"
                }
            },
            {
                //个人资料
                url:"/showStuInfo",
                config:{
                    template:"<show-stu-info></show-stu-info>"
                }
            },
            {
                // 修改密码
                url:"/modifyStuPWD",
                config:{
                    template:"<modify-stu-pwd></modify-stu-pwd>"
                }
            },
            {
                // 学生主页
                url:"/stuIndex",
                config:{
                    template:"<stu-index-page></stu-index-page>"
                }
            },

            {
                // 教师主页
                url:"/teacherIndex",
                config:{
                    template:"<teacher-index></teacher-index>"
                }
            },
            {
                // 教师个人信息
                url:"/teacherInfo",
                config:{
                    template:"<teacher-info></teacher-info>"
                }
            },
            {
                // 学生信息管理-包含增删改查
                url:"/stuInfoMgr",
                config:{
                    template:"<teach-reg-stu></teach-reg-stu>"
                }
            },
            {
                // 课程考勤信息查询-课程名称-节次-学员姓名
                url:"/searchAttendInfo",
                config:{
                    template:"<teach-search-attend-info></teach-search-attend-info>"
                }
            },
            {
                // 学员课程选修管理-增删改查-可进行分页导航栏设计
                url:"/stuCourseMgr",
                config:{
                    template:"<teach-mgr-stu-course></teach-mgr-stu-course>"
                }
            },
            {
                // 课程分节信息管理-对某课程某节课进行增删改查-时间多可采用响应式
                url:"/courseMerogenInfoMgr",
                config:{
                    template:"<teach-course-merogen-mgr></teach-course-merogen-mgr>"
                }
            }
        ];

        //绑定路由信息当angular-route
        routes.forEach(
            function (route) {
                $routeProvider.when(route.url,route.config);
            }
        );

        $routeProvider.otherwise({redirectTo:"/loginPage"});
    }]);

