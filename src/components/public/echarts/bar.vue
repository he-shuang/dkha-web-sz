<template>
	<div>
		<div class="chart-map" ref="myEchart">
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			params: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				colorList: ['#45DBF7', '#F69846', '#FF4343'],
			}
		},
		mounted() {},
		// watch 不生��
		// watch: {
		// 	params: {
		// 		handler(newName, oldName) {
		// 			this.init()
		// 		},
		// 		deep: true,
		// 	}
		// },
		methods: {
			init() {
				this.params.seriesData = this.params.seriesData.map((item, index) => {
					let obj = {
						type: 'bar',
						barMaxWidth: "3%",
						barMaxWidth: "3%",
						itemStyle: {
							normal: {
								color: this.colorList[index],
								barBorderRadius: 10,
							}
						}
					}
					item = {
						...item,
						...obj
					}
					return item
				})
				let myChartDrawer = this.$echarts.init(this.$refs.myEchart);
				window.onresize = myChartDrawer.resize;
				let option = {
					title: {
						text: this.params.title,
						left: "center",
						textStyle: {
							color: "#FFF"
						}
					},
					legend: {
						textStyle: {
							color: "#FFF"
						},
						top: "8%"
					},
					grid: {
						top: "20%",
						containLabel: false
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: {
						name: this.params.xTitle,
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
						type: 'category',
						data: this.params.xAxisData
					},
					yAxis: {
						name: this.params.yTitle,
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
						type: 'value'
					},
					series: this.params.seriesData
				}
				myChartDrawer.setOption(option);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chart-map {
		height: calc(calc(100vh - 190px)/2);
	}
</style>
