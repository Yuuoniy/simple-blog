const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/blog')

const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  telephone:String,
  password: String

})

const articleSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: String,
  content: String,
  gist: String,
  labels: Array,
  visible:Boolean
})

const commentSchema = new mongoose.Schema({
  name: String,
  content: String,
  articleId: String,
  date: String,
  visible:Boolean
})

const Models = {
  User: mongoose.model('User', userSchema),
  Article: mongoose.model('Article', articleSchema),
  Comment:mongoose.model('Comment',commentSchema)
}

module.exports = Models
