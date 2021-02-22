<template>
	<el-card shadow="never" class="aui-card--fill dormitory-report">
		<el-form :model="dataForm" :inline="true" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="时间选择">
				<el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="">
				<el-switch v-model="dataForm.numType" active-text="人数" inactive-text="次数" active-color="#13ce66" inactive-color="#ff4949"
				 active-value=2 inactive-value=1 @change="numTypeHandle">
				</el-switch>
			</el-form-item>
			<el-form-item label="">
				<el-switch v-model="dataForm.dateType" active-text="月" inactive-text="周" active-color="#13ce66" inactive-color="#ff4949"
				 active-value=2 inactive-value=1 @change="dateTypeHandle">
				</el-switch>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
				<el-button type="success" @click="exprotHandleClick()">导出</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="dataList" border style="width: 100%;" :header-cell-style="{fontSize:'18px'}">
			<el-table-column :label="(dataForm.dateType==1 ? '周统计' : '月统计') + ( dataForm.numType==1 ? '次数报表' : '人数报表')" align="center">
				<el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
				<el-table-column :prop="dataForm.dateType==1 ? 'weeks' : 'months'" label="时间段" align="center">
				</el-table-column>
				<el-table-column :prop="dataForm.numType==1 ? 'type1' : 'typestudent1'" :label="dataForm.numType==1 ? '未进未出次数' : '未进未出人数'"
				 align="center"></el-table-column>
				<el-table-column :prop="dataForm.numType==1 ? 'type2' : 'typestudent2'" :label="dataForm.numType==1 ? '只进未出次数' : '只进未出人数'"
				 align="center"></el-table-column>
				<el-table-column :prop="dataForm.numType==1 ? 'type3' : 'typestudent3'" :label="dataForm.numType==1 ? '只出未进次数' : '只出未进人数'"
				 align="center"></el-table-column>
			</el-table-column>
		</el-table>
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
					getDataListURL: '/system/reportForm/roomStatistics',
					getDataListIsPage: false,
				},
				daterange: null,
				dataForm: {
					startDate: '',
					endDate: '',
					numType: 1,
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


		methods: {
			exprotHandleClick() {
				if (this.dataList.length === 0) {
					return this.$message.info("报表暂无数据")
				}
				var params = qs.stringify({
					'access_token': Cookies.get('access_token'),
					...this.dataForm
				})
				window.location.href = `${window.SITE_CONFIG['apiURL']}/system/reportForm/exportgetByCountWeek?${params}`
			},
			numTypeHandle(e) {
				this.dateType = e
				this.query()
			},
			dateTypeHandle(e) {
				this.numType = e
				this.query()
			},

			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
				this.dataForm.numType = 1
				this.dataForm.dateType = 1
				this.query()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dormitory-report {

		/deep/.el-switch__label {
			color: #FFF;
		}

		/deep/.el-switch__label.is-active {
			color: #17B3A3;
		}
	}
</style>
