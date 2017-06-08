# Lem(m)a

Lemma is a scalable, single-page JavaScript application for natural-language processing built in the Angular framework. It measures cosine similarity between the tf-idf vectors of a query and a control set of data. Because it incorporates Browserify, it can use all the algorithms of the "Natural" node module. 


## Table of Contents

- [Background](#background)
- [Prerequisites](#prerequisites)
- [Installation](#install-lemma)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [A Note on Firebase](#a-note-on-firebase)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Background

Lem(m)a is my first step in testing a theory I have about the use of digital tools to quantify qualitative human phenomena. After reading Bren&#233; Brown's [_Daring Greatly_](https://www.amazon.com/Daring-Greatly-Courage-Vulnerable-Transforms/dp/1592408419/ref=sr_1_1?s=books&ie=UTF8&qid=1484430978&sr=1-1&keywords=daring+greatly), I decided to test the limits of my ability to evaluate abstract ideas. Early in that book, Brown writes, "I was riveted by a statement from one of my research professors, 'If you can't measure it, it doesn't exist'"(8). I wanted to know how far I could take that idea, so I began with a topic for which I have expertise: religious struggle. Thus Lem(m)a. It is the ancient Greek word for "theory" or "proposition," the koine Greek transliteration of the biblical Hebrew word for "why," and the technical term for the dictionary entry of a word. I have a theory about the use of ancient Israelite psalms of lament to quantify religious struggle. Lem(m)a parses the data for me and presents it in an intelligible form with the help of [D3](https://d3js.org/).


## Prerequisites

Install [npm](https://www.npmjs.com/)

Install [Browserify](http://browserify.org/)

Install [Grunt](https://gruntjs.com/getting-started)

## Install Lem(m)a
```
$ git clone https://github.com/JeremyBakker/Lemma.git
$ cd Lemma/lib
$ npm install
```

## Getting Started

Open two terminal windows.

In one terminal:
```
$ cd Lemma/lib
$ grunt
```

In a second terminal:
```
$ cd Lemma
```
Then host your server, open your favorite internet browser and go to your [Local Host - port: 8080](http://localhost:8080/).

## Usage

The opening page allows you to choose between working with "Sample Data" or "Data from Psalms."

![image](https://user-images.githubusercontent.com/24864800/26938222-333e8d88-4c39-11e7-93e3-a0f78ab5b853.png)

The sample data is a simple sentence: "The sun in the sky is bright and hot today."
The data from psalms are the thirty individual psalms of lament as categorized by [Hermann Gunkel](https://en.wikipedia.org/wiki/Hermann_Gunkel). See [here](http://biblical-studies.ca/pdfs/Gunkel_Classification_of_the_Psalms.pdf) for more detail.

The "Control Data" page displays the individual words, the documents in which they appear, the [normalized term frequency (adjusted for document length)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf#Term_frequency_2), the [inverse document frequency](https://en.wikipedia.org/wiki/Tf%E2%80%93idf#Inverse_document_frequency_2), and the [tf-idf](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) values. Please note that all [stop words](https://en.wikipedia.org/wiki/Stop_words) have been removed.

![image](https://user-images.githubusercontent.com/24864800/26938280-62aa2942-4c39-11e7-8fc5-5d77c412df10.png)

The "Query Data" page asks for a query to analyze against the sample data. It will calculate the cosine similarity between the control data and the query. As with the control data, the program removes all stop words from the query.

![image](https://user-images.githubusercontent.com/24864800/26938360-9eedae24-4c39-11e7-8575-bd5460ac05b6.png)

The "Chart Page" will display all the words as a scatter plot with the term frequencies as the x-axis and the inverse document frequency as the y-axis. Each point responds to a mouse hover and displays the relevant data in a tooltip on the left side of the screen.

![image](https://user-images.githubusercontent.com/24864800/26938871-250c80f6-4c3b-11e7-8dbc-210277610d3c.png)

## A Note on Firebase

I left my database authentication credentials publicly accessible for ease of access. I don't want developers to have to setup a new Firebase project in order to experiment with this application. The only data stored in Firebase is refreshed with each calculation, so the database can be wiped clean without any negative consequences. Nonetheless, should anyone wish to fork the project and hide his or her Firebase credentials, the code is designed to make that possible. Simply replace my code in the app/values/firebaseCredentials.js file and add the file to your .gitignore before pushing to your repository. You will need to set your database rules as follows: 

```
{
  "rules": {
    ".read": true,
    ".write": true,
    "$firebaseID":{
    ".indexOn":["document", "word"]
  	}
  }
}
```

## Maintainer

[Jeremy Bakker](https://github.com/JeremyBakker)

## Contribute

Please contribute! [Open an issue](https://github.com/JeremyBakker/Lemma/issues/new) or [submit PRs](https://github.com/JeremyBakker/Lemma/pulls). 


## License

[MIT](LICENSE) © Jeremy Bakker
