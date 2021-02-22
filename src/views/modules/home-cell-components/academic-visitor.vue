<template>
	<div class="academic-visitor">
		<div class="title">
			科研楼来访人员
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<div>
			<el-table :data="dataList" style="width: 100%" :height="isFullScreen?'456':'300'">
				<el-table-column label="照片" width="100" align="center">
					<template slot-scope="scope">
						<el-image :src="$ImgServerUrl+ scope.row.vr_phoneimg" fit='fill'>
							<div slot="error" class="image-slot">
								<img class="student-img" src="../../../assets/img/person.jpg">
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="姓名" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="routeHandle(scope.row.vr_name)">{{scope.row.vr_name}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="vr_temperature" label="体温(℃)" width="80" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.vr_temperature<37.3" style="color:#67C23A;"> {{ scope.row.vr_temperature}}</span>
						<span v-else style="color:#f56c6c;"> {{ scope.row.vr_temperature }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="floorname" label="访问楼层" show-overflow-tooltip width="100" align="center">
				</el-table-column>
				<el-table-column prop="vr_vistorbegintime" label="进入时间" align="center" width="100">
				</el-table-column>
			</el-table>
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
				dataList: []
			}
		},
		computed: {
			...mapGetters(['isFullScreen']),
		},
		created() {
			this.getVisitorData()
		},
		activated() {
			const timer = setInterval(() => {
				this.getVisitorData();
			}, 10 * 1000);
			this.$once("hook:deactivated", () => {
				clearInterval(timer)
			})
			this.$once("hook:destroyed", () => {
				clearInterval(timer)
			})
		},
		methods: {
			//访客信息
			getVisitorData() {
				this.$http.get('/system/index/visitorInformation')
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.dataList = res.data.slice(0,10)
					}).catch(err => {

					})
			},
			routeHandle(name) {
				sessionStorage.setItem("visitorName", name)
				this.$router.push({
					name: 'visitor-index',
					params:{
						vrName:name
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.academic-visitor {
		color: #FFF;

		.el-image {
			width: 40px;
			height: 50px;
		}

		.title {
			font-size: 18px;
			line-height: 36px;
			background-color: #133C6F;
			width: 156px;
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

		.student-img {
			width: 50px;
			height: 50px;
		}

		/deep/ .el-table__body-wrapper::-webkit-scrollbar {
			width: 6px; // 横向滚动条
			height: 6px; // 纵向滚动条 必写
		}

		// 滚动条的滑块
		/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
			background-color: #555;
			border-radius: 3px;
		}
	}
</style>
