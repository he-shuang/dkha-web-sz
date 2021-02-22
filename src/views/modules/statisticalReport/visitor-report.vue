<template>
	<el-card shadow="never" class="aui-card--fill academic-report">
		<el-form :model="dataForm" :inline="true" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="时间选择">
				<el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="">
				<el-switch v-model="dataForm.dateType" active-text="月" inactive-text="周" active-color="#13ce66" inactive-color="#ff4949"
				 active-value=2 inactive-value=1 @change="dateTypeHandle">
				</el-switch>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
				<el-button type="success" @click="exportHandle()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table border ref="table" :data="dataList" style="width: 100%" :span-method="objectSpanMethod" :header-cell-style="{fontSize:'18px'}">
			<el-table-column :label="dataForm.dateType==1 ? '访客人次周报表' : '访客人次月报表'" align="center">
				<el-table-column prop="dateStr" align="center" label="时间段">
				</el-table-column>
				<el-table-column prop="floorname" align="center" label="楼层">
				</el-table-column>
				
				<el-table-column prop="count" align="center" label="人次">
				</el-table-column>
			</el-table-column>
		</el-table>
	</el-card>
</template>
<script>
	import qs from 'qs'
	import Cookies from 'js-cookie'
	import {
		buildMerge
	} from "../../../utils/mergeCell.js"
	export default {
		data() {
			return {
				dataList: [],
				daterange: null,
				dataForm: {
					startDate: '',
					endDate: '',
					dateType: 1,
				},
				dataList: [],
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
		mounted() {
			this.getDataList()
		},
		methods: {
			// 列表查询
			getDataList() {
				this.$http.get("/system/reportForm/visitorFloorWeekMonth", {
					params: this.dataForm
				}).then(({
					data: res
				}) => {
					this.dataList = res.data
					buildMerge(this.dataList, 'dateStr', 'floorname')
				})
				// this.buildMerge(this.dataList)
			},
			// 导出
			exportHandle() {
				if(this.dataList.length===0){
					return this.$message.info("报表暂无数据")
				}
				var params = qs.stringify({
					'access_token': Cookies.get('access_token'),
					...this.dataForm
				})
				window.location.href = `${window.SITE_CONFIG['apiURL']}/system/reportForm/visitorFloorWeekMonthExport?${params}`
			},
			// 周月切换
			dateTypeHandle() {
				this.getDataList()
			},
			// 重置
			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
				}
				this.dataForm.dateType = 1
				this.getDataList()
			},
			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 0) {
					return this.ret(row, 'firstSpan')
				} else if (columnIndex === 1) {
					return this.ret(row, 'secondSpan')
				}
				// } else if (columnIndex === 2) {
				//     return this.ret(row, 'thirdSpan')
				// } 
				// else if (columnIndex === 3) {
				//     return this.ret(row, 'fourthSpan')
				// }
			},
			ret(row, obj) {
				if (row && row[obj] != 0) {
					return {
						rowspan: row[obj],
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.academic-report {

		/deep/.el-switch__label {
			color: #FFF;
		}

		/deep/.el-switch__label.is-active {
			color: #17B3A3;
		}
	}
</style>
