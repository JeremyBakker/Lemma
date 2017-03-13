"use strict";

module.exports = function($scope, QueryFactory) {

	$scope.grabQuery = () => {
		let query = $scope.queryInput;
		QueryFactory.setQuery(query);
	};

	$scope.grabControlData = () => {
		QueryFactory.grabControlData();
	};

	$scope.displayData = () => {
		console.log("$scope.data", $scope.data);
		$scope.data = QueryFactory.getData();
	};
};