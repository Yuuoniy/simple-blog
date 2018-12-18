import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VuePaginate from 'vue-paginate'
import App from './App.vue'
import router from './router'
import adminAccount from '../config/adminAccount.js'


Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)
Vue.use(VuePaginate)
// Vue.use(VeeValidate)

// 按需引用element
import { Button, Message, MessageBox, Notification, Popover, Tag, Input, Form, FormItem, Pagination, Menu, Submenu, MenuItem, MenuItemGroup, } from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
const components = [Button, Message, MessageBox, Notification, Popover, Tag, Input, Form, FormItem, Pagination,Menu, Submenu, MenuItem, MenuItemGroup ]

components.forEach((item) => {
  Vue.component(item.name, item)
})

const MsgBox = MessageBox
Vue.prototype.$msgbox = MsgBox
Vue.prototype.$alert = MsgBox.alert
Vue.prototype.$confirm = MsgBox.confirm
Vue.prototype.$prompt = MsgBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification

const store = new Vuex.Store({
  state: {
    // domain:'http://test.example.com', //保存后台请求的地址，修改时方便
    userInfo: { //保存用户信息
      name: null
    }
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo;
    }
  }
})


Vue.prototype.setCookie = (c_name, value, expiredays) => {
  var exdate = new Date();　　　　
  exdate.setDate(exdate.getDate() + expiredays);　　　　
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//获取cookie、
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;
Vue.prototype.admin = adminAccount
//删除cookie
Vue.prototype.delCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

new Vue({
  data: {},
  el: '#app',
  router: router,
  render: h => h(App),
  store,
  watch: {
    "$route": 'checkLogin'
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      if (!this.getCookie('session')&&this.$route.path!=='/signup') {
        this.$router.push('/signin');
      }else if(this.getCookie('session')&&(this.$route.path==='/signup'||this.$route.path==='/signin')){
        this.$router.push('/article');
      }
    }
  }
})
