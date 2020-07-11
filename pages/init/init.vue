<template>
	<view></view>
</template>

<script>
	import api from '../../api/api.js'
	var that = null
	//心跳检测
	var heartCheck = {
		timeout: 5000, //5s 发一次心跳
		timeoutObj: null,
		reset: function() {
			clearTimeout(this.timeoutObj)
			return this
		},
		start: function() {
			let self = this
			self.reset()
			self.timeoutObj = setTimeout(function() {
				that.socketEmit('res_socket', (_) => {
					console.log(_)
				})
				self.start()
			}, this.timeout)
		}
	}
	
	export default {
		onShow () {
			let self = that = this
			uni.getStorage({
				key: 'mine',
				success: (r) => {
					let _res = JSON.parse(r.data)
					self.init(_res)
					uni.switchTab({
						url: '../mine/mine'
					})
				}
			})
		},
		methods: {
			/**
			 * 初始数据 方法 
			 * 这里面 获取了 个人信息 朋友信息 聊天信息
			 * @param {Object} _res
			 */
			init (_res) {
				let self = this
				/** 获取登陆者信息 */
				getApp().globalData.mine = _res
				
				self.socketEmit('add_socket', {
					data: _res.username
				})
				/** 获取朋友 */
				self.getFirends(_res)
				
				/** 获取好友申请 */
				self.getApply(_res)
				
				/** 获取聊天列表 */
				self.getFriendChat(_res)
				
				heartCheck.start()
				
				self.socketOn('addFriend', (_) => {
					getApp().globalData.friends.push(_.data[0])
					// 手机震动
					uni.vibrateLong()
					heartCheck.start()
				})
				self.socketOn('addApply', (_) => {
					getApp().globalData.applys.push(_.data[0])
					// 手机震动
					uni.vibrateLong()
					heartCheck.start()
				})
			},
			/**
			 * 获取 pass_state = 2 朋友
			 * @param { friend_uid 用户自己的id } _res
			 */
			getFirends (_res) {
				let self = this
				api.getApply({
					friend_uid: _res.username,
					pass_state: 2,
					uid: ''
				})
				.then(r => {
					let _r = r[1].data
					if (_r.code == 200) {
						getApp().globalData.friends = _r.data
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			/**
			 * 获取好友申请
			 * @param { friend_uid 用户自己的id } _res
			 */
			getApply (_res) {
				let self = this
				api.getApply({
					friend_uid: _res.username,
					pass_state: '',
					uid: ''
				})
				.then(r => {
					let _r = r[1].data
					if (_r.code == 200) {
						getApp().globalData.applys = _r.data
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			/**
			 * 获取好友消息列表 
			 * @param { username } _res
			 */
			getFriendChat (_res) {
				let self = this
				api.getFriendChat({
					friend_uid: _res.username
				})
				.then(r => {
					let _r = r[1].data
					if (_r.code == 200) {
						_r.data.forEach((e, i) => {
							getApp().globalData.catting['friend-' + e.uid] = e
							self.socketOn('friend-' + e.uid, (_) => {
								api.getMessage({
									cid: _.data
								})
								.then(res => {
									let _res = res[1].data
									if (_res.code == 200) {
										getApp().globalData.catting['friend-' + e.uid].chatting.push(_res.data[0])
										// 手机震动
										uni.vibrateLong()
										heartCheck.start()
									}
								})
							})
						})
					}
				})
			}
		}
	}
</script>
