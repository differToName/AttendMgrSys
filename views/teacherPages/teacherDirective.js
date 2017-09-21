angular.module("teacherModule")
    .directive("teacherIndex",function(){
        return {
            restrict:"AE",
            replace:true,
            templateUrl:"teacherPages/teacherIndexTemplate.html",
            controller:"teachCtrl"
        }
    });