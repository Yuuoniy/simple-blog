<template>
  <div id="content">
    <div v-show='articleList.length!==0'>
      <paginate name='articles' :list='articleList' :per='3' class="paginate-list">
        <div class="article-wrap" v-for="item in paginated('articles')" :key='item._id'>
          <div class="article-title" @click="articleDetail( item._id )">{{ item.title }}</div>
          <div class="article-info">
            <span>作者：{{item.author}}</span>
            <span>发表于：{{ item.date }}</span>
            <span>标签：
        <span v-if="item.labels.length === 0">未分类</span>
            <el-tag v-else class="tag" type="primary" v-for="tag in item.labels" :key='tag'>{{ tag }}</el-tag>
            </span>
          </div>
          <div v-if='item.visible==true'>
            <div class="article_gist">{{ item.gist }}</div>
            <div @click="articleDetail( item._id )" class="article-button article-all">阅读全文 ></div>
          </div>
          <div v-else class="hidden">该内容已被管理员隐藏</div>
          <div class="article-underline"></div>
        </div>
      </paginate>
    </div>
    <div class="empty" v-show='articleList.length===0'>没有相关内容</div>
    <div v-show='articleList.length!==0' class="el-pagination">
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
      paginate: ['articles']
    }
  },
  mounted: function() {
    console.log('searchresults')
    console.log(this.$route.params.text)
    articleList: []
    this.$http.get('/api/search/' + this.$route.params.text).then(
      res => this.articleList = res.body.reverse(),
      response => console.log(response)
    )
  },
  watch: {
    "$route": "fetchDate"
  },
  methods: {
    articleDetail: function(id) {
      this.$router.push('/articleDetail/' + id)
    },
    fetchDate: function() {
      console.log('searchresults')
      this.$http.get('/api/search/' + this.$route.params.text).then(
        res => this.articleList = res.body.reverse(),
        res => console.log(response)
      )
    }
  }
}
</script>
<style>
.empty {
  padding-top: 20px;
  margin-bottom: 20px;
}
</style>
