import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/home'
import Test from '../pages/test'
import Add from '../pages/add'

Vue.use(Router)

const routes = new Router({
	routes: [
		{
			name: 'home',
			path: '/',
			component: Home
		},{
			name: 'test',
			path: '/test',
			component: Test
		},{
			name: 'add',
			path: '/add',
			component: Add,
			props: true
		},
	]
})

export default routes
