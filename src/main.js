// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
import axios from 'axios'
Vue.prototype.$axios = axios;
import requestPlugin from './rest/http'
Vue.use(requestPlugin); // 设置Axios拦截器
/** 设置webSQL数据库 start **/
import WebSQL from './webSQL/webSQL'
Vue.use(WebSQL.init);
/** 设置webSQL数据库 end **/
Vue.config.productionTip = false;	// 阻止启动生产消息

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
})
