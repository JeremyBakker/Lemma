"use strict";

module.exports = function($scope, DataFactory) {
	//Import the control data. 
	$scope.getData = () => {
		DataFactory.getJSON().then(
			(data) => DataFactory.parseJSON(data)
		);
	};

	$scope.parseData = () => {
		DataFactory.countTokens();
	};

	$scope.printData = () => {
		let results = DataFactory.getData();
		$scope.data = results;
	};
};