export default {
	data() {
		return {
			systemCount: 0,
			electricData: {},
			electricArr: [], // 电流预警
			thermaArr: [], // 管道预警
			temp:{
				pm:0,
				temperature:0,
				humidity:0,
			}
		}
	},
	created() {
		this.systemCount = 0;
		this.initSystemWebsocket()
	},
	methods: {
		initSystemWebsocket() {
			let _this = this;
			// 尝试建立websocket连接
			try {
				let environment_websockt = new WebSocket(window.GLOBAL_CONFIG['socketURL']);
				// 监听socket连接
				environment_websockt.onopen = () => {
					console.log("websocket连接成功");
				};
				environment_websockt.onclose = () => {
					console.log("websocket连接已关闭");
				};
				environment_websockt.onerror = () => {
					console.log("websocket连接失败");
				};
				environment_websockt.onmessage = res => {
					let data = JSON.parse(res.data);
					// 环境传感器数据
					if (data.type == 1) {
						// 提交到Vuex
						_this.$store.commit('system/UPDATE_ENVIRONMENT_LIST', data.data.map(item => {
							if(item.mbdDevicesn == '20103'){
								this.temp={
									pm:item.pm,
									temperature:item.temperature,
									humidity:item.humidity
								}
							}
							
							return {
								...item,
								coordinate: item.coordinate.split(","),
								floorAddr: item.floorAddr.split(","),
							}
						}));
						// 存储到本地   避免刷新页面的时候  报警数据 消失
						// localStorage.setItem("shenzhen_school_environment_wangring", JSON.stringify(data.data))
					}
					// 宿舍用电报警数据和宿舍管道预警数据
					else if (data.type == 2 || (data.type == 4 && data.data.tfDevicetype < 4)) {
						console.log(data.type)
						data.data.tfaEcurrent = (data.data.tfaEcurrent * 1).toFixed(2) // 将预警值保留两位小数
						// 当缓存没有值
						if (!localStorage.getItem("electricData") && data.data.isAlarm) {
							_this.electricArr.unshift(data.data)
							localStorage.setItem("electricData", JSON.stringify(_this.electricArr))
						}
						// 当缓存有值
						else {
							_this.electricArr = JSON.parse(localStorage.getItem("electricData"))
							_this.electricArr = _this.electricArr.filter(item => {
								if (data.type == 4) {
									return item.IP != data.data.IP
								} else {
									return item.drNum != data.data.drNum
								}
							})
							if (data.data.isAlarm) {
								_this.electricArr.unshift(data.data)
							}
							if (_this.electricArr.length === 0) {
								localStorage.setItem("electricData", JSON.stringify([]))
							} else {
								localStorage.setItem("electricData", JSON.stringify(_this.electricArr))
							}
						}
					}
					// 大力热成像
					else if (data.type == 4 && data.data.tfDevicetype > 3) {
						data.data.tfaEcurrent = (data.data.tfaEcurrent * 1).toFixed(2) // 将预警值保留两位小数
						// 当缓存没有值
						if (!localStorage.getItem("thermaData") && data.data.isAlarm) {
							_this.thermaArr.unshift(data.data)
							localStorage.setItem("thermaData", JSON.stringify(_this.thermaArr))
						}
						// 当缓存有值
						else {
							_this.thermaArr = JSON.parse(localStorage.getItem("thermaData"))
							_this.thermaArr = _this.thermaArr.filter(item => {
								return item.IP != data.data.IP
							})
							if (data.data.isAlarm) {
								_this.thermaArr.unshift(data.data)
							}
							if (_this.thermaArr.length === 0) {
								localStorage.setItem("thermaData", JSON.stringify([]))
							} else {
								localStorage.setItem("thermaData", JSON.stringify(_this.thermaArr))
							}
						}
					}
				};

				// 关闭webscoket连接
				_this.$once("hook:beforeDestroy", () => {
					environment_websockt.close();
				});
				// 关闭或刷新浏览器 结束websocket连接
				window.addEventListener("beforeunload", () => {
					environment_websockt.close();
				});
			} catch (error) {
				console.error('链接websocket失败：', error);
				_this.systemCount++;
				// 失败建立连接 五次内失败  尝试重新连接
				if (_this.systemCount < 5) {
					_this.initSystemWebsocket();
				} else {
					_this.$confirm('建立websocket连接失败，环境传感器数据无法实时更新！是否重试?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						_this.systemCount = 0;
						_this.initSystemWebsocket();
					}).catch(() => {

					})
				}
			}
		}
	},
}
