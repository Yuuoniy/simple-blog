<template>
  <div>
    <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="100px" class="demo-articleForm">
      <div class="edit-wrap">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <div class="tag_wrap">
          <el-form-item label="标签">
            <el-tag class="tag-margin" :key="tag" v-for="tag in articleForm.labels" :closable="true" :close-trasition="true" @close="handleClose(tag)" type="primary">{{ tag }}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-form-item>
        </div>
         <el-form-item label="简介" prop="gist">
        <el-input type="textarea" :rows="4" placeholder="请输入简介" v-model="articleForm.gist">
        </el-input>
      </el-form-item>`
          <el-form-item label="内容 (Markdown)" prop="content">
        <div class="markdown">
          <textarea class="input-markdown" v-model="articleForm.content" @input="update"></textarea>
          <div class="markdown-compiled" v-html="compiledMarkdown()"></div>
        </div>
      </el-form-item>
          <el-button class='submit-button' type="primary" @click="submitForm('articleForm')">发表</el-button>
          <!-- <el-button type="primary" @click="resetForm('articleForm')">清空</el-button> -->
      </div>
    </el-form>
  </div>
</template>
<script>
import _ from 'lodash'
import marked from 'marked'
import hightlight from 'highlight.js'
import '../assets/atom-one-light.css'
marked.setOptions({
  hightlight: function(code) {
    return hightlight.hightlightAuto(code).value
  }
})


export default {
  name: 'articleEdit',
  data() {
    return {
      articleForm: {
        author:'',
        title: '',
        date: '',
        content: '',
        gist: '',
        labels: [],
        visible:true
      },
      inputVisible: false,
      inputValue: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        gist: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function() {
    this.articleForm.author = localStorage.name
    if (this.$route.params.id) {
      this.$http.get('/api/articleDetail/' + this.$route.params.id).then(
        response => {
          this.articleForm = response.body
        },
        response => console.log(response)
      )
    }
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveArticle()
          } else {
            cons
            ole.log('error submit!!');
            return false;
          }
        });
      },
    // 编译Markdown
    compiledMarkdown: function() {
      return marked(this.articleForm.content, { sanitize: true })
    },
    // 延时赋值给content
    update: _.debounce(function(e) {
      this.content = e.target.value
    }, 300),
    // 获取发表时间
    getDate: function() {
      let mydate, y, m, d, hh, mm, ss;
      mydate = new Date()
      y = mydate.getFullYear()
      m = mydate.getMonth()+1
      d = mydate.getDate()
      hh = mydate.getHours()
      mm = mydate.getMinutes()
      ss = mydate.getSeconds()
      if (m < 10) m = '0' + m
      if (d < 10) d = '0' + d
      if (hh < 10) hh = '0' + hh
      if (mm < 10) mm = '0' + mm
      if (ss < 10) ss = '0' + ss
      this.articleForm.date = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    },
    // 保存文章
    saveArticle: function() {
      let that = this
      if (this.$route.params.id) {
        // 更新文章
        let obj = {
          _id:this.$route.params.id,
          title: this.articleForm.title,
          date: this.articleForm.date,
          content: this.articleForm.content,
          gist: this.articleForm.gist,
          labels: this.articleForm.labels
        }
        this.$http.post('/api/admin/updateArticle', {
          articleInformation: obj
        }).then(
          response => {
            that.$message({
              message: '更新文章成功',
              type: 'success'
            })
            that.$router.push('/articleDetail/' + that.$route.params.id)
          },
          response => console.log(response)
        )
      } else {
        // 新建文章
        // 获取时间
        this.getDate()
        let obj = this.articleForm
        this.$http.post('/api/admin/saveArticle', {
          articleInformation: obj
        }).then(
          response => {
            that.$message({
              message: '发表文章成功',
              type: 'success'
            })
            // 保存成功后跳转至文章列表页
            that.refreshArticleList()
          },
          response => console.log(response)
        )
      }
    },
    // 保存成功后跳转至文章列表页
    refreshArticleList: function() {
      this.$router.push('/article')
    },
    goBack: function() {
      this.$router.go(-1)
    },
    // element标签组件
    handleClose: function(tag) {
      this.articleForm.labels.splice(this.articleForm.labels.indexOf(tag), 1)
    },
    showInput: function() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm: function() {
      let inputValue = this.inputValue
      if (inputValue) this.articleForm.labels.push(inputValue)
      this.inputVisible = false
      this.inputValue = ''
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.articleForm.labels = []
    }
  }
}
</script>
<style>
.edit-wrap {
  padding: 40px;
  font-size: 16px;
  width: 800px;
}

.return_button {
  text-align: left;
  margin-bottom: 40px;
}

.tag_wrap {
  text-align: left;
  padding: 20px 0;
}

.tag_wrap .input-new-tag {
  width: 80px;
  height: 28px;
}

.edit-wrap textarea {
  outline: none;
  font-size: 16px;
}

.markdown {
  text-align: left;
  border: 1px solid #bfcbd9;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  width: 100%;
  height: 400px;
  vertical-align: top;
  background: #f5f7f9;
  overflow: hidden;
}

.markdown textarea {
  border: none;
  resize: none;
  /*不可拖动*/
}

.input-markdown {
  float: left;
  display: inline-block;
  width: 49%;
  height: 98%;
  background-color: white;
  padding-left: 1%;
  padding-top: 1%;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.markdown-compiled {
  overflow: auto;
  float: right;
  display: inline-block;
  width: 49%;
  height: 100%;
  padding: 5px 0 5px 1%;
}

.submit-button{
  position: relative;
   left:50px;
}

</style>
