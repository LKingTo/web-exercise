<template lang="pug">
	.w-container
		.w-editor(:id="editorId")
</template>

<script>
	/**
	 * wangEditor文档
	 * https://www.kancloud.cn/wangfupeng/wangeditor3/335769
	 */
	import WEditor from 'wangeditor'
	import utils from '../common/utils'

	window.mOxie = window.moxie = require('../../static/js/plupload/moxie')
	require('../../static/js/plupload/plupload.dev')
	const Qiniu = require('../../static/js/qiniu/qiniu')
	const qiniuConfig = require('../../static/js/qiniu/config')

	export default {
		editor: null,

		name: "w-editor",
		data() {
			return {
				editorId: "editor_" + utils.uuid(16),
				editorContent: ''
			}
		},
		mounted() {
			this.initEditor();
		},

		methods: {
			initEditor() {
				let editor = new WEditor('#' + this.editorId);
				editor.customConfig = {
					menus: [
						'head',  // 标题
						'bold',  // 粗体
						'fontSize',  // 字号
						'fontName',  // 字体
						'underline',  // 下划线
						'foreColor',  // 文字颜色
						'backColor',  // 背景颜色
						'link',  // 插入链接
						'list',  // 列表
						'justify',  // 对齐方式
						'image',  // 插入图片
						'table',  // 表格
					],
					zIndex: 100,
					// debug: location.href.indexOf('wangeditor_debug_mode=1') > 0,
					onchange: (html) => {
						console.log(html);
						this.editorContent = html;
						this.$emit('content-change', html);
					},
					onchangeTimeout: 500,  // 单位 ms，默认200ms
					uploadImgShowBase64: true, // 使用 base64 保存图片
					showLinkImg: false,	// 隐藏“网络图片”tab
					qiniu: true, // 上传图片到七牛云存储
				};
				// 关闭粘贴样式的过滤
				editor.customConfig.pasteFilterStyle = false;
				editor.create();
				this.editor = editor;
				this.initUpload();
			},

			initUpload() {
				// 初始化七牛云上传
				window.qiniu = new Qiniu();
				let editor = this.editor;
				const domain = qiniuConfig.domain;
				const uploadToken = qiniuConfig.uploadToken;
				// 获取相关 DOM 节点的 ID
				let btnId = editor.imgMenuId;
				let containerId = editor.toolbarElemId;
				let textElemId = editor.textElemId;

				const printLog = (title, info) => {
					window.console && console.log(title, info);
				};

				/***
				 *  报错："TypeError: Cannot read property 'browser' of undefined"		-- 20190517
				 */
				// 创建上传对象
				let uploader = qiniu.uploader({
						runtimes: 'html5,flash,html4',    	//上传模式,依次退化
						browse_button: btnId,       				//上传选择的点选按钮，**必需**
						// uptoken_url: uploadToken, 					//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
						uptoken: uploadToken,						//若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
						// unique_names: true,							// 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
						// save_key: true,									// 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
						domain: domain, 										//bucket 域名，下载资源时用到，**必需**
						container: containerId,           	//上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '100mb',           	//最大文件体积限制
						flash_swf_url: '../qiniu/plupload/Moxie.swf',  //引入flash,相对路径
						filters: {
							mime_types: [
								//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
								{
									title: "图片文件",
									extensions: "jpg,gif,png,bmp"
								}
							]
						},
						max_retries: 3,                   //上传失败最大重试次数
						dragdrop: true,                   //开启可拖曳上传
						drop_element: textElemId,        	//拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
						chunk_size: '4mb',                //分块上传时，每片的体积
						auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							'FilesAdded': function (up, files) {
								plupload.each(files, function (file) {
									// 文件添加进队列后,处理相关的事情
									printLog('on FilesAdded');
								});
							},
							'BeforeUpload': function (up, file) {
								// 每个文件上传前,处理相关的事情
								printLog('on BeforeUpload');
							},
							'UploadProgress': function (up, file) {
								// 显示进度
								printLog('进度 ' + file.percent)
							},
							'FileUploaded': function (up, file, info) {
								// 每个文件上传成功后,处理相关的事情
								// 其中 info 是文件上传成功后，服务端返回的json，形式如
								// {
								//    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
								//    "key": "gogopher.jpg"
								//  }
								printLog(info);
								// 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

								let domain = up.getOption('domain');
								let res = $.parseJSON(info);
								let sourceLink = domain + res.key; //获取上传成功后的文件的Url

								printLog(sourceLink);

								// 插入图片到editor
								editor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
							},
							'Error': function (up, err, errTip) {
								//上传出错时,处理相关的事情
								printLog('on Error');
							},
							'UploadComplete': function () {
								//队列文件处理完毕后,处理相关的事情
								printLog('on UploadComplete');
							}
							// Key 函数如果有需要自行配置，无特殊需要请注释
							//,
							// 'Key': function(up, file) {
							//     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
							//     // 该配置必须要在 unique_names: false , save_key: false 时才生效
							//     let key = "";
							//     // do something with key here
							//     return key
							// }
						}
						// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
						// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
					});
			},

			getContent() {
				return this.editor.txt.html();
			},

			setContent(html) {
				this.editor.txt.html(html);
				this.editorContent = html;
			},

			reset() {
				// this.editor.txt.html('');
				this.editor.txt.clear();
				this.editorContent = '';
			}
		}
	}
</script>

<style lang="stylus">
	.w-container
		.w-editor
			.w-e-toolbar
				flex-wrap wrap !important
			.w-e-text-container
				min-height 500px
</style>