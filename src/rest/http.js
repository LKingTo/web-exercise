import axios from "axios/index";
import {stringify} from 'qs' // 引入qs模块，用来序列化post类型的数据

// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = 'http://'
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = 'https://'
// }
axios.defaults.timeout = 10000; // 请求超时设置
axios.defaults.withCredentials = false; // 表示跨域请求时是否需要使用凭证,默认否

/** 设置Axios拦截器 **/
//请求拦截器
axios.interceptors.request.use((config) => {
	// console.log('Interceptors request:', config);
	config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	/**
	 * 可设置：cookies、token等
	 */
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

/**
 * 封装$http请求方法
 * @param options
 * @return {Promise<AxiosResponse<any>>}
 */
var request = (options) => {
	// 表单传值参数格式化
	return axios.request({
		url: `http://localhost:3000${options.url}`,
		method: options.method,
		data: options.body,
		params: options.params
	}).then(response => {
		return response
	}, err => {
		throw err
	}).catch((error) => {
		throw error
	})
};
// http请求方式
export const http = {};
const methods = ['get', 'post', 'put', 'delete'];
methods.forEach(method => {
	http[method] = (url, params = {}) => {
		if (method === 'get') {
			return request({url, params, method})
		}
		return request({url, body: stringify(params), method})
	}
});

export default function plugin(Vue) {
	if (plugin.installed) {
		return
	}
	plugin.installed = true;
	Object.defineProperties(Vue.prototype, {
		$http: {
			get() {
				const obj = {
					get: http['get'],
					post: http['post'],
					put: http['put'],
					delete: http['delete']
				};
				return obj
			}
		}
	})
}

