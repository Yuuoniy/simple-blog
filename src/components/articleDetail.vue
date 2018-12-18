<template>
  <div id="content">
    <div class="article-wrap detail-wrap">
      <div class="article-title article-detail-title">{{ article.title }}</div>
      <div class="article-info">
        <span class="article-info-date">发表于：{{ article.date }}</span>
        <span class="article-info-label">标签：
        <span v-if="article.labels.length == 0">未分类</span>
        <el-tag v-else class="tag-margin" type="primary" v-for="tag in article.labels" :key='tag'>{{ tag }}</el-tag>
        </span>
      </div>

      <div v-if='article.visible' class="article-detail-content" v-html="compiledMarkdown()"></div>
      <div v-else    class="article-detail-content">该内容已被管理员隐藏</div>
    </div>
    <article-comment class="comment animated fadeIn"></article-comment>
  </div>
</template>
<script>
import marked from 'marked'
import highlight from 'highlight.js'
import '../assets/atom-one-light.css'
import articleComment from './articleComment.vue'
marked.setOptions({
  highlight: function(code) {
    return highlight.highlightAuto(code).value
  }
})
export default {
  name: 'articleDetail',
  data() {
    return {
      article: {}
    }
  },
  mounted: function() {
    let id = this.$route.params.id
    this.$http.get('/api/articleDetail/' + id).then(
      response => this.article = response.body,
      response => console.log(response)
    )
  },
  methods: {
    compiledMarkdown: function() {
      return marked(this.article.content || '', { sanitize: true })
    }
  },
  components: {
    articleComment
  }
}
</script>
<style >
.detail-wrap{
  padding-bottom: 0px;
}
.article-detail-title {
  cursor: default;
  margin: 40px 0 0;
}

.article-detail-content {
  text-align: left;
  padding: 60px 0;
  font-size: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}

</style>
