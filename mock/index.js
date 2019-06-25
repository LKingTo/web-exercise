const Mock = require('mockjs');
const utils = require('./utils');	//自定义工具模块
const bodyParser = require('body-parser');

module.exports = (app) => {
	// 监听http请求
	app.use('/api/questions', (req, res) => {
		//每次响应请求时读取mock data的json文件
		let json = utils.getJsonFile('./questions.json');
		//将json传入 Mock.mock 方法中，生成的数据返回给浏览器
		res.json(Mock.mock(json));
	});

	// 设置post参数接收
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({
		limit: '50mb',  // 解决请求体太大问题：PayloadTooLargeError: request entity too large
		extended: true
	}));
	app.use('/api/updateQuestionsFile', (req, res) => {
		let data = req.body;
		let json = JSON.stringify(data);
		utils.setJsonFile('./questions.json', json);
		res.json({msg: 'Update file: questions.json sucess!'});
	})

}