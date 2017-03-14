"use strict";

module.exports = function($scope, CosineFactory) {
	// TODO: set up this controller to pull data from Firebase based on uid
	
	$scope.showData = () => {
		let results = CosineFactory.getData();
		$scope.result = results;
	};
};