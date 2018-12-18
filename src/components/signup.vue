<template>
  <div id="sign-wrap">
    <h1 class="signup-title">注册</h1>
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="userForm.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password" placeholder="请设置密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="userForm.telephone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="signup">注册</el-button>
        <el-button @click="signin">去登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'signup',
  data() {
    return {
      userForm: {
        name: '',
        telephone: '',
        email: '',
        password: '',
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        telephone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }, { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入合法的电话号码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, {
          pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: '请输入合法的邮箱',
          trigger: 'blur'
        }],
        password: [{ required: true, message: '请设置密码', trigger: 'blur' }, { min: 6, max: 12, message: '长度在 6 到 18 个字符', trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    
  },
  methods: {
    signup: function() {
      let that = this;
      let obj = {
        name: that.userForm.name,
        password: that.userForm.password,
        email: that.userForm.email,
        telephone: that.userForm.telephone
      }
      this.$http.get('/api/admin/checkUser', { params: { obj } }).then(
        response => {
          if (response.body) {
            if (response.body.name === that.userForm.name)
              that.$message.error('该用户已存在')
            else if (response.body.email === that.userForm.email)
              that.$message.error('邮箱已绑定其他账户')
            else if (response.body.telephone === that.userForm.telephone)
              that.$message.error('电话号码已绑定账户')
          } else {
            that.$http.post('/api/admin/signup', {
              userInfo: obj
            }).then(
              response => {
                that.$message({
                  message: '注册成功',
                  type: 'success'
                })
                this.signin()

              },
              response => console.log('注册失败' + response)
            )
          }
        },
        response => console.log(response)
      )
    },
    
    signin: function() {
      this.$router.push('/login')

    }
  }
}
</script>
<style>
#sign-wrap {
  width: 300px;
  margin: 200px auto;
}

#sign-wrap h1 {
  color: #383a42;
  padding: 10px;
}



.signup-title{
  position: relative;
  left: 40px;
}
/*#sign-wrap div {
  padding-bottom: 20px;
}*/
</style>
