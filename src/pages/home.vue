<template lang="pug">
	.container
		el-collapse(accordion)
			el-collapse-item(v-for="(item, $index) in list", :key="$index")
				template(slot="title")
					.title {{item.question}}
				.expanded
					.btn-container
						el-button(type="primary", icon="el-icon-edit", circle, @click="editItem(item)")
						el-button(type="danger", icon="el-icon-delete", circle, @click="deleteItem(item)")
					.content
						.question Q：{{item.question}}
						.answer(v-html="item.answer")
		common-footer

		el-dialog(
		title="提示",
		:visible.sync="showDelConfirm",
		width="90%",
		center
		)
			span 确定删除？
			span.dialog-footer(slot="footer")
				el-button(@click="showDelConfirm = false") 取 消
				el-button(type="primary", @click="doDelete()") 确 定
</template>

<script>
	import CommonFooter from '../components/commonFooter'
	import storageUtils from '../common/storageUtils'
	import wSql from '../rest/wSql'

	export default {
		name: "home",
		data() {
			return {
				list: [],
				currentItem: null,
				showDelConfirm: false
			}
		},
		components: {
			CommonFooter
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// 读取webSQL数据库
				wSql.getQuestionsList(this.$myDb).then((res) => {
					this.list = res && res.data;
				})
			},

			editItem(item) {
				let id = item.id;
				this.$router.push({name: 'add', params: {id: id, edit: true}})
			},

			deleteItem(item) {
				this.currentItem = item;
				this.showDelConfirm = true;
			},

			doDelete() {
				let id = this.currentItem.id;
				wSql.deleteQuestion(this.$myDb, id).then((res) => {
					this.showDelConfirm = false;
					this.$message.success('删除成功!');
					this.init();
				}, (err) => {
					this.showDelConfirm = false;
					this.$message.error('删除失败!请重试');
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.container
		padding-bottom 80px

	.title
		padding-left 8px
		width 100%
		white-space nowrap
		overflow hidden
		text-overflow ellipsis

	.expanded
		padding 8px
		border-top 1px solid #EBEEF5
		.btn-container
			display flex
			justify-content flex-end
			padding-top 5px
			padding-bottom 5px
		.question
			font-weight bold
			margin-bottom 10px
</style>