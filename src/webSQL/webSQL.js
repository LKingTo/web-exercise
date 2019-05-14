import Vue from 'vue'

const WebSql = {

	createTable(db, tableName, keysSql) {
		let createTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName +
			' (' + keysSql + ')';
		return new Promise((resolve, reject) => {
			db.transaction((ctx, result) => {
				ctx.executeSql(createTableSQL, [], (ctx, result) => {
					console.log("表创建成功：" + tableName); //建表成功
					resolve(result);
				}, (tx, error) => {
					console.log('创建表失败：' + tableName + error.message);//建表失败
					reject({error: error.message});
				});
			});
		});
	},

	insertDataToTable(db, tableName, data) {
		let keys = [], values = [], valuesSQL = '';
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				keys.push(key.toUpperCase());
				values.push(data[key]);
			}
		}
		let keysSQL = keys.join(',');
		values.forEach((item, i) => {valuesSQL += (i === 0) ? '?' : ',?'});
		let insertTableSQL = 'INSERT INTO ' + tableName + ' (' + keysSQL + ') VALUES (' + valuesSQL + ')';
		return new Promise((resolve, reject) => {
			db.transaction((ctx) => {
				ctx.executeSql(insertTableSQL, values, (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	getAllDataFromTable(db, tableName) {
		let selectSQL = 'SELECT * FROM ' + tableName;
		return new Promise((resolve, reject) => {
			db.transaction(function (ctx) {
				ctx.executeSql(selectSQL, [], (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	getDataFromTable(db, tableName, name) {
		let selectSQL = 'SELECT * FROM ' + tableName + ' WHERE NAME = ?';
		return new Promise((resolve, reject) => {
			db.transaction(function (ctx) {
				ctx.executeSql(selectSQL, [name], (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	deleteAllDataFromTable(db, tableName) {
		let deleteTableSQL = 'DELETE FROM ' + tableName;
		return new Promise((resolve, reject) => {
			db.transaction((ctx, result) => {
				ctx.executeSql(deleteTableSQL, [], (ctx, result) => {
					console.log("清空表成功：" + tableName + name);
					resolve(result);
				}, (tx, error) => {
					console.log('清空表失败：' + tableName + error.message);
					reject({error: error.message});
				});
			});
		});
	},

	deleteDataFromTable(db, tableName, name) {
		let deleteTableSQL = 'DELETE FROM ' + tableName + ' WHERE NAME = ?';
		return new Promise((resolve, reject) => {
			db.transaction((ctx, result) => {
				ctx.executeSql(deleteTableSQL, [name], (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	dropTable(db, tableName) {
		let dropTableSQL = 'DROP TABLE ' + tableName;
		return new Promise((resolve, reject) => {
			db.transaction((ctx, result) => {
				ctx.executeSql(dropTableSQL, [], (ctx, result) => {
					console.log("删除表成功：" + tableName);
					resolve(result);
				}, (ctx, error) => {
					console.log('删除表失败：' + tableName + error.message);
					reject({error: error.message});
				})
			});
		});
	},

	init() {
		if (window.openDatabase) {
			var db = window.openDatabase('webSql', '1.0', 'web-exercise', 10 * 1024 * 1024);
			if (!db) {
				console.log('创建webSQL数据库失败');
			} else {
				Vue.prototype.$myDb = db;
				// 创建表
				let tableName = 'questions';
				let keysSql = 'id unique,_index int,question text,answer text';
				WebSql.createTable(db, tableName, keysSql).then((res) => {});
				// WebSql.dropTable(db, tableName)
			}
		}
	},
};

export default WebSql;