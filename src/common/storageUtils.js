import utils from './utils';	//自定义工具模块

let localStorage = window.localStorage;
let SUPPORT_LOCAL_STORAGE = !!(localStorage && localStorage.getItem);
if (SUPPORT_LOCAL_STORAGE) {
	try {
		localStorage.setItem('test', '1');
		localStorage.removeItem('test');
	} catch (error) {
		SUPPORT_LOCAL_STORAGE = false;
	}
}
var NOT_SUPPORT_LS_MSG = "Not support localStorage !!!";

const storageUtils = {

	/**
	 * 判断是否支持local storage
	 * @returns {boolean|*}
	 */
	isSupportLocalStorage: function () {
		return SUPPORT_LOCAL_STORAGE;
	},

	/**
	 * 保存数据到 local storage
	 * @param key
	 * @param value
	 * @param timeoutSeconds    超时, 单位秒, 不指定时则默认永不超时
	 * @returns {boolean}
	 */
	setStorage: function (key, value, timeoutSeconds) {
		if (!SUPPORT_LOCAL_STORAGE) {
			// if (config.debug)
			// 	throw new Error(NOT_SUPPORT_LS_MSG);
			console.error(NOT_SUPPORT_LS_MSG);
			return false;
		}
		if (!key)
			return false;
		if (value == null)
			value = null;      //避免undefined 错误
		var obj = {v: value};
		if (timeoutSeconds && utils.isNumber(timeoutSeconds))
			obj.e = (new Date().getTime()) + timeoutSeconds * 1000;
		var saved = JSON.stringify(obj);
		localStorage.setItem(key, saved);
		return true;
	},

	/**
	 * 从local storage中读取数据
	 */
	getStorage: function (key) {
		if (!SUPPORT_LOCAL_STORAGE) {
			// if (config.debug)
			// 	throw new Error(NOT_SUPPORT_LS_MSG);
			console.error(NOT_SUPPORT_LS_MSG);
			return null;
		}
		if (!key)
			return null;
		var str = localStorage.getItem(key);
		if (!utils.isString(str))
			return str;
		var data = null;
		try {
			data = JSON.parse(str);
		} catch (e) {
			console.warn("storage['" + key + "'] is not a json formatted value!");
			return str;
		}
		if (!data)
			return data;
		var value, expires;
		// 兼容旧版的value、expires属性
		if (("value" in data) && ("expires" in data)) {
			value = data.value;
			expires = data.expires;
		} else if ("v" in data) {
			value = data.v;
			expires = data.e;
		} else {
			return data;
		}
		var nowTime = new Date().getTime();
		if (utils.isNumber(expires) && expires > 0 && expires < nowTime) {
			storageUtils.removeStorage(key);
			return null;
		}
		return value;
	},

	removeStorage: function (key) {
		if (!SUPPORT_LOCAL_STORAGE) {
			// if (config.debug)
			// 	throw new Error(NOT_SUPPORT_LS_MSG);
			console.error(NOT_SUPPORT_LS_MSG);
			return false;
		}
		localStorage.removeItem(key);
		return true;
	},
};

export default storageUtils;
