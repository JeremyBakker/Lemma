"use strict";

module.exports = function($scope, DataFactory, QueryFactory, CosineFactory) {

	$scope.grabQuery = () => {
		let query = $scope.queryInput;
		$scope.alertMessage = "";
		$scope.queryEntered = false;
		if (query === undefined) {
			$scope.alertMessage = "Please enter a query."
			$scope.queryEntered = true;
			count++
			return;
		} else {
		QueryFactory.setQuery(query);
		}
	};

	$scope.grabControlData = () => {
		QueryFactory.grabControlData();
	};

	$scope.displayData = () => {
		$scope.data = [];
		$scope.data = QueryFactory.getData();
		console.log("$scope.data at displayData", $scope.data);
	};
	
	let results;

	$scope.showData = () => {
		CosineFactory.getData();
		if (DataFactory.getData().length === 0) {
			results = "Please choose a control data set from the Home screen."
		} else {
			results = CosineFactory.printData();
		}
		$scope.result = results;
	};
};