"use strict";

module.exports = function DataFactory ($q, $http, firebaseCredentials, DataStorageFactory) {

	let natural = require('../../lib/node_modules/natural/'),
		stopWord = require('../../lib/node_modules/stopword/lib/stopword.js');

	let tokenizer = new natural.WordTokenizer();


	//=========================================// 
	//=========Import the control data=========//
	//=========================================//
	
	let getPsalmsJSON = () => {
	    return $q((resolve, reject)=>{
	        $http.get("../../psalms.json").
	        	then((returnObject)=> parseJSON(returnObject)).
				then((sortedTokensArray) => countTokens(sortedTokensArray));
	    });
	};

	let getTestJSON = () => {
		return $q((resolve, reject) => {
			$http.get("../../test.json").
				then((returnObject)=> parseJSON(returnObject)).
				then((sortedTokensArray) => countTokens(sortedTokensArray));
			
		});
	};

	//=========================================// 
	//==========Parse the control data=========//
	//=========================================//

	// Parse the dataObject passed from the async call into a two-dimensional array 
	// of alphabetized tokens, grouped by original document source. This will allow us 
	// to iterate over the tokens to determine term frequency and inverse document frequency.
	// We initialize two empty arrays on the global scope: one to hold the sorted keys and 
	// one to hold the sorted tokens, both from the Firebase dataObject. This will allow us 
	// access the data in later operations. We will pass the keyArray into the countTokens 
	// function in order to append the name of the attendant document to each term. We access 
	// the sorted tokens array 1.) within the countTokens function in order to count the 
	// tokens and 2.) within the inverseDocumentFrequency function to determine the total 
	// number of documents in the control set. We use the originalTokensArray below to calculate 
	// the term frequency.
	let originalTokensArray = [];
	let keyArray;
	let sortedTokensArray;
	let parseJSON = (dataObject) => {
		keyArray = [];
		sortedTokensArray = [];
		return $q((resolve, reject) => {
			// Loop through the dataObject, grab the keys, and push them into the keyArray.
			for (var i = 0; i < (Object.keys(dataObject.data.Psalms).length); i++) {
				keyArray.push(Object.keys(dataObject.data.Psalms[i]));
			}
			// Loop through the data in the dataObject, grab each string, lowercase it, 
			// tokenize it, remove all stopwords from the data, and push the strings into 
			// an array.
			for (i = 0; i < (dataObject.data.Psalms).length; i++) {
				// Initialize a variable to hold each value of the dataObject as a single string
				let oneString;
				oneString = dataObject.data.Psalms[i][keyArray[i]];
				// Lowercase each string, then tokenize it, pushing each token into an array.
				let tokensArray = tokenizer.tokenize(oneString.toLowerCase());
				originalTokensArray.push(tokensArray);
				// Remove all stop words from the array of tokens.
				tokensArray = stopWord.removeStopwords(tokensArray).sort();
				// Push the sorted tokensArray into an array.
				sortedTokensArray.push(tokensArray);
			}
			resolve(sortedTokensArray);
		});
	};

	//=========================================// 
	//=======Count the term frequency==========//
	//=========================================//

	let countTokens = (sortedTokensArray) => {
		// Set the initial count value for each term.
		let count = 1;
		// Initialize a parent array to hold children arrays that contain each token object
		// organized by document. The parent array will pass directly to the termFrequency 
		// function in order to calculate the normalized term frequency.
		let countedTokensArray = [];
		// Loop through the 2D array of sorted tokens, count each token, and create an object 
		// for it, appending the relevant statistical data.
		for (var i = 0; i < sortedTokensArray.length; i++){
			countedTokensArray[i] = [];
			for (var j = 0; j < sortedTokensArray[i].length; j++) {
				if (sortedTokensArray[i][j] !== sortedTokensArray[i][j+1] || sortedTokensArray[i].length === 1) {
				let currentTokenObject = {};
				currentTokenObject.document = keyArray[i][0];
				currentTokenObject.word = sortedTokensArray[i][j];
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
	
	//====================================================// 
	//=======Calculate the normalized term frequency======//
	//====================================================//
	
	let termFrequency = (countedTokensArray) => {
	// Loop through the 2D array of counted tokens and divide the number of appearances of each
	// term by the length of each document. This gives the normalized term frequency, which 
	// we then append to the object within the countedTokensArray. Pass the countedTokensArray 
	// to the inverseDocumentFrequency function. 
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++) {
				let termFrequency = countedTokensArray[i][j].count/originalTokensArray[i].length;
				countedTokensArray[i][j].termFrequency = termFrequency;
			}
		}
		inverseDocumentFrequency(countedTokensArray);
	};

	//=====================================================// 
	//=======Calculate the inverse document frequency======//
	//=====================================================//
	
	let inverseDocumentFrequency = (countedTokensArray) => {
		// Initialize an array to hold the combined list of words.
		let idfPrepArray = [];
		// Loop through the arrays in the counted tokens array and push each word into one 
		// array.
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++){
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
		// determines how far to reach back in the array and must change as the recursive 
		// function cycles; the other must remain stable to serve as the document frequency 
		// appended to each term.
		let setNumberOfDocs = (count, docCount) => {
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
		// Here we set the inverse document frequency, which is the log10 of the total number 
		// of documents divided by the document frequency. We get the total number of documents from 
		// sortedTokensArray.length, which is on the global scope. We need a new loop here 
		// because the sortedIdfArray is modified in a function that resides outside the 
		// prior loop. The final array is set outside, and indeed above, the prior loop. This
		// operation represents the end of the data manipulation for this factory. 
		for (i = 0; i < sortedIdfPrepArray.length; i++) {
			sortedIdfPrepArray[i].inverseDocumentFrequency = 
				1 + Math.log10(sortedTokensArray.length/sortedIdfPrepArray[i].documentFrequency);
			sortedIdfPrepArray[i].tfIdf = sortedIdfPrepArray[i].inverseDocumentFrequency * 
				sortedIdfPrepArray[i].termFrequency;
		}
		setDataToOutput(idfPrepArray);
	};

	//=======================================================================// 
	//=========Set final data for passing to other segments of the code======//
	//=======================================================================//

	let dataToOutput = [];
	let firebaseObjectKey;
	// Set the data in the global array dataToOutput because we will need to pass it to 
	// the controller, then send it to Firebase. Log the key that Firebase gives the data 
	// so we can access it later.
	let setDataToOutput = (data) => {
		dataToOutput = data;
		setControlData(dataToOutput).then(
			(ObjectFromFirebase) => {
				firebaseObjectKey = ObjectFromFirebase.data.name;
			});
	};
	// Get the hidden values from /values/firebaseCredentials.js that will allow us to 
	// access Firebase.
	let firebaseValues = firebaseCredentials.getfirebaseCredentials();
	// Send the data to Firebase.
	let setControlData = (dataToPost) => {
		return $q((resolve, reject) => {
			$http.post(`${firebaseValues.databaseURL}/.json`,
				angular.toJson(dataToPost))
					.then(
						(ObjectFromFirebase) => {
							console.log("Here is my Firebase Object from setControlData: ", ObjectFromFirebase);
							DataStorageFactory.setFirebaseData(ObjectFromFirebase);
							resolve(ObjectFromFirebase);
						})
					.catch((error) => error);
		});
	};

	// Create a function to make dataToOutput available to controllers.
	let getData = () => {
		return dataToOutput;
	};

	return {getPsalmsJSON, getTestJSON, parseJSON, countTokens, getData};
};