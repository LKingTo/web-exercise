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
						// 'image',  // 插入图片
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
					// qiniu: true, // 上传图片到七牛云存储
				};
				// 关闭粘贴样式的过滤
				editor.customConfig.pasteFilterStyle = false;
				editor.create();
				this.editor = editor;
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