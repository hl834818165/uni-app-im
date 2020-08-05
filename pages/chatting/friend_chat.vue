<template>
	<view class="content friend_chat">
		
		<view class="chatting">
			<view class="cont" @click="hideCard">
				<scroll-view
					:scroll-into-view="scrollTo"
					scroll-y="true"
					class="scroll-Y"
					:style="{ height: '100%' }"
					scroll-with-animation
					scroll-anchoring
					refresher-background="#F8F8F8"
					:refresher-enabled="enabled"
					:refresher-triggered="triggered"
					@refresherrefresh="reStart">
						<view class="chat-thumb" v-show="!enabled">没有更多了</view>
						<view :class="[list.from != e.fromid ? 'cont_l' : 'cont_r', 'default-cell']" :id="'view'+ e.cid" v-for="(e, i) in chatList" :key="i" :index="i">
							<view class="chat-thumb" v-show="e.hasTimeTip">{{ e.hasTimeTip }}</view>
							<view :class="['cell-row', 'chat-row', e.message == 'voice' ? 'center' : '']">
								<image class="cell-avatar" :src="e.avatar"></image>
								<view class="cell-chatText" v-if="e.message == 'text'">{{ e.content }}</view>
								<view class="cell-chatImage" v-else-if="e.message == 'file'">
									<!-- 后续加入视频 等其他格式文件展示 根据后缀判断 -->
									<image style="max-width: 250rpx;" mode="widthFix" :src="e.content"></image>
								</view>
								<view class="cell-chatText voice" v-else-if="e.message == 'voice'" @click="playVoice(e)">
									<view :class="[e.cid == playNow ? 'active' : '', 'voice-item']">
										<view class="item-li"></view>
										<view class="item-li"></view>
										<view class="item-li"></view>
									</view>
									<view class="voice-time">{{ e.voice_len }}”</view>
									<view class="voice-bar" v-show="e.new_voice == 'old'"></view>
								</view>
								<view v-else></view>
							</view>
						</view>
				</scroll-view>
			</view>
			<hl-chat-box class="hlChatBox" ref="hlChatBox" @sendMsg="sendMsg" @sendImg="sendImg" @sendVoice="sendVoice"></hl-chat-box>
		</view>
	</view>
</template>

<script>
	let friendChat = null
	import FriendChat from './friend_chat.js'
	import hlChatBox from '../../components/hl-chat-box/hl-chat-box.nvue'
	import loadRefresh from '../../components/load-refresh/load-refresh.vue'
	import { mapState, mapActions } from 'vuex'
	export default {
		components: {
			loadRefresh,
			hlChatBox
		},
		data () {
			return {
				windowH: null,					// 屏幕高度
				emoji: [],							// 表情库
				ops: null,							// 浏览器携带参数
				chatList: [],						// 聊天记录
				scrollTo: '',						// 滚动到某个标签
				playNow: '',						// 当前播放的audio
				innerAudioContext: null, //
				now: {},
				needWatch: true,
				enabled: true,
				triggered: false,
				hasNo: false,
				list: {
					to: '',
					from: '',
					message: '',
					content: '',
					type: 'friend'
				},
				currentPage: 1,
				pageSize: 20,
				totalPage: 0
			}
		},
		computed: {
			...mapState([
				'base'
			])
		},
		onLoad (ops) {
			this.ops = ops
			friendChat = new FriendChat(this)
		},
		onShow () {
			friendChat.init(this.ops)
		},
		// 页面卸载 修改阅读时间
		onUnload () {
			let time = new Date().getTime()
			// 设置消息总数  删减
			this.ACT_COUNTCHAT(
				this.base.countChat - this.base.chatting['friend-' + this.ops.uid].chatCount
			)
			if (this.base.countChat <= 0) {
				uni.removeTabBarBadge({
				  index: 0
				})
			} else {
				uni.setTabBarBadge({
					index: 0,
					text: String(this.base.countChat)
				})
			}
			// 清除查阅目标未读数量
			friendChat.lookChat({
				last_time: String(time),
				last_mid: this.chatList[this.chatList.length - 1].id,
				uid: this.base.mine.username,
				friend_uid: this.ops.uid
			})
		},
		watch: {
			// 计算 初始 是否超过20条
			'chatList': {
				handler (val, oldVal) {
					// 设置接收消息无法滚底
					if (val.length == oldVal.length) {
						friendChat.scrollBottom()
					}
					if (!this.needWatch) return false
					if (val.length < this.pageSize) {
						this.hasNo = true
						this.enabled = false
					} else {
						this.hasNo = false
						this.needWatch = false
					}
				}
			}
		},
		methods: {
			...mapActions([
				'ACT_CHATTING',
				'ACT_COUNTCHAT'
			]),
			/** 发送消息回调 */
			sendMsg (data) {
				this.list.content = data
				this.list.message = 'text'
				friendChat.send(this.list)
				this.hideCard()
			},
			/** 发送图片 */
			sendImg (data) {
				this.list.content = data
				this.list.message = 'file'
				friendChat.send(this.list)
				this.hideCard()
			},
			/** 发送语音消息 */
			sendVoice (data) {
				this.list.content = data.res
				this.list.message = 'voice'
				this.list.voice_len = data.voice_len
				friendChat.send(this.list)
				this.hideCard()
			},
			/** 播放语音消息 */
			playVoice (e) {
				if (this.innerAudioContext) this.innerAudioContext.destroy()
				this.innerAudioContext = uni.createInnerAudioContext()
				if (this.playNow == e.cid) {
					this.$set(this, 'playNow', '')
					this.innerAudioContext.stop()
				} else {
					this.$set(this, 'playNow', e.cid)
					this.innerAudioContext.src = e.content
					this.innerAudioContext.play()
				}
				this.innerAudioContext.onEnded(() => {
					this.$set(this, 'playNow', '')
				})
			},
			hideCard () {
				friendChat.hideCard()
			},
			reStart () {
				friendChat.reStart()
			}
		}
	}
</script>