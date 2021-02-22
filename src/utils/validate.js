/**
 * 非零正整数
 * @param {*} s
 */
export function isPositiveInteger(s) {
	return '^[1-9]\d*$'
}


/**
 * 邮箱
 * @param {*} 
 */
export function isEmail(rule, value, callback) {
	let regEmail = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	if (!value) {
		callback(new Error("请输入邮箱"))
	} else if (!regEmail.test(value)) {
		callback(new Error('请输入正确的邮箱'))
	} else {
		callback()
	}

}

/**
 * 联系电话
 * @param {*} s
 */
export function isMobile(rule, value, callback) {
	let regMobile = /^1[0-9]{10}$/;
	if (!value) {
		callback(new Error("请输入联系电话"))
	} else if (!regMobile.test(value)) {
		callback(new Error('请输入正确的联系电话'))
	} else {
		callback()
	}
}

/**
 * 联系电话
 * @param {*} s
 */
export function isPhone(rule, value, callback) {
	let regPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
	if (!value) {
		callback(new Error("请输入联系电话"))
	} else if (!regPhone.test(value)) {
		callback(new Error('请输入正确的联系电话'))
	} else {
		callback()
	}
}
/**
 * URL地址 路由处使用
 * @param {*} s
 */
export function isURL(s) {
	return /^http[s]?:\/\/.*/.test(s)
}

/**
 * URL地址 表单验证使用
 * @param {*} s
 */
export function isgetUrl(rule, value, callback) {
	let regUrl = /^http[s]?:\/\/.*/;
	if (!value) {
		callback(new Error("请输入URL地址"))
	} else if (!regUrl.test(value)) {
		callback(new Error('请输入正确的URL地址'))
	} else {
		callback()
	}
}

/**
 * QQ
 * @param {*} s
 */
export function isqq(rule, value, callback) {
	let regqq = /^[1-9][0-9]{4,}$/;
	if (!value) {
		callback(new Error("请输入QQ号码"))
	} else if (!regqq.test(value)) {
		callback(new Error('请输入正确的QQ号码'))
	} else {
		callback()
	}
}

/**
 * 传真号码
 * @param {*} s
 */
export function ischuanzhen(rule, value, callback) {
	let regCz = /^(\d{3,4}-)?\d{7,8}$/;
	if (!value) {
		callback(new Error("请输入传真号码"))
	} else if (!regCz.test(value)) {
		callback(new Error('请输入正确的传真号码'))
	} else {
		callback()
	}
}

/**
 * 护照
 * @param {*} s
 */
export function ishuzhao(rule, value, callback) {
	let regHz = /^([a-zA-z]|[0-9]){6,64}$/;
	if (!value) {
		callback(new Error("请输入护照"))
	} else if (!regHz.test(value)) {
		callback(new Error('请输入正确的护照'))
	} else {
		callback()
	}
}


/**
 * 开始时间大于结束时间
 * @param {*} s
 */
export function isDate(rule, value, callback) {
	if (!value) {
		callback(new Error("请选择时间"))
	}
}


/**
 * 经度
 * @param {*} s
 */
export function isLong(rule, value, callback) {
	//经度范围：-180.0000~180.0000;
	//let regLong=/^[\-\+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/;
	let lngState = -180 <= value && value <= 180
	if (!value) {
		callback(new Error("请输入经度"))
	} else if (!lngState) {
		//callback(new Error('请输入正确的经度'))
		callback(new Error('经度范围有误（-180<=经度<=180)'))
	} else {
		callback()
	}
}


/**
 * 纬度
 * @param {*} s
 */
export function isLat(rule, value, callback) {
	//纬度范围：-90.0000~90.0000
	//let regLat=/^[\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/;
	let latState = -90 <= value && value <= 90
	if (!value) {
		callback(new Error("请输入纬度"))
	} else if (!latState) {
		//callback(new Error('请输入正确的纬度'))
		callback(new Error('纬度范围有误（-90<=经度<=90)'))
	} else {
		callback()
	}
}


/**
 * 身份证 校验
 * @param {*} value    参数
 * @param {*} callback 回调函数
 */
export function idCardValidate(rule, value, callback) {
	if (!value) {
		callback(new Error("请输入身份证号码"))
	}
	//15位和18位的身份证号码的 正则
	let regIdCard =
		/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

	//如果通过该验证，说明身份证格式正确，但准确性还需计算
	if (regIdCard.test(value)) {
		if (value.length == 18) {
			let idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
			let idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
			let idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和

			for (var i = 0; i < 17; i++) {
				idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
			}
			let idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
			let idCardLast = value.substring(17); //得到最后一位身份证号码
			//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
			if (idCardMod == 2) {
				if (idCardLast == "X" || idCardLast == "x") {
					callback()
				} else {
					callback(new Error("身份证号码错误！"))
				}
			} else {
				//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
				if (idCardLast == idCardY[idCardMod]) {
					callback()
				} else {
					callback(new Error("身份证号码错误！"))
				}
			}
		} else {
			callback()
		}
	} else {
		callback(new Error("身份证格式不正确！"))
	}
}
/**
 * IP校验
 */
export function validateIP(rule, value, callback) {
	if (value === '') {
		callback(new Error("必填项不能为空"));
	} else {
		let IPv4 =
			/^((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))$/
		if (!IPv4.test(value)) {
			callback(new Error("IP格式错误"));
		}
		callback();
	}
}
