import Base from '../../base/base.js'
export default class Mine extends Base {
  loginOut () {
    this.heartReset()
  	// 重置vuex
    this.vm.ACT_INIT()
    this.socketEmit('close', {
      data: this.vm.list.username
    })
    this.socketClose()
    uni.reLaunch({
      url: '../login/login'
    })
  }
}