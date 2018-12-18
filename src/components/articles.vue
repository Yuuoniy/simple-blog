<template>
  <div id="content">
    <!-- <div>{{this.admin.name}}</div> -->
    <paginate name='articles' :list='articleList' :per='3' class="paginate-list">
      <div class="article-wrap" v-for="item in paginated('articles')" :key='item._id'>
        <div class="article-title"  v-if='item.visible' @click="articleDetail( item._id )">{{ item.title }}</div>
        <div class="article-title"  v-else>{{ item.title }}</div>
        <div class="article-info">
          <span>作者：{{item.author}}</span>
          <span>发表于：{{ item.date }}</span>
          <span>标签：
        <span v-if="item.labels.length === 0">未分类</span>
          <el-tag v-else class="tag-margin" type="primary" v-for="tag in item.labels" :key='tag'>{{ tag }}</el-tag>
          </span>
        </div>
        <div v-if='item.visible'>
          <div class="article_gist">{{ item.gist }}</div>
          <div @click="articleDetail( item._id )" class="article-button article-all">阅读全文 ></div>
        </div>
        <div v-else class="hidden">该内容已被管理员隐藏</div>
        <div class="article-underline"></div>
      </div>
    </paginate>
    <div class="el-pagination">
      <paginate-links for="articles" :limit="2" :show-step-links="true"></paginate-links>
    </div>
  </div>
</template>
<script>
export default {
  name: 'articles',
  data() {
    return {
      articleList: [],
      paginate: ['articles']
    }
  },
  mounted: function() {
    this.$http.get('/api/articleList').then(
      response => this.articleList = response.body.reverse(),
      response => console.log(response)
    )
  },
  methods: {
    articleDetail: function(id) {
      this.$router.push('/articleDetail/' + id)
    }
  }
}
</script>
<style>
.article-wrap {
  padding: 40px;
}

.article-title {
  display: inline-block;
  color: #222;
  font-size: 34px;
  font-weight: 600;
  border-bottom: 1px solid white;
  cursor: pointer;
}

.article_title:hover {
  border-bottom: 1px solid #222;
}

.article-info {
  color: #999;
  font-size: 14px;
  padding-top: 8px;
}

.tag-margin {
  margin: 3px;
}

.article_gist {
  text-align: left;
  padding-top: 40px;
  padding-bottom: 40px;
  font-size: 16px;
}

.article-button {
  display: inline-block;
  padding: 3px 12px;
  border: 2px solid #222;
  color: #222;
  font-size: 14px;
  cursor: pointer;
}

.article-all:hover {
  color: white;
  background: #000;
  font-weight: 600;
}

.article-underline {
  height: 1px;
  width: 40px;
  background: #545455;
  margin: 80px auto 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  border-radius: 2px;
}


/*分页样式*/

.el-pagination {
  margin-bottom: 20px;
}

.number {
  font-size: 12px;
  line-height: 22px;
  height: 22px;
  min-width: 22px;
}

.left-arrow {
  margin-right: 8px;
}

.right-arrow {
  margin-left: 8px;
}

.active {
  border-color: #20a0ff;
  background-color: #20a0ff;
  color: #fff;
  cursor: default;
}

.disabled {
  color: #e4e4e4;
  background-color: #fff;
  cursor: not-allowed;
}

.hidden{
  margin-top: 50px;
}
</style>
