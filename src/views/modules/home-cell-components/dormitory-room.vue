<template>
	<div class="dormitory-room">
		<div class="title title1" style="width:156px ;">
			宿舍总入住人数
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<div class="dormitory-room__content1">
			<div @click="$router.push({ path: '/dormitoryManage-room' })">
				<span style="font-size: 28px;cursor: pointer">{{ dormitoryNums.total }}</span>
				<span style="font-size: 14px;cursor: pointer">人</span>
			</div>
			<div style="display: flex; margin-left: 40px">
				<div>
					<el-image :src="require('@/assets/home/male.png')"></el-image>
				</div>
				<div style="margin-left: 10px" @click="$router.push({ path: '/dormitoryManage-room' })">
					<span style="font-size: 14px;cursor: pointer">男/<span style="font-size: 22px">{{ dormitoryNums.dormitoryManNum }}</span>人</span>
				</div>
			</div>
			<div style="display: flex; margin-left: 20px">
				<div>
					<el-image :src="require('@/assets/home/female.png')"></el-image>
				</div>
				<div style="margin-left: 10px" @click="$router.push({ path: '/dormitoryManage-room' })">
					<span style="font-size: 14px;cursor: pointer">女/<span style="font-size: 22px">{{ dormitoryNums.dormitoryWomanNum }}</span>人
					</span>
				</div>
			</div>
		</div>
		<div :class="isFullScreen?'title title3':'title title2'" style="width:138px;">
			宿舍分配状况
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<div class="dormitory-room__content2">
			<div class="dormitory-echarts" ref="myEchart"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
	export default {
		props: {},
		computed:{
            ...mapGetters(['isFullScreen'])
        },
		data() {
			return {
				dormitoryNums: {
					total: 0,
					dormitoryManNum: 0,
					dormitoryWomanNum: 0,
					dormitoryEmpty: 0,
					dormitoryFull: 0,
					dormitoryNotFull: 0,
				},
			};
		},
		mounted() {
			this.dormitoryCheckTotal();
		},
		methods: {
			//宿舍入住人数 房间容量
			dormitoryCheckTotal() {
				this.$http
					.get("/system/index/dormitoryCheckInStatistics")
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg);
						}
						this.dormitoryNums = res.data;
						this.dormitoryNums.total =
							Number(res.data.dormitoryManNum) +
							Number(res.data.dormitoryWomanNum);
						let vdata = [{
								name: "空",
								value: res.data.dormitoryEmpty
							},
							{
								name: "未住满",
								value: res.data.dormitoryNotFull
							},
							{
								name: "住满",
								value: res.data.dormitoryFull
							},
						];
						this.initEcharts(vdata);
					});
			},
			initEcharts(vdata) {
				let myChart = this.$echarts.init(this.$refs.myEchart);
				let colorList = ['#45DBF7', '#F69846', '#FF4343'];
				let option = {
					tooltip: {
						trigger: "item",
					},
					series: [{
						type: "pie",
						// roseType: 'radius',
						center: ["50%", "50%"],
						radius: ["0%", "80%"],
						clockwise: true,
						avoidLabelOverlap: true,
						hoverOffset: 15,
						itemStyle: {
							normal: {
								color: function(params) {
									return colorList[params.dataIndex];
								},
							},
						},
						label: {
							show: true,
							position: "outside",
							formatter: "{a|{b}：{c}间}",
							rich: {
								a: {
									padding: [0, 10],
									fontSize: 16
								},
							},
						},
						labelLine: {
							normal: {
								length: 20,
								length2: 30,
								lineStyle: {
									width: 1,
								},
							},
						},
						data: vdata,
					}, ],
				};
				myChart.setOption(option)
				let that = this
				myChart.on('click', function(param) {
					that.$router.push({
						name: "dormitoryManage-room"
					})
				})
			},
		},
	};
</script>

<style scoped lang="scss">
	.dormitory-room {
		color: #fff;

		.title1 {
			margin-bottom: 26px
		}

		.title2 {
			margin-top: 26px;
			margin-bottom: 16px
		}
		.title3 {
			margin-top: 88px;
			margin-bottom: 16px
		}

		.title {
			font-size: 18px;
			height: 36px;
			line-height: 36px;
			background-color: #133c6f;
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
				border-left: 1px solid #01ffff;
				border-top: 1px solid #01ffff;
			}

			.right-top-border {
				top: -6px;
				right: -6px;
				border-right: 1px solid #01ffff;
				border-top: 1px solid #01ffff;
			}

			.left-bottom-border {
				bottom: -6px;
				left: -6px;
				border-left: 1px solid #01ffff;
				border-bottom: 1px solid #01ffff;
			}

			.right-bottom-border {
				bottom: -6px;
				right: -6px;
				border-right: 1px solid #01ffff;
				border-bottom: 1px solid #01ffff;
			}
		}

		&__content1 {
			display: flex;
			align-items: center;
			height: 40px;
		}

		&__content2 {
			.dormitory-echarts {
				height: 180px;
			}
		}
	}
</style>
