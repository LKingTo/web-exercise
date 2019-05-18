const qiniu = require('qiniu');
const accessKey = "s1VEpG4cgWr-8N-onFRXnJVyxm_8V5HFPzP84Te9";
const secretKey = "ATk0-WPt9Ew64jFI6w_cVHTN5yr8NBQTWwRb38KY";
const bucket = "ktyok_img";
const domain = "http://prla72uxr.bkt.clouddn.com/";

module.exports = {
	accessKey: accessKey,
	secretKey: secretKey,
	bucket: bucket,
	domain: domain,
	uploadUrl: location.protocol === 'http:' ? 'http://upload-z2.qiniu.com' : 'https://upload-z2.qbox.me',
	createToken() {
		const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		let options = {
			scope: bucket,
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		return uploadToken;
	}
}