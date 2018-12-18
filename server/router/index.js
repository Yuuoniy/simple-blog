const express = require('express')
const router = express.Router()
const db = require('../model/db')


// 储存用户名密码
router.post('/api/admin/signup', function(req, res) {
  new db.User(req.body.userInfo).save(function(err) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

// 登录
router.post('/api/admin/signin', function(req, res) {
  res.send()
})

// 根据用户名获取用户
router.get('/api/admin/getUser/:name', function(req, res) {
  db.User.findOne({ name: req.params.name }, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.send(docs)
  })
})

router.get('/api/admin/checkUser', function(req, res) {
  console.log(req.query)
  db.User.findOne({ $or: [{ name: req.query.obj.name }, { email: req.query.obj.email }, { telephone: req.query.obj.telephone }] }, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.send(docs)
  })
})


// 获取所有文章
router.get('/api/articleList', function(req, res) {
  db.Article.find({}, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.json(docs)
  })
})

// 文章详情页
router.get('/api/articleDetail/:id', function(req, res) {
  db.Article.findOne({ _id: req.params.id }, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.send(docs)
  })
})

// 文章保存
router.post('/api/admin/saveArticle', function(req, res) {
  new db.Article(req.body.articleInformation).save(function(err) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

// 文章更新
router.post('/api/admin/updateArticle', function(req, res) {
  let info = req.body.articleInformation
  db.Article.find({ _id: info._id }, function(err, docs) {
    if (err) {
      return
    }
    docs[0].title = info.title
    docs[0].date = info.date
    docs[0].content = info.content
    docs[0].gist = info.gist
    docs[0].labels = info.labels
    db.Article(docs[0]).save(function(err) {
      if (err) {
        res.status(500).send()
        return
      }
      res.send()
    })
  })
})

//文章隐藏
router.post('/api/admin/hideArticle', (req, res) => {
  db.Article.findByIdAndUpdate(req.body._id, { $set: { 'visible': false } }, function(err, docs) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

//文章显示
router.post('/api/admin/displayArticle', (req, res) => {
  db.Article.findByIdAndUpdate(req.body._id, { $set: { 'visible': true } }, function(err, docs) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

//根据id获取评论
router.get('/api/commentDetail/:id', function(req, res) {
  db.Comment.findOne({ _id: req.params.id }, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.send(docs)
  })
})

//评论更新
router.post('/api/updateComment', function(req, res) {
  let info = req.body.commentInfo
  db.Comment.find({ _id: info._id }, function(err, docs) {
    if (err) {
      return
    }
    docs[0].content = info.content
    db.Comment(docs[0]).save(function(err) {
      if (err) {
        res.status(500).send()
        return
      }
      res.send()
    })
  })
})
//评论隐藏
router.post('/api/admin/hideComment', (req, res) => {
  db.Comment.findByIdAndUpdate(req.body._id, { $set: { 'visible': false } }, function(err, docs) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

//评论显示
router.post('/api/admin/displayComment', (req, res) => {
  db.Comment.findByIdAndUpdate(req.body._id, { $set: { 'visible': true } }, function(err, docs) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})
// 文章删除
router.post('/api/admin/deleteArticle', function(req, res) {
  db.Article.remove({ _id: req.body._id }, function(err) {
    if (err) {
      res.status(500).send()
      return
    } else {
      db.Comment.remove({ articleId: req.body._id }, (err, data) => {
        if (err) {
          res.status(500).send()
          return
        }
      })
    }
    res.send()
  })
})

//评论删除
router.post('/api/deleteComment', function(req, res) {
  db.Comment.remove({ _id: req.body._id }, function(err) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})


//发布评论
router.post('/api/comment', function(req, res) {
  new db.Comment(req.body.commentInfo).save(function(err) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

//获取某一篇文章的所有评论
router.get('/api/comment/:id', function(req, res) {
  db.Comment.find({ articleId: req.params.id }, function(err, docs) {
    if (err) {
      console.error(err)
      return
    }
    res.send(docs)
  })
})

router.get('/api/search/:text', function(req, res) {
  const value = req.params.text
  const page = 1
  const skip = 4 * (page - 1)
  const re = new RegExp(value, 'i')
  db.Article.find({ title: re })
    .sort({ date: -1 }).limit(4).skip(skip).exec()
    .then((articles) => {
      res.send(articles)
    })
})

module.exports = router
