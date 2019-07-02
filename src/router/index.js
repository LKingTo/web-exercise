import Vue from 'vue'
import VueRouter from 'vue-router'
import RouterConfig from './modules'
import CommonRouters from './common'

Vue.use(VueRouter)

const routes = new VueRouter({
	routes: RouterConfig.concat(CommonRouters)
})

export default routes
