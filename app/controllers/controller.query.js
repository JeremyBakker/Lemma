"use strict";

module.exports = function($scope, QueryFactory, CosineFactory) {

	$scope.grabQuery = () => {
		let query = $scope.queryInput;
		QueryFactory.setQuery(query);
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
		results = CosineFactory.printData();
		console.log("results", results);
		$scope.result = results;
	};
};