'use strict';

let angular = require("../../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle");

app.factory('DataFactory', require('./factory.controlData.js'));
app.factory('QueryFactory', require('./factory.userInterface.js'));