import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

import store from './store.js'


App.mpType = 'app'

const app = new Vue({
	store,
  ...App
})
app.$mount()
