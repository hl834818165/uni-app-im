import Base from '../../base/base.js'
import api from '../../api/api.js'
import unit from '../../unit/unit.js'
export default class Login extends Base {
	/**
	 * 登录校验
	 * @param { username: String, password: String, captcha: Number } param
	 */
	loginFn (param) {
		let self = this
		if (param.username == '') {
			self.vm.popup.message = {
				type: 'error',
				message: '用户不能为空',
				duration: 3000
			}
			self.vm.$refs.popup.open()
			return false
		}
		if (param.password == '') {
			self.vm.popup.message = {
				type: 'error',
				message: '密码不能为空',
				duration: 3000
			}
			self.vm.$refs.popup.open()
			return false
		}
		api.login(param)
		.then(res => {
			// 初始化 socket
			this.openIO()
			let _res = res[1].data
			if (_res.code == 200) {
				self.vm.popup.message = {
					type: 'success',
					message: '登录成功',
					duration: 3000
				}
				self.vm.ACT_MINE({
					id: _res.data[0].id,
					name: _res.data[0].name,
					username: _res.data[0].username,
					apply_last_time: _res.data[0].apply_last_time
				})
				self.init(_res)
				uni.switchTab({
					url: '../mine/mine'
				})
			} else {
				self.vm.popup.message = {
					type: 'error',
					message: _res.msg,
					duration: 3000
				}
			}
			self.vm.$refs.popup.open()
		})
		.catch(ret => {
			console.log(ret)
		})
	}
	/**
	 * 初始数据 方法 
	 * 这里面 获取了 个人信息 朋友信息 聊天信息
	 * @param {Object} _res
	 */
	async init (_res) {
		let self = this
		/** 获取登陆者信息 */
		_res = _res.data[0]
		self.socketEmit('add_socket', {
			data: _res.username
		})
		/** 获取朋友 */
		self.getFirends(_res)

		/** 获取好友申请 */
		self.getApply(_res)

		/** 获取聊天列表 */
		self.getFriendChat(self.vm.base.chatting, _res)

		self.heartStart()
		// 处理好友申请 同意
		self.socketOn('addFriend', (_) => {
			self.vm.ACT_FRIENDS_PUSH(_.data[0])
			// 手机震动
			uni.vibrateLong()
			unit.playTim()
			self.heartStart
			self.getFriendChat(self.vm.base.chatting, {
				username: _res.username,
				to: _.data[0].uid
			})
		})
		// 收到好友申请
		self.socketOn('addApply', (_) => {
			self.vm.ACT_APPLYS_PUSH(_.data[0])
			// 手机震动
			uni.vibrateLong()
			// 播放提示音
			unit.playTim()
			// 重置心跳检测
			self.heartStart()
			// 设置 消息标记
			if (unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true)) {
				self.vm.ACT_APPLYCOUNT(
					String(unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true))
				)
				uni.setTabBarBadge({
					index: 1,
					text: String(unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true))
				})
			}
		})
		self.socketOn('friend-chat', (_) => {
			self.getFriendChat(self.vm.base.chatting, {
				username: _res.username,
				to: _.data
			}, () => {
				
				// 设置消息总数  叠加
				self.vm.ACT_COUNTCHAT(
					self.vm.base.countChat+1
				)
				if (self.vm.base.countChat <= 0) {
					uni.removeTabBarBadge({
						index: 0
					})
				} else {
					uni.setTabBarBadge({
						index: 0,
						text: String(self.vm.base.countChat)
					})
				}

				// 手机震动
				uni.vibrateLong()
				unit.playTim()
				self.heartStart()
			})
		})
	}
	
	/**
	 * 获取好友消息记录
	 * @param { username } _res
	 */
	getFriendChat (chatting, _res, callback) {
		let self = this
		api.getFriendChat({
			friend_uid: _res.username,
			uid: _res.to || ''
		})
		.then(async (r) => {
			let _r = r[1].data
			if (_r.code == 200) {
				await _r.data.forEach((e) => {
					
					// 设置消息总数  初始
					if (!_res.to) {
						self.vm.ACT_COUNTCHAT(
							self.vm.base.countChat + e.chatCount
						)
					}

					chatting['friend-' + e.uid] = e
					unit.updateList(chatting, e.uid, e.chatting[e.chatting.length - 1])
					self.socketOn('friend-' + e.uid, (_) => {
						api.getMessage({
							cid: _.data
						})
						.then(res => {
							let _res = res[1].data
							if (_res.code == 200) {
								chatting['friend-' + e.uid].chatting.push(_res.data[0])
								unit.updateList(chatting, e.uid, _res.data[0])
								
								// 设置消息总数  叠加
								self.vm.ACT_COUNTCHAT(
									self.vm.base.countChat+1
								)
								if (self.vm.base.countChat <= 0) {
									uni.removeTabBarBadge({
										index: 0
									})
								} else {
									uni.setTabBarBadge({
										index: 0,
										text: String(self.vm.base.countChat)
									})
								}

								// 手机震动
								uni.vibrateLong()
								unit.playTim()
								self.heartStart()
							}
						})
					})
				})
				self.vm.ACT_CHATTING(self.vm.base.chatting)
				if (self.vm.base.countChat) {
					uni.setTabBarBadge({
						index: 0,
						text: String(self.vm.base.countChat)
					})
				}
				callback ? callback() : ''
			}
		})
	}
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
				self.vm.ACT_FRIENDS(_r.data)
			}
		})
		.catch(ret => {
			console.log(ret)
		})
	}

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
				self.vm.ACT_APPLYS(_r.data)
				// 设置 消息标记
				if (unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true)) {
					self.vm.ACT_APPLYCOUNT(
						String(unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true))
					)
					console.log(String(unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true)))
					uni.setTabBarBadge({
						index: 1,
						text: String(unit.readCount(self.vm.base.applys, self.vm.base.mine.apply_last_time, true))
					})
				}
			}
		})
		.catch(ret => {
			console.log(ret)
		})
	}
}