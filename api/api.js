
import http from '../http/http.js'

export default {
	/** 登录检验
	 * @param {username, password, captcha} param
	 */
	login (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/user/login`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	/** 搜索用户
	 * @param {uid} param
	 */
	searchFriend (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/user/searchFriend?uid=${param.uid}`, 'GET', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	addApply (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/user/addApply`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	getApply (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/user/getApply?friend_uid=${param.friend_uid}&pass_state=${param.pass_state}&uid=${param.uid}`, 'GET', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	setApply (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/user/setApply`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	getFriendChat (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/chat/getFriendChat`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	send (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/chat/send`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	getMessage (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/chat/getMessage`, 'GET', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	},
	getFriendChatting (param) {
		return new Promise((resolve, reject) => {
			http.httpRequest(`/chat/getFriendChatting`, 'POST', {}, param)
			.then(res => {
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		})
	}
}