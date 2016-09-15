var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  link: {
    type:String,
    required:true
  },
  // this only saves one note's ObjectId. ref refers to the Note model.
  comments: [{
      type: Schema.ObjectId,
      ref: 'Comment'
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the model
module.exports = Article;