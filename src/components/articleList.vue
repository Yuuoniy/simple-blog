<template>
  <div id="content">
    <!-- <div>{{this.admin.name}}</div> -->
    <paginate name='articles' :list='articleList' :per='3' class="paginate-list">
      <div class="article-wrap" v-for="item in paginated('articles')" :key='item._id'>
             <div class="article-title" @click="articleDetail( item._id )">{{ item.title }}</div>
        <div class="article-info">
          <span class="article-info-date">发表于：{{ item.date }}</span>
          <span class="article-info-label">标签：
        <span v-if="item.labels.length === 0">未分类</span>
          <el-tag v-else class="tag-margin" type="primary" v-for="tag in item.labels" :key='tag'>{{ tag }}</el-tag>
          </span>
        </div>
        <div class="article_gist">{{ item.gist }}</div>
        <!-- <div>{{admin.name}}</div> -->
        <div v-if='admin.name===loginUser'>
          <div @click="hideArticle(item._id)" v-if='item.visible' class="article-button edit">隐藏</div>
          <div @click="displayArticle(item._id)" v-else class="article-button edit">显示</div>
        </div>
        <div v-else>
          <div @click="articleEdit(item._id)" class="article-button edit">修改</div>
          <div @click="deleteArticle(item._id)" class="article-button delete">删除</div>
        </div>
        <div class="article_underline"></div>
      </div>
    </paginate>
    <div class="el-pagination">
      <paginate-links for="articles" :limit="2" :show-step-links="true"></paginate-links>
    </div>
  </div>
</template>
<script>
export default {
  name: 'article',
  data() {
    return {
      articleList: [],
      paginate: ['articles'],
      loginUser: '',
      admin: this.admin
    }
  },
  mounted: function() {
    // this.$http.get('/api/articleList').then(
    //   response => this.articleList = response.body.reverse().filter(item => item.author === localStorage.name),
    //   response => console.log(response)
    console.log('this.admin=' + this.admin.name)
    this.loginUser = localStorage.name
    if (this.loginUser == this.admin.name)
      this.$http.get('/api/articleList').then(res => this.articleList = res.body.reverse()), res => console.log(res)
    else {
      this.$http.get('/api/articleList').then(
        response => this.articleList = response.body.reverse().filter(item => item.author === localStorage.name),
        response => console.log(response)
      )
    }
  },
  methods: {
    // 跳转至文章编辑页
    articleEdit: function(id) {
      this.$router.push('/admin/articleEdit/' + id)
    },
     articleDetail: function(id) {
      this.$router.push('/articleDetail/' + id)
    },
    // 删除文章
    deleteArticle: function(id) {
      let self = this
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http.post('/api/admin/deleteArticle', {
          _id: id
        }).then(
          response => {
            self.$message({
              type: 'success',
              message: '删除成功!'
            });
            self.fetchData()
          },
          response => {
            console.log(response)
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 更新数据
    fetchData: function() {
      if (localStorage.name == this.admin.name)
        this.$http.get('/api/articleList').then(res => this.articleList = res.body.reverse()), res => console.log(res)
      else {
        this.$http.get('/api/articleList').then(
          response => this.articleList = response.body.reverse().filter(item => item.author === localStorage.name),
          response => console.log(response)
        )
      }
    },
    hideArticle: function(id) {
      this.$http.post('/api/admin/hideArticle', { _id: id }).then(res => {
        this.$message({
          type: 'success',
          message: '隐藏成功'
        })
        this.fetchData()
      }, res => {
        console.log(res)
      })
    },
    displayArticle: function(id) {
      this.$http.post('/api/admin/displayArticle', { _id: id }).then(res => {
        this.$message({
          type: 'success',
          message: '显示成功'
        })
        this.fetchData()
      }, res => {
        console.log(res)
      })
    }
  }
}
</script>
<style>
.edit:hover {
  background: limegreen;
  color: white;
  font-weight: 600;
}

.delete:hover {
  background: red;
  color: white;
  font-weight: 600;
}
</style>
