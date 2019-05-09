<template lang="pug">
	.container
		el-collapse(accordion)
			el-collapse-item(v-for="(item, $index) in list", :key="$index")
				template(slot="title")
					.title {{item.question}}
				.answer {{item.answer}}
		common-footer
</template>

<script>
	import CommonFooter from '../components/commonFooter'

	export default {
		name: "home",
		data() {
			return {
				list: []
			}
		},
		components: {
			CommonFooter
		},
		mounted() {
			// this.$axios.get('/mock/questions').then((res) => {
			this.$axios.get('../../mock/questions').then((res) => {
			  this.list = res.data;
			})
		}
	}
</script>

<style lang="stylus" scoped>
	.title
		padding-left 8px
		width 100%
	.answer
		padding 8px
</style>