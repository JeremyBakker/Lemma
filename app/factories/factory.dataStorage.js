"use strict";

module.exports = function DataStorageFactory ($q, $http, firebaseCredentials) {

	let setQueryArray = [];

	let setData = (queryArray) => {
		console.log("Set Query Array");
		setQueryArray = queryArray; 
	};

	let setFirebaseControlData = [];
	let setFirebaseData = (firebaseControlData) => {
		console.log("Set Firebase Data", setFirebaseControlData);
		setFirebaseControlData = firebaseControlData;
	};

	let getSetData = () => {
		console.log("Data Get");
		return {
				"queryArray": setQueryArray,
				"setFirebaseControlData": setFirebaseControlData};
	};

	return {setData, getSetData, setFirebaseData};
};