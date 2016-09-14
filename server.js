var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

request('https://www.reddit.com/r/webdev', function(err, response, html) {
	if (err) {
		throw err;
	}
	var $ = cheerio.load(html);
	var results = [];
	$('p.title').each(function (index, element) {
		var title = $(element).text();
		var link = $(element).find('a').first().attr('href');
		if (link.indexOf('http:') === -1 && link.indexOf('https:') === -1) {
			link = 'https://www.reddit.com' + link;
		};
		results.push({
			title: title,
			link: link
		});
	});
	console.log('all results: ', results);
});
