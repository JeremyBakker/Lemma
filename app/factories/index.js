'use strict';

let angular = require("../../lib/node_modules/angular/"),
	app = angular.module("religiousStruggle");

app.factory('DataFactory', require('./factory.controlData.js'));
app.factory('QueryFactory', require('./factory.query.js'));
app.factory('DataStorageFactory', require('./factory.dataStorage.js'));
app.factory('CosineFactory', require('./factory.cosine.js'));