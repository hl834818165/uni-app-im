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
	import unit from '../../unit/unit.js'
	import uniIcons from '../../components/uni-icons/icons.js'
	import { mapState, mapActions } from 'vuex'
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
				url: '../friend/firend'
			})
			return true
		},
		computed: {
			...mapState([
				'base'
			])
		},
		onShow () {
			this.$set(this.oldList, 'data', this.base.applys)
		},
		onUnload () {
			// 请求修改当前的时间
			this.lookApply()
		},
		methods: {
			...mapActions([
				'ACT_MINE',
				'ACT_APPLYCOUNT'
			]),
			/** 切换输入状态 */
			switchSearch() {
				this.nowList.show = !this.nowList.show
			},
			/** 查看最后一次好友申请时间 */
			lookApply () {
				let self = this
				let _res = self.base.mine
				let _now = new Date().getTime()
				
				api.lookApply({
					username: _res.username,
					date_time: _now
				})
				.then(res => {
					if (res[1].data.code == 200) {
						self.base.mine.apply_last_time = String(_now)
						self.ACT_MINE(self.base.mine)
						// 设置 消息标记
						self.ACT_APPLYCOUNT('0')
						uni.removeTabBarBadge({
							index: 1
						})
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			/** 获取申请列表 */
			getApply () {
				let self = this
				let _res = self.base.mine
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
			},
			/** 查看好友申请 */
			detailApply (e) {
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