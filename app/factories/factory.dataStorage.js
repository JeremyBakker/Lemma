"use strict";

module.exports = function DataStorageFactory ($q, $http, firebaseCredentials) {

	let setQueryArray = [];

	let setData = (queryArray) => {
		setQueryArray = queryArray; 
	};

	let controlData = [];
	let setControlData = (idfPrepArray) => {
		controlData = idfPrepArray;
	};

	let originalFirebaseControlData = [];
	let setOriginalFirebaseData = (firebaseControlData) => {
		originalFirebaseControlData = firebaseControlData;
	};

	let setFirebaseControlData = [];
	let setFirebaseData = (firebaseControlData) => {
		setFirebaseControlData = firebaseControlData;
	};

	let getSetData = () => {
		return {
				"controlData": controlData,
				"originalFirebaseControlData": originalFirebaseControlData,
				"queryArray": setQueryArray,
				"setFirebaseControlData": setFirebaseControlData};
	};

	return {setData, getSetData, setFirebaseData, setOriginalFirebaseData, setControlData};
};