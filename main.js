import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

App.mpType = 'app'

import io from '@hyoga/uni-socket.io'

// let socket = io("ws://localhost:9527")
// let ip = 'ws://localhost:9527'
let ip = 'ws://182.92.169.234:9527'
let socket = io(ip, {
	transports: [ 'websocket', 'polling' ]
})
socket.on('connect', () => {
	console.log('已连接')
})
Vue.prototype.socketEmit = function (event, args) {
	socket.emit(event, args)
}
Vue.prototype.socketOn = function (event, callback) {
	socket.on(event, (_) => {
		callback(_)
	})
}
const app = new Vue({
  ...App
})
app.$mount()
