<template>
  <div>
    <div id='comment'>
      <div v-show='this.admin.name!==loginUser' class='new-comment'>
        <div class="comment-instr">发表评论:</div>
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="畅所欲言..." v-model="content" ref='inputRef'>
        </el-input>
        <el-button class='submit' type="primary" @click="submit">发表</el-button>
      </div>
    </div>
    <div class='comments-container'>
      <div class='summary'>
        <div class="comment-num">当前评论数： {{comments.length}}</div>
      </div>
      <div class='comments-item' v-for='(comment,index) in comments'>
        <p class='comment-head'>{{index + 1}} 楼 <span class="comment-name">{{comment.name}}   </span><span>· {{comment.date}}</span></p>
        <p v-if='comment.visible' class='text'>{{comment.content}}</p>
        <p v-else-if='loginUser === comment.name'>{{comment.content}}<span class="hiddenHint">(内容被隐藏)</span> </p>

        <p v-else class='text'>该内容已被管理员隐藏</p>
        <div v-if='admin.name!==loginUser'>
          <el-button v-show='loginUser === comment.name' @click='deleteComment(comment._id)'>删除</el-button>
          <el-button v-if='loginUser === comment.name' @click='editComment(comment._id,index)'>编辑</el-button>
          <el-button v-else @click='reply(comment.name)'>回复</el-button>
        </div>
        <div v-else>
          <el-button v-if='comment.visible' @click='hideComment(comment._id)'>隐藏</el-button>
          <el-button v-else @click='displayComment(comment._id)'>显示</el-button>
        </div>
      </div>
    </div>
    <div v-show='comments.length === 0' class='nocomment'>快来抢沙发吧~</div>
  </div>
  </div>
</template>
<script>
import { focus } from 'vue-focus';
export default {
  data() {
    return {
      name: '',
      content: '',
      articleId: '',
      date: '',
      comments: [],
      loginUser: '',
      admin: this.admin,
      focused: false,
      editingId: ''
    }
  },
  directives: { focus: focus },
  mounted: function() {
    this.loginUser = localStorage.name
    this.$http.get('/api/comment/' + this.$route.params.id).then(res => this.comments = res.body, res => console.log(res))
  },
  methods: {
    submit() {
      //更新评论
      console.log(this.editingId)
      if (this.editingId) {
        let that = this
        let obj = {
          _id: this.editingId,
          content: this.content,
        }
        this.$http.post('/api/updateComment', {
          commentInfo: obj
        }).then(
          response => {
            that.$message({
              message: '更新评论成功',
              type: 'success'
            })
            // 更新完成后跳转至该文章的详情页
            this.fetchData()
            this.editingId = ''
            console.log('id=' + localStorage.id)
          },
          response => console.log(response)
        )
      } else {
        let that = this
        this.getDate()
        let obj = {
          name: localStorage.name,
          content: this.content,
          articleId: this.$route.params.id,
          date: this.date,
          visible: true
        }
        this.$http.post('/api/comment', { commentInfo: obj }).then(res => {
          that.$message({ message: '发表评论成功', type: 'success' })
          that.content = ''
          that.fetchData()
        })
      }
    },
    reply(name) {
      this.content = '@' + name + ': '
      this.$refs.textBox.focus()
      this.$refs.inputRef.$el.children[0].focus();
    },
    fetchData() {
      this.$http.get('/api/comment/' + this.$route.params.id).then(res => this.comments = res.body, res => console.log(res))
    },
    getDate: function() {
      let mydate, y, m, d, hh, mm, ss;
      mydate = new Date()
      y = mydate.getFullYear()
      m = mydate.getMonth() + 1
      d = mydate.getDate()
      hh = mydate.getHours()
      mm = mydate.getMinutes()
      ss = mydate.getSeconds()
      if (m < 10) m = '0' + m
      if (d < 10) d = '0' + d
      if (hh < 10) hh = '0' + hh
      if (mm < 10) mm = '0' + mm
      if (ss < 10) ss = '0' + ss
      this.date = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    },
    deleteComment: function(id) {
      let self = this
      this.$confirm('是否确定删除该评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http.post('/api/deleteComment', {
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
    editComment: function(id, index) {
      // console.log('id='+id)
      console.log(this.$router.path)
      this.content = this.comments[index].content
      this.$refs.inputRef.$el.children[0].focus();
      this.editingId = id
      // console.log('')
    },
    hideComment: function(id) {
      this.$http.post('/api/admin/hideComment', { _id: id }).then(res => {
        this.$message({
          type: 'success',
          message: '隐藏成功'
        })
        this.fetchData()
      }, res => {
        console.log(res)
      })
    },
    displayComment: function(id) {
      this.$http.post('/api/admin/displayComment', { _id: id }).then(res => {
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
.comments-container {
  border: 0;
  box-shadow: none;
  text-align: left;
}

.new-comment {
  text-align: left;
  padding: 30px;
}

.comment-instr {
  padding-bottom: 10px;
}

.comment-head {}

.comment-name {
  color: #66bfe7;
}

.comments-item {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  margin:
}

.submit {
  position: relative;
  top: 10px;
}

.nocomment {
  text-align: center;
  margin-bottom: 20px;
}

.summary {
  margin: 10px;
}

.comment-num {
  padding-left: 20px;
}
.hiddenHint{
  margin-left: 10px;
  color: #9e9e9e;
}
</style>
