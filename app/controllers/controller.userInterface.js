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
		$scope.data = QueryFactory.getData();
		console.log("$scope.data", $scope.data);
	};
};