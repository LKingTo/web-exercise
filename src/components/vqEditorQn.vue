<template lang="pug">
	.vq-container
		quill-editor(
		v-model="editorContent",
		ref="myQuillEditor",
		:options="editorOption",
		@blur="onEditorBlur($event)",
		@focus="onEditorFocus($event)",
		@ready="onEditorReady($event)",
		@change="onEditorChange($event)"
		)
		el-upload.avatar-uploader(
		:action="uploadUrl",
		:accept="'image/*'",
		:data="qiniuForm",
		:show-file-list="false",
		:on-success="uploadEditorSuccess",
		:on-error="uploadEditorError",
		:before-upload="beforeEditorUpload"
		)
</template>

<script>
	/**
	 * el-upload + v-quill-editor + 七牛云 封装组件
	 * vue-quill-editor文档：https://github.com/surmon-china/vue-quill-editor
	 * toolbar设置：https://quilljs.com/docs/modules/toolbar/
	 */
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {quillEditor} from 'vue-quill-editor'
	import utils from '../common/utils'
	// 七牛云个人配置
	const config = require('../../static/js/qiniu/config')

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
	//图片路径命名空间
	const IMG_SPACE = "web-exercise_";

	export default {
		name: "vq-editor-qn",
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
							handlers: {
								'image': function (value) {
									if (value) {
										document.querySelector('.avatar-uploader input').click()
									} else {
										this.quill.format('image', false);
									}
								}
							}
						}
					}
				},
				quillUpdateImg: false,
				qiniuForm: {
					'key': '',
					'token': '',
					'domain': config.domain
				},
			}
		},
		computed: {
			// v-quill-editor实例
			editor() {
				return this.$refs.myQuillEditor.quill
			},
			// 七牛云上传地址
			uploadUrl() {
				return config.uploadUrl;
			}
		},

		mounted() {
			this.qiniuForm.key = IMG_SPACE + new Date().getTime() + "" + Math.floor(Math.random() * 1000);
			this.qiniuForm.token = config.createToken();
		},

		methods: {
			getContent() {
				return editorContent;
			},

			setContent(html) {
				this.editorContent = html;
			},

			reset() {
				this.editorContent = '';
			},

			/** v-quill-editor组件相关事件回调函数 start **/
			onEditorBlur(quill) {
				// console.log('editor blur!', quill)
			},

			onEditorFocus(quill) {
				// console.log('editor focus!', quill)
			},

			onEditorReady(quill) {
				// console.log('editor ready!', quill)
			},

			onEditorChange({quill, html, text}) {
				console.log('editor change!', quill, html, text);
				this.editorContent = html;
				this.$emit('editor-content-change', html);
			},
			/** v-quill-editor组件相关事件回调函数 end **/

			/** el-upload组件相关事件回调函数 start **/
			//上传图片之前
			beforeEditorUpload(res, file) {
				//显示上传动画
				this.quillUpdateImg = true;
			},

			// 上传图片成功
			uploadEditorSuccess(res, file) {
				//拼接出上传的图片在服务器的完整地址
				let imgUrl = this.qiniuForm.domain + res.key;
				//重置上传文件key，为下次上传做好准备
				this.qiniuForm.key = IMG_SPACE + new Date().getTime() + "" + Math.floor(Math.random() * 1000);
				// 获取富文本组件实例
				let quill = this.$refs.myQuillEditor.quill;
				// 获取光标所在位置
				let length = quill.getSelection().index;
				// 插入图片  res.info为服务器返回的图片地址
				quill.insertEmbed(length, 'image', imgUrl);
				// 调整光标到最后
				quill.setSelection(length + 1);
				//取消上传动画
				this.quillUpdateImg = false;
			},

			// 上传图片失败
			uploadEditorError(res, file) {
				//页面提示
				this.$message.error('上传图片失败');
				//取消上传动画
				this.quillUpdateImg = false;
			},
			/** el-upload组件相关事件回调函数 end **/
		}
	}
</script>

<style lang="stylus">
	.vq-container
		.ql-editor
			min-height 500px !important
</style>