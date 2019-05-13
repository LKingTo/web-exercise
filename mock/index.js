const Mock = require('mockjs');
const utils = require('./utils');	//自定义工具模块

module.exports = (app) => {
	//监听http请求
	app.use('/api/questions', (req, res) => {
		//每次响应请求时读取mock data的json文件
		//util.getJsonFile方法定义了如何读取json文件并解析成数据对象
		let json = utils.getJsonFile('./questions.json');
		//将json传入 Mock.mock 方法中，生成的数据返回给浏览器
		res.json(Mock.mock(json));
	})

}