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
	}
}
