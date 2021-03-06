const utils = {

	/**
	 * 生成uuid随机数
	 * @param len   uuid字符串长度
	 * @param onlyNumber    是否只包括数字
	 * @returns {string}
	 */
	uuid(len, onlyNumber) {
		var CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
		var NUMBER_CHARS = '0123456789'.split('');
		var chars = onlyNumber ? NUMBER_CHARS : CHARS, uuid = [];
		var radix = chars.length;
		var i;
		if (len) {
			// Compact form
			for (i = 0; i < len; i++)
				uuid[i] = chars[0 | Math.random() * radix];
		}
		else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	},

	isNumber(value) {
		return typeof value === "number";
	},

	isString(value) {
		return typeof value === "string";
	},
}

export default utils;