"use strict";

module.exports = function($scope, DataFactory, QueryFactory, CosineFactory) {

	let query;

	$scope.grabQuery = () => {
		query = $scope.queryInput;
		$scope.alertMessage = "";
		$scope.queryEntered = false;
		if (query === undefined) {
			$scope.alertMessage = "Please enter a query.";
			$scope.queryEntered = true;
			return;
		}
		else if (DataFactory.getData().length === 0) {
			$scope.alertMessage = "Please choose a control data set from the Home screen.";
			$scope.queryEntered = true;
		} else {
		QueryFactory.setQuery(query);
		query = "";
		}
	};

	$scope.grabControlData = () => {
		QueryFactory.grabControlData();
	};

	$scope.displayData = () => {
		$scope.data = [];
		$scope.queryEntered = false;
		if (query === undefined) {
			$scope.alertMessage = "Please enter a query.";
			$scope.queryEntered = true;
		}
		else if (DataFactory.getData().length === 0) {
			$scope.alertMessage = "Please choose a control data set from the Home screen.";
			$scope.queryEntered = true;
		} else {
			$scope.data = QueryFactory.getData();
		}
	};
	
	let results;

	$scope.showData = () => {
		CosineFactory.getData();
		$scope.queryEntered = false;
		if (query === undefined) {
			$scope.alertMessage = "Please enter a query.";
			$scope.queryEntered = true;
		}
		else if (DataFactory.getData().length === 0) {
			$scope.alertMessage = "Please choose a control data set from the Home screen.";
			$scope.queryEntered = true;
		} else {
			results = CosineFactory.printData();
		}
		$scope.result = results;
	};
};