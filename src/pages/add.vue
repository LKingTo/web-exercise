<template lang="pug">
	.add-container
		el-input.title-input(
		placeholder="请输入题目"
		v-model="title"
		clearabl
		)
		w-editor(ref="wEditor")
		.button-container
			el-button(type="primary", @click="submit()") 保存
			el-button(@click="reset()") 重置
		common-footer
		el-dialog(
		title="提示",
		:visible.sync="showDialog",
		width="90%",
		center
		)
			span {{errorMsg}}
			span.dialog-footer(slot="footer")
				el-button(@click="showDialog = false") 取 消
				el-button(type="primary", @click="onClickClearStorage") 确 定
</template>

<script>
	import WEditor from '../components/wEditor'
	import CommonFooter from '../components/commonFooter'
	import storageUtils from '../common/storageUtils'
	import utils from '../common/utils'
	import wSql from '../rest/wSql'

	export default {
		name: "add",
		components: {
			WEditor,
			CommonFooter
		},
		data() {
			return {
				title: "",
				content: "",
				errorMsg: "保存失败!",
				showDialog: false
			}
		},
		methods: {
			submit() {
				const getContent = () => {
					let html = this.$refs.wEditor.getContent();
					console.log('get html', html);
					this.content = html;
				};
				getContent();
				this.save();
			},

			reset() {
				this.title = "";
				this.content = "";
				this.$refs.wEditor.reset();
			},

			save() {
				let title = this.title;
				let content = this.content;
				let params = {
					id: utils.uuid(16),
					question: title,
					answer: content,
				};
				wSql.addQuestion(this.$myDb, params).then((res) => {
					this.$message.success('保存成功!');
					this.reset();
					// 通知首页更新
				}, (err) => {
					this.$message.error('保存失败!');
					this.reset();
				})
			},

			onClickClearStorage() {
				this.showDialog = false;
				storageUtils.removeStorage('web_exercise_question');
				this.reset();
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.add-container
		padding 15px
		padding-bottom 80px
		.title-input
			margin-bottom 20px
		.button-container
			margin-top 30px
			display flex
			justify-content center
</style>