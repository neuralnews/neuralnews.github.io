var request       = require('request');
var app           = require('express')();
var http          = require('http').Server(app);
var https         = require('https');
var path          = require('path');
var express       = require('express');
var bodyParser    = require('body-parser');
var validator     = require('validator');
var fetch         = require('node-fetch');
var AYLIENTextAPI = require('aylien_textapi');
var textapi       = new AYLIENTextAPI({
        application_id: "a5ad45d9",
        application_key: "2c891b3f58381a7842d500c5fb534b8e"
});
var PythonShell   = require('python-shell');
var utf8          = require('utf8');
var Q             = require('q');

/* Setting app properties */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express').static(__dirname + '/public'));

/* Serve index page */
app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
});

/* Serve test data */
app.get('/sanders.json', function(req, res) {
        res.sendFile(__dirname + '/test_data/sanders.json');
})

/* Trying out things from scratch... */
app.get('/query', function(req, res) {

        /* Microsoft Azure Cognitive Services */
        var subscription_key = 'bfc96e2d7cee4696b2e3bd85c2f4816c';
        var host             = 'api.cognitive.microsoft.com';
        var path             = '/bing/v7.0/news/search';
        var term             = req.query.search;
        var startDate        = Date.now();
        var request_params   = {
                method : 'GET',
                hostname : host,
                path : path + '?q=' + term,
                headers : {
                    'Ocp-Apim-Subscription-Key' : subscription_key,
                }
        };

        // Handles response
        var response_handler = function (response) {
            var body = "";
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                articles = JSON.parse(body).value;
                new_process_articles(articles, startDate).then(function(data) {
                        res.send(JSON.stringify(data));
                });
            });
            response.on('error', function (e) {
                console.log('Error: ' + e.message);
            });
        };

        var bing_news_search = function (search) {
          console.log('Searching news for: ' + search);
          var request_params = {
                method : 'GET',
                hostname : host,
                path : path + '?q=' + encodeURIComponent(search),
                headers : {
                    'Ocp-Apim-Subscription-Key' : subscription_key,
                }
            };

            var req = https.request(request_params, response_handler);
            req.end();
        }

        bing_news_search(term);
});

// Given object of articles, returns a JSON string with all the data
// needed by the app
function new_process_articles(articles, startDate)
{
        var deferred = Q.defer();
        var result = [];
        for (var i = 0; i < articles.length; i++) {
                // 1a. Get news source
                var news_source   = articles[i].provider[0].name;

                // 1b. Extract text from article
                textapi.extract({
                        url: articles[i].url,
                        best_image: true
                }, function(error, response) {
                        if (error) {
                                console.log("LOG: ERROR: " + JSON.stringify(error));
                        } else {
                                console.log("* * Extracted text successfully");
                                console.log("Time to extract article text: " + ((Date.now() - startDate) / 1000).toString() + " seconds\n");
                                
                                // 2a. Sanitize text (remove quotes, etc.)
                                var article_text  = response.article;
                                //console.log(article_text);
                                var article_title = response.title;

                                // The path to your python script
                                var myPythonScript = "./scripts/nlp_v2.py";

                                // Provide the path of the python executable, if python is available as environment variable then you can use only "python"
                                var pythonExecutable = "python";

                                // Function to convert an Uint8Array to a string
                                var uint8arrayToString = function(data){
                                    return String.fromCharCode.apply(null, data);
                                };

                                // Spawn child process
                                const spawn           = require("child_process").spawn;
                                const scriptExecution = spawn(pythonExecutable, [myPythonScript, article_text.replace(/[^\w.]+/g, " ")]);
                                scriptExecution.stdout.setEncoding('utf8');

                                // Handle normal output
                                scriptExecution.stdout.on('data', (data) => {
                                        console.log("*** ==> Python script executed successfully!");
                                        var __data = JSON.parse(data);
                                        // 2b. Extract entities
                                        textapi.entities({
                                                "text" : article_text
                                        }, function(error, __response) {
                                                if (error) {
                                                        console.log("ERROR: Extracting entities");
                                                } else {
                                                        console.log("* * * * Entities extracted successfully");
                                                        console.log("Time to extract entities: " + ((Date.now() - startDate) / 1000).toString() + " seconds\n");

                                                        // 5. Do something with all of this data...
                                                        result.push({
                                                                "article" : process_nlp_data(__data, __response.entities, startDate, article_title, news_source)
                                                        });
                                                        if (result.length == 3) {
                                                                deferred.resolve(result);
                                                        }
                                                }
                                        });

                                });

                                // Handle error output
                                scriptExecution.stderr.on('data', (data) => {
                                    console.log("ERROR: " + uint8arrayToString(data));
                                });
                        }
                });
        }
        return deferred.promise;
}

function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}

/*
 * process_nlp_data
 * 
 */
function process_nlp_data(sentences, entities, startDate, article_title, news_source)
{
        var ents   = getEntities(entities);
        var result = {
                data : [
                        {
                                "ent" : ents[0],
                                "count" : 0,
                                "polarity" : 0
                        },
                        {
                                "ent" : ents[1],
                                "count" : 0,
                                "polarity" : 0
                        },
                        {
                                "ent" : ents[2],
                                "count" : 0,
                                "polarity" : 0
                        }
                ],
                title  : article_title,
                source : news_source        
        };

        for (var i = 0; i < ents.length; i++) {
                for (var j = 0; j < sentences.length; j++) {
                        if (sentences[j].text.indexOf(ents[i]) != -1) {
                                result.data[i].count++;
                                result.data[i].polarity = (result.data[i].polarity + parseFloat(sentences[j].polarity)) / result.data[i].count;
                        }
                }
        }
        console.log("* * * * * Text processed => printing results...")
        console.log(result);
        console.log("Time to iterate over sentences looking for entities: " + ((Date.now() - startDate) / 1000).toString() + " seconds\n");

        return result;

}

/*
 * sanitizeText
 * Given a string, sanitizes and returns a version of the string without
 * dialogue quotes, etc.
 */
function sanitizeText(response)
{
        return response.article;
}

/*
 * santitizeSentences
 */
function sanitizeSentences(sentences)
{
        for (sentence in sentences) {
                sentences[sentence] = sentence.replace(/\/r/g, '');
        }
        return sentences;
}

/*
 * getEntities
 * Returns the top three
 */
function getEntities(response)
{
        var ents = [];
        if (response.organization)
                if (response.organization[0])
                        ents.push(response.organization[0])
        if (response.location)
                if (response.location[0])
                        ents.push(response.location[0]);
        if (response.person)
                if (response.person[0])
                        ents.push(response.person[0]);
        return ents;
}

http.listen(process.env.PORT || 3000, function() {
        console.log('listening on port:3000');
});