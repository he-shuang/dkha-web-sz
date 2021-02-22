<template>
	<div class="sensors">
		<div class="title" style="width:102px;">
			设备报警
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<!-- 滚动条备选样式 -->
		<!-- <el-scrollbar vertical="horizontal" style="width:484px;height:40px;"> -->
		<ul class="floor-list">
			<li v-for="(item,index) in floorList" :key="index" :class="[activeName==item.df_floorname?'active':'',item.type==true?'actives':'']" @click="changeFloor(item)">{{item.df_floorname}}</li>
		</ul>
		<!-- </el-scrollbar> -->
		<div class="floor-map">
			<el-image :style="isFullScreen?'height:400px':'height:100%'" :src="require('@/assets/img/map/floor-'+activeName+'.png')" fit="contain"></el-image>
			<el-popover :popper-class="item.isSendAlarm=='true'?'environment-popover environment-popover-danger':'environment-popover'"
			 v-for="(item,index) in warningList" :key="index" placement="top" width="210" trigger="hover">
				<p class="title">{{item.devicename}}</p>
				<div v-if="item.isOffdevice=='false'">
					<p :class="item.istemperatureAlarm=='true'?'danger':''" class="temperature">温度：{{(item.temperature*1).toFixed(2)}}℃</p>
					<p :class="item.ishumidityAlarm=='true'?'danger':''" class="humidity">湿度：{{(item.humidity*1).toFixed(2)}}%</p>
					<p :class="item.ispmAlarm=='true'?'danger':''" class="graininess">PM2.5细颗粒物：{{item.pm}}</p>
				</div>
				<p v-else>离线</p>
				<!-- 离线 -->
				<el-image class="environment-icon" :style="{left:item.coordinate[0],top:item.coordinate[1]}" slot="reference" :src="item|filterIcon"></el-image>
			</el-popover>
		</div>

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		filters: {
			// 根据状态返回对应状态的icon
			filterIcon(data) {
				let icon = 'normal.png';
				if (data.isOffdevice == 'true') {
					icon = 'offline.png';
				} else if (data.isSendAlarm == 'true') {
					icon = 'abnormal.png'
				}
				return require('@/assets/home/' + icon)
			}
		},
		computed: {
			...mapGetters(['environmentList','isFullScreen']),
			warningList() {
				return this.environmentList.filter(item => {
					return item.floorAddr[1] == this.activeId
				})
			}
		},
		data() {
			return {
				activeName: '1f',
				activeNames: '',
				activeNameArr: [],
				activeId: '',
				floorList: [], //楼层列表
			}
		},
		watch: {
			// 监听环境传感器报警数据改变
			environmentList: {
				deep: true,
				handler(newData) {
					if (newData.length > 0) {
						// 是否有报警设备  优先显示
						let warn = newData.filter(item => item.isSendAlarm == 'true');
						if (warn.length > 0) {
							let floorId = warn[0].floorAddr[1];
							获取最新报警数据相关信息
							let list = this.floorList;
							//根据查找最新报警设备所在楼层切换显示报警数据
							for (let i = 0; i < list.length; i++) {
								if (floorId == list[i].df_floorid) {
									let arr=[]
									arr.push(list[i].df_floorname);
									this.activeNameArr=Array.from(new Set(arr))
									this.activeNameArr.forEach(item=>{
										this.floorList.forEach(val=>{
											if(item == val.df_floorname){
												val.type=true
											}
										})
									})
									this.activeId = list[i].df_floorid;
									break
								}
							}
						}
					}

				}
			}
		},
		created() {
			this.getBuildingFloors();			
		},
		methods: {
			changeFloor(item) {
				this.activeName = item.df_floorname;
				this.floorList.forEach(val=>{
					if(val.type == item.type){
						item.type=false
					}
				})	
				this.activeId = item.df_floorid;
			},
			getBuildingFloors() {
				// 获取教学楼楼层信息 // id   -1全部  0学生宿舍  1教师宿舍  2教学楼
				this.$http({
					method: "get",
					url: '/system/scdormitoryfloor/tree/2'
				}).then(({
					data: res
				}) => {
					if (res.code != 0) {
						return this.$message(res.msg)
					}
					let arrs = res.data.filter(item => item.df_parentid != "0");
					this.floorList=arrs.map(item=>{
						return {
							...item,
							type:false
						}
					})
					// 默认显示第一个楼层
					this.activeName = this.floorList[0].df_floorname
					this.activeId = this.floorList[0].df_floorid
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.sensors {
		position: relative;

		.title {
			font-size: 18px;
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

		.floor-list {
			display: flex;
			list-style-type: none;
			margin: 0 0 10px 0;
			padding: 0;
			color: #FFF;

			// white-space: nowrap;
			// height: 30px;
			li {
				// display: inline-block;
				// min-width: 60px;
				padding: 0 15px;
				margin-right: 10px;
				// width:60px;
				text-align: center;
				cursor: pointer;
				height: 30px;
				line-height: 30px;
				background: #133C6F;

				&.active {
					background: green;
				}
				&.actives {
					background: red;
				}
			}
		}

		.floor-map {
			position: relative;

			.el-image {
				width: 100%;
			}

			.environment-icon {
				position: absolute;
				width: 24px;
				height: 24px;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>
<style lang="scss">
	body {
		.environment-popover {
			color: #fff;

			// background: #1154FF;
			// .popper__arrow{
			// 	&::after{
			// 		border-top-color: #1154FF!important;
			// 	}
			// }
			&.environment-popover-danger {
				p {
					&.danger {
						animation: evironmentdanger 0.8s linear;
						animation-iteration-count: infinite;
						animation-direction: alternate;
					}
				}
			}

			p {
				margin: 5px 0;
				padding: 0;
				line-height: 1;
				animation-fill-mode: both;

				&.title {
					font-size: 18px;
				}

			}
		}
	}

	@keyframes evironmentdanger {
		0% {
			color: #fff;
		}

		100% {
			color: red;
		}
	}
</style>
