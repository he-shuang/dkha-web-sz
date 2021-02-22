export default {
	data() {
		return {
			uwbCount: 0, // socket连接次数计数
			keyArr: ["1f", "2f", "3f", "4f", "5f"], // Y
			series: [], // X
			total: 0, // 楼层总人数
			uwbLabelTypeList: {}, // 后端返回的标签分类及每种类型的标签ID
			uwbLabel: {
				studentUwb: '学生',
				teacherUwb: '教师',
				// cleaningUwb: '后勤',
				// securityUwb: '安保',
				visitorUwb: '访客',
				// importantUwb: '重控设施',
				other: '其它'
			}
		}
	},
	created() {
		this.uwbCount = 0;
		this.initUwbLabelType().then(() => {
			this.initUwbWebsocket();
		});
	},
	activated() {
		// 每隔 1分钟 请求最新标签type
		let timer = setInterval(() => {
			this.initUwbLabelType();
		}, 60 * 1000);
		this.$once("hook:beforeDestroy", () => {
			clearInterval(timer)
		})
		this.$once("hook:deactivated", () => {
			clearInterval(timer)
		})
	},
	methods: {
		initUwbLabelType() {
			return this.$http({
				url: "/system/index/uwbLabelType",
				method: "get"
			}).then(({
				data: res
			}) => {
				if (res.code != 0) {
					return this.$message.error(res.msg)
				}
				this.uwbLabelTypeList = res.data;
			})
		},
		initUwbWebsocket() {
			let _this = this;
			// 尝试建立websocket连接
			try {
				let uwb_websockt = new WebSocket(window.GLOBAL_CONFIG.UWB_WEBSOCKET);
				// 监听socket连接
				uwb_websockt.onopen = () => {
					console.log("websocket连接成功");
					let params = JSON.stringify({
						type: 1,
						map_id: "14",
					})
					uwb_websockt.send(params)
				};
				uwb_websockt.onclose = () => {
					console.log("websocket连接已关闭");
				};
				uwb_websockt.onerror = () => {
					console.log("websocket连接失败");
				};
				uwb_websockt.onmessage = res => {
					if (res.data != "heartbeat") {
						let data = JSON.parse(res.data)
						// let statics = {};
						// // 统计对应楼层人数
						// data.forEach(item => {
						//     if (statics[item.floor]) {
						//         statics[item.floor]++
						//     } else {
						//         statics[item.floor] = 1
						//     }
						// });
						// this.keyArr = Object.keys(statics).sort()
						// let newXData = []
						// for (let i = 0; i < this.keyArr.length; i++) {
						//     newXData.push(statics[this.keyArr[i]])
						// }
						// // 和上一次提送数据比较，如果相同，不渲染echarts
						// if (JSON.stringify(newXData) !== JSON.stringify(this.seriesData)) {
						//     this.seriesData = newXData
						//     this.total = this.seriesData.reduce(function(prev, curr, idx, arr) {
						//         return prev + curr;
						//     });
						//     this.draw()
						// };
						// 人数分类分楼层统计
						let temList = this.uwbLabelTypeList;
						let typeList = {
							studentUwb: [],
							teacherUwb: [],
							// cleaningUwb: [],
							// securityUwb: [],
							visitorUwb: [],
							// importantUwb: [],
							other: []
						};
						// 先分类
						// for (var key in typeList) {
						//     typeList[key] = data.filter(item => {
						//         return temList[key].includes(item.tid.toString())
						//     })
						// }
						//先分类
						data.forEach(item => {
							let uwbId = item.tid.toString();
							// 学生
							if (temList.studentUwb.includes(uwbId)) {
								typeList.studentUwb.push(item)
							}
							// 教师
							else if (temList.teacherUwb.includes(uwbId)) {
								typeList.teacherUwb.push(item)
							}
							// 访客
							else if (temList.visitorUwb.includes(uwbId)) {
								typeList.visitorUwb.push(item)
							}
							// 其它  供调试使用
							else {
								typeList.other.push(item)
							}
						})
						let series = [];
						// 再按照分类 统计不同楼层人数
						for (let key in typeList) {
							let temp = {};
							typeList[key].forEach(item => {
								if (temp[item.floor]) {
									temp[item.floor]++
								} else {
									temp[item.floor] = 1
								}
							})
							// 获取楼层排序后的键值
							let keyArr = this.keyArr;
							// 序列化后的 楼层统计人数
							let newXData = []
							for (let i = 0; i < keyArr.length; i++) {
								newXData.push(temp[keyArr[i]] || '')
							}
							// floors[key] = newXData;
							series.push({
								name: this.uwbLabel[key],
								type: 'bar',
								stack: '总人数',
								barMaxWidth: 20,
								barMinHeight: 20,
								label: {
									show: true,
									position: 'inside'
								},
								data: newXData
							})
						}
						// 和上一次提送数据比较，如果相同，不渲染echarts
						if (JSON.stringify(this.series) != JSON.stringify(series)) {
							this.series = series;
							this.draw();
						}
					}
				};

				// 销毁时关闭webscoket
				_this.$once("hook:beforeDestroy", () => {
					uwb_websockt.close();
				});
				// 切换页面时关闭websocket
				_this.$once("hook:deactivated", () => {
					uwb_websockt.close();
				});
				// 关闭或刷新浏览器 结束websocket连接
				window.addEventListener("beforeunload", () => {
					uwb_websockt.close();
				});
			} catch (error) {
				console.error('链接websocket失败：', error);
				_this.uwbCount++;
				// 失败建立连接 五次内失败  尝试重新连接
				if (_this.uwbCount < 5) {
					_this.initUwbWebsocket();
				} else {
					_this.$confirm('建立websocket连接失败，无法实时获取楼层人数！是否重试?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						_this.uwbCount = 0;
						_this.initUwbWebsocket();
					}).catch(() => {

					})
				}
			}
		}
	},
}
