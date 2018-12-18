import Vue from 'vue'
import Router from 'vue-router'
import signin from '../components/signin.vue'
import signup from '../components/signup.vue'
import sidebar from '../components/sidebar.vue'
import articles from '../components/articles.vue'
import login from '../components/signin.vue'
import articleDetail from '../components/articleDetail.vue'
import articleList from '../components/articleList.vue'
import articleEdit from '../components/articleEdit.vue'
import SearchResult from '../components/searchResult.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: './',
  routes: [
    { path: '/', components: { default: articles, sidebar: sidebar } },
    { path: '/signin', component: signin },
    { path: '/signup', component: signup },
    { path: '/article', components: { default: articles, sidebar: sidebar } },
    { path: '/articleDetail/:id', components: { default: articleDetail, sidebar: sidebar } },
    { path: '/admin/articleList', components: { default: articleList, sidebar: sidebar } },
    { path: '/admin/articleEdit', components: { default: articleEdit, sidebar: sidebar } },
    { path: '/admin/articleEdit/:id', components: { default: articleEdit, sidebar: sidebar } },
    { path: '/search/:text', name: 'SearchResult', components: { default: SearchResult, sidebar: sidebar } },
    { path: '*',redirect: '/'}
  ]
})
