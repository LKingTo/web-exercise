// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from 'axios'
/** 设置Axios拦截器 start **/
//请求拦截器
axios.interceptors.request.use((config) => {
	// console.log('Interceptors request:', config);
	return config;
}, (error) => {
	return Promise.reject(error);
});

//响应拦截器
axios.interceptors.response.use((response) => {
	// console.log('Interceptors response:', response);
	//只返回响应数据data
	return response.data;
}, (error) => {
	return Promise.reject(error);
});
/** 设置Axios拦截器 end **/
Vue.prototype.$axios = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
})
