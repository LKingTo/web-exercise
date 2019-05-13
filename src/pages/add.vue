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
</template>

<script>
	import WEditor from '../components/wEditor'
	import CommonFooter from '../components/commonFooter'
	import storageUtils from '../common/storageUtils'
	import utils from '../common/utils'

	export default {
		name: "add",
		components: {
			WEditor,
			CommonFooter
		},
		data() {
			return {
				title: "",
				content: ""
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
				this.$refs.wEditor.reset();
			},

			save() {
				let title = this.title;
				let content = this.content;
				// this.$axios.post('/api/questions/add', {title, content}).then((res) => {
				// 	console.log('save', res);
				// })
				// 暂用localStorage存储，定期本地更新json
				let storage = storageUtils.getStorage('web_exercise_question');
				let list = storage && storage.data || [];
				list.push({
					id: utils.uuid(16),
					index: list.length,
					question: title,
					answer: content,
				});
				let json = {
					data: list,
					total: list.length
				};
				storageUtils.setStorage('web_exercise_question', json);
				// 通知首页更新
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