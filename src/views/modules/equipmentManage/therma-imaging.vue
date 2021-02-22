<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" ref="ruleForm">
			<!-- <el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item> -->
			<el-form-item label="检测位置" prop="tfDevicename">
				<el-input v-model="dataForm.tfDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备状态" prop="tfStatus">
				<el-select v-model="dataForm.tfStatus" placeholder="请选择" clearable>
					<el-option v-for="item in equipStatusList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
				<el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%;">
			<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
			<el-table-column prop="tfDevicename" label="检测位置" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tfDevicesn" label="设备序列号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tfIpgateway" label="IP地址" header-align="center" align="center"></el-table-column>
			<el-table-column label="设备状态" header-align="center" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.tfStatus==0" style="color:#67C23A;"> {{ $getDictLabel("equipment_status", scope.row.tfStatus) }}</span>
					<span v-else style="color:#f56c6c;"> {{ $getDictLabel("equipment_status", scope.row.tfStatus) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="tfSetupaddr" label="安装位置" header-align="center" align="center"></el-table-column>
			<el-table-column prop="tfSetupdate" label="安装时间" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="addOrUpdateHandle(scope.row.tfId)">{{ $t('update') }}</el-button>
					<el-button type="text" @click="deleteHandle(scope.row.tfId)">{{ $t('delete') }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script>
	import AddOrUpdate from './therma-imaging-add-or-update'
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictDataList
	} from '@/utils'
	export default {
		name: "therma-imaging",
		components: {
			AddOrUpdate,
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scthermalimaging/page',
					getDataListIsPage: true,
					deleteURL: '/system/scthermalimaging',
				},
				equipStatusList: getDictDataList('equipment_status'),
				// dataForm: {

				// }
			}
		},
		methods: {}
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
