"use strict";

module.exports = function CosineFactory (DataStorageFactory) {
	// TODO: push cosine similarity data from here to Firebase once uid functionality is set

	let queryArray = [];
	let controlArray = [];
	let createIdfVectors = () => {
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
			console.log("queryArray", queryArray);
			console.log("controlArray", controlArray);
			calculateCosine(queryArray, controlArray);
	};

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
		console.log("cosineSimilarity", cosineSimilarity);
	};

// [Definition: if a = (a1,a2,...,an) and b = (b1,b2,...,bn) then a.b = Sum(a1*b1 + a2*b2 + ... + an*bn) 
// and ||a|| = sqrt(a1^2 + a2^2 + ... + an^2) and ||b|| = sqrt(b1^2 + b2^2 + ... + bn^2). ]
	
	let getData = () => {
		console.log("getData at CosineFactory called");
		createIdfVectors();
	};

	return {createIdfVectors, calculateCosine, getData};

};

