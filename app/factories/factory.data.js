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

	let parseDocument = (string) => {
		return new Promise((resolve, reject) => { 
			console.log("parseDocument fired here");
			console.log("string at parse", string);
			let keyArray = [];
			for (var i = 0; i < (Object.keys(string.data.Psalms).length); i++) {
				keyArray.push(Object.keys(string.data.Psalms[i]));
			}
			console.log("keyArray", keyArray);
			let sortedTokensArray = [];
			for (var i = 0; i < (string.data.Psalms).length; i++) {
				let oneString = [];
				oneString = string.data.Psalms[i][keyArray[i]];
				let tokenizedString = tokenizer.tokenize(oneString.toLowerCase());
				tokenizedString = stopWord.removeStopwords(tokenizedString);
				let sortedTokens = tokenizedString.sort();
				sortedTokensArray.push(sortedTokens)
			}
		console.log("sortedTokensArray", sortedTokensArray);
		resolve(sortedTokensArray);
		});
	};

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
					console.log(currentToken, "appears", count, "times");
					currentToken = tokenizedStringsArray[i][j];
					currentTokenObject.word = currentToken;
					currentTokenObject.count = count;
					countedTokensArray[i].push(currentTokenObject);
					count = 1;
				} else {
					count++;
				}
			}
			console.log("countedTokensArray", countedTokensArray);
		}
	};

	return {getJSON, parseDocument, countTokens};
};