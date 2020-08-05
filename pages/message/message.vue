<template>
	<view class="content">
		<view class="default-cell" v-for="(e, i) in list" :key="i" :index="i" @click="chat(e)">
			<view class="cell-row">
				<view class="cell-avatar-tip">
					<image :class="['cell-avatar']" :src="e.avatar">
					</image>
					<view class="tipShow" v-show="e.chatCount">{{ e.chatCount }}</view>
				</view>
				<view class="cell-item">
					<view class="cell-title">{{ e.friend_remark }}</view>
					<view class="cell-cont">{{ e.end_cont }}</view>
				</view>
				<view class="cell-operation-tip">
					{{ e.end_date }}
				</view>
			</view>
		</view>
		<view v-show="false">{{ isTrue }}</view>
	</view>
</template>
<script>
	import api from '../../api/api.js'
	import { mapState } from 'vuex'
	export default {
		data () {
			return {
				list: [],
				isTrue: false
			}
		},
		computed: {
			...mapState([
				'base'
			])
		},
		watch: {
			'base.chatting': {
				handler (val, oldVal) {
					this.$set(this, 'isTrue', !this.isTrue)
				},
				deep: true
			}
		},
		onShow () {
			this.$set(this, 'list', this.base.chatting)
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