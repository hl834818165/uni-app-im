<template>
	<view class="content">
		
		<view class="detail-box">
			<image class="detail-avatar" :src="list.avatar"></image>
			<view class="detail-cont">
				<view class="detail-name">{{ list.name }}</view>
				<view class="detail-title">{{ list.uid }}</view>
			</view>
			<uni-icons type="arrowright"></uni-icons>
		</view>
		
		<view class="default-cell cell-item">
			<view class="cell-row">
				<view class="cell-title">我是</view>
				<view class="cell-cont">{{ list.friend_remark }}</view>
			</view>
		</view>
		
		<view class="footer-operation pop__panel" v-if="list.pass_state == 1">
			<view class="pop__btn-primary pop__btn-default" @click="setApply(2)">同意</view>
			<view class="pop__btn-danger pop__btn-default" @click="setApply(3)">拒绝</view>
		</view>
		<!-- 提示弹框 -->
		<view class="hl-dialog default" v-show="logList.show">
			<view class="dialog-mask"></view>
			<view class="dialog-cont">
				<view class="dialog-body">
					<view class="dialog-msg">
						{{ logList.title }}
					</view>
				</view>
				<view class="dialog-footer">
					<view class="dialog-btn success" @click="logConfirm">确定</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import api from '../../api/api.js'
	export default {
		data () {
			return {
				uid: null,
				list: {},
				logList: {
					show: false,
					title: ''
				}
			}
		},
		onLoad (ops) {
			if (ops.redirect) {
				uni.redirectTo({
					url: '../addFriend/addFriend'
				})
			}
			if (ops.uid) { // 携带参数
				this.$set(this, 'uid', ops.uid)
				uni.getStorage({
					key: 'mine',
					success: (mine) => {
						let _mine = JSON.parse(mine.data)
						this.getApply({
							uid: ops.uid,
							friend_uid: _mine.username,
							pass_state: ''
						})
					}
				})
			} else { // 缺少参数
				this.$set(this.logList, 'show', true)
				this.$set(this.logList, 'title', '缺少参数')
			}
		},
		methods: {
			/** 搜索用户 */
			getApply(param) {
				let self = this
				api.getApply(param)
				.then(res => {
					let _res = res[1].data
					if (_res.code == 200) {
						self.$set(self, 'list', _res.data[0])
					} else {
						self.$set(self.logList, 'show', true)
						self.$set(self.logList, 'title', _res.msg)
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			setApply (e) {
				this.list.pass_state = e
				api.setApply(this.list)
				.then(res => {
					console.log(res)
					let _res = res[1].data
					if (_res.code == 200) {
						alert('操作成功')
						uni.redirectTo({
							url: '../friend/friend'
						})
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			logConfirm() {
				this.$set(this.logList, 'show', false)
				uni.navigateTo({
					url: '../addFriend/addFriend'
				})
			}
		}
	}
</script>

<style scoped>
	.detail-box {
		margin-bottom: 24rpx;
	}
</style>
