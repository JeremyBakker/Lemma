"use strict";

module.exports = function DataFactory ($q, $http) {

	let natural = require('../../lib/node_modules/natural/'),
		stopWord = require('../../lib/node_modules/stopword/lib/stopword.js');

	let tokenizer = new natural.WordTokenizer();

	// Import the control data from storage.
	let getJSON = () => {
	    return $q((resolve, reject)=>{
	        $http.get("../../psalms.json")
	        .then((returnObject)=>{
	        resolve(returnObject);
	    	});
	    });
	};

	// Parse the dataObject passed from the async call above into a two-dimensional array 
	// of alphabetized tokens, grouped by original document source. This will allow us 
	// to iterate over the tokens to determine term frequency and inverse document frequency.
	// We initialize two empty arrays on the global scope: one to hold the sorted keys and 
	// one to hold the sorted tokens, both from the dataObject. This will allow us to access 
	// the relevant data in this factory. We will pass the key array into the countTokens 
	// function in order to append the name of the relevant document to each term. We access 
	// the sorted tokens array within the countTokens function in order to count the tokens.
	let keyArray = [];
	let sortedTokensArray = [];
	let parseJSON = (dataObject) => {
		// Initialize an empty array to hold the data keys of the dataObject so that we
		// can access each value/string in the dataObject.
		// Loop through the dataObject, grab the keys, and push them into the array.
		for (var i = 0; i < (Object.keys(dataObject.data.Psalms).length); i++) {
			keyArray.push(Object.keys(dataObject.data.Psalms[i]));
		}
		// Loop through the data in the dataObject, grab each string, lowercase it, 
		// tokenize it, remove all stopwords, and push them into an array.
		for (i = 0; i < (dataObject.data.Psalms).length; i++) {
			// Initialize a variable to hold each value of the dataObject as a single string
			let oneString;
			oneString = dataObject.data.Psalms[i][keyArray[i]];
			// Lowercase each string, then tokenize it, pushing each token into an array.
			let tokensArray = tokenizer.tokenize(oneString.toLowerCase());
			// Remove all stop words from the array of tokens.
			tokensArray = stopWord.removeStopwords(tokensArray).sort();
			// Push the sorted tokensArray into an array.
			sortedTokensArray.push(tokensArray);
		}
	};

	// Calculate the number of times each token appears in its document, create an object
	// for each token, and append the relevant statistical data.
	let countTokens = () => {
		// Set the initial count value for each term.
		let count = 0;
		// Set the initial comparison token to null.
		let currentToken = null;
		// Initialize an array to hold arrays that contain each token object. Each array
		// represents a document. The parent array will pass directly to the termFrequency 
		// function.
		var countedTokensArray = [];
		// Loop through the 2D array of sorted tokens, count each token, and create an object 
		// for it.
		for (var i = 0; i < sortedTokensArray.length; i++){
			countedTokensArray[i] = [];
			for (var j = 0; j < sortedTokensArray[i].length; j++) {
				// If a token does not equal its predecessor and the count is 0, the count 
				// increases by one. If the current token equals its predecessor, the count
				// increases by one. If the current token does not equal its predecessor, and 
				// the count is at least one, this updates the current token, creates an object
				// with the current-token-before-update and appends the relevant statistical
				// data.
				if (sortedTokensArray[i][j] !== currentToken && count > 0) {
					let currentTokenObject = {};
					currentToken = sortedTokensArray[i][j];
					currentTokenObject.document = keyArray[i][0];
					currentTokenObject.word = currentToken;
					currentTokenObject.count = count;
					countedTokensArray[i].push(currentTokenObject);
					count = 1;
				} else {
					count++;
				}
			}
		}
		termFrequency(countedTokensArray);
	};
	
	// Loop through the 2D array of counted tokens and divide the number of appearances of each
	// term by the length of each document. This gives the normalized term frequency, which 
	// we then append to the object within the countedTokensArray. Pass the countedTokensArray 
	// to the inverseDocumentFrequency function. 
	let termFrequency = function (countedTokensArray) {
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++) {
				let termFrequency = countedTokensArray[i][j].count/countedTokensArray[i].length;
				countedTokensArray[i][j].termFrequency = termFrequency;
			}
		}
		inverseDocumentFrequency(countedTokensArray);
	};

	// Set the document appearance of each term to 1. Then push all the terms into a single
	// array and sort them alphabetically. Compare neighbors and add document appearance 
	// numbers when neighbor words match. Set the numberOfDocs property of all duplicate
	// words to the same number. Divide the number of documents by the numberofDocs property 
	// and multiply by log10. This gives the inverse document frequency. Add this to each 
	// object, then sort by the "document" property (or push the data to Firebase).
	let inverseDocumentFrequency = (countedTokensArray) => {
		// Initialize an array to hold the combined list of words.
		let idfPrepArray = [];
		// Loop through the arrays in the counted tokens array and push each word into one 
		// array.
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++){
				// countedTokensArray[i][j].documentAppearance = 1;
				idfPrepArray.push(countedTokensArray[i][j]);
			}
		}
		// Sort the entire list of words alphabetically.
		let sortedIdfPrepArray = idfPrepArray.sort(function(a, b){
		    if (a.word < b.word) {
			return - 1;
			}
			if (a.word > b.word) {
			return + 1;
			}
			return 0;
		});
		// Determine how many documents contain each term. The recursive function 
		// setNumberofDocs() takes the count set when a term's subsequent neighbor does not
		// match. It uses that number to move backward through the array and assign the 
		// docCount to each term object. The loop below the function determines the count
		// and sets docCount to the count. We need two instances of that number because one
		// determines how far to reach back in the array, and one remains stable as the 
		// document frequency.
		let setNumberOfDocs = function(count, docCount) {
			if (count >= 0) {
				sortedIdfPrepArray[(i-count)].documentFrequency = docCount;
				return setNumberOfDocs(count - 1, docCount);
			} else {
				return count;
			}
		};
		let count = 0;
		let currentToken = null;
		for (i = 0; i < sortedIdfPrepArray.length; i++) {
			if (sortedIdfPrepArray[i].word !== currentToken && count > 0) {
				currentToken = sortedIdfPrepArray[i].word;
				let docCount = count;
				setNumberOfDocs(count, docCount);
				count = 1;
			} else {
				count++;
			}
		}
		// Here we set the inverse document frequency, which is the total number of documents
		// divided by the document frequency and multiplied by log. On the use of log, see
		// Manning, Raghavan, and Schütze, "Introduction to Information Retrieval," Cambridge 
		// University Press, (2008), pg. 118. We get the total number of documents from 
		// countedTokensArray.length, which is on the global scope. We need a new loop here 
		// because the sortedIdfArray is modified in a function that resides outside the 
		// prior loop. The final term is set outside, and indeed above, the prior loop. This
		// operation represents the end of the data manipulation. 
		for (i = 0; i < sortedIdfPrepArray.length; i++) {
			sortedIdfPrepArray[i].inverseDocumentFrequency = 
				Math.log(sortedTokensArray.length/sortedIdfPrepArray[i].documentFrequency);
			sortedIdfPrepArray[i].tfIdf = sortedIdfPrepArray[i].inverseDocumentFrequency * 
				sortedIdfPrepArray[i].termFrequency;
		}
		setDataToOutput(idfPrepArray);
	};

	let dataToOutput = [];
	let setDataToOutput = function(data){
		dataToOutput = data;
	};

	let getData = () => {
		console.log("dataToOutput at get", dataToOutput);
		return dataToOutput;
	};


	return {getJSON, parseJSON, countTokens, getData};
};