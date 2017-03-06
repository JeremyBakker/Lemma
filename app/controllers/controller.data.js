"use strict";

module.exports = function($scope, DataFactory) {
	console.log("dataCtrl loaded here.");
	$scope.getData = () => {
		console.log("click");
		DataFactory.getJSON().then(
			(data) => DataFactory.parseDocument(data)
		).then (
			(data) => {DataFactory.countTokens(data);}
		);
	};
};