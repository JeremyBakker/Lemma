"use strict";

module.exports = function DataStorageFactory ($q, $http, firebaseCredentials) {

	let setQueryArray = [];
	let setData = (queryArray) => {
		setQueryArray = queryArray; 
	};

	let setFirebaseControlData = [];
	let setFirebaseData = (firebaseControlData) => {
		setFirebaseControlData = firebaseControlData;
		console.log("setFirebaseControlData at set", setFirebaseControlData);
	};

	let getSetData = () => {
		return {
				"queryArray": setQueryArray,
				"setFirebaseControlData": setFirebaseControlData};
	};

	return {setData, getSetData, setFirebaseData};
};