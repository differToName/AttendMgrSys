"use strict";

angular.module("stuModule")
    .controller("stuIndexCtrl", ["$scope", "$location", "$rootScope", "$http", function ($scope, $location, $rootScope, $http) {

        $(function () {
            if (sessionStorage.userNo == undefined || sessionStorage.userPWD == undefined) {
                // $location.path("/loginPage");
                history.go(-1);
            }
        });

        //签到，展示课程信息
        $scope.toSignCourse = function () {
            $location.path("/signCourse");
        }

        //去修改密码-打开模态窗
        $scope.toModifyPWD = function () {
            if (sessionStorage.userNo || sessionStorage.userPWD) {
                console.log("打开模态窗");
                $('#modifyUserPWD').modal('toggle');//打开模态窗
            }else {
                $location.path("/loginPage")
            }
        }

        //验证旧密码，正确就读入数据库
        $scope.modifyPWD = function () {
            var oldPWD = $scope.oldUserPWD;
            var newPWD = $scope.newUserPWD;
            var newPWD2 = $scope.newUserPWD2;//再次输入的密码
            console.log(oldPWD + " " + newPWD + "  " + newPWD2);
            if (newPWD === newPWD2) {
                if (newPWD.length <= 5) {
                    $scope.errorMessage = "密码长度在6-15之间！";
                } else if (oldPWD != sessionStorage.userPWD) {
                    $scope.errorMessage = "输入的旧密码不正确";
                } else if (oldPWD === newPWD) {//旧密码和新密码一样
                    $scope.errorMessage = "新密码不能和旧密码相同";
                } else {//验证正确
                    ModifyPWDInDB(newPWD);//去数据库修改密码
                }
            } else {
                $scope.errorMessage = "重复输入的密码不一致";
            }
        }

        //修改数据库密码
        function ModifyPWDInDB(pwd) {
            $http({
                method: "POST",
                data: {stuPWD: pwd, stuNo: sessionStorage.userNo},
                url: "http://localhost/v1/stu/updatePWD"
            }).then(
                function (resp) {
                    $('#modifyUserPWD').modal('toggle');//关闭模态窗
                    sessionStorage.clear();//清空session
                    $location.path("/loginPage");
                    console.log(resp.data);
                    console.log(sessionStorage);
                },
                function (resp) {
                    console.log("修改密码失败!");
                    alert(resp.data.error);
                }
            )
        }

        // 将错误信息置空隐藏
        $scope.changeHidden = function () {
            $scope.errorMessage = null;
        }

        //退出
        $scope.toLogOut = function () {
            //$('#myModal').modal('hide');
            if (confirm("您确定退出该系统吗？")) {
                sessionStorage.clear();//清空sessionStorage
                // sessionStorage=null;
                $location.path("/loginPage");
            }
        }

        //展示个人信息
        $scope.showStuInfo = function () {
            $location.path("/showStuInfo");
        }
    }]);