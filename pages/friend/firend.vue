<template>
	<view class="content friend">
		<view class="default-cell add-friend" @click="addFriend">
			<view class="cell-row">
				<image class="cell-avatar" src="../../static/icon__add-friend.png"></image>
				<view class="cell-title">新的好友</view>
				<view class="cell-right-tiptab" v-show="base.applyCount != '0'">{{ base.applyCount }}</view>
			</view>
		</view>
		<view class="default-cell add-groups">
			<view class="cell-row">
				<image class="cell-avatar" src="../../static/icon__groups.png"></image>
				<view class="cell-title">群聊</view>
			</view>
		</view>
		<view>
			<view class="default-cell" v-for="(e, i) in friends" :key="i" :index="i" @click="friend_chat(e)">
				<view class="cell-row">
					<image class="cell-avatar" :src="e.avatar"></image>
					<view class="cell-title">{{ e.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				friends: []
			}
		},
		computed: {
			...mapState([
				'base'
			])
		},
		onShow () {
			let self = this
			self.$set(self, 'friends', this.base.friends)
		},
		methods: {
			...mapActions([
				'ACT_APPLYCOUNT'
			]),
			/** 去到添加朋友页面 */
			addFriend() {
				uni.navigateTo({
					url: '../addFriend/addFriend',
					animationType: 'pop-in',
					animationDuration: 200
				})
				uni.removeTabBarBadge({
				  index: 1
				})
				this.ACT_APPLYCOUNT('0')
			},
			/** 去到朋友聊天 */
			friend_chat (e) {
				uni.navigateTo({
					url: '../chatting/friend_chat?uid=' + e.uid
				})
			}
		}
	}
</script>
