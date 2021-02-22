/**
 * 构建合并列数据
 * 思路：遍历所有数据，将需要合并的列的内容作为key，数据id作为value，然后依次遍历获取对应的合并列的行数
 * @param	dataList	列表数据
 * @param	label1		第1列合并的字段名称
 * @param   label2		第2列合并的字段名称
 * @param   label3		第3列合并的字段名称
 * @param   label4		第4列合并的字段名称
 */
export function buildMerge(dataList, label1 = 'label1', label2 = 'label2', label3 = 'label3', label4 = 'label4') {
	// 当列表数据没有主键时，添加主键
	if (dataList.length > 0 && (dataList[0].id !== 0 || dataList[0].id !== '0')) {
		dataList.forEach((item, index) => {
			item.id = [index]
		})
	}

	let firstObj = {},
		secondObj = {},
		thirdObj = {},
		fourthObj = {}
	let firstObjKey = '',
		secondObjKey = '',
		thirdObjKey = '',
		fourthObjKey = ''
	// 本示例合并的前四列，对应的字段分别：label1、label2、label3、label4
	// 如果你需要合并其他的字段，需修改此处字段名称
	for (let i = 0, len = dataList.length; i < len; i++) {
		firstObjKey = dataList[i][label1]
		secondObjKey = dataList[i][label2]
		thirdObjKey = dataList[i][label3]
		fourthObjKey = dataList[i][label4]

		if (!firstObj[firstObjKey])
			firstObj[firstObjKey] = new Array(dataList[i].id)
		else {
			firstObj[firstObjKey].push(dataList[i].id)
		}
		if (!secondObj[secondObjKey])
			secondObj[secondObjKey] = new Array(dataList[i].id)
		else {
			secondObj[secondObjKey].push(dataList[i].id)
		}
		if (!thirdObj[thirdObjKey])
			thirdObj[thirdObjKey] = new Array(dataList[i].id)
		else {
			thirdObj[thirdObjKey].push(dataList[i].id)
		}
		if (!fourthObj[fourthObjKey])
			fourthObj[fourthObjKey] = new Array(dataList[i].id)
		else {
			fourthObj[fourthObjKey].push(dataList[i].id)
		}
	}
	computeFirstSpan(dataList, firstObj, secondObj, thirdObj, fourthObj)
}
// 计算第一列合并总数
function computeFirstSpan(dataList, firstObj, secondObj, thirdObj, fourthObj) {
	// 遍历计算第一列合并行数
	for (let obj in firstObj) {
		let fristData = dataList.filter(d => d.id === firstObj[obj][0])[0]
		// 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
		if (fristData) fristData['firstSpan'] = firstObj[obj].length
		computeSecondSpan(dataList, firstObj[obj], secondObj, thirdObj, fourthObj)
	}
}

// 计算第二列合并总数
function computeSecondSpan(dataList, classList, secondObj, thirdObj, fourthObj) {
	let secondList = []
	// 遍历计算第二列合并行数
	for (let obj in secondObj) {
		// 判断两个id数组，取其并集，并集的长度就是合并列的行数
		let secondIds = secondObj[obj].filter(val => {
			return classList.indexOf(val) > -1
		})
		let fristData = dataList.filter(d => d.id === secondIds[0])[0]
		// 获取第一条数据，对其添加 'secondSpan' 属性，并设置值
		if (fristData) fristData['secondSpan'] = secondIds.length
		secondList.push(secondIds)
	}
	secondList.forEach(list => {
		computeThirdSpan(dataList, list, thirdObj, fourthObj)
	})
}
// 计算第三列合并总数
function computeThirdSpan(dataList, list, thirdObj, fourthObj) {
	let thirdList = []
	// 遍历计算第三列合并行数
	for (let obj in thirdObj) {
		let thirdIds = thirdObj[obj].filter(val => {
			return list.indexOf(val) > -1
		})
		let fristData = dataList.filter(d => d.id === thirdIds[0])[0]
		// 获取第一条数据，对其添加 'thirdSpan' 属性，并设置值
		if (fristData) fristData['thirdSpan'] = thirdIds.length
		thirdList.push(thirdIds)
	}
	thirdList.forEach(list => {
		computeFourthSpan(dataList, list, fourthObj)
	})
}
// 计算第四列合并总数
function computeFourthSpan(dataList, list, fourthObj) {
	// 遍历计算第四列合并行数
	for (let obj in fourthObj) {
		let fourthIds = fourthObj[obj].filter(val => {
			return list.indexOf(val) > -1
		})
		let fristData = dataList.filter(d => d.id === fourthIds[0])[0]
		// 获取第一条数据，对其添加 'fourthSpan' 属性，并设置值
		if (fristData) fristData['fourthSpan'] = fourthIds.length
	}
}
