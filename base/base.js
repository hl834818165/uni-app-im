import io from '@hyoga/uni-socket.io'

let ip = 'ws://182.92.169.234:9527';
let socket = null;

let timeout = 3000;
let timeoutObj = null;

export default class Base {
	constructor(vm) {
		this.vm = vm
	}
	openIO () {
		socket = io(ip, {
			transports: [ 'websocket', 'polling' ]
		})
		socket.on('connect', () => {
			console.log(socket.id, '连接')
		})
	}
	socketEmit (event, args) {
		socket.emit(event, args)
	}
	socketOn (event, callback) {
		socket.on(event, (_) => {
			callback(_)
		})
	}
	socketClose () {
		socket.close()
	}
	socketDisconnect () {
		socket.disconnect()
	}
	heartReset () {
		clearTimeout(timeoutObj)
	}
	heartStart () {
		let self = this
		self.heartReset()
		timeoutObj = setTimeout(function() {
			self.socketEmit('res_socket')
			self.heartStart()
		}, timeout)
	}
	getIp () {
		return ip
	}
}