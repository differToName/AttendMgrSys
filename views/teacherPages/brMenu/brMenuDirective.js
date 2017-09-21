/**
 * Created by yang ong on 2017/7/21.
 */

angular.module("brMenu")
    .directive("brMenu",function(){
        return {
           restrict:"AE",
           controller: 'brMenuController',
           templateUrl:"teacherPages/brMenu/brMenuTemplate.html",
           transclude:true,
           replace:true
        };
    })
