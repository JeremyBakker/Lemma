"use strict";

module.exports = function firebaseCredentials() {
    	let credentials = {
            apiKey: "AIzaSyBGFufjIczMcskQZZPwV9Hg55hJ8KvK8j8",
            authDomain: "lemmaredux.firebaseapp.com",
            databaseURL: "https://lemmaredux.firebaseio.com/"
        };

    	let getfirebaseCredentials = () => {
    		return credentials;
    	};
   	return {firebaseCredentials, getfirebaseCredentials};
};