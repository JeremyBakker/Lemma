"use strict";

module.exports = function($scope, DataFactory) {

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