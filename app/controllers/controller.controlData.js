"use strict";

module.exports = function($scope, DataFactory) {

	$scope.printData = () => {
		let results = DataFactory.getData();
		$scope.data = results;
	};
	
};