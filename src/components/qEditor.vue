<template lang="pug">
	.q-container
		quill-editor(
		v-model="editorContent",
		ref="myQuillEditor",
		:options="editorOption",
		@blur="onEditorBlur($event)",
		@focus="onEditorFocus($event)",
		@ready="onEditorReady($event)",
		@change="onEditorChange($event)"
		)
</template>

<script>
	/**
	 * vue-quill-editor文档
	 * https://github.com/surmon-china/vue-quill-editor
	 * toolbar设置：https://quilljs.com/docs/modules/toolbar/
	 */
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {quillEditor} from 'vue-quill-editor'
	import utils from '../common/utils'
	// window.mOxie = window.moxie = require('../../static/js/plupload/moxie')
	// require('../../static/js/plupload/plupload.dev')
	// const Qiniu = require('../../static/js/qiniu/qiniu')
	// const qiniuConfig = require('../../static/js/qiniu/config')

	//自定义编辑器的工作条
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],
		[{'header': 1}, {'header': 2}],               // custom button values
		[{'list': 'ordered'}, {'list': 'bullet'}],
		[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
		[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
		[{'direction': 'rtl'}],                         // text direction
		[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
		[{'header': [1, 2, 3, 4, 5, 6, false]}],
		[{'color': []}, {'background': []}],          // dropdown with defaults from theme
		[{'font': []}],
		[{'align': []}],
		['link', 'image', 'video'],
		['clean']                                         // remove formatting button
	];

	export default {
		editor: null,

		name: "q-editor",
		components: {
			quillEditor
		},
		data() {
			return {
				editorId: "editor_" + utils.uuid(16),
				editorContent: '',
				editorOption: {
					placeholder: '请填写内容',
					modules: {
						toolbar: {
							container: toolbarOptions,  // 工具栏
							// handlers: {
							// 	'image': function (value) {
							// 		if (value) {
							// 			document.querySelector('#quillEditorQiniu .avatar-uploader input').click()
							// 		} else {
							// 			this.quill.format('image', false);
							// 		}
							// 	}
							// }
						}
					}
				}
			}
		},
	  computed: {
		  editor() {
			  return this.$refs.myQuillEditor.quill
		  }
	  },
		mounted() {
			console.log('this is current quill instance object', this.editor)
		},

		methods: {
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
				 *  报错："TypeError: Cannot read property 'browser' of undefined"    -- 20190517
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
				return editorContent;
			},

			setContent(html) {
				this.editorContent = html;
			},

			reset() {
				this.editorContent = '';
			},

			onEditorBlur(quill) {
				console.log('editor blur!', quill)
			},

			onEditorFocus(quill) {
				console.log('editor focus!', quill)
			},

			onEditorReady(quill) {
				console.log('editor ready!', quill)
			},

			onEditorChange({quill, html, text}) {
				console.log('editor change!', quill, html, text);
	  		this.editorContent = html;
	  		this.$emit('content-change', html);
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.q-container
			min-height 500px
</style>