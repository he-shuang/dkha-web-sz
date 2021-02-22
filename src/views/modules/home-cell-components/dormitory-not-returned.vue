<template>
	<div class="dormitory-not-returned">
		<div style="display: flex;">
			<div class="title">
				宿舍每日到点未归人员
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
			<div class="el-icon-timer" style="height: 36px;line-height: 36px;margin-left: 20px;cursor: pointer;font-size: 30px;"
			 @click="refreshHandle"></div>
		</div>
		<div :class="isFullScreen?'chart-maps':'chart-map'" ref="myEchart">
		</div>
	</div>
</template>

<script>
import {
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				xDataWeek: [],
				seriesDataWeek: [],
			}
		},
		computed: {
			...mapGetters(['isFullScreen']),
		},
		mounted() {
			this.notReturnFun()
		},
		methods: {
			draw() {
				// 实例化echarts对象
				let myChartDrawer = this.$echarts.init(this.$refs.myEchart);
				let option = {
					dataZoom: [{
						type: 'inside',
						start: this.xDataWeek.length < 7 ? 0 : ((this.xDataWeek.length - 7) / this.xDataWeek.length) * 100,
						end: 100
					}],
					grid: {
						top: 60,
						left: 0,
						right: '4%',
						bottom: 0,
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						formatter: '日期：{b}<br>未归人数：{c} 人'
					},
					xAxis: [{
						type: 'category',
						data: this.xDataWeek,
						axisLine: {
							lineStyle: {
								color: "#FFF"
							}
						},
						axisLabel: {
							interval: 0,
							rotate: 60
						}
					}],
					yAxis: {
						name: "人",
						type: 'value',
						splitNumber: 4,
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
						nameTextStyle: {
							color: "#FFF"
						},
					},
					series: [{
						name: '13',
						type: 'line',
						data: this.seriesDataWeek,
						lineStyle: {
							normal: {
								width: 2,
								color: {
									type: 'linear',

									colorStops: [{
										offset: 0,
										color: '#A9F387' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#48D8BF' // 100% 处的颜色
									}],
									globalCoord: false // 缺省为 false
								},
								shadowColor: 'rgba(72,216,191, 0.3)',
								shadowBlur: 0,
								shadowOffsetY: 0
							}
						},
						itemStyle: {
							normal: {
								color: '#fff',
								borderWidth: 0,
								borderColor: "#A9F387"
							}
						},
						smooth: true
					}]
				};
				myChartDrawer.setOption(option);
				let that = this
				myChartDrawer.on('click', function(param) {
					let date = param.name
					sessionStorage.setItem("date", date)
					that.$router.push({
						name: "dormitoryManage-not-return"
					})
				})
			},
			// 未归人员 一星期
			notReturnFun() {
				this.$http.get('/system/index/notReturnedStatistics')
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						let seriesDataWeek = res.data.map(v => {
							return v.num
						})
						let xDataWeek = res.data.map(v => {
							return v.date
						})
						this.xDataWeek = xDataWeek.reverse()
						this.seriesDataWeek = seriesDataWeek.reverse()

						this.draw()
					})
			},
			// 点名
			refreshHandle() {
				let timeId = null
				this.$http.put("/job/schedule/runHome", ["1318181679319240705"]).then(({
					data: res
				}) => {
					window.clearInterval(timeId)
					if (res.code != 0) {
						return this.$message.warning(res.msg)
					}
					timeId = setTimeout(() => {
						this.notReturnFun()
						this.$message.success("已点名成功")
					}, 2000)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.dormitory-not-returned {
		color: #FFF;

		.title {
			font-size: 18px;
			height: 36px;
			line-height: 36px;
			background-color: #133C6F;
			width: 210px;
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
		.chart-maps{
			height: 450px
		}
	}
</style>
