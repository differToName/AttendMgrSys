"use strict";
angular.module("loginModule")
    .directive("loginPage",function () {
        return{
            restrict:"AE",
            templateUrl:"loginPages/loginTemplate.html",
            replace:true,
            scope:{
                loginNo:"@",
                loginPWD:"@",
                loginUser:"@",
                errorMessage:"@"
            },
            controller:"loginCtrl",
            link:function (scope,el,attrs,ctrl) {
                scope.loginUser="S";
                scope.changeHidden=function () {
                    scope.errorMessage=null;
                    // console.log($("#loginError").attr("hidden"));
                    // var hiddenStauts=$(".alert-dismissible").attr("hidden");//获取属性值
                    // $(".alert-dismissible").attr("hidden",!hiddenStauts);
                }
            }
        }
    });
