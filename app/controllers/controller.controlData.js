"use strict";

module.exports = function($scope, $document, DataFactory) {

	$scope.printData = function() {
		console.log("printData fired");
		let results = DataFactory.getData();
		console.log("results", results);
		if (results === []) {
			$scope.alert = "Please choose a dataset to query from the Home Screen.";
		} else {
			$scope.data = results;
		}
	};
	
};