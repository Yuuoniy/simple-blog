<template>
  <div class="header">
    <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/article">首页</el-menu-item>
      <el-menu-item index="/admin/articleList">管理</el-menu-item>
      <el-menu-item v-show='this.admin.name!==loginUser' index="/admin/articleEdit">写文章</el-menu-item>
      <el-input type="text" placeholder="搜索一下" class='search' v-model="text" ></el-input>
         <el-button plain @click="search">搜索</el-button>
        <el-button plain @click="logout">注销 {{loginUser}}</el-button>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'sidebar',
  data() {
    return {
      userName: '',
      text:'',
      loginUser: '',
    }
  },
  mounted: function() {
    this.loginUser = localStorage.name
    this.$http.get('/api/articleList').then(
      response => this.articleNumber = response.body.length,
      response => console.log(response)
    )
    this.userName = sessionStorage.userName;
  },
  methods: {
    logout: function() {
      this.$store.commit('updateUserInfo', { name: null });
      this.$message({
        message: '注销成功',
        type: 'success'
      })
      this.delCookie('session');
      this.$router.push('/signin');
    },
     search() {
      this.$router.push({ name: 'SearchResult', params: { text: this.text }, hash: '#search' })
      this.text=''
    }
  }
}
</script>
<style>
.search {
  margin-top: 0.68rem;
  margin-right: 0.625rem;
  margin-left: 150px;
  width: 200px !important;
}
.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header{
  width: 800px;
}
.search .icon-search {
  cursor: pointer;
  font-size: 1.875rem;
  color: #ffffff;
  position: absolute;
  right: 0.5rem;
  top: 0.2rem;
}
</style>
