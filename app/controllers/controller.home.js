"use strict";

module.exports = function($scope, $window, DataFactory) {
	$scope.getPsalmsData = () => {
		$window.location.href="#!/ControlData";
		DataFactory.getPsalmsJSON().
			then((data) => DataFactory.parseJSON(data)).
			then((sortedTokensArray) => DataFactory.countTokens(sortedTokensArray)
		);
	};

	$scope.getTestData = () => {
		$window.location.href="#!/ControlData";
		DataFactory.getTestJSON().
			then((data) => DataFactory.parseJSON(data)).
			then((sortedTokensArray) => DataFactory.countTokens(sortedTokensArray)
		);
	};

};