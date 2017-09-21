"use strict";

angular.module("attendApp")
    .directive("appHeader",function () {
        return {
            restrict:"EA",
            transclude:true,
            scope:{
                isShowBackBtn:"@",
                titleInfo:"@"
            },
            controller:"headerCtrl",
            templateUrl:"headerPage/headerTemplate.html",
            link:function (scope,el,attrs,ctrl) {
                scope.titleInfo=attrs.pagetitle;
                if(attrs.showbtn==="T")
                    scope.isShowBackBtn=true;
                else
                    scope.isShowBackBtn=false;
               console.log(attrs.pagetitle);
            }
        }
    });