var cheerio = require('cheerio');
var request = require('request');

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