"use strict";
angular.module("stuModule")
    .directive("stuIndexPage",function () {
        return {
            restrict:"AE",
            templateUrl:"studentPages/stuIndex/stuIndexTemplate.html",
            replace:true,
            controller:"stuIndexCtrl",
            link:function () {

            }
        }
    });