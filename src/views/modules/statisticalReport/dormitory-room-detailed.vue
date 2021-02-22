<template>
	<el-card shadow="never" class="aui-card--fill dormitory-room-detailed">
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
			<el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
			<el-table-column prop="drNum" label="宿舍号" align="center"></el-table-column>
			<el-table-column prop="number" label="未归寝次数" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/reportForm/dormitoryRoomStatistics',
					getDataListIsPage: true,
					exportURL:"/system/reportForm/findCountRoomExport",
				},
				limit: 10,
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
			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
				this.page = 1
				this.limit = 10
				this.query()
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
