/**
 * Created by yang on 2017/7/21.
 */

angular.module("brFramework")
       .directive("brFramework",function() {

           return {
               restrict: 'AE',
               scope: {
                   appTitle: "@",
                   subTitle: "@",
                   logoImg: "@"
               },
               controller:"brFrameworkController",
               replace: true,
               transclude: true,
               templateUrl: 'teacherPages/brFramework/brFrameworkTemplate.html'
           }

       });