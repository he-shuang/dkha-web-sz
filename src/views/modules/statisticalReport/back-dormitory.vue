<template>
	<el-card shadow="never" class="aui-card--fill dormitory">
		<el-row :gutter="10">
			<el-col :span="7">
				<div class="left">
					<div class="left-top">
						<bar :params="params" ref="weekPepleRef"></bar>
					</div>
					<div class="left-bottom">
						<bar :params="params" ref="monthPepleRef"></bar>
					</div>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content bg-purple">
					<el-form :model="dataForm" :inline="true" @keyup.enter.native="getDataList()" ref="ruleForm">
						<el-form-item label="归寝时间">
							<el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
							 start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList">查询</el-button>
							<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
					<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%;" border>
						<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
						<el-table-column prop="scStuname" label="姓名" align="center" width="80"></el-table-column>
						<el-table-column label="照片" align="center">
							<template slot-scope="scope">
								<el-image class="student-img" :src="$ImgServerUrl+scope.row.scPhotoimg" :preview-src-list="[$ImgServerUrl + scope.row.scPhotoimg]">
									<div slot="error" class="image-slot">
										<img class="student-img" src="../../../assets/img/person.jpg">
									</div>
								</el-image>
							</template>
						</el-table-column>
						<el-table-column prop="number" label="未归寝次数" align="center"></el-table-column>
						<el-table-column prop="scPhonenum" label="联系电话" align="center"></el-table-column>
						<el-table-column prop="drNum" label="宿舍号" align="center" width="80"></el-table-column>
						<el-table-column label="性别" align="center" width="60">
							<template slot-scope="scope">
								{{ $getDictLabel("gender", scope.row.scSex) }}
							</template>
						</el-table-column>
					</el-table>
					<el-pagination :current-page="page" :page-sizes="[6,10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
					 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
					</el-pagination>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="right">
					<div class="right-top">
						<bar :params="params" ref="weekTimeRef"></bar>
					</div>
					<div class="right-bottom">
						<bar :params="params" ref="monthTimeRef"></bar>
					</div>
				</div>
			</el-col>
		</el-row>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import bar from '../../../components/public/echarts/bar'
	export default {
		components: {
			bar,
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/reportForm/dormitoryStatistics',
					getDataListIsPage: true,
				},
				limit: 6,
				daterange: null,
				dataForm: {
					startDate: '',
					endDate: '',
				},
				params: {},
			}
		},
		watch: {
			daterange(val) {
				if (val) {
					this.dataForm.startDate = val[0];
					this.dataForm.endDate = val[1];
				} else {
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
			},
		},
		created() {
			this.getWeekData()
			this.getMonthData()
			this.getWeekDataTime()
			this.getMonthDataTime()
		},
		mounted() {},
		methods: {
			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
				}
				this.page = 1
				this.limit = 6
				this.query()
			},


			commonFun(res, title, xTitle, yTitle, ref, xType) {
				let type = [] // 类型
				let seriesData = []
				let xAxisData = []

				res.data.forEach(item => {
					type.push(item.typr)
					xAxisData.push(item[xType])
				})
				type = [...new Set(type)];
				xAxisData = [...new Set(xAxisData)];

				type.forEach((item, index) => {
					seriesData.push({
						data: [],
						name: item,
					})
					res.data.forEach(item1 => {
						if (item === item1.typr) {
							seriesData[index].data.push(item1.sumcount)
						}
					})
				})

				this.params.seriesData = seriesData
				this.params.xAxisData = xAxisData
				this.params.title = title
				this.params.xTitle = xTitle
				this.params.yTitle = yTitle

				this.$nextTick(() => {
					this.$refs[ref].init()
				})
			},

			/**
			 * 周 人
			 * 
			 */
			getWeekData() {
				this.$http.get("/system/reportForm/roomWeek").then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res, msg)
					}

					this.commonFun(res, "宿舍楼异常出入人数（周）", "周", "人", "weekPepleRef", "weeks")

				})
			},
			/**
			 * 月 人
			 * 
			 */
			getMonthData() {
				this.$http.get("/system/reportForm/roomMonth").then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res, msg)
					}

					this.commonFun(res, "宿舍楼异常出入人数（月）", "月", "人", "monthPepleRef", "months")
				})
			},
			/**
			 * 月 次
			 * 
			 */
			getMonthDataTime() {
				this.$http.get("/system/reportForm/abnormalMonth").then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res, msg)
					}
					this.commonFun(res, "宿舍楼异常出入次数（月）", "月", "次", "monthTimeRef", "months")

				})
			},
			/**
			 * 周 次
			 * 
			 */
			getWeekDataTime() {
				this.$http.get("/system/reportForm/abnormalWeek").then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res, msg)
					}
					this.commonFun(res, "宿舍楼异常出入次数（周）", "周", "次", "weekTimeRef", "weeks")
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.left,
	.right {
		min-height: calc(calc(100vh - 190px));
		display: flex;
		flex-direction: column;
		align-content: space-between;

		.left-top,
		.right-top {
			min-height: calc(calc(100vh - 190px)/2);
		}

		.left-bottom,
		right-bottom {
			min-height: calc(calc(100vh - 190px)/2);
		}
	}

	.el-table {
		.student-img {
			vertical-align: top;
			width: 53px;
			height: 70px;
		}
	}

	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
