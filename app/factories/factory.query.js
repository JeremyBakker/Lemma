"use strict";

module.exports = function QueryFactory ($q, $http, firebaseCredentials, DataFactory, DataStorageFactory) {

	let natural = require('../../lib/node_modules/natural/'),
		stopWord = require('../../lib/node_modules/stopword/lib/stopword.js');

	let tokenizer = new natural.WordTokenizer();

	//==========================================================// 
	//=======Define global variables to hold original data======//
	//==========================================================//

	let query;
	let originalQueryTokens;
	let countedQueryTokensArray;
	
	//=========================================================================// 
	//=======Grab the search query, parse it, and pass the resulting data======//
	//=========================================================================//

	let setQuery = (queryReceived) => {
		// Grab the query from the text input box in the userInterface partial, tokenize it, 
		// lowercase the tokens, store the tokens in the global originalQueryTokens array, 
		// remove the stop words, alphabetize the remaining tokens, and push them into an 
		// array to be passed into the next function and counted.
		query = queryReceived;	
		let tokensArray = tokenizer.tokenize(query.toLowerCase());
		originalQueryTokens = tokensArray;
		tokensArray = stopWord.removeStopwords(tokensArray).sort();
		countTokens(tokensArray);
	};

	//=========================================// 
	//========Count the term frequency=========//
	//=========================================//

	let countTokens = (tokensArray) => {
	// Clear the array for new searches, calculate the number of times each token appears 
	// in the query, create an object for each token, and append the count. Push each object 
	// into an array that will be passed into the next function, which will calculate the 
	// normalized term frequency.
		countedQueryTokensArray = [];
		let count = 1;
		for (var i = 0; i < tokensArray.length; i++){
			if (tokensArray[i] !== tokensArray[i+1] || tokensArray.length === 1) {
				let currentTokenObject = {};
				currentTokenObject.document = "query";
				currentTokenObject.word = tokensArray[i];
				currentTokenObject.count = count;
				currentTokenObject.timeStamp = new Date();
				countedQueryTokensArray.push(currentTokenObject);
			} else {
				count++;
			}
		}
		termFrequency(countedQueryTokensArray);
	};
	
	//====================================================// 
	//=======Calculate the normalized term frequency======//
	//====================================================//

	let termFrequency = (countedQueryTokensArray) => {
	// Loop through the array of counted tokens and divide the number of appearances of each
	// term by the length of each document, which is set in the global originalQueryTokens
	// array. This gives the normalized term frequency, which we then append to the object 
	// within the countedQueryTokensArray. Pass the countedQueryTokensArray to the 
	// inverseDocumentFrequency function. 
		for (var i = 0; i < countedQueryTokensArray.length; i++) {
			let termFrequency = countedQueryTokensArray[i].count/originalQueryTokens.length;
			countedQueryTokensArray[i].termFrequency = termFrequency;
		}
		idfQuery(countedQueryTokensArray);
	};

	//==================================================================================// 
	//=Create a Promise.all that waits for each term query to resolve before proceeding=//
	//==================================================================================//

	let idfQuery = (countedQueryTokensArray) => {	
		let queryPromises = [];
		// Loop through the array of tokens and create a Promise containing each 
		// token to be queried. 
		for (var i = 0; i < countedQueryTokensArray.length; i++) {
			let searchTerm = countedQueryTokensArray[i].word;
			queryPromises.push(grabControlData(searchTerm));
		}
		Promise.all(queryPromises).
			then((firebaseControlData) => getQueryKeys(firebaseControlData)).
			catch ((error)=> console.error(error));
	};
	
	//======================================================================// 
	//=======Grab the control data to compare the search query against======//
	//======================================================================//

	// Get the hidden values from /values/firebaseCredentials.js that will allow us to 
	// access Firebase.
	let firebaseValues = firebaseCredentials.getfirebaseCredentials();
	// Get the control data from Firebase, ordered by token entered in the Promise.all function. 
	// This allows us to pull the stored inverse document frequency for the query words. 
	// Pass the relevant data to the getQueryKeys function via the Promise.all in the
	// idfQuery function.
	

	let path;
	let grabControlData = (searchTerm) => {
		// This determines whether the user wants to query the control data or the data
		// from Psalms. The path is a key assigned by Firebase.

		let firebaseControlData = DataStorageFactory.getSetData();
		path = firebaseControlData.setFirebaseControlData.data.name;
		return $q((resolve, reject) => {
			$http.get(`${firebaseValues.databaseURL}${path}.json?orderBy=
				"word"&equalTo="${searchTerm}"`)
					.then(
						(ObjectFromFirebase) => {
							resolve(ObjectFromFirebase);
						})
					.catch((error) => console.error(error));
		});
	};

	//=======================================================// 
	//=======Grab the firebase keys for each query term======//
	//=======================================================//

	let getQueryKeys = (firebaseControlData) => {
	// Get the keys for each query token that exists in the control data in order to access 
	// each token's idf value. Terms that appear multiple times have multiple keys. Separate 
	// the first key in each array to use for assigning the idf value. Each term will have 
	// the same idf value. Pass the keys and the data to the subsequent function.
		DataStorageFactory.setFirebaseData(firebaseControlData);
		let controlIdfKeys = [];
		let individualIdfKeys = [];
		for (var i = 0; i < firebaseControlData.length; i++) {
			let keys = Object.keys(firebaseControlData[i].data);
			controlIdfKeys.push(keys);
		}
		for (i = 0; i < controlIdfKeys.length; i++) {
			if (controlIdfKeys[i] === undefined) {
				individualIdfKeys.push(controlIdfKeys[i]);
			} else {
				individualIdfKeys.push(controlIdfKeys[i][0]);
			}
		}
		assignIdfValues(individualIdfKeys, firebaseControlData);
	};

	//========================================================// 
	//=======Add the appropriate idf values to each term======//
	//========================================================//

	let assignIdfValues = (individualIdfKeys, firebaseControlData) => {
	// Determine whether each token exists in the control set. If the query token does not 
	// exist in the control set, create an object for it from the countedQueryTokens array
	// and calculate an idf depending on its control data. If the token exists in the control
	// set, calculate a new idf that takes into account its existence in the query document.
	// Push the amended objects into the queryArray. Pass that array to the setTfIdf function.
		let queryArray = [];
		let controlArray = [];
		for (var i = 0; i < individualIdfKeys.length; i++) {
			let	queryObject = countedQueryTokensArray[i];
			let controlObject = firebaseControlData[i].data[individualIdfKeys[i]];
			console.log("controlObject.document", controlObject.document);
			if (controlObject === undefined && controlObject.document === "Test") {
				queryObject.inverseDocumentFrequency = 1 + Math.log10(2/1);
			} else if (controlObject === undefined && controlObject.document !== "Test") {
				queryObject.inverseDocumentFrequency = 1 + Math.log10(34/1);
			} else if (controlObject && controlObject.document === "Test") {
				queryObject.inverseDocumentFrequency = 1 + Math.log10(2 / (controlObject.documentFrequency + 1));
			} else {
				queryObject.inverseDocumentFrequency = 1 + Math.log10(34 / (controlObject.documentFrequency + 1));
			}
			queryArray.push(queryObject);
		}
	setTfIdf(queryArray);
	};

	//=========================================// 
	//===========Calculate the tf-idf==========//
	//=========================================//

	let setTfIdf = (queryArray) => {
		for (var i = 0; i < queryArray.length; i++) {
			queryArray[i].tfIdf = queryArray[i].termFrequency * 
				queryArray[i].inverseDocumentFrequency;
			DataStorageFactory.setData(queryArray);
			setData(queryArray);
		}
	};

	//==================================================================================// 
	//======Set the final data and make it available to other segments of the code======//
	//==================================================================================//

	let finalArray = [];
	let setData = (completedArray) => {
		finalArray = completedArray;
	};

	let getData = () => {
		return finalArray;
	};

	return {setQuery, grabControlData, getData};
};