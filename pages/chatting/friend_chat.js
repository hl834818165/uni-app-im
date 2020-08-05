import Base from '../../base/base.js'
import api from '../../api/api.js'
import unit from '../../unit/unit.js'
export default class FriendChat extends Base {
  /** 初始 */
  init (ops) {
    let self = this
    self.vm.$set(self.vm.list, 'to', ops.uid)
    self.vm.$set(self.vm.list, 'from', self.vm.base.mine.username)
    if (!self.vm.base.chatting['friend-' + ops.uid]) {
      self.getFriendChat(self.vm.base.chatting, {
        username: self.vm.list.from,
        to: self.vm.list.to,
        chat_state: ''
      }, () => {
        self.initSet(ops)
      })
    } else {
      self.initSet(ops)
    }
  }
  initSet (ops) {
    let self = this
    self.vm.$set(self.vm, 'now', self.vm.base.chatting['friend-' + ops.uid].chatting.length ? self.vm.base.chatting['friend-' + ops.uid].chatting[0] : {})
    self.vm.$set(self.vm, 'chatList', self.vm.base.chatting['friend-' + ops.uid].chatting)
    /** 设置超过5分钟的消息提示 */
    self.vm.chatList.length ? self.vm.chatList.reduce(self.difference.bind(self.vm, arguments)) : ''
    self.vm.$set(self.vm, 'currentPage', self.vm.base.chatting['friend-' + ops.uid].currentPage || 1)
    self.vm.$set(self.vm, 'hasNo', self.vm.base.chatting['friend-' + ops.uid].hasNo != undefined ? self.vm.base.chatting['friend-' + ops.uid].hasNo : false)
    self.vm.$set(self.vm, 'enabled', self.vm.base.chatting['friend-' + ops.uid].enabled != undefined ? self.vm.base.chatting['friend-' + ops.uid].enabled : true)
    /** 初始 自动滚底 */
    self.vm.$nextTick(function(){
      self.scrollBottom()
    })
  }
  /** 自动滚底 */
  scrollBottom() {
    let self = this;
    if (!self.vm.chatList.length) return false
    self.vm.$nextTick(function () {
      self.vm.scrollTo = "view" + self.vm.chatList[self.vm.chatList.length - 1].cid;
    })
  }
  /** 判断 数组 相邻数据是否超过 5分钟 */
  difference (_now, arg) {
    if (!_now || !arg || !_now.date_time || !arg.date_time) return false
    if ((arg.date_time - _now.date_time) > (5*60*1000)) {
      arg.hasTimeTip = unit.dateConvert({
        date: arg.date_time,
        dateFormat: 'MM-DD hh:mm'
      })
    }
    this.vm.now = arg
    return this.vm.now
  }
  /** 下拉加载更多 */
  reStart (e) {
    let self = this
    if (self.vm.hasNo) {
      self.vm.triggered = true
      return false
    }
    self.vm.triggered = true
    self.vm.currentPage++
    self.vm.base.chatting['friend-' + self.vm.list.to].currentPage = self.vm.currentPage
    self.getFriendChatting(self.vm.base.mine)
    self.vm.base.chatting['friend-' + self.vm.list.to].hasNo = self.vm.hasNo = true
  }
  // 隐藏输入内容卡 （表情卡 更多类卡）
  hideCard () {
    this.vm.$refs['hlChatBox'].hideEmoji()
    this.vm.$refs['hlChatBox'].hideMore()
  }
  getFriendChat (chatting, _res, callback) {
		let self = this
		api.getFriendChat({
			friend_uid: _res.username,
      uid: _res.to || '',
      chat_state: _res.chat_state
		})
		.then(async (r) => {
			let _r = r[1].data
			if (_r.code == 200) {
				await _r.data.forEach((e) => {
					
					// 设置消息总数  初始
					if (!_res.to) {
						self.vm.ACT_COUNTCHAT(
							self.vm.base.countChat + e.chatCount
						)
					}

					chatting['friend-' + e.uid] = e
					unit.updateList(chatting, e.uid, e.chatting[e.chatting.length - 1])
					self.socketOn('friend-' + e.uid, (_) => {
						api.getMessage({
							cid: _.data
						})
						.then(res => {
							let _res = res[1].data
							if (_res.code == 200) {
								chatting['friend-' + e.uid].chatting.push(_res.data[0])
								unit.updateList(chatting, e.uid, _res.data[0])
								
								// 设置消息总数  叠加
								self.vm.ACT_COUNTCHAT(
									self.vm.base.countChat+1
								)
								if (self.vm.base.countChat <= 0) {
									uni.removeTabBarBadge({
										index: 0
									})
								} else {
									uni.setTabBarBadge({
										index: 0,
										text: String(self.vm.base.countChat)
									})
								}

								// 手机震动
								uni.vibrateLong()
								unit.playTim()
								self.heartStart()
							}
						})
					})
				})
				self.vm.ACT_CHATTING(self.vm.base.chatting)
				if (self.vm.base.countChat) {
					uni.setTabBarBadge({
						index: 0,
						text: String(self.vm.base.countChat)
					})
				}
				callback ? callback() : ''
			}
		})
	}
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
          self.vm.chatList.push(_r.data[0])
          // 发送消息 更新列表显示 最新消息内容
          unit.updateList(self.vm.base.chatting, self.vm.list.to, _r.data[0])
          self.vm.ACT_CHATTING(self.vm.base.chatting)
          self.scrollBottom()
        })
        self.vm.$nextTick(function(){
          self.vm.now = {}
          [self.vm.chatList[self.vm.chatList.length - 2], self.vm.chatList[self.vm.chatList.length - 1]] = [self.vm.chatList[self.vm.chatList.length - 2], self.vm.chatList[self.vm.chatList.length - 1]].reduce(self.difference.bind(self.vm, arguments))
          self.vm.$refs['hlChatBox'].clearContent()
          self.vm.$set(self.vm.list, 'content', '')
        })
      }
    })
    .catch(ret => {
      console.log(ret)
    })
  }
  /** 获取更多消息记录 */
  getFriendChatting (_res) {
    let self = this
    api.getFriendChatting({
      uid: self.vm.list.to,
      friend_uid: _res.username,
      currentPage: self.currentPage
    })
    .then(r => {
      let _r = r[1].data
      if (_r.code == 200) {
        if (_r.data.length != self.pageSize) {
          self.vm.base.chatting['friend-' + self.vm.list.to].hasNo = self.vm.hasNo = true
          self.vm.base.chatting['friend-' + self.vm.list.to].enabled = self.vm.enabled = false
        } else {
          self.vm.base.chatting['friend-' + self.vm.list.to].hasNo = self.vm.hasNo = false
        }
        _r.data.reduce(self.difference.bind(self.vm, arguments))
        self.vm.now = {}
        [_r.data[_r.data.length - 1], self.vm.chatList[0]] = [_r.data[_r.data.length - 1], self.vm.chatList[0]].reduce(self.difference.bind(self.vm, arguments))
        self.vm.chatList = self.vm.base.chatting['friend-' + self.vm.list.to].chatting = _r.data.concat(self.vm.base.chatting['friend-' + self.vm.list.to].chatting)
        self.vm.triggered = false
      }
    })
  }
  lookChat (param) {
    let self = this
    api.lookChat(param)
    .then(res => {
      let _r = res[1].data
      if (_r.code == 200) {
        let chatting = self.vm.base.chatting
        let target = param.friend_uid
        chatting['friend-' + target].last_time = param.last_time
		    chatting['friend-' + target].chatCount = unit.chatCount(chatting['friend-' + target].chatting, chatting['friend-' + target].last_time, target)
        self.vm.ACT_CHATTING(chatting)
      }
    })
  }
}