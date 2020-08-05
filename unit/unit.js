export default {
	/**
	 * @param {  date dateFormat } args
	 */
	dateConvert(args) {
		let reg = /Y{4}|M{1,4}|D{1,2}|h+|m{1,2}|s{1,2}/g
		let newDate = new Date(Number(args.date))
		let _date = {
			YYYY: newDate.getFullYear(),
			MM: (newDate.getMonth() + 1) >= 10 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1),
			M: newDate.getMonth() + 1,
			DD: newDate.getDate() >= 10 ? newDate.getDate() : '0' + newDate.getDate(),
			D: newDate.getDate(),
			hh: newDate.getHours() >= 10 ? newDate.getHours() : '0' + newDate.getHours(),
			h: newDate.getHours(),
			mm: newDate.getMinutes() >= 10 ? newDate.getMinutes() : '0' + newDate.getMinutes(),
			m: newDate.getMinutes(),
			ss: newDate.getSeconds() >= 10 ? newDate.getSeconds() : '0' + newDate.getSeconds(),
			s: newDate.getSeconds()
		}
		return args.dateFormat.replace(reg, (_) => {
			return _date[_]
		})
	},
	// 数组分割成多个数组
	splitArr (arr, num) {
    let _arr = []
    for (var i = 0; i < arr.length; i++) {
			_arr[Math.floor(i/num)] ? '' : _arr[Math.floor(i/num)] = []
			_arr[Math.floor(i/num)].push(arr[i])
    }
    return _arr
	},
	arrSum (arr, target) {
		let num = 0
		for (var i = 0; i < arr.length; i++) {
			num += arr[target]
		}
		return num > 99 ? 99 : num
	},
	// 更新消息列表 最新展示
	updateList (chatting, target, pary) {
		chatting['friend-' + target].end_cont = pary && pary.content ? pary.content : ''
		chatting['friend-' + target].end_date = pary && pary.date_time ? this.dateConvert({
			date: pary.date_time,
			dateFormat: 'hh:mm'
		}) : ''
		chatting['friend-' + target].chatCount = this.chatCount(chatting['friend-' + target].chatting, chatting['friend-' + target].last_time, target)
		return chatting
	},
	// 播放消息提示音
	playTim () {
		const timAudio = uni.createInnerAudioContext();
		timAudio.src = '../../static/chat/mp3.wav';
		timAudio.play()
	},
	/**
	 * 
	 * @param {聊天记录} arr 
	 * @param {未读之前的时间} lastT 
	 * @param {聊天记录 判断条件} pary 
	 */
	chatCount (arr, lastT, pary) {
		let _arr = []
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]['fromid'] == pary) {
				if (arr[i].date_time > lastT) {
					_arr.push(arr[i])
				}
			}
		}
		return _arr.length > 99 ? 99 : _arr.length
	},
	readCount (arr, lastT, isChatting) {
		let _arr = []
		lastT = lastT ? lastT : '0'
		arr.forEach((e, i) => {
			if (isChatting) {
				if (e.chat_state == 'chatting') return false	
			}
			if (e.date_time > lastT) {
				_arr.push(e)
			}
		})
		return _arr.length > 99 ? 99 : _arr.length
	},
	// 设置朋友列表消息数量标记
	// setFriend () {
	// 	uni.setTabBarBadge({
	// 	  index: 1,
	// 	  text: String(unit.readCount(gd.applys, gd.mine.apply_last_time))
	// 	})
	// }
}
