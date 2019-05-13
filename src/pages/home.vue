<template lang="pug">
	.container
		el-collapse(accordion)
			el-collapse-item(v-for="(item, $index) in list", :key="$index")
				template(slot="title")
					.title {{item.question}}
				.answer(v-html="item.answer")
		common-footer
</template>

<script>
	import CommonFooter from '../components/commonFooter'
	import storageUtils from '../common/storageUtils'

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
			this.$axios.get('/api/questions').then((res) => {
			  let storage = storageUtils.getStorage('web_exercise_question');
			  let storageData = storage && storage.data || [];
			  this.list = res.data.concat(storageData);
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