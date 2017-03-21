"use strict";

module.exports = function($scope, $window, DataFactory) {

	$scope.getPsalmsData = () => {
		DataFactory.getPsalmsJSON();
		$window.location.href="#!/ControlData";
	};

	$scope.getTestData = () => {
		DataFactory.getTestJSON();
		$window.location.href="#!/ControlData";
	};

};