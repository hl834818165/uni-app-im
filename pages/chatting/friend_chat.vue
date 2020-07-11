<template>
	<view class="content friend_chat">
		
		<view class="chatting">
			<view class="cont">
				<scroll-view
					:scroll-into-view="scrollTo"
					scroll-y="true"
					class="scroll-Y"
					:style="{ height: getContH + 'px' }"
					scroll-with-animation
					scroll-anchoring
					refresher-background="#F8F8F8"
					:refresher-enabled="enabled"
					:refresher-triggered="triggered"
					@refresherrefresh="reStart">
						<view class="chat-thumb" v-show="!enabled">没有更多了</view>
						<view :class="[list.from != e.fromid ? 'cont_l' : 'cont_r', 'default-cell']" :id="'view'+ e.cid" v-for="(e, i) in chatList" :key="i" :index="i">
							
							<view class="chat-thumb" v-show="e.hasTimeTip">{{ e.hasTimeTip }}</view>
							<view class="cell-row chat-row">
								<image class="cell-avatar" :src="e.avatar"></image>
								<view class="cell-chatText">{{ e.content }}</view>
							</view>
						</view>
				</scroll-view>
			</view>
			<view class="msg">
				<input class="send-inp uni-input" type="text" v-model="list.content" />
				<view class="send-btn" @click="sendMsg">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loadRefresh from '../../components/load-refresh/load-refresh.vue'
	import api from '../../api/api.js'
	import unit from '../../unit/unit.js'
	export default {
		components: {
			loadRefresh
		},
		data () {
			return {
				ops: null,
				chatList: [],
				scrollTo: '',
				scrollH: 0,
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
		onLoad (ops) {
			this.ops = ops
		},
		onShow () {
			this.init(this.ops)
		},
		watch: {
			// 计算 初始 是否超过20条
			'chatList': {
				handler (val, oldVal) {
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
		computed: {
			getContH () {
				this.getContHFn('.cont')
				return this.scrollH
			}
		},
		methods: {
			init (ops) {
				let self = this
				self.$set(self.list, 'to', ops.uid)
				self.$set(self.list, 'from', getApp().globalData.mine.username)
				self.$set(self, 'now', getApp().globalData.catting['friend-' + ops.uid].chatting.length ? getApp().globalData.catting['friend-' + ops.uid].chatting[0] : {})
				self.$set(self, 'chatList', getApp().globalData.catting['friend-' + ops.uid].chatting)
				/** 设置超过5分钟的消息提示 */
				self.chatList.length ? self.chatList.reduce(self.difference) : ''
				self.$set(self, 'currentPage', getApp().globalData.catting['friend-' + ops.uid].currentPage || 1)
				self.$set(self, 'hasNo', getApp().globalData.catting['friend-' + ops.uid].hasNo != undefined ? getApp().globalData.catting['friend-' + ops.uid].hasNo : false)
				self.$set(self, 'enabled', getApp().globalData.catting['friend-' + ops.uid].enabled != undefined ? getApp().globalData.catting['friend-' + ops.uid].enabled : true)
				/** 初始 自动滚底 */
				self.$nextTick(function(){
					self.scrollBottom()
				})
				/** 接收到消息 让消息自动滚底 */
				self.socketOn('friend-' + ops.uid, (_) => {
					self.$nextTick(function(){
						self.scrollBottom()
					})
				})
			},
			/** 判断 数组 相邻数据是否超过 5分钟 */
			difference (_now, arg) {
				if (!_now || !arg || !_now.date_time || !arg.date_time) return false
				if ((arg.date_time - _now.date_time) > (5*60*1000)) {
					arg.hasTimeTip = unit.dateConvert({
						date: arg.date_time,
						dateFormat: 'MM-DD hh:mm'
					})
				}
				this.now = arg
			  return this.now
			},
			/** 下拉加载更多 */
			reStart (e) {
				let self = this
				if (self.hasNo) {
					this.triggered = true
					return false
				}
				this.triggered = true
				self.currentPage++
				getApp().globalData.catting['friend-' + self.list.to].currentPage = self.currentPage
				uni.getStorage({
					key: 'mine',
					success: (res) => {
						let _res = JSON.parse(res.data)
						self.getFriendChatting(_res)
					}
				})
				getApp().globalData.catting['friend-' + self.list.to].hasNo = self.hasNo = true
			},
			/** 获取元素高度 */
			getContHFn (target) {
				this.$nextTick(function(){
					const query = uni.createSelectorQuery().in(this)
					query.select(target).boundingClientRect(_ => {
						this.scrollH = _.height
					}).exec()
				})
			},
			sendMsg () {
				this.send(this.list)
			},
			/** 自动滚底 */
			scrollBottom() {
				let self = this;
				if (!self.chatList.length) return false
				self.$nextTick(function () {
					self.scrollTo = "view" + self.chatList[self.chatList.length - 1].cid;
				})
			},
			/** 获取好友消息列表 */
			getFriendChatting (_res) {
				let self = this
				api.getFriendChatting({
					uid: self.list.to,
					friend_uid: _res.username,
					currentPage: self.currentPage
				})
				.then(r => {
					let _r = r[1].data
					if (_r.code == 200) {
						if (_r.data.length != self.pageSize) {
							getApp().globalData.catting['friend-' + self.list.to].hasNo = self.hasNo = true
							getApp().globalData.catting['friend-' + self.list.to].enabled = self.enabled = false
						} else {
							getApp().globalData.catting['friend-' + self.list.to].hasNo = self.hasNo = false
						}
						_r.data.reduce(this.difference)
						self.now = {}
						[_r.data[_r.data.length - 1], self.chatList[0]] = [_r.data[_r.data.length - 1], self.chatList[0]].reduce(this.difference)
						self.chatList = getApp().globalData.catting['friend-' + self.list.to].chatting = _r.data.concat(getApp().globalData.catting['friend-' + self.list.to].chatting)
						self.triggered = false
					}
				})
			},
			/** 发送消息 */
			send (param) {
				let self = this
				api.send(param)
				.then(res => {
					let _res = res[1].data
					if (_res.code == 200) {
						api.getMessage({
							cid: _res.data
						})
						.then(r => {
							let _r = r[1].data
							self.chatList.push(_r.data[0])
							self.scrollBottom()
						})
						self.$nextTick(function(){
							self.now = {}
							[self.chatList[self.chatList.length - 2], self.chatList[self.chatList.length - 1]] = [self.chatList[self.chatList.length - 2], self.chatList[self.chatList.length - 1]].reduce(this.difference)
						})
						self.$nextTick(function(){
							self.list.content = ''
						})
					}
				})
				.catch(ret => {
					console.log(ret)
				})
			}
		}
	}
</script>

<style scoped>
	.msg {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #F4F4F4;
		padding: 0 36rpx;
		height: 85rpx;
	}
	.msg .send-inp {
		flex: 1;
		height: 60rpx;
		background: #FFFFFF;
		text-indent: 1em;
	}
	.msg .send-btn {
		margin-left: 36rpx;
	}
	
	.hollow-dots-spinner, .hollow-dots-spinner * {
	  box-sizing: border-box;
	}
	
	.hollow-dots-spinner {
	  height: 100rpx;
	  width: 100%;
	}
	
	.hollow-dots-spinner .dot {
	  width: 15px;
	  height: 15px;
	  margin: 0 calc(15px / 2);
	  border: calc(15px / 5) solid #04C4C4;
	  border-radius: 50%;
	  float: left;
	  transform: scale(0);
	  animation: hollow-dots-spinner-animation 1000ms ease infinite 0ms;
	}
	
	.hollow-dots-spinner .dot:nth-child(1) {
	  animation-delay: calc(300ms * 1);
	}
	
	.hollow-dots-spinner .dot:nth-child(2) {
	  animation-delay: calc(300ms * 2);
	}
	
	.hollow-dots-spinner .dot:nth-child(3) {
	  animation-delay: calc(300ms * 3);
	
	}
	
	@keyframes hollow-dots-spinner-animation {
	  50% {
		transform: scale(1);
		opacity: 1;
	  }
	  100% {
		opacity: 0;
	  }
	}
</style>
