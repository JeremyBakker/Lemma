"use strict";

let angular = require("../../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle");

app.controller('dataCtrl', require('./controller.data.js'));