

var articles  = getArticles();
var json_data = '';

for (var i = 0; i < articles.length; i++) {

        // Asynchronous process to perform NLP analysis
        // on each article and return the results as JSON string
        json_data += processArticle(articles[i]);
}

return json_data;