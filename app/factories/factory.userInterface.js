"use strict";

module.exports = function QueryFactory ($q, $http, firebaseCredentials) {

	let natural = require('../../lib/node_modules/natural/'),
		stopWord = require('../../lib/node_modules/stopword/lib/stopword.js');

	let tokenizer = new natural.WordTokenizer();

	let countedQueryTokensArray = [];

	let setQuery = (queryReceived) => {
	let query = queryReceived;	
	console.log("query received at click", queryReceived);
	// Parse the query data into individual tokens.
	let tokensArray = tokenizer.tokenize(query.toLowerCase());
	// Remove all stop words from the array of tokens.
	tokensArray = stopWord.removeStopwords(tokensArray).sort();
	// Push the sorted tokensArray into an array.
	console.log("sorted tokens", tokensArray);
	countTokens(tokensArray);
	};

	// Calculate the number of times each token appears in its document, create an object
	// for each token, and append the relevant statistical data.
	let countTokens = (tokensArray) => {
		countedQueryTokensArray = [];
		let count;
		console.log("tokensArray received", tokensArray);
		// Loop through the array of sorted tokens, count each token, and create an object 
		// for it.
		for (var i = 0; i < tokensArray.length; i++){
			
			if (tokensArray[i] !== tokensArray[i+1] || tokensArray.length === 1) {
				let currentTokenObject = {};
				count = 1;
				currentTokenObject.document = "query";
				currentTokenObject.word = tokensArray[i];
				currentTokenObject.count = count;
				currentTokenObject.uid = ""; //=============TO DO==============//
				currentTokenObject.timeStamp = new Date();
				countedQueryTokensArray.push(currentTokenObject);
			} else {
				count++;
			}
		}
		console.log("countedQueryTokensArray", countedQueryTokensArray);
		termFrequency(countedQueryTokensArray);
	};
	
	// Loop through the array of counted tokens and divide the number of appearances of each
	// term by the length of each document. This gives the normalized term frequency, which 
	// we then append to the object within the countedQueryTokensArray. Pass the 
	// countedQueryTokensArray to the inverseDocumentFrequency function. 
	let termFrequency = (countedQueryTokensArray) => {
		for (var i = 0; i < countedQueryTokensArray.length; i++) {
			let termFrequency = countedQueryTokensArray[i].count/countedQueryTokensArray.length;
			countedQueryTokensArray[i].termFrequency = termFrequency;
		}
		idfQuery(countedQueryTokensArray);
	};

	let idfQuery = (countedQueryTokensArray) => {	
		let queryPromises = [];
		// loop through array, grab token and append it to search query. 
		for (var i = 0; i < countedQueryTokensArray.length; i++) {
			let searchTerm = countedQueryTokensArray[i].word;
			queryPromises.push(grabControlData(searchTerm));
		}
		Promise.all(queryPromises).
			then((firebaseControlData) => getQueryKeys(firebaseControlData)).
			catch ((error)=> console.error(error));
	};
	
	// Get the hidden values from /values/firebaseCredentials.js that will allow us to 
	// access Firebase.
	let firebaseValues = firebaseCredentials.getfirebaseCredentials();
	// Get the control data from Firebase, ordered by word. This will allow us to pull the 
	// inverse document frequency for the query words.
	let grabControlData = (searchTerm) => {
		return $q((resolve, reject) => {
			$http.get(`${firebaseValues.databaseURL}/-KeuDJjQ45LivyeELPEQ.json?orderBy="word"&equalTo="${searchTerm}"`)
					.then(
						(ObjectFromFirebase) => {
							console.log("Here is my Firebase Object from grabControlData: ", ObjectFromFirebase);
							resolve(ObjectFromFirebase);
						})
					.catch((error) => console.error(error));
		});
	};

	let getQueryKeys = (firebaseControlData) => {
		let queryKeys = [];
		let idfKeys = [];
		for (var i = 0; i < firebaseControlData.length; i++) {
			let keys = Object.keys(firebaseControlData[i].data);
			queryKeys.push(keys);
		}
		console.log("queryKeys", queryKeys);
		for (i = 0; i < queryKeys.length; i++) {
			if (queryKeys[i] === undefined) {
				idfKeys.push(queryKeys[i])
			} else {
				idfKeys.push(queryKeys[i][0]);
			}
			// The Firebase search returns an empty array for the words in the query not in 
			// the control dataset. This if statement removes the empty data.
			console.log("idfKeys", idfKeys);
			// if (queryKeys[i].length === 0) {
			// 	idfKeys.pop();
			// }
		}
		console.log("idfKeys at 118", idfKeys);
		assignIdfValues(idfKeys, firebaseControlData);
	};

	let assignIdfValues = (idfKeys, firebaseControlData) => {
		let queryArray = [];
		for (var i = 0; i < idfKeys.length; i++) {
			let queryObject = {};
			console.log("firebaseControlData", firebaseControlData);
			console.log("idfKeys", idfKeys);
			let controlObject = firebaseControlData[i].data[idfKeys[i]];
			if (controlObject === undefined) {
				firebaseControlData.splice(i, 1);
				idfKeys.splice(i, 1);
			} else {
			queryObject.word = controlObject.word;
			queryObject.inverseDocumentFrequency = controlObject.inverseDocumentFrequency;
			queryArray.push(queryObject);
			}
		}
	console.log("queryArray", queryArray);
	concatQueryCountedArrays(queryArray);
	};

	let concatQueryCountedArrays = (queryArray) => {
		let concatenatedQueryArray = countedQueryTokensArray.concat(queryArray);
		let sortedConcatQueryArray = concatenatedQueryArray.sort(function(a, b){
		    if (a.word < b.word) {
			return - 1;
			}
			if (a.word > b.word) {
			return + 1;
			}
			return 0;
		});
		mergeQueryCountedIdf(sortedConcatQueryArray);
	};
	
	let finalArray = [];
	let mergeQueryCountedIdf = (sortedConcatQueryArray) => {
		console.log("sortedConcatQueryArray", sortedConcatQueryArray);
		console.log("countedQueryTokensArray", countedQueryTokensArray);
		for (var i = 0; i < sortedConcatQueryArray.length; i++) {
			for (var j = 0; j < countedQueryTokensArray.length; j++) {
				if (sortedConcatQueryArray[i].word === countedQueryTokensArray[j].word) {
					countedQueryTokensArray[j].inverseDocumentFrequency = 
						sortedConcatQueryArray[i].inverseDocumentFrequency;
				}
			}
			finalArray.push(countedQueryTokensArray[i]);
			console.log("finalArray", finalArray);
		}
		// let j = 1;
		// for (var i = 0; i < countedQueryTokensArray.length; i++) {
		// 	console.log("i", i);
		// 	console.log("j", j);
		// 	let idf = sortedConcatQueryArray[j].inverseDocumentFrequency;
		// 	countedQueryTokensArray[i].inverseDocumentFrequency = idf;
		// 	j = j + 2;
		// 	finalArray.push(countedQueryTokensArray[i]);
		// }
		// queryTfIdf(finalArray);
	};

	let queryTfIdf = (finalArray) => {
		for (var i = 0; i < finalArray.length; i++) {
			finalArray[i].tfIdf = finalArray[i].termFrequency * 
				finalArray[i].inverseDocumentFrequency;
		}
	};

	// Create a function to make dataToOutput available to controllers.
	let getData = () => {
		console.log("finalArray at getData", finalArray);
		return finalArray;
	};


	return {setQuery, grabControlData, getData};
};