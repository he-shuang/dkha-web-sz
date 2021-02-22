<template>
	<div class="electric-current">
		<div class="title">
			宿舍今日用电量TOP10
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<div class="chart-map" ref="myEchart">
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				yAxis: [],
				series: [],
			}
		},
		mounted() {
			this.electricityFun()
		},
		activated() {
			const timer = setInterval(() => {
				this.electricityFun();
			}, 30*1000);
			this.$once("hook:deactivated", () => {
				clearInterval(timer)
			})
			this.$once("hook:destroyed", () => {
				clearInterval(timer)
			})
		},
		methods: {
			draw() {
				// 实例化echarts对象
				let myChartDrawer = this.$echarts.init(this.$refs.myEchart);
				let option = option = {
					title: {
						text: '',
						subtext: ''
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						borderWidth: 0,
						top: '10%',
						left: 0,
						right: '10%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						name: 'kW·h',
						type: 'value',
						boundaryGap: [0, 0.01],
						splitLine: {
							lineStyle: {
								color: '#FFF'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: "#FFF"
							},
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff'
							},
						},
					},
					yAxis: {
						name: "房间号",
						type: 'category',
						splitLine: {
							lineStyle: {
								color: '#FFF'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: "#FFF"
							},
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff'
							},
						},
						data: this.yAxis
					},
					series: [{
						name: '',
						type: 'bar',
						barWidth: '10px',
						data: this.series,
						itemStyle: {
							normal: {
								color: '#C40',
								barBorderRadius: 30,
							}
						},
					}]
				};
				myChartDrawer.setOption(option);
				let that = this
				myChartDrawer.on('click', function(param) {
					let room = param.name
					let floorId = ''
					that.dataList.forEach(item => {
						if (room === item.chNum) {
							floorId = item.floorid
						}
					})
					// that.$store.state.user.floorId=floorId
					sessionStorage.setItem("floorId", floorId)
					that.$router.push({
						name: "dormitoryManage-room"
					})
				})
			},
			//用电
			electricityFun() {
				this.$http.get('/system/index/roomCurrentAlarm')
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.yAxis = []
						this.series = []
						this.dataList = res.data
						res.data.forEach(item => {
							this.yAxis.unshift(item.chNum)
							if (item.chEcurrent) {

								// 电压*电流累加值/（每小时采样次数*千瓦）
								item.chEcurrent = 220 * item.chEcurrent / (120 * 1000)
								this.series.unshift(item.chEcurrent.toFixed(2))
							}
						})
						this.draw()
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	.electric-current {
		color: #FFF;

		.title {
			font-size: 18px;
			line-height: 36px;
			background-color: #133C6F;
			width: 220px;
			text-align: center;
			position: relative;
			color: #fff;
			margin-bottom: 20px;

			.angle-border {
				position: absolute;
				width: 12px;
				height: 12px;
			}

			.left-top-border {
				top: -6px;
				left: -6px;
				border-left: 1px solid #01FFFF;
				border-top: 1px solid #01FFFF;
			}

			.right-top-border {
				top: -6px;
				right: -6px;
				border-right: 1px solid #01FFFF;
				border-top: 1px solid #01FFFF;
			}

			.left-bottom-border {
				bottom: -6px;
				left: -6px;
				border-left: 1px solid #01FFFF;
				border-bottom: 1px solid #01FFFF;
			}

			.right-bottom-border {
				bottom: -6px;
				right: -6px;
				border-right: 1px solid #01FFFF;
				border-bottom: 1px solid #01FFFF;
			}
		}

		.chart-map {
			height: 300px
		}
	}
</style>
