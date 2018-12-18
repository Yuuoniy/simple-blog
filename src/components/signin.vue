<template>
  <div id="sign-wrap">
    <h1>登录</h1>
    <el-input v-model="name" placeholder="请输入用户名"></el-input>
    <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
    <el-button @click="signup">去注册</el-button>
    <el-button type="primary" @click="signin">登录</el-button>
  </div>
</template>
<script>
export default {
  name: 'signin',
  data() {
    return {
      name: '',
      password: '',
    }
  },
  mounted: function() {
    if (this.getCookie('session')) {
        this.$router.push('/article');
      }
  },
  methods: {
    signup: function() {
      this.$router.push('/signup')
    },
    signin: function() {
      let that = this;
      if (this.name === this.admin.name && this.password === this.admin.password) {
        let expireDays = 1000 * 60 * 60 * 24 * 15;
        this.setCookie('session', 'isadmin', expireDays);
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$emit('userSignIn', this.name);
        this.$store.commit('updateUserInfo', { name: this.name });
        localStorage.name = this.name
        delete this.password;
        this.$router.push('/article')
        return 
      }
      this.$http.get('/api/admin/getUser/' + this.name).then(
        response => {
          if (that.password !== response.body.password) {
            that.$message.error('用户名或密码不正确')
          } else {
            let obj = {
              name: that.name,
              password: that.password
            }
            that.$http.post('/api/admin/signin', {
              userInfo: obj
            }).then(
              response => {
                let expireDays = 1000 * 60 * 60 * 24 * 15;
                this.setCookie('session', response.data.session, expireDays);
                that.$message({
                  message: '登录成功',
                  type: 'success'
                })
                that.$emit('userSignIn', that.name);
                this.$store.commit('updateUserInfo', { name: obj.name });
                localStorage.name = obj.name
                console.log(localStorage.name)
                delete that.password;
                this.$router.push('/article')
              },
              response => console.log('登录失败' + response)
            )
          }
        },
        response => {
          that.$message.error('该用户不存在')
          return
        }
      )
    }
  }
}
</script>
<style scoped>
#sign-wrap {
  width: 300px;
  margin: 200px auto;
}

#sign-wrap h1 {
  color: #383a42;
  padding: 10px;
}

#sign-wrap div {
  padding-bottom: 20px;
}
</style>
