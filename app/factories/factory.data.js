"use strict";

module.exports = function DataFactory ($q, $http) {

	let natural = require('../../lib/node_modules/natural/'),
		stopWord = require('../../lib/node_modules/stopword/lib/stopword.js');

	let tokenizer = new natural.WordTokenizer();

	let getJSON = () => {
	    return $q((resolve, reject)=>{
	        $http.get("../../psalms.json")
	        .then((returnObject)=>{
	        resolve(returnObject);
	    	});
	    });
	};

	let parseJSON = (string) => {
		return new Promise((resolve, reject) => { 
			// console.log("string at parse", string);
			let keyArray = [];
			for (var i = 0; i < (Object.keys(string.data.Psalms).length); i++) {
				keyArray.push(Object.keys(string.data.Psalms[i]));
			}
			// console.log("keyArray", keyArray);
			let sortedTokensArray = [];
			for (i = 0; i < (string.data.Psalms).length; i++) {
				let oneString = [];
				oneString = string.data.Psalms[i][keyArray[i]];
				let tokenizedString = tokenizer.tokenize(oneString.toLowerCase());
				tokenizedString = stopWord.removeStopwords(tokenizedString);
				let sortedTokens = tokenizedString.sort();
				sortedTokensArray.push(sortedTokens);
			}
		console.log("sortedTokensArray", sortedTokensArray);
		resolve(sortedTokensArray);
		});
	};

	let tokenizedStringsArray = [];
	
	let setData = (data) => {
		tokenizedStringsArray = data;
		console.log("tokenizedStringsArray at setData", tokenizedStringsArray);
	};

	let run = () => {
		countTokens(tokenizedStringsArray);
	};
	
	let countedTokensArray = [];

	let countTokens = (tokenizedStringsArray) => {
		console.log("tokenizedStringsArray at countTokens(): ", tokenizedStringsArray);
		let count = 0;
		let currentToken = null;
		var countedTokensArray = [];
		for (var i = 0; i < tokenizedStringsArray.length; i++){
			countedTokensArray[i] = [];
			for (var j = 0; j < tokenizedStringsArray[i].length; j++) {
				if (tokenizedStringsArray[i][j] !== currentToken && count > 0) {
					let currentTokenObject = {};
					// console.log(currentToken, "appears", count, "times");
					currentToken = tokenizedStringsArray[i][j];
					currentTokenObject.word = currentToken;
					currentTokenObject.count = count;
					countedTokensArray[i].push(currentTokenObject);
					count = 1;
				} else {
					count++;
				}
			}
		}
		console.log("countedTokensArray passed from countTokens:", countedTokensArray);
		termFrequency(countedTokensArray);
	};

	let dataToOutput = [];
	let setDataToOutput = function(data){
		console.log("dataToOutput at set", data);
		dataToOutput = data;
	};
// TAKE OBJECTS, CREATE ONE ARRAY, COUNT APPEARANCES OF ITEMS, WHICH GIVES DOCUMENT FREQUENCY
	
	let inverseDocumentFrequency = (countedTokensArray) => {
		let newArray = [];
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++) {
				newArray.push(countedTokensArray[i][j]);
			}
		}
		console.log("newArray", newArray);
		let sortedArray = newArray.sort(function(a, b){
		    if (a.word < b.word) {
			return - 1;
			}
			if (a.word > b.word) {
			return + 1;
			}
			return 0;
		});
		let count = 0;
		let currentToken = null;
		console.log("sorted Array", sortedArray);
		for (i = 0; i < sortedArray.length; i++){
			if (sortedArray[i].word !== currentToken && count > 0) {
				currentToken = sortedArray[i].word;
				sortedArray[i].idf = Math.log10(sortedArray.length/count);
				count = 1;
			} else {
				count++;
			}
		}
		console.log("sortedArray after count", sortedArray);
		let b = [];
		let a = [];
		Array.prototype.unique = function() {
		    for ( i = 0; i < this.length; i++ ) {
		        var current = this[i].word;
		        if (a.indexOf(current) < 0) {
		        	a.push(current);
		        	b.push(this[i]);
		        }
		    }
		    return a;
		}
		sortedArray.unique();
    	console.log("a", a);
    	console.log("b", b);
    	setDataToOutput(b);
	};

	let getData = () => {
		console.log("dataToOutput at get", dataToOutput);
		return dataToOutput;
	};

	let termFrequency = function (countedTokensArray) {
		// console.log("countedTokensArray received at termFrequency():", countedTokensArray);
		for (var i = 0; i < countedTokensArray.length; i++) {
			for (var j = 0; j < countedTokensArray[i].length; j++) {
				let termFrequency = countedTokensArray[i][j].count/countedTokensArray[i].length;
				countedTokensArray[i][j].termFrequency = termFrequency;
				// console.log("termFrequency", termFrequency);
			}
		}
		// console.log("countedTokensArray at the end of termFrequency", countedTokensArray);
		inverseDocumentFrequency(countedTokensArray);
		// setDataToOutput(countedTokensArray);
	};

	return {getJSON, parseJSON, countTokens, setData, run, getData};
};