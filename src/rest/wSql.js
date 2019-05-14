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
			params._index = total + 1;
			return new Promise((resolve, reject) => {
				WebSql.insertDataToTable(db, TABLE_QUESTIONS, params).then((res) => {
					resolve({success: true});
				}, (err) => {
					reject(err);
				})
			})
		});
	}
}

export default wSql;