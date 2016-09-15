var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment: {
		type:String
	},
	_forArticle: {
		type:String,
		ref:'Article'
	}
});


var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
