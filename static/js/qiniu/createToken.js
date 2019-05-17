const qiniu = require('qiniu')
const config = {
	accessKey: "s1VEpG4cgWr-8N-onFRXnJVyxm_8V5HFPzP84Te9",
	secretKey: "ATk0-WPt9Ew64jFI6w_cVHTN5yr8NBQTWwRb38KY",
	bucket: "ktyok_img",
	domain: "http://prla72uxr.bkt.clouddn.com/"
}
const accessKey = config.accessKey;
const secretKey = config.secretKey;
const bucket = config.bucket;

const createToken = () => {
	const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	let options = {
		scope: bucket,
	};
	const putPolicy = new qiniu.rs.PutPolicy(options);
	const uploadToken = putPolicy.uploadToken(mac);
	console.log('uploadToken', uploadToken);
	return uploadToken;
};

createToken();