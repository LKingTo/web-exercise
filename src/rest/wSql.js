import WebSql from '../webSQL/webSQL'
import axios from "axios/index";

/**
 *  对webSQL数据库处理后响应数据封装的API
 */
const TABLE_QUESTIONS = 'questions';
const wSql = {
	getQuestionsList(db) {
		return new Promise((resolve, reject) => {
			WebSql.getAllDataFromTable(db, TABLE_QUESTIONS).then((res) => {
				let rows = res && res.rows;
				let data = [];
				for (let i = 0; i < rows.length; i++) {
					data.push(rows[i]);
				}
				if (!data.length) {
					// webSQL有效期失效则读取本地json数据
					axios.get('/api/questions').then((result) => {
						data = result && result.data;
						// 更新至webSQL数据库
						data.forEach((item) => {
							wSql.addQuestion(db, item);
						});
						resolve({data: data, total: data.length});
					})
				} else
					resolve({data: data, total: data.length});
			}, (err) => {
				reject(err);
			})
		})
	},

	addQuestion(db, params) {
		return WebSql.getAllDataFromTable(db, TABLE_QUESTIONS).then((allRes) => {
			let total = allRes && allRes.rows && allRes.rows.length;
			if (!params._index)
				params._index = total + 1;
			return new Promise((resolve, reject) => {
				WebSql.insertDataToTable(db, TABLE_QUESTIONS, params).then((res) => {
					wSql.updateJsonFile(db);
					resolve({success: true, data: res});
				}, (err) => {
					reject(err);
				})
			})
		});
	},

	deleteQuestion(db, id) {
		let data = {key: 'id', value: id};
		return new Promise((resolve, reject) => {
			WebSql.deleteDataFromTable(db, TABLE_QUESTIONS, data).then((res) => {
				wSql.updateJsonFile(db);
				resolve({success: true});
			}, (err) => {
				reject(err);
			})
		})
	},

	getQuestion(db, id) {
		let data = {key: 'id', value: id};
		return new Promise((resolve, reject) => {
			WebSql.getDataFromTable(db, TABLE_QUESTIONS, data).then((res) => {
				resolve(res.rows[0]);
			}, (err) => {
				reject(err);
			})
		})
	},

	editQuestion(db, params) {
		let data = Object.assign(params);
		data.query = 'id';
		return new Promise((resolve, reject) => {
			WebSql.updateDataToTable(db, TABLE_QUESTIONS, data).then((res) => {
				wSql.updateJsonFile(db);
				resolve({success: true});
			}, (err) => {
				reject(err);
			})
		})
	},

	// 更新本地questions.file文件
	updateJsonFile(db) {
		wSql.getQuestionsList(db).then((res) => {
			axios.post('/api/updateQuestionsFile', res).then((ret) => {
				console.log(ret);
			})
		})
	}
}

export default wSql;