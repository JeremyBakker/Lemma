"use strict";

let angular = require("../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle", ['ngRoute']);

require("../lib/node_modules/angular-route/angular-route.min.js");

require("./factories/");
require("./controllers/");

app.config(function($routeProvider){
    $routeProvider.
    when('/', {
        templateUrl: '../partials/partial.test.html',
        controller: "dataCtrl"
    });
});