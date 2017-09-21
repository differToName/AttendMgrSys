"use strict";

angular.module("stuModule")
    .controller("stuInfoCtrl",["$scope", "$location", "$rootScope", "$http", function ($scope, $location, $rootScope, $http) {
        // $scope.isShowStuInfo=true;//刚开始是等于true
        //去显示修改页面
        // $scope.toModifyStu=function () {
        //     $scope.isShowStuInfo=false;
        // }



        $(function () {
            if(!(sessionStorage.userNo || sessionStorage.userPWD)){
                console.log("");
                $location.path("/loginPage");
            }
        });

        //获取学生信息进行填充
        $http({
            method:"GET",
            url:"http://localhost/v1/stu/showStuInfo?stuNo="+sessionStorage.userNo
        }).then(
            function (resp) {//获取成功后
                $scope.stuInfoErrorInfo=resp.data.result;
                console.log("查看错误信息");
                console.log($scope.stuInfoErrorInfo);
                if(resp.data.result){//没有查询到
                    console.log("没有查询到该信息");
                }else {
                    $scope.stuInfo=resp.data.stuInfo;
                    if($scope.stuInfo.stuSex==="F"){
                        $scope.stuInfo.stuSex="女";
                    }else
                        $scope.stuInfo.stuSex="男";
                }

            },
            function (resp) {//失败了
                $scope.stuInfoErrorInfo=resp.data.result;
                console.log("查询学生信息失败了");
            }
        );

        //获取该学生的课程考勤分进行展示
        $http({
            method:"GET",
            url:"http://localhost/v1/stu/showStuCourse?stuNo="+sessionStorage.userNo
        }).then(
          function (resp) {//成功
            // $scope.stuCourseScoreInfo=resp.data
              console.log(resp.data.courseScore);
              if(resp.data.courseScore!=undefined)
                 $scope.stuCourseScoreInfo=resp.data.courseScore;
              else{
                  console.log("查出来是空的");
              }
          },
            function (resp) {
                console.log("查询考勤分失败了");
            }
        );

    }]);