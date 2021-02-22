<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="检测位置">
				<el-input v-model="dataForm.tfDevicename" clearable placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset()">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%;">
			<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
			<el-table-column prop="tfDevicename" label="检测位置" header-align="center" align="center"></el-table-column>
			<el-table-column label="温度(℃)" header-align="center" align="center">
				<template slot-scope="scope">
					<span style="color:red" v-if="scope.row.tfaEcurrent >= $getDictLabel('thermalImaging','0' )">{{(scope.row.tfaEcurrent*1).toFixed(2)}}</span>
					<span v-else-if="scope.row.tfaEcurrent < $getDictLabel('thermalImaging','1' )">{{(scope.row.tfaEcurrent*1).toFixed(2)}}</span>
					<span style="color:orange" v-else>{{(scope.row.tfaEcurrent*1).toFixed(2)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="tfaAlarmtime" label="报警时间" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictDataList
	} from '@/utils'
	export default {
		name: "therma-imaging",
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scthermalalarm/list',
					getDataListIsPage: true,
				},
				dataForm: {
					tfDevicename: "",
				}
			}
		},
		activated(){
			
		},
		methods: {
			reset() {
				this.dataForm = {
					tfDevicename: "",
				}
				this.page = 1
				this.limit = 10
				this.query()
			}
		}
	}
</script>
<style scoped lang="scss">
	.el-table {
		.el-button--text {
			padding: 8px 0;

			&.hide-text {
				max-width: 120px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				word-break: break-all;
			}
		}
	}
</style>
