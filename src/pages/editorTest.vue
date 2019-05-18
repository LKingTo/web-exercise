<template lang="pug">
	.container
		q-editor
</template>

<script>
	import QEditor from '../components/qEditor'

	export default {
		name: "editor-test",
		components: {
			QEditor,
		},
		mounted() {
			console.log('e t');
		}
	}
</script>

<style scoped>

</style>