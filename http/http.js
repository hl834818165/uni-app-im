/**
 * 封装http请求
 * */
 const ip = 'http://182.92.169.234:3000'
 // const ip = 'http://localhost:3000'
 export default {
	 getIp () {
		 return ip
	 },
	 httpRequest (url, method, header, param) {
		 return new Promise((resolve, reject) => {
			uni.request({
			 	url: ip + url,
				method: method,
				header: header | method == 'GET' ? {'Content-Type': 'application/json; charset=utf-8'} : {'Content-Type': 'application/json, text/plain, */*, charset=utf-8'},
				data: param,
				dataType: 'json'
			})
			.then(res => {
				if (res[1].data.code == -1) {
					uni.navigateTo({
					    url: '/pages/liveLogin/liveLogin'
					})
				}
				return resolve(res)
			})
			.catch(ret => {
				return reject(ret)
			})
		 })
	 }
 }