var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/mongocheeriomongodb://heroku_5vvcz754:\
	4nbamickqdgsgoheglg32kmf8v@ds033076.mlab.com:33076/heroku_5vvcz754');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));


var Comment = require('./models/comment');
var Article = require('./models/article');


app.get('/', function(req, res) {
	res.sendFile('public/index.html')
});

app.post('/addComment', function(req, res) {
	var comment = req.body;
	console.log(comment)
	var newComment = new Comment(req.body);
	
	newComment.save(function(err, doc) {
		if (err) {
			throw err;
		} else {
		Article.findOneAndUpdate({ _id: req.body._forArticle},
		{$push: {comments:doc._id}},
		{new: true}, function(err, doc) {
			if (err) {
				res.send(err);
			} else {
				res.send(doc)
			}
		})	
		}
		
	})

});

app.post('/removeComment/:commentId', function(req, res) {
	Comment.remove({_id: req.params.commentId}, function(err, removed) {
		console.log(removed);
	});

});

app.get('/articles', function(req, res) {

	Article.find({}).populate('comments')
	.exec(function(err, doc) {
		if (err){
			console.log(err);
		} 
		else {
			res.json(doc);
		}
	});
});
app.get('/comments', function(req, res) {

	Comment.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});
app.post('/scrape', function(req, res) {
	request('https://www.reddit.com/r/webdev', function(err, response, html) {
		if (err) {
			throw err
		}
		var $ = cheerio.load(html);
		$('p.title').each(function (index, element) {
			var result = {};
			var title = $(element).text();
			var link = $(element).find('a').first().attr('href');
			if (link.indexOf('http:') === -1 && link.indexOf('https:') === -1) {
				link = 'https://www.reddit.com' + link;
			};
			Article.find({link: link}, function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} 
				// or send the doc to the browser as a json object
				else {
					if (doc.length === 0) {
						result.title = title;
						result.link = link;

						var entry = new Article(result);

						entry.save(function(err, doc) {
							// log any errors
							if (err) {
								console.log(err);
							} else {
								console.log(doc);
							};
						});
					} else {
						console.log('Article is already in DB')
					}
				}
			});
		});
	});
	res.send("Scrape Complete");
});

app.listen(3000, function() {
	console.log('listening on 3000')
});
