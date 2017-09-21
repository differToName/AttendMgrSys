/**
 * Created by yang ong on 2017/8/1.
 */

"use strict";

angular.module("brMenu")
    .directive("brMenuGroup",function(){
        return {
           restrict:"AE",
           require:"^brMenu",
           transclude:true,
           scope:{
              label:"@",
              icon:"@"
           },
           templateUrl:"teacherPages/brMenu/brMenuGroupTemplate.html",
           link:function(scope,el,attrs,ctrl){

               console.log("menu-group el:"+el);

               scope.isOpen = false;

               scope.closeMenu = function () {
                   scope.isOpen = false;
               };

               scope.isVertical = function(){
                   return ctrl.isVertical() || el.parents('.br-subitem-section').length > 0;
               }

               scope.toggleSubMenu = function () {
                   scope.isOpen = !scope.isOpen;

                   if (el.parents('.br-subitem-section').length == 0)
                       scope.setSubmenuPosition();

                   ctrl.setOpenMenuScope(scope);

               }

               scope.setSubmenuPosition = function () {
                   console.log(el);
                   var pos = el.offset();
                   $('.br-subitem-section').css({ 'left': pos.left + 20, 'top': 36 });
               };

           }
        };
    })

