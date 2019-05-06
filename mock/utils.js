const fs = require('fs');	//引入文件系统模块
const path = require('path');	//引入path模块

module.exports = {
	getJsonFile: (filePath) => {
		let json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
		return JSON.parse(json);
	}
}