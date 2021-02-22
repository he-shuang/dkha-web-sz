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
		<div :class="isFullScreen?'academic-building__title3':'academic-building__title2'">
			<div class="title" style="width:102px;cursor: pointer;" @click="$router.push({path:'/xwyl-track',query:{url:'index'}})">
				机房环境
				<div class="angle-border left-top-border"></div>
				<div class="angle-border right-top-border"></div>
				<div class="angle-border left-bottom-border"></div>
				<div class="angle-border right-bottom-border"></div>
			</div>
		</div>
        <div class="charts">
            <div class="maps">
              <div class="chart-map" ref="myEchartone"></div>  
              <div class="imgs">
                  <img src="../../../assets/img/shouye/temp.png" alt="">
                  <span class="num" v-if="temp.temperature*1<$getDictLabel('envirthreshold','temperatureH')">{{(temp.temperature*1).toFixed(2)}}&#8451;</span>
				  <span class="num" v-else style="color: red">{{(temp.temperature*1).toFixed(2)}}&#8451;</span>
              </div>
            </div>
            <div class="maps">
               <div class="chart-map" ref="myEchart2"></div> 
               <div class="imgs">
                  <img src="../../../assets/img/shouye/humidity.png" alt="">
                  <span class="num" v-if="temp.humidity%100< $getDictLabel('envirthreshold','humidityH' )">{{(temp.humidity * 1).toFixed(2)}}%</span>
				  <span class="num" v-else style="color: red">{{(temp.humidity * 1).toFixed(2)}}%</span>
              </div>
            </div>
            <div class="maps">
              <div class="chart-map" ref="myEchart3"></div>  
              <div class="imgs">
                  <img src="../../../assets/img/shouye/pm.png" alt="">
                  <span class="num" v-if="temp.pm*1< $getDictLabel('envirthreshold','pmH' )">{{(temp.pm * 1).toFixed(2)}}ug/m<sup>3</sup></span>
                  <span class="num" v-else style="color: red">{{(temp.pm * 1).toFixed(2)}}ug/m<sup>3</sup></span>
              </div>
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
        watch:{
            temp:{
                handler(newVal){
                    if(newVal){
                        this.draw1()
                        this.draw2()
                        this.draw3() 
                    }
                }
            }
        },
		mounted() {
            this.aidooreightFun()
            this.$nextTick(()=>{
                this.draw1()
                this.draw2()
                this.draw3() 
            })
            
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
			draw1() {           
				// 实例化echarts对象
                let myChartDrawer = this.$echarts.init(this.$refs.myEchartone);
                let option = {
                        tooltip: {
                            formatter: "{b}{c}"
                        },
                        series: [{
                            tooltip: {
                                show: false
                            },
                            name: '刻度',
                            type: 'gauge',
                            radius: '80%',
                            z: 1,
                            min: 0,
                            max: 1,
                            center: ['50%','60%'],
                            splitNumber: 5, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 5,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: false
                            }, //刻度标签。
                            axisTick: {
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 0
                                },
                                length: -15
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 0,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            }, //分隔线样式
                            detail: {
                                show: false
                            },
                            pointer: {
                                show: false
                            }
                        }, {
                            name: '',
                            type: 'gauge',
                            radius: '80%',
                            min: 0,
                            max: 1,
                            center: ['50%','60%'],
                            data: [{
                                value: this.temp.temperature/100,
                                name: '温度'
                            }],
                            splitNumber: 10, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            z: 5,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 0,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: true,
                                color: '#24D8E7',
                                fontSize:10,
                                distance: -30,
                                formatter:function(params){
                                    var value = params.toFixed(2)                      
                                    if(value == 0.00){
                                        return '0'
                                    }else if(value == 1.00){
                                        return '100'
                                    }else{
                                        return ''
                                    }
                                }
                            }, //刻度标签。
                            axisTick: {
                                splitNumber: 10,
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                },
                                length: 6,
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 10,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            }, //分隔线样式

                            "itemStyle": {
                                "normal": {
                                    "color": "#24D8E7" //指针颜色
                                }
                            },
                            pointer: {
                                width: 4,
                                length: '60%'
                            },
                            detail: {
                                formatter: function(params){
                                    return (params*100).toFixed(0) + '%'
                                },
                                fontSize: 50,
                                color: "transparent",
                                offsetCenter: ['0%', '-35%']
                            },
                            title: {
                                offsetCenter: ['0', '30%'], 
                                fontSize: 14,
                                color: "#24D8E7",
                                show: true
                            },
                        }]
                    };
                myChartDrawer.setOption(option);
            },
            draw2() {
				// 实例化echarts对象
				let myChartDrawer = this.$echarts.init(this.$refs.myEchart2);
				let option = {
                        tooltip: {
                            formatter: "{b}{c}"
                        },
                        series: [{
                            tooltip: {
                                show: false
                            },
                            name: '刻度',
                            type: 'gauge',
                            radius: '80%',
                            z: 1,
                            min: 0,
                            max: 1,
                            center: ['50%','60%'],
                            splitNumber: 5, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 5,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: false
                            }, //刻度标签。
                            axisTick: {
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 0
                                },
                                length: -15
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 0,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            }, //分隔线样式
                            detail: {
                                show: false
                            },
                            pointer: {
                                show: false
                            }
                        }, {
                            name: '',
                            type: 'gauge',
                            radius: '80%',
                            min: 0,
                            max: 1,
                            center: ['50%','60%'],
                            data: [{
                                value: this.temp.humidity/100,
                                name: '湿度'
                            }],
                            splitNumber: 10, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            z: 5,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 0,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: true,
                                color: '#24D8E7',
                                fontSize:10,
                                distance: -30,
                                formatter:function(params){
                                    var value = params.toFixed(2)                      
                                    if(value == 0.00){
                                        return '0'
                                    }else if(value == 1.00){
                                        return '100'
                                    }else{
                                        return ''
                                    }
                                }
                            }, //刻度标签。
                            axisTick: {
                                splitNumber: 10,
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                },
                                length: 6,
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 10,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            }, //分隔线样式

                            "itemStyle": {
                                "normal": {
                                    "color": "#24D8E7" //指针颜色
                                }
                            },
                            pointer: {
                                width: 4,
                                length: '60%'
                            },
                            detail: {
                                formatter: function(params){
                                    return (params*100).toFixed(0) + '%'
                                },
                                fontSize: 50,
                                color: "transparent",
                                offsetCenter: ['0%', '-35%']
                            },
                            title: {
                                offsetCenter: ['0', '30%'], 
                                fontSize: 14,
                                color: "#24D8E7",
                                show: true
                            },
                        }]
                    };
				myChartDrawer.setOption(option);
            },
            draw3() {
				// 实例化echarts对象
				let myChartDrawer = this.$echarts.init(this.$refs.myEchart3);
				let option = {
                        tooltip: {
                            formatter: "{b}{c}"
                        },
                        series: [{
                            tooltip: {
                                show: false
                            },
                            name: '刻度',
                            type: 'gauge',
                            radius: '80%',
                            z: 1,
                            min: 0,
                            max: 3,
                            center: ['50%','60%'],
                            splitNumber: 5, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 5,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: false
                            }, //刻度标签。
                            axisTick: {
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 0
                                },
                                length: -15
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 0,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            }, //分隔线样式
                            detail: {
                                show: false
                            },
                            pointer: {
                                show: false
                            }
                        }, {
                            name: '',
                            type: 'gauge',
                            radius: '80%',
                            min: 0,
                            max: 3,
                            center: ['50%','60%'],
                            data: [{
                                value: this.temp.pm/100,
                                name: '颗粒度'
                            }],
                            splitNumber: 10, //刻度数量
                            startAngle: 210,
                            endAngle: -30,
                            z: 5,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 0,
                                    color: [
                                        [0.12, '#70C27E'],
                                        [0.35, '#7AD4DF'],
                                        [0.63, '#FBF76B'],
                                        [0.8, '#F88168'],
                                        [1, '#E71A6D'],
                                    ]
                                }
                            }, //仪表盘轴线
                            axisLabel: {
                                show: true,
                                color: '#24D8E7',
                                fontSize:10,
                                distance: -30,
                                formatter:function(params){
                                    var value = params.toFixed(2)                      
                                    if(value == 0.00){
                                        return '0'
                                    }else if(value == 3.00){
                                        return '300'
                                    }else{
                                        return ''
                                    }
                                }
                            }, //刻度标签。
                            axisTick: {
                                splitNumber: 10,
                                show: true,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                },
                                length: 6,
                            }, //刻度样式
                            splitLine: {
                                show: true,
                                length: 10,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            }, //分隔线样式

                            "itemStyle": {
                                "normal": {
                                    "color": "#24D8E7" //指针颜色
                                }
                            },
                            pointer: {
                                width: 4,
                                length: '60%'
                            },
                            detail: {
                                formatter: function(params){
                                    return (params*100).toFixed(0) + '%'
                                },
                                fontSize: 50,
                                color: "transparent",
                                offsetCenter: ['0%', '-35%']
                            },
                            title: {
                                offsetCenter: ['0', '30%'], 
                                fontSize: 14,
                                color: "#24D8E7",
                                show: true
                            },
                        }]
                    };
				myChartDrawer.setOption(option);
			},
			//教学楼总人数进出
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
        &__title3 {
			margin-top: 100px;
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
        .charts{
            display: flex;
            .maps{
                width: 100%;
                height: 100%;
               .chart-map {
                    width: 180px;
                    height: 150px;                 
                }
                .imgs{
                    width: 180px;
                    text-align: center;
                   .num{
                        display: inline-block;
                        font-size: 20px;
                        margin-left: 14px;
                    } 
                }
                
            }        
        }
		
	}
</style>
