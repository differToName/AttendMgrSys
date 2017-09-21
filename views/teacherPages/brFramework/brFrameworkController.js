/**
 * Created by yang on 2017/7/25.
 */

"use strict";

angular.module("brFramework").controller("brFrameworkController",
    ['$scope','$window','$timeout','$location',
        function ($scope,$window,$timeout,$location) {

            $scope.isMenuButtonVisible = true;
            $scope.isMenuVisible = true;

            $scope.menuButtonClicked = function(){
                // console.log("you click the menu button!");
                $scope.isMenuVisible = !$scope.isMenuVisible;

                // $scope.apply();
            }


            $scope.$on('br-menu-item-selected-event', function (evt, data) {
                console.log("333"+data.route);
                $scope.routeString = data.route;
                $location.path(data.route);
            });

            // console.log($($window));
            $($window).on("resize",function(){

                $scope.$apply(function(){
                    checkWidth();
                });

            });

            //angularjs发生资源清理操作的时候，会广播$destory事件，我们可以把一些系统资源的清理代码写在这里。
            $scope.$on("$destroy",function(){
                $($window).off("resize");
                console.log("resize event listening is off!");
            });

            var checkWidth = function(){
                //get current width width
                var width  = Math.max($($window).width(),$window.innerWidth);
                $scope.isMenuButtonVisible = (width<768);
                $scope.isMenuVisible = !$scope.isMenuButtonVisible;
            }

            $timeout(function(){
                checkWidth();
            },0);

        }
    ]);