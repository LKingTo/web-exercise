import WebSql from '../webSQL/webSQL'

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
				resolve({data: data, total: rows.length});
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
					resolve({success: true});
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
				resolve({success: true});
			}, (err) => {
				reject(err);
			})
		})
	}
}

export default wSql;