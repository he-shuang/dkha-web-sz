<template>
	<div class="academic-building">
		<div class="academic-building__title1">
			<div class="title" style="width: 210px;">
				科研楼今日进入总人次
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
			<div class="title" style="width: 210px;margin-left: 50px;">
				科研楼今日离开总人次
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
		</div>
		<div class="academic-building__content1">
			<div style="width: 210px;">
				<span style="font-size: 28px;cursor: pointer;" @click="$router.push({path:'/statistics-accessRecord'})">{{dormitoryTotalNums.entrantsCount}}
				</span>
				<span>人次</span>
			</div>
			<div style="width: 210px;margin-left: 50px;">
				<span style="font-size: 28px;cursor: pointer" @click="$router.push({path:'/statistics-accessRecord'})">{{dormitoryTotalNums.outCount}}
				</span>
				<span>人次</span>
			</div>
		</div>
		<div class="academic-building__title2">
			<div class="title" style="width:192px;" @click="$router.push({path:'/xwyl-track',query:{url:'index'}})">
				科研楼实时楼层人数
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
		</div>
		<div :class="isFullScreen?'chart-maps':'chart-map'" ref="myEchart">
		</div>
	</div>
</template>

<script>
	import uwbWebsocket from '@/websocket/uwb'
	import {
		mapGetters
	} from "vuex";
	export default {
		mixins: [uwbWebsocket],
		computed: {
			...mapGetters(['isFullScreen']),
		},
		props: {
			//进
			enterTitle: {
				type: String,
				default: () => {}
			},
			//出
			gooutTitle: {
				type: String,
				default: () => {}
			},
		},
		data() {
			return {
				dormitoryTotalNums: {
					entrantsCount: 0,
					outCount: 0
				},
			}
		},
		mounted() {
			this.aidooreightFun()
		},
		activated() { 
			const timer = setInterval(() => {
				this.aidooreightFun();
			}, 5000);
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
				let option = {
					color: ['#45DBF7', '#F69846', '#FF4343', '#AD94FF'],
					tooltip: {
						trigger: 'axis',
						// show: false,
						axisPointer: {
							type: 'shadow'
						},
						formatter: function(params) {
							var result = params[0].name + "<br>";
							params.forEach(function(item) {
								if (item.value) {
									result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
								} else {
									result += item.marker + " " + item.seriesName + " :  0 </br>";
								}
							});
							return result;

						}
					},
					legend: {
						data: ['学生', '教师','访客','其它'],
						textStyle: {
							color: '#fff'
						},
					},
					grid: {
						top: "20px",
						left: 0,
						right: '6%',
						bottom: 0,
						containLabel: true
					},
					xAxis: [{
						splitLine: {
							show: false
						},
						type: 'value',
						show: false,
					}],
					yAxis: [{
						splitLine: {
							show: false
						},
						axisLine: { //y轴
							show: false
						},
						type: 'category',
						axisTick: {
							show: false
						},
						data: this.keyArr,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#00FFFF'
							},
						}
					}],
					series: this.series
				};
				myChartDrawer.setOption(option);
			},
			//科研楼总人数进出
			aidooreightFun() {
				this.$http.get('/system/index/aidooreight')
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.dormitoryTotalNums = res.data
					})
			},
		}
	}
</script>

<style scoped lang="scss">
	.academic-building {
		color: #FFF;

		&__title1 {
			margin-bottom: 26px;
		}

		&__title2 {
			margin-top: 26px;
			margin-bottom: 16px;
		}


		&__title1,
		&__title2 {
			display: flex;
			// justify-content: space-between;
			font-size: 18px;

			.title {
				height: 36px;
				line-height: 36px;
				background-color: #133C6F;
				text-align: center;
				position: relative;
				color: #fff;

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
		}

		&__content1 {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			height: 40px;

			&>div {
				width: 210px;
			}
		}

		.chart-maps {
			height: 400px;
		}
		.chart-map {
			height: 184px;
		}
	}
</style>
