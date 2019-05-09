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
		  	// 自定义菜单配置
		  	editor.customConfig.menus = [
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
		  	];
		  editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
		  	editor.create();
		  // editor.customConfig.onchange((html) => {
					// this.editorContent = html;
				// });
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