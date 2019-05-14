<template lang="pug">
	.add-container
		el-input.title-input(
		placeholder="请输入题目"
		v-model="title"
		clearabl
		)
		w-editor(ref="wEditor", @content-change="contentOnChange")
		.button-container
			el-button(type="primary", @click="submit()", :disabled="disabled") 保存
			el-button(@click="reset()") 重置
		common-footer
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
		props: ['id', 'edit'],
		data() {
			return {
				title: "",
				content: "",
				errorMsg: "保存失败!",
				showDialog: false
			}
		},
		computed: {
			disabled() {
				return !this.title || !this.content;
			}
		},
		methods: {
			contentOnChange(data) {
				this.content = data;
			},

			submit() {
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
					question: title,
					answer: content,
				};
				let promise, action;
				if (this.edit) {
					params.id = this.id;
					action = '修改';
					promise = wSql.editQuestion(this.$myDb, params);
				} else {
					params.id = utils.uuid(16);
					action = '保存';
					promise = wSql.addQuestion(this.$myDb, params);
				}
				promise.then((res) => {
					this.$message.success(`${action}成功!`);
					this.reset();
					// 通知首页更新
				}, (err) => {
					this.$message.error(`${action}失败!`);
					this.reset();
				})
			},

			getQuestionDetail() {
				wSql.getQuestion(this.$myDb, this.id).then((res) => {
					this.title = res && res.question;
					this.content = res && res.answer;
					this.$refs.wEditor.setContent(this.content);
				})
			}
		},

		mounted() {
			if (this.id) {
				this.getQuestionDetail();
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