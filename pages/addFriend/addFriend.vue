<template>
	<view class="content addFriend">
		<!-- 初始显示 -->
		<view class="search-defalt" v-show="!nowList.show">
			<view class="search-cell default-cell bg-cell">
				<view class="search-box" @click="switchSearch">
					<uni-icons type="search" size="20" color="#808080"></uni-icons>
					<view class="search-txt">输入对方账号</view>
				</view>
			</view>
			<view>
				<view class="default-cell" v-for="(e, i) in oldList.data" :key="i" :index="i" @click="detailApply(e)">
					<view class="cell-row">
						<image class="cell-avatar" :src="e.avatar"></image>
						<view class="cell-title">{{ e.name }}</view>
						<view :class="[e.pass_state == 1 ? 'cell-operation-btn' : 'cell-operation-tip']">{{ e.pass_state == 1 ? '查看' : (e.pass_state == 2 ? '已通过' : '已拒绝') }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 搜索显示 -->
		<view class="search-operation" v-show="nowList.show">
			<!-- 搜索输入 -->
			<view class="search-cell default-cell bg-cell">
				<view class="search-box search-now">
					<uni-icons type="search" size="20" color="#808080"></uni-icons>
					<input class="search-inp uni-input" :focus="nowList.show" v-model="nowList.search" type="text" />
					<view class="search-operation-btn" @click="switchSearch">取消</view>
				</view>
			</view>
			<!-- 搜索结果 -->
			<view class="default-cell add-groups" v-show="nowList.search != ''" @click="searchFriend">
				<view class="cell-row">
					<image class="cell-avatar" src="../../static/icon__groups.png"></image>
					<view class="cell-title">
						<label class="search-titile">搜索 : </label>
						<label class="search-data">{{ nowList.search }}</label>
					</view>
				</view>
			</view>
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
	import uniIcons from '../../components/uni-icons/icons.js'
	export default {
		comments: {
			uniIcons
		},
		data() {
			return {
				nowList: {
					show: false,
					search: ''
				},
				oldList: {
					data: []
				},
				logList: {
					show: false,
					title: ''
				}
			}
		},
		onBackPress (e) {
			uni.switchTab({
				url: '../friend/friend'
			})
			return true
		},
		onShow () {
			// this.getApply()
			this.$set(this.oldList, 'data', getApp().globalData.applys)
		},
		methods: {
			/** 切换输入状态 */
			switchSearch() {
				this.nowList.show = !this.nowList.show
			},
			/** 获取申请列表 */
			getApply () {
				let self = this
				uni.getStorage({
					key: 'mine',
					success: (res) => {
						let _res = JSON.parse(res.data)
						api.getApply({
							friend_uid: _res.username,
							pass_state: '',
							uid: ''
						})
						.then(res => {
							let _res = res[1].data
							if (_res.code == 200) {
								self.$set(self.oldList, 'data', _res.data)
							}
						})
						.catch(ret => {
							console.log(ret)
						})
					}
				})
			},
			/** 查看好友申请 */
			detailApply (e) {
				console.log(e)
				uni.navigateTo({
					url: '../detail/detail_apply?uid=' + e.uid,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			/** 搜索用户 */
			searchFriend() {
				api.searchFriend({
					uid: this.nowList.search
				})
				.then(res => {
					let _res = res[1].data
					if (_res.code == 200) {
						uni.navigateTo({
							url: '../detail/friend_detail?uid=' + _res.data[0].username,
							animationType: 'pop-in',
							animationDuration: 200
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
			logConfirm() {
				this.$set(this.logList, 'show', false)
			}
		}
	}
</script>

<style scoped>
	.search-box {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		padding: 12rpx;
		color: #808080;
	}

	.search-box .search-txt,
	.search-box .search-inp {
		flex: 1;
		padding: 0 12rpx;
	}

	.search-box .search-inp {
		font-size: 16px;
		height: unset;
		min-height: unset;
		line-height: unset;
	}

	.search-box.search-now {
		justify-content: baseline;
	}

	.search-operation .search-operation-btn {
		color: #1AAD19;
		padding: 0 12rpx;
	}
</style>
