<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-row :gutter="10">
			<el-col :span="4">
				<div class="left">
					<dormitory-tree ref="dormitoryTree" type='electric' @treeFun="treeFun"></dormitory-tree>
				</div>
			</el-col>
			<el-col :span="20">
				<div class="right">
					<el-date-picker v-model="dateTime" type="datetimerange" value-format="yyyy/MM/dd HH:mm:ss" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
					</el-date-picker>
					<el-button @click="clickSearch" style="margin-left:20px">查询</el-button>
					<hr>
					<div v-if="floorName==''" style="font-size: 20px;text-align: center;margin-top: 24px;">301房间</div>
					<div v-else style="font-size: 20px; text-align: center;margin-top: 24px;">{{floorName}}房间</div>
					<div id="electric_echarts"></div>
				</div>
			</el-col>
		</el-row>
	</el-card>
</template>

<script>
	import dormitoryTree from '../../../components/public/dormitory-tree'
	export default {
		data() {
			return {
				dateTime: [
					new Date()
					.toLocaleString("zh", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit"
					})
					.substr(0, 10) + " 00:00:00",
					new Date()
					.toLocaleString("zh", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit"
					})
					.substr(0, 10) + " 23:59:59"
				],
				treeValue: {
					df_floorid: '',
					df_type: '',
					df_floorname: ''
				},
				dataForm: {
					startDate: "",
					endDate: "",
				},
				xAxisData: [],
				ydata: [],
				floorName: "",
			}
		},
		components: {
			dormitoryTree
		},
		activated() {
			const timer = setInterval(() => {
				this.clickSearch();
			}, 30000);
			this.$once("hook:deactivated", () => {
				clearInterval(timer)
			})
			this.$once("hook:destroyed", () => {
				clearInterval(timer)
			})
		},
		watch: {
			'$store.state.user.defaultCheckedKeys': {
				handler(val) {
					if (val) {
						this.clickSearchs(val);
					}
				},
				deep: true,
				immediate: true
			},
		},
		methods: {
			//树形控件 回调函数
			treeFun(val) {
				this.treeValue = val;
				if (val.df_type != '2') {
					return this.$message.info('请选择房间查看宿舍电流')
				}
				this.floorName = val.df_floorname
				this.clickSearch()
			},
			//搜索
			clickSearch() {
				if (!this.dateTime || this.dateTime.length == '0') {
					return this.$message.error('请选择时间范围')
				} else if (!this.$store.state.user.defaultCheckedKeys) {
					return this.$message.error('暂无楼栋数据，无法查询')
				}
				let startDate = this.dateTime[0].replace(/\//g, '-')
				let endDate = this.dateTime[1].replace(/\//g, '-')
				let id = ''
				if (this.treeValue.df_floorid == '') {
					id = this.$store.state.user.defaultCheckedKeys
				} else {
					id = this.treeValue.df_floorid
				}

				this.$http.get(`/system/sccurrenthistory/${id}/${startDate}/${endDate}`)
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						
						// chColltime: "2020-10-31 17:53:08",
						// chEcurrent: 0.0424328


						let arrData = res.data; //所有数据
						let xData = []; //x 数据
						let data = []; //y 数据

						this.xAxisData = []

						xData = arrData.map(item => item.chColltime.slice(11, 19))
						data = arrData.map(item => item.chEcurrent)
						this.ydata = data.map(item => {
							return item.toFixed(2)
						})
						this.xAxisData = xData;
						this.electricFun()
					})
			},
			//搜索
			clickSearchs(val) {
				let startDate = this.dateTime[0].replace(/\//g, '-')
				let endDate = this.dateTime[1].replace(/\//g, '-')

				this.$http.get(`/system/sccurrenthistory/${val}/${startDate}/${endDate}`)
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}

						let arrData = res.data; //所有数据
						let xData = []; //x 数据
						let data = []; //y 数据

						this.xAxisData = []

						xData = arrData.map(item => item.chColltime.slice(11, 19))
						data = arrData.map(item => item.chEcurrent)
						this.ydata = data.map(item => {
							return item.toFixed(2)
						})
						this.xAxisData = xData;
						this.electricFun()

					})
			},
			//echarts 图表
			electricFun() {
				let mycharts = this.$echarts.init(document.getElementById('electric_echarts'));
				window.onresize = mycharts.resize;
				let options = {
					dataZoom: [{
						type: 'inside',
						start: this.xAxisData.length < 10 ? 0 : ((this.xAxisData.length - 10) / this.xAxisData.length) * 100,
						end: 100,
						filterMode: 'empty',
						// zoomLock:true,
					}],
					title: {
						//text: '监控'
					},
					tooltip: {
						trigger: 'axis',
						itemStyle: {
							normal: {
								label: {
									show: true
								}
							}
						}
					},
					//工具图标
					toolbox: {
						show: false,
						feature: {
							magicType: {
								type: ['line', 'bar']
							}
						}
					},
					xAxis: {
						type: 'category',
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						data: this.xAxisData
					},
					yAxis: {
						type: 'value',
						name: "电流（A）",
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						splitLine: { //网格线
							lineStyle: {
								type: 'dashed' //设置网格线类型 dotted：虚线   solid:实线
							},
							show: true //隐藏或显示
						}
					},
					series: [{
						name: '电流',
						type: 'line',
						data: this.ydata,
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: 'white'
								}
							}
						},
						//对于超上限的数据用默认样式展示
						markPoint: {
							itemStyle: {
								normal: {
									borderColor: '#fab60c',
									borderWidth: 5, // 标注边线线宽，单位px，默认为1
									label: {
										show: true
									}
								},
								emphasis: {
									borderColor: '#fab60c',
									borderWidth: 5,
									label: {
										show: true
									}
								}
							},
							data: 20
						},
						markLine: {
							symbol: "none", //去掉警戒线最后面的箭头
							label: {
								position: "end", //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
								formatter: "阈值线" + this.$getDictLabel("electricValue", 0)
							},
							data: [{
								silent: true, //鼠标悬停事件  true没有，false有
								lineStyle: { //警戒线的样式  ，虚实  颜色
									type: "dashes",
									color: "rgba(238, 99, 99)"
								},
								name: '阈值线',
								yAxis: this.$getDictLabel("electricValue", 0)
							}]
						},
						smooth: true,
					}]
				}
				mycharts.setOption(options)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.left {
		/deep/ .el-tree {
			height: 690px;
			padding-right: 10px;
			overflow-y: auto;
		}
	}

	.right {
		margin-left: 100px;
		color: #fff;

		#electric_echarts {
			width: 100%;
			height: 690px;
		}
	}
</style>
