<template>
	<view class="content">
		<view class="pop__panel pop__clearfix">
			<view class="pop__form-cells">
				<h2 class="pop__form-title">登录</h2>
				<form action="post" @submit="login">
					<view class="pop__form-cell uni-form-item uni-column">
						<view class="title pop__form-label">账号</view>
						<view class="pop__flex1">
							<input class="pop__form-input" type="text" confirm-type="next" name="username" placeholder="请输入账号"
							 placeholder-class="pop__form-input-placeholder" />
						</view>
					</view>
					<view class="pop__form-cell uni-form-item uni-column">
						<view class="title pop__form-label">密码</view>
						<view class="pop__flex1">
							<input class="pop__form-input" type="text" confirm-type="next" name="password" placeholder="请输入密码"
							 placeholder-class="pop__form-input-placeholder" />
						</view>
					</view>
					<!-- <view class="pop__form-cell uni-form-item uni-column">
						<view class="title pop__form-label">验证码</view>
						<view class="pop__flex1">
							<input class="pop__form-input" type="text" confirm-type="done" name="captcha" placeholder="输入验证码" placeholder-class="pop__form-input-placeholder" />
						</view>
						<view>
							<img :src="joincaptcha" alt="" class="pop__form-captcha" @click="changeJoincaptcha">
						</view>
					</view> -->

					<view class="pop__form-link">
						<view class="btn__register">注册账号</view>
					</view>
					<view class="pop__form-btn">
						<button class="pop__btn-primary btn__login pop__btn-default" form-type="submit">登录</button>
					</view>
				</form>
			</view>
		</view>
		<uni-popup ref="popup" type="message">
			<uni-popup-message :type="popup.message.type" :message="popup.message.message" :duration="popup.message.duration"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import api from '../../api/api.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
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
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				// joincaptcha: 'http://pop-web/h5/login/logincaptcha',
				resref: false,
				popup: {
					message: {
						type: 'success',
						message: '成功',
						duration: 0
					}
				}
			}
		},
		onShow () {
			let self = that = this
		},
		methods: {
			/**
			 * 登录校验
			 * @param { username: String, password: String, captcha: Number } param
			 */
			loginFn(param) {
				let self = this
				if (param.username == '') {
					self.popup.message = {
						type: 'error',
						message: '用户不能为空',
						duration: 3000
					}
					self.$refs.popup.open()
					return false
				}
				if (param.password == '') {
					self.popup.message = {
						type: 'error',
						message: '密码不能为空',
						duration: 3000
					}
					self.$refs.popup.open()
					return false
				}
				api.login(param)
					.then(res => {
						let _res = res[1].data
						if (_res.code == 200) {
							self.popup.message = {
								type: 'success',
								message: '登录成功',
								duration: 3000
							}
							let _mine = {
								id: _res.data[0].id,
								name: _res.data[0].name,
								username: _res.data[0].username
							}
							uni.setStorage({
								key: 'mine',
								data: JSON.stringify(_mine)
							})
							self.init(_res)
							uni.switchTab({
								url: '../mine/mine'
							})
							// uni.reLaunch({
							//   url: '/pages/init/init'
							// })
						} else {
							self.popup.message = {
								type: 'error',
								message: _res.msg,
								duration: 3000
							}
						}
						self.$refs.popup.open()
					})
					.catch(ret => {
						console.log(ret)
					})
			},
			// 登录方法
			login(e) {
				this.loginFn(e.detail.value)
			},
			/**
			 * 初始数据 方法 
			 * 这里面 获取了 个人信息 朋友信息 聊天信息
			 * @param {Object} _res
			 */
			init(_res) {
				/** 获取登陆者信息 */
				_res = _res.data[0]
				getApp().globalData.mine = _res
				this.socketEmit('add_socket', {
					data: _res.username + new Date().getTime()
				})
				/** 获取朋友 */
				this.getFirends(_res)

				/** 获取好友申请 */
				this.getApply(_res)

				/** 获取聊天列表 */
				this.getFriendChat(_res)

				heartCheck.start()

				this.socketOn('addFriend', (_) => {
					getApp().globalData.friends.push(_.data[0])
					// 手机震动
					uni.vibrateLong()
					heartCheck.start()
				})
				
				this.socketOn('addApply', (_) => {
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
			getFirends(_res) {
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
			getApply(_res) {
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
			getFriendChat(_res) {
				let self = this
				api.getFriendChat({
						friend_uid: _res.username
					})
					.then(r => {
						let _r = r[1].data
						if (_r.code == 200) {
							_r.data.forEach((e, i) => {
								getApp().globalData.catting['friend-' + e.uid] = e
								let num = 0
								self.socketOn('friend-' + e.uid, (_) => {
									num = num+1
									console.log('接受了几'+ num +'次')
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
