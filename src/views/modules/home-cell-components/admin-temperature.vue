<template>
	<div class="academic-building">
		<div class="academic-building__title1">
			<div class="title" style="width:240px;">
				科研楼强弱电井温度TOP10
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
		</div>
		<div class="temparr" v-for="(item,index) in tempArr" :key="index">
			<div :class="isFullScreen?'bigbox':'box'" @click="$router.push({name:'warningData-therma-imaging',params:{tfDevicename:item.name}})">
				<span :class="item.temperature*1 >= $getDictLabel('thermalImaging','0' )?'dex dex1':item.temperature*1 < $getDictLabel('thermalImaging','1' )?'dex':'dex dex2'">N0.{{index+1}}</span>
				<span>{{item.name}}&emsp;&nbsp;&emsp;&nbsp;</span>
				<div :class="item.temperature*1 >= $getDictLabel('thermalImaging','0' )?'temp temp1':item.temperature*1 < $getDictLabel('thermalImaging','1' )?'temp':'temp temp2'"></div>&emsp;&emsp;&nbsp;
				<span v-if="item.temperature ==''">0&#8451;</span>
				<span v-else>{{(item.temperature*1).toFixed(2)}}&#8451;</span>
			</div>
		</div>
	</div>
</template>

<script>
	import tempWebsocket from '@/websocket/system'
	import {
		mapGetters
	} from "vuex";
	export default {
		mixins: [tempWebsocket],
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
		computed: {
			...mapGetters(['isFullScreen']),
		},
		data() {
			return {
				dormitoryTotalNums: {
					entrantsCount: 0,
					outCount: 0
				},
				itemStyle: {},
				tempArr: []
			}
		},
		mounted() {
			this.getDataList()
		},
		activated() {
			const timer = setInterval(() => {
				this.getDataList();
			}, 5000);
			this.$once("hook:deactivated", () => {
				clearInterval(timer)
			})
			this.$once("hook:destroyed", () => {
				clearInterval(timer)
			})
		},
		methods: {
			//访客信息
			getDataList() {
				this.$http.get('/system/index/thermalTop')
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.tempArr = res.data.sort((a, b) => b.temperature - a.temperature)
					})
			},
		}
	}
</script>

<style scoped lang="scss">
	.academic-building {
		color: #FFF;

		&__title1 {
			margin-bottom: 22px;
		}

		&__title1 {
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

		.temparr {
			margin-bottom: 15px;
			height: 100%;

			.box {
				display: flex;
				height: 18px;
				cursor: pointer;
			}


			.bigbox {
				display: flex;
				margin-bottom: 26px;
				cursor: pointer;
			}

			.dex {
				width: 50px;

			}

			.dex1 {
				color: #CF2D1D;
			}

			.dex2 {
				color: #F46208;
			}

			.temp {
				width: 240px;
				height: 18px;
				background-color: #0B5970;
			}

			.temp1 {
				background-color: #CF2D1D;
			}

			.temp2 {
				background-color: #F46208;
			}
		}

		.temparr:last-child {
			margin-bottom: 0px;
		}


	}
</style>
