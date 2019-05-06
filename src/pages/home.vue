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
				list: [
						{
							index: 0,
							question: 'ss',
							answer: 'ss'
						},
						{
							index: 1,
							question: 'sss',
							answer: 'sss'
						},
						{
							index: 2,
							question: 'ssss',
							answer: 'ssss'
						},
				]
			}
		},
		components: {
			CommonFooter
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