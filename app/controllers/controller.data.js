"use strict";

module.exports = function($scope, DataFactory) {
	$scope.getData = () => {
		DataFactory.getJSON().then(
			(data) => DataFactory.parseJSON(data)
		).then (
			(data) => {DataFactory.setData(data);}
		);
	};

	$scope.parseData = () => {
		DataFactory.run();
	};

	$scope.printData = () => {
		let results = DataFactory.getData();
		console.log("results", results[0]);
		$scope.data = results;
	};
};