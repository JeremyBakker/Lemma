"use strict";

module.exports = function($scope, $location) {

	$(".button-collapse").sideNav();

	$scope.home = function(){
        $location.url("/");
    };

    $scope.control = function(){
        $location.url("/ControlData");
    };

    $scope.query = function(){
        $location.url("/Query");
    };

    $scope.chart = function(){
        $location.url("/Chart");
    };

};