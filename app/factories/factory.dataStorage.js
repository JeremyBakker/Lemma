"use strict";

module.exports = function DataStorageFactory ($q, $http, firebaseCredentials) {

	let setQueryArray = [];

	let setData = (queryArray) => {
		console.log("Set Query Array");
		setQueryArray = queryArray; 
	};

	let originalFirebaseControlData = [];
	let setOriginalFirebaseData = (firebaseControlData) => {
		console.log("Hello");
		originalFirebaseControlData = firebaseControlData;
		console.log("setOriginalFirebaseData in Data Storage", originalFirebaseControlData);};

	let setFirebaseControlData = [];
	let setFirebaseData = (firebaseControlData) => {
		setFirebaseControlData = firebaseControlData;
		console.log("setFirebaseControlData in Data Storage", setFirebaseControlData);
	};

	let getSetData = () => {
		return {
				"originalFirebaseControlData": originalFirebaseControlData,
				"queryArray": setQueryArray,
				"setFirebaseControlData": setFirebaseControlData};
	};

	return {setData, getSetData, setFirebaseData, setOriginalFirebaseData};
};