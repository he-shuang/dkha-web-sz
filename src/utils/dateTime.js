// 中国标准时间format yyyy-mm-dd
const format = (time) => {
	let ymd = ''
	let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
	let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
	ymd += time.getFullYear() + '-' // 获取年份。
	ymd += mouth + '-' // 获取月份。
	ymd += day // 获取日。
	return ymd // 返回日期。
}

export const getAllDate = (start, end) => {
	let dateArr = []
	let startArr = start.split('-')
	let endArr = end.split('-')
	let db = new Date()
	db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2])
	let de = new Date()
	de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2])
	let unixDb = db.getTime()
	let unixDe = de.getTime()
	let stamp
	const oneDay = 24 * 60 * 60 * 1000;
	for (stamp = unixDb; stamp <= unixDe;) {
		dateArr.push(format(new Date(parseInt(stamp))))
		stamp = stamp + oneDay
	}
	return dateArr
}

export function getNowFormatDate(date) {
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
