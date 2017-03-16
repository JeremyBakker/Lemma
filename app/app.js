"use strict";

let angular = require("../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle", ['ngRoute']);

require("../lib/node_modules/angular-route/angular-route.min.js");

require("./factories/");
require("./controllers/");
require("./values/");

app.config(function($routeProvider){
    $routeProvider.
    when('/', {
        templateUrl: '../partials/partial.home.html',
        controller: 'homeCtrl'
    }).
    when('/ControlData', {
        templateUrl: '../partials/partial.rawData.html',
        controller: "dataCtrl"
    }).
    when('/UserInterface', {
    	templateUrl: '../partials/partial.query.html',
    	controller: 'queryCtrl'
    }).
    when('/Chart', {
        templateUrl: '../partials/partial.chart.html',
        controller: 'chartCtrl'
    });
});