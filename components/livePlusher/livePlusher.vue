<template>
	<view class="content"></view>
</template>

<script>
	export default {
		props: {
			url:{
				type: String
			},
			messageList: {
				type: Array
			}
		},
		data() {
			return {
				pusher: null,
				startBtn: null,
				startText: '开始直播',
				liveStatus: 0
			}
		},
		created() {
			this.initLive()
			console.log(this.url)
		},
		methods: {
			initLive () {
				let that = this
				let currentWebview = that.$mp.page.$getAppWebview()  
				that.pusher = plus.video.createLivePusher("livePusher", {    
					url: that.url,
					beauty: 1,
					whiteness: 1,
					top:'0',
					left:'0',
					width: '100%',
					height: '100%'
				});
				that.startBtn = new plus.nativeObj.View('startBtn', { top: '80%', left: '20%', height: '50px', width: '60%' }, [
					{
						tag: 'rect',
						id: 'startrect',
						position: {
							width: '100%',
							left: '0px',
							height: '100%'
						},
						rectStyles: {
							color: '#FE2B54',
							radius: '20px'
						}
					}, {
						tag: 'font',
						id: 'startfont',
						text: that.startText,
						textStyles: {
							size: '20px',
							color: '#ffffff'
						},
						position: {
							width: '100%',
							left: '0px',
							height: '100%'
						}
					}
				]);
				
				that.chatBox = new plus.nativeObj.View('view', {
					position: 'absolute',
					width: '100%',
					height: '200rpx',
					bottom: '0',
					left: '0',
					background: 'green'
				})
				that.pusher.preview();
				currentWebview.append(that.pusher);
				currentWebview.append(that.startBtn);
				currentWebview.append(that.chatBox);
				
				// let html = ''
				// for (let i = 0; i < 100; i++) {
				// 	html = new plus.nativeObj.View('chatItem', {
				// 		width: '100%',
				// 		height: '40rpx',
				// 		color: '#fff'
				// 	}, [
				// 		{tag:'font',id:'font',text:'原生控件' + i,textStyles: {size:'18px'}}
				// 	])
				// 	// currentWebview.append(html)
				// }
				// that.chatBox.innerHTML = html
				console.log(that.chatBox.innerHTML)
				that.startBtn.addEventListener('click', function (event) {
					that.changeLive()
				})
			},
			changeLive () {
				console.log('点击')
				if (this.liveStatus) {
					this.pusher.pause()
					console.log('停止推送')
					this.liveStatus = 0
				} else {
					this.pusher.start((res) => {
						console.log('开始推送', res)
						this.liveStatus = 1
					}, (ret) => {
						console.log('推送失败', ret)
					})
				}
			}
		}
	}
</script>

<style>
	.content{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.chat-box{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: green;
	}
</style>
