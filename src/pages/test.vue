<template lang="pug">
	.container
		el-card.box-card
			.header {{currentItem.question}}
			el-divider(v-if="status === 'locked'")
				i.el-icon-lock(@click="unlock()")
			el-divider(v-if="status === 'unlock'")
				i.el-icon-arrow-down(v-show="!showAnswer", @click="showAnswer = true")
				i.el-icon-arrow-up(v-show="showAnswer", @click="showAnswer = false")
			.amswer-box(v-show="status === 'unlock' && showAnswer")
				.content(v-html="currentItem.answer")
				el-divider
			.input-box
				el-input(type="textarea", :rows="6", placeholder="请输入内容", v-model="inputContent")

		.controller-box
			.mode
				el-switch(v-model="mode", active-text="随机模式", active-value="random", inactive-value="order")
			.btn
				el-button(
				type="primary",
				icon="el-icon-arrow-left",
				:disabled="currentIndex == 1",
				circle,
				@click="prev()"
				)
				el-button(
				type="primary",
				icon="el-icon-arrow-right",
				:disabled="currentIndex == list.length",
				circle,
				@click="next()"
				)
		common-footer
</template>

<script>
	import CommonFooter from '../components/commonFooter'
	import wSql from '../rest/wSql'

	export default {
		name: "test",
		newList: null,
		components: {
			CommonFooter
		},
		data() {
			return {
				mode: 'random',		// 出题模式，默认随机模式
				list: [],
				currentItem: {},
				inputContent: "",
				showAnswer: false,
				status: 'locked'
			}
		},
		computed: {
			currentIndex() {
				return (this.mode === 'order') ? this.currentItem._index : this.currentItem.ranIndex;
			}
		},
		watch: {
			mode(val) {
				this.handleRanking();
			}
		},
		mounted() {
			this.getAllQuestions();
		},
		methods: {
			getAllQuestions() {
				wSql.getQuestionsList(this.$myDb).then((res) => {
					this.list = res && res.data;
					// 洗牌排序
					this.handleRanking();
				})
			},

			handleRanking() {
				this.reset();
				let newList = this.list.slice();
				if (this.mode === 'order') {
					newList = newList.sort((a, b) => {return a._index - b._index;});
				} else {
					// 随机模式
					const randomSort = (a, b) => {
						//通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
						return Math.random() > .5 ? -1 : 1;
					};
					let arr = [];
					for (let i = 1; i <= newList.length; i++) {
						arr.push(i);
					}
					arr = arr.sort(randomSort);
					newList.forEach((item, index) => {
						item.ranIndex = arr[index];
					});
					this.newList = newList.sort((a, b) => {return a.ranIndex - b.ranIndex});
				}
				this.newList = newList;
				this.currentItem = newList[0];
			},

			unlock() {
				this.status = 'unlock';
				this.showAnswer = true;
			},

			prev() {
				let index = this.currentIndex === 1 ? 1 : this.currentIndex - 1;
				this.currentItem = this.newList[index - 1];
				this.reset();
			},

			next() {
				let length = this.newList.length;
				let index = this.currentIndex === length ? length : this.currentIndex + 1;
				this.currentItem = this.newList[index - 1];
				this.reset();
			},

			reset() {
				this.status = 'locked';
				this.inputContent = "";
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.container
		padding-bottom 130px

	.controller-box
		display flex
		justify-content space-between
		position fixed
		width 100%
		height 50px
		bottom 50px
		background #fff
		padding 10px 0

	.mode
		padding-left 20px

	.btn
		padding-right 20px
</style>