<template>
	<view class="content">
		<view class="default-cell" v-for="(e, i) in list" :key="i" :index="i" @click="chat(e)">
			<view class="cell-row">
				<image class="cell-avatar" :src="e.avatar"></image>
				<view class="cell-title">{{ e.name || e.friend_remark }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/api.js'
	export default {
		data () {
			return {
				list: []
			}
		},
		onShow () {
			this.$set(this, 'list', getApp().globalData.catting)
		},
		methods: {
			chat (e) {
				uni.navigateTo({
					url: '../chatting/friend_chat?uid=' + e.uid
				})
			}
		}
	}
</script>