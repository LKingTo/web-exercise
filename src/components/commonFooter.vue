<template lang="pug">
	.footer
		ul.footer-cont
			router-link(:to="path='/'", tag="li", :class="{'active':$route.path === '/'}") home
			router-link(:to="path='/test'", tag="li", :class="{'active':$route.path === '/test'}") test
			router-link(:to="path='/add'", tag="li", :class="{'active':$route.path === '/add'}") add
</template>

<script>
	export default {
		name: "common-footer",
	}
</script>

<style lang="stylus" scoped>
	.footer
		height 50px
		width 100%
		position fixed
		bottom 0
		left 0
		z-index 10000
		border-top 1px solid #EBEEF5
		background-color white
		ul.footer-cont
			display flex
			li
				flex 1
				height 50px
				line-height 50px
				font-size 20px
				color #303133
				text-align center
				&.active
					background-color rgba(64, 158, 255, .85)
					color white
				&:after
					content ''
					display block
					clear both
					width 0
					height 0
</style>