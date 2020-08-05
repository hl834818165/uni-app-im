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
	import { mapState, mapActions } from 'vuex'
	import Login from './login.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	let login = null
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
		computed: {
			...mapState([
				'base'
			])
		},
		onShow () {
			login = new Login(this)
			// 重置vuex
			this.ACT_INIT()
		},
		methods: {
			...mapActions([
				'ACT_INIT',
				'ACT_COUNTCHAT',
				'ACT_MINE',
				'ACT_FRIENDS',
				'ACT_FRIENDS_PUSH',
				'ACT_APPLYS',
				'ACT_APPLYS_PUSH',
				'ACT_CHATTING',
				'ACT_APPLYCOUNT'
			]),
			// 登录方法
			login (e) {
				login.loginFn(e.detail.value)
			}
		}
	}
</script>
