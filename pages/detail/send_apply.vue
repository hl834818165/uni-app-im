<template>
	<view class="content">
		<text class="gray-text">
			你需要发送验证申请，等对方通过
		</text>
		<view class="default-cell cell-item">
			<view class="cell-row">
				<view class="cell-title">
					<input type="text" class="uni-input" v-model="list.friend_remark" />
				</view>
			</view>
		</view>
		
		<view class="footer-operation pop__panel">
			<view class="pop__btn-primary pop__btn-default" @click="addApply">确定</view>
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
	import { mapState } from 'vuex'
	export default {
		data () {
			return {
				isGoBack: false,
				list: {
					uid: '',
					friend_uid: '',
					friend_remark: ''
				},
				logList: {
					show: false,
					title: ''
				}
			}
		},
		computed: {
			...mapState([
				'base'
			])
		},
		onShow () {
			this.$set(this, 'list', this.base.search_apply)
		},
		methods: {
			addApply () {
				api.addApply(this.list)
				.then(res => {
					let _res = res[1].data
					this.$set(this.logList, 'show', true)
					this.$set(this.logList, 'title', _res.msg)
					if (_res.code == 200 || _res.code == 102) {
						this.$set(this, 'isGoBack', true)
					} else {
						this.$set(this, 'isGoBack', false)
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			},
			logConfirm () {
				if (this.isGoBack) {
					uni.redirectTo({
						url: './friend_detail?redirect=true'
					})
				}
			}
		}
	}
</script>

<style>
</style>
