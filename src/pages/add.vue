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
			span 保存失败，本地缓存已满！是否清空？
			span.dialog-footer(slot="footer")
				el-button(@click="showDialog = false") 取 消
				el-button(type="primary", @click="onClickClearStorage") 确 定
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
				content: "",
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
				// this.$axios.post('/api/questions/add', {title, content}).then((res) => {
				// 	console.log('save', res);
				// })
				// 暂用localStorage存储，定期本地更新json
				this.$axios.get('/api/questions').then((res) => {
					let storage = storageUtils.getStorage('web_exercise_question');
					let list = storage && storage.data || [];
					list.push({
						id: utils.uuid(16),
						index: res.data.length + list.length,
						question: title,
						answer: content,
					});
					let params = {
						data: list,
						total: list.length
					};
					// 校验storage的大小
					let size = storageUtils.getStorageSize();
					if (size >= 5|| list.length >= 10) {
						// 通知更新json文件
						this.showDialog = true;
			  		let json = {
			  			data: res.data.concat(list),
							total: res.total + list.length
						};
			  		console.log(JSON.stringify(json));
					} else {
			  		storageUtils.setStorage('web_exercise_question', params);
			  		// 通知首页更新
			 			this.reset();
					}
				});
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