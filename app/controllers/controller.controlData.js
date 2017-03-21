"use strict";

module.exports = function($scope, $document, DataFactory) {

	$scope.printData = function() {
		$scope.emptyData = false;
		let results = DataFactory.getData();
		if (results.length === 0) {
			$scope.emptyData = true;
			$scope.alertMessage = "Please choose a dataset to query from the Home screen.";
		} else {
			$scope.data = results;
		}
	};
	
};