<template>
	<view class="content">
		<view class="mine-box detail-box">
			<image class="mine-avatar detail-avatar" src="../../static/avatar.jpg"></image>
			<view class="mine-cont detail-cont">
				<view class="mine-name detail-name">{{ list.name }}</view>
				<view class="mine-title detail-title">{{ list.name }}</view>
			</view>
			<uni-icons type="arrowright"></uni-icons>
		</view>
		<view class="pop__panel">
			<view class="pop__form-link">
				<view class="btn__loginout" @click="loginOut">登出</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="message">
			<uni-popup-message :type="popup.message.type" :message="popup.message.message" :duration="popup.message.duration"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	let mine = null
	import Mine from './mine.js'
	import api from '../../api/api.js'
	import { mapState, mapActions } from 'vuex'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniIcons,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				list: {},
				popup: {
					message: {
						type: 'success',
						message: '获取成功',
						duration: 3000
					}
				}
			}
		},
		computed: {
			...mapState([
				'base'
			])
		},
		onShow() {
			mine = new Mine(this)
			this.$set(this, 'list', this.base.mine)
		},
		methods: {
			...mapActions([
				'ACT_INIT'
			]),
			loginOut () {
				mine.loginOut()
			}
		}
	}
</script>
