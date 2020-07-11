<template>
	<view class="content">
		
		<view class="detail-box">
			<image class="detail-avatar" :src="list.avatar"></image>
			<view class="detail-cont">
				<view class="detail-name">{{ list.name }}</view>
				<view class="detail-title">{{ list.username }}</view>
			</view>
			<uni-icons type="arrowright"></uni-icons>
		</view>
		
		<view class="default-cell cell-item">
			<view class="cell-row">
				<view class="cell-title">个性签名</view>
				<view class="cell-cont">{{ list.signature || '该用户很懒，没留下任何东西' }}</view>
			</view>
		</view>
		
		<view class="footer-operation pop__panel">
			<view class="pop__btn-primary pop__btn-default" @click="addApply">发起申请</view>
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
				this.searchFriend({
					uid: ops.uid
				})
			} else { // 缺少参数
				this.$set(this.logList, 'show', true)
				this.$set(this.logList, 'title', '缺少参数')
			}
		},
		methods: {
			/** 搜索用户 */
			searchFriend(param) {
				api.searchFriend(param)
				.then(res => {
					let _res = res[1].data
					if (_res.code == 200) {
						this.$set(this, 'list', _res.data[0])
						uni.getStorage({
							key: 'mine',
							success: (mine) => {
								let _mine = JSON.parse(mine.data)
								let _list = {
									uid: _mine.username,
									friend_remark: _mine.name,
									friend_uid: param.uid
								}
								uni.setStorage({
									key: 'search_apply',
									data: JSON.stringify(_list)
								})
							}
						})
					} else {
						this.$set(this.logList, 'show', true)
						this.$set(this.logList, 'title', _res.msg)
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			addApply () {
				uni.navigateTo({
					url: 'send_apply?uid=' + this.uid
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
