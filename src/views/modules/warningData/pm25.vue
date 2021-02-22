<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :model="dataForm" :inline="true" @keyup.enter.native="getDataList()">
			<el-form-item label="设备名称" prop="devicename">
				<el-input v-model="dataForm.devicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="报警时间">
				<el-date-picker v-model="dateTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
				 end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="clickReset">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%">
			<el-table-column type="index" label="序号" align="center"></el-table-column>
			<el-table-column prop="devicename" label="设备名称" align="center"></el-table-column>
			<el-table-column label="PM2.5(ug/m³)" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.pmaValue*1<  $getDictLabel('envirthreshold','pm' )">{{scope.row.pmaValue}}</span>
					<span v-else style="color: red">{{scope.row.pmaValue}}</span>
				</template>
			</el-table-column>
			<el-table-column label="温度(℃)" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.pmaTemperature<  $getDictLabel('envirthreshold','temperatureH' )">{{(scope.row.pmaTemperature*1).toFixed(2)}}</span>
					<span v-else style="color: red">{{(scope.row.pmaTemperature*1).toFixed(2)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="pmaHumidity" label="湿度(%RH)" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.pmaHumidity%100<  $getDictLabel('envirthreshold','humidityH' )">{{(scope.row.pmaHumidity * 1).toFixed(2)}}</span>
					<span v-else style="color: red">{{(scope.row.pmaHumidity * 1).toFixed(2)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="pmaAlarmtime" label="报警时间" align="center"></el-table-column>
		</el-table>
		<el-pagination @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle" :current-page="page"
		 :page-sizes="[10, 20, 30, 40]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
					getDataListURL: 'system/scpmalarm/page',
					getDataListIsPage: true,
				},
				dateTime: null,
				dataForm: {
					startDate: '',
					endDate: '',
					devicename: "",
				},
			}
		},
		watch: {
			dateTime(val) {
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
			clickReset() {
				this.dateTime = null
				this.dataForm.startDate = "";
				this.dataForm.endDate = "";
				this.dataForm.devicename = ""
				this.getDataList()
			}
		}

	}
</script>

<style lang="scss" scoped>

</style>
