"use strict";

module.exports = function($scope, $window, DataFactory) {

	$scope.getPsalmsData = () => {
        $("#navButtons").show();
		DataFactory.getPsalmsJSON();
		$window.location.href="#!/ControlData";
	};

	$scope.getTestData = () => {
        $("#navButtons").show();
		DataFactory.getTestJSON();
		$window.location.href="#!/ControlData";
	};

};