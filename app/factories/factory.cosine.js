"use strict";

module.exports = function CosineFactory (DataStorageFactory) {
	// TODO: push cosine similarity data from here to Firebase once uid functionality is set

	let createIdfVectors = () => {
		let queryArray = [];
		let controlArray = [];
		let queryTfIdf;
		let data = DataStorageFactory.getSetData();
		let sumIdf = 0;
		let	calculateMultiple = (n, i) => {
			if (n > 0) {
				let keys = Object.keys(data.setFirebaseControlData[i].data);
				sumIdf += data.setFirebaseControlData[i].data[keys[n-1]].tfIdf;
				return calculateMultiple(n-1, i);
			}
		};
		for (var i = 0; i < data.queryArray.length; i++) {
			queryTfIdf = data.queryArray[i].tfIdf;
			queryArray.push(queryTfIdf);
		}
		for (i = 0; i < data.setFirebaseControlData.length; i++) {
			let keys = Object.keys(data.setFirebaseControlData[i].data);
			let controlTfIdf;	
			if (keys.length === 0) {
				controlTfIdf = 0;
			}
			else if (keys.length > 1) {
				let n = keys.length;
				calculateMultiple(n, i);
				controlTfIdf = sumIdf/keys.length;
			} else {
				controlTfIdf = 	data.setFirebaseControlData[i].data[keys[0]].tfIdf;
			}
			controlArray.push(controlTfIdf);
		}
			calculateCosine(queryArray, controlArray);
	};

	let cosineResult;
	let calculateCosine = (a, b) => {
		let numerator = 0;
		let aDenominator = 0;
		let bDenominator = 0;
		for (var i = 0; i < a.length; i++) {
			numerator += a[i] * b[i];
			aDenominator += a[i] * a[i];
			bDenominator += b[i] * b[i];
		}
		let cosineSimilarity = numerator/(Math.sqrt(aDenominator) * Math.sqrt(bDenominator));
		if (isNaN(cosineSimilarity)) {
			cosineResult = "There is no correlation between the query and the control data.";
		} else {	
			cosineResult = cosineSimilarity;
		}
	};
	
	let getData = () => {
		createIdfVectors();
	};

	let printData = () => {
		return cosineResult;
	};

	return {createIdfVectors, calculateCosine, getData, printData};

};

