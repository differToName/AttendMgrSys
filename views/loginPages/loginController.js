"use strict";

angular.module("loginModule")
    .controller("loginCtrl",["$scope","$location","$rootScope","$http",function ($scope,$location,$rootScope,$http) {

        $scope.toLogin=function () {
            //三个变量分别表示用户号、密码、身份
            var userNo=$scope.loginNo;
            var userPWD=$scope.loginPWD;
            var userIdentity=$scope.loginUser;
            if(userNo.length<4){
                $scope.errorMessage="您输入的账号格式不对！";
                return ;
            }
            if(userPWD.length<3){
                $scope.errorMessage=" 密码长度不能小于3位！";
                return ;
            }
            if(userIdentity==="S"){//是学生登陆
                $http({
                    method:"GET",
                    url:"http://localhost/v1/stu/idenStu?stuNo="+userNo+"&stuPWD="+userPWD
                }).then(
                    function (resp) {//登陆成功
                        if(resp.data.result===0){//如果没有查询到-后台做
                            console.log(resp.data);
                            $scope.errorMessage="用户账号或密码错误！";
                        }else if(resp.data.result===2){//已经停学了
                            console.log("停学判断");
                            $scope.errorMessage="该学生已经停学，不允许登陆！";
                        }else{
                            //缓存到session中
                            sessionStorage.setItem("userNo",userNo);
                            sessionStorage.setItem("userPWD",userPWD);
                            sessionStorage.setItem("userIdentity",userIdentity);
                            $location.path("/stuIndex");
                        }
                        return ;
                    },
                    function (resp) {//登陆失败
                        console.log("fail："+resp.data);
                        $scope.errorMessage="用户账号或密码错误！";
                        return ;
                    }
                );
            }else if(userIdentity==="T"){//是教师登陆
                $http({
                    method:"GET",
                    url:"http://localhost/v1/teacher/idenTeac?teacherNo="+userNo+"&teacherPWD="+userPWD
                }).then(
                    function (resp) {//后台查询成功
                        if(resp.data.result===0){//如果没有查询到-后台做
                            console.log(resp.data);
                            $scope.errorMessage="用户账号或密码错误！";
                        }else{
                            //缓存到session中
                            $location.path("/teacherIndex");
                        }
                        return ;
                    },
                    function (resp) {//登陆失败
                        console.log("fail："+resp.data);
                        $scope.errorMessage="用户账号或密码错误！";
                        return ;
                    }
                );
            }
            console.log(userNo+" +"+userPWD+" "+userIdentity);
        }
    }]);