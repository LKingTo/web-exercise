const fs = require('fs');

let json = {"data":[{"id":"2h9t9m1dpc4bk7sv","index":0,"question":"2+2","answer":"<p>4</p>"},{"id":"0l0d03lsut99g16f","index":1,"question":"2=0","answer":"<p>false</p>"},{"id":"uu94ptb0crpbuapn","index":2,"question":"1321","answer":"<p>213</p>"},{"id":"s7h4xheo0vq6ukie","index":3,"question":"3121","answer":"<p>12321</p>"},{"id":"zfbllihrdrrjx2yz","index":0,"question":"21321","answer":"<p>132311</p>"},{"id":"lftc672nv7qxoikv","index":0,"question":"232","answer":"<p>3232</p>"},{"id":"5vc7dofdqu9tyq2s","index":0,"question":"232","answer":"<p>3232</p>"},{"id":"18tpr8h96b107a5c","index":0,"question":"31213","answer":"<p>32131</p>"},{"id":"x5d67g2kcwoxtdua","index":0,"question":"3123","answer":"<p>3213</p>"},{"id":"j4cpjrtsou1u7udg","index":0,"question":"4343","answer":"<p>4343</p>"}],"total":10};

fs.writeFile('./mock/questions.json', JSON.stringify(json), (err) => {
	console.log('sucess');
});