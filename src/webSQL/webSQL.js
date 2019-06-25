import Vue from 'vue'

/**
 * WebSQL 客户端数据库相关操作
 */
const WebSql = {

	/**
	 * 创建表
	 * @param db
	 * @param tableName
	 * @param keysSql
	 * @return {Promise<any>}
	 */
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

	/**
	 * 插入数据（一条）
	 * @param db
	 * @param tableName
	 * @param data
	 * @return {Promise<any>}
	 */
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

	/**
	 * 更新表数据
	 * @param db
	 * @param tableName
	 * @param data
	 * @return {Promise<any>}
	 */
	updateDataToTable(db, tableName, data) {
		let query = data.query.toUpperCase();
		let keys = [], values = [];
		delete data.query;
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				(key !== 'id') && keys.push(key.toUpperCase());
				values.push(data[key]);
			}
		}
		let keysSql = keys.map((item) => {return item + ' = ?'}).join(',');
		let updateDataSQL = 'UPDATE ' + tableName + ' SET ' + keysSql + ' WHERE ' + query + ' = ?';
		return new Promise((resolve, reject) => {
			db.transaction((ctx) => {
				ctx.executeSql(updateDataSQL, values, (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	/**
	 * 获取表所有记录行
	 * @param db
	 * @param tableName
	 * @return {Promise<any>}
	 */
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

	/**
	 * 获取表指定行的数据
	 * @param db
	 * @param tableName
	 * @param data
	 * @return {Promise<any>}
	 */
	getDataFromTable(db, tableName, data) {
		let key = data.key.toUpperCase();
		let value = data.value;
		let selectSQL = 'SELECT * FROM ' + tableName + ' WHERE ' + key + ' = ?';
		return new Promise((resolve, reject) => {
			db.transaction(function (ctx) {
				ctx.executeSql(selectSQL, [value], (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	/**
	 * 清空表数据
	 * @param db
	 * @param tableName
	 * @return {Promise<any>}
	 */
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

	/**
	 * 删除表的指定行
	 * @param db
	 * @param tableName
	 * @param data
	 * @return {Promise<any>}
	 */
	deleteDataFromTable(db, tableName, data) {
		let key = data.key.toUpperCase();
		let value = data.value;
		let deleteTableSQL = 'DELETE FROM ' + tableName + ' WHERE ' + key + ' = ?';
		return new Promise((resolve, reject) => {
			db.transaction((ctx, result) => {
				ctx.executeSql(deleteTableSQL, [value], (ctx, result) => {
					resolve(result);
				}, (tx, error) => {
					reject({error: error.message});
				});
			});
		});
	},

	/**
	 * 删除表
	 * @param db
	 * @param tableName
	 * @return {Promise<any>}
	 */
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

	/**
	 * 初始化webSQL
	 */
	init() {
		if (window.openDatabase) {
			var db = window.openDatabase('webSql', '1.0', 'web-exercise', 10 * 1024 * 1024);
			if (!db) {
				console.log('创建webSQL数据库失败');
			} else {
				Vue.prototype.$myDb = db;  // 绑定到vue实例
				// 创建表
				let tableName = 'questions';
				let keysSql = 'id unique,_index int,question text,answer text';
				// WebSql.deleteAllDataFromTable(db, tableName);
				WebSql.createTable(db, tableName, keysSql).then((res) => {});
			}
		}
	},
};

export default WebSql;