'use strict';

let angular = require("../../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle");

app.factory('DataFactory', require('./factory.data.js'));