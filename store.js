import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import base from './store/store.js'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		base
	},
	plugins: [
		createPersistedState({
			key: 'hl-admin-master',
			paths: ['base'],
			storage: {  // 存储方式定义  
				getItem: (key) => uni.getStorageSync(key), // 获取  
				setItem: (key, value) => uni.setStorageSync(key, value), // 存储  
				removeItem: (key) => uni.removeStorageSync(key) // 删除  
			} 
		})
	]
})