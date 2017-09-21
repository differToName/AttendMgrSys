"use strict";

angular.module("stuModule")
    .directive("showStuInfo", ["$http", function ($scope) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "studentPages/stuInfoPage/stuInfoTemplate.html",
            controller: "stuInfoCtrl",
            link: function (scope, el, attrs, ctrl) {
                // console.log("http://localhost/studentPic/s001.jpg");
            }
        }
    }]);