"use strict";

let angular = require("../../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle");

app.controller('homeCtrl', require('./controller.home.js'));
app.controller('dataCtrl', require('./controller.controlData.js'));
app.controller('userInterfaceCtrl', require('./controller.userInterface.js'));
app.controller('chartCtrl', require('./controller.chart.js'));