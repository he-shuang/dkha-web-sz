<template>
	<el-card shadow="never" class="aui-card--fill dormitory-people-detailed">
		<el-form inline :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="归寝时间">
				<el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
				<el-button type="success" @click="exportHandle()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" style="width: 100%;" border>
			<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
			<el-table-column prop="scStuname" label="姓名" align="center"></el-table-column>
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
			<el-table-column prop="drNum" label="宿舍号" align="center"></el-table-column>
			<el-table-column label="性别" align="center">
				<template slot-scope="scope">
					{{ $getDictLabel("gender", scope.row.scSex) }}
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6,10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import qs from 'qs'
	import Cookies from 'js-cookie'
	import mixinViewModule from '@/mixins/view-module'
	export default {
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
		methods: {
			// 导出
			exportHandle() {
				if (this.dataList.length === 0) {
					return this.$message.info("报表暂无数据")
				}
				var params = qs.stringify({
					'access_token': Cookies.get('access_token'),
					...this.dataForm,
					...{
						page: this.page,
						limit: this.limit
					}
				})
				window.location.href = `${window.SITE_CONFIG['apiURL']}/system/reportForm/dormitoryStatisticsExport?${params}`
			},
			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
				this.page = 1
				this.limit = 6
				this.query()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dormitory-people-detailed {
		.el-table {
			.student-img {
				vertical-align: top;
				width: 53px;
				height: 70px;
			}
		}
	}
</style>
