export default {
	state: {
		emoji: ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😠'],
		mine: {},
		countChat: 0,
		friends: [],
		applyCount: 0,
		applys: [],
		search_apply: {},
		chatting: {}
	},
	mutations: {
		// 初始vuex
		MUT_INIT (state) {
			state.mine = Object.assign({}, {})
			state.countChat = 0
			state.friends = []
			state.applyCount = 0
			state.applys = []
			state.search_apply = Object.assign({}, {})
			state.chatting = Object.assign({}, {})
		},
		// 赋值 mine
		MUT_MINE (state, value) {
			state.mine = Object.assign({}, value)
		},
		MUT_COUNTCHAT (state, value) {
			state.countChat = value
		},
		// 赋值 firends
		MUT_FRIENDS (state, value) {
			state.friends = value
		},
		MUT_FRIENDS_PUSH (state, value) {
			state.friends.push(value)
		},
		// 赋值 申请好友 标记数量
		MUT_APPLYCOUNT (state, value) {
			state.applyCount = value
		},
		// 赋值 applys
		MUT_APPLYS (state, value) {
			state.applys = value
		},
		// 添加 applys
		MUT_APPLYS_PUSH (state, value) {
			state.applys.push(value)
		},
		MUT_SEARCH_APPLY (state, value) {
			state.search_apply = Object.assign({}, value)
		},
		MUT_CHATTING (state, value) {
			state.chatting = Object.assign({}, value)
		}
	},
	actions: {
		// 初始vuex
		ACT_INIT (content) {
			content.commit('MUT_INIT')
		},
		ACT_COUNTCHAT (content, value) {
			content.commit('MUT_COUNTCHAT', value)
		},
		// 赋值 mine
		ACT_MINE (content, value) {
			content.commit('MUT_MINE', value)
		},
		// 赋值 firends
		ACT_FRIENDS (content, value) {
			content.commit('MUT_FRIENDS', value)
		},
		
		ACT_FRIENDS_PUSH (content, value) {
			content.commit('MUT_FRIENDS_PUSH', value)
		},
		// 赋值 申请好友 标记数量
		ACT_APPLYCOUNT (content, value) {
			content.commit('MUT_APPLYCOUNT', value)
		},
		// 赋值 applys
		ACT_APPLYS (content, value) {
			content.commit('MUT_APPLYS', value)
		},
		// 添加 applys
		ACT_APPLYS_PUSH (content, value) {
			content.commit('MUT_APPLYS_PUSH', value)
		},
		ACT_SEARCH_APPLY (content, value) {
			content.commit('MUT_SEARCH_APPLY', value)
		},
		ACT_CHATTING (content, value) {
			content.commit('MUT_CHATTING', value)
		}
	}
}