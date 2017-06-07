"use strict";

module.exports = function firebaseCredentials() {
    	let credentials = {
            apiKey: "AIzaSyDjtARRuvTkO_lu05RiXI3LI2MlHSziflc",
            authDomain: "lemma-6aeab.firebaseapp.com",
            databaseURL: "https://lemma-6aeab.firebaseio.com/"
        };

    	let getfirebaseCredentials = () => {
    		return credentials;
    	};
   	return {firebaseCredentials, getfirebaseCredentials};
};