<template lang="pug">
	.add-container
		el-input.title-input(
			placeholder="请输入题目"
			v-model="title"
			clearabl
		)
		w-editor
		.button-container
			el-button(type="primary", @click="submit()") 保存
			el-button(@click="reset()") 重置
		common-footer
</template>

<script>
	import WEditor from '../components/wEditor'
	import CommonFooter from '../components/commonFooter'

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
			submit() {},
			reset() {}
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