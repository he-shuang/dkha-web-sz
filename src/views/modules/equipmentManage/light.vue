<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="设备名称" prop="mbdDevicename">
				<el-input v-model="dataForm.mbdDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备状态" prop="mdbStatus">
				<el-select v-model="dataForm.mdbStatus" placeholder="请选择" clearable>
					<el-option v-for="item in statusList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="importHandle()">导入</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%;">
			<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
			<el-table-column prop="mbdDevicename" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mbdDevicesn" label="设备序列号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mdbStatus" label="设备状态" header-align="center" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.mdbStatus==0" style="color:#67C23A;"> {{ $getDictLabel("equipment_status", scope.row.mdbStatus) }}</span>
					<span v-else style="color:#f56c6c;"> {{ $getDictLabel("equipment_status", scope.row.mdbStatus) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="mbdNetwork" label="是否组网" header-align="center" align="center">
				<template slot-scope="scope">
					{{scope.row.mbdNetwork == 0 ? '否' : "是"}}
				</template>
			</el-table-column>
			<el-table-column prop="mbdUwbaddr" label="安装位置" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mbdSetupdate" label="安装时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mbdExpirydate" label="有效期" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="addOrUpdateHandle(scope.row.mbdId)">{{ $t('update') }}</el-button>
					<el-button type="text" v-if="scope.row.mbdNetwork == 0" @click="deleteHandle(scope.row.mbdId)">{{ $t('delete') }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		<!-- 批量上传信息 -->
		<upload ref="studentUploadExcel" template-url="./template/equipment/智能照明设备表导入模板.xls" upload-url="/system/scmodbusdevicedc/importSLExcel"></upload>
	</el-card>
</template>

<script>
	import AddOrUpdate from './light-add-or-update'
	import mixinViewModule from '@/mixins/view-module'
	import upload from '@/components/public/upload-excel-or-img'
	import {
		getDictDataList
	} from '@/utils'
	export default {
		name: "pir",
		components: {
			AddOrUpdate,
			upload
		},
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scmodbusdevicedc/page',
					getDataListIsPage: true,
					deleteURL: '/system/scmodbusdevicedc',
				},
				dataForm: {
					mbdDevicetype: 1,
					mbdDevicename: "",
					mdbStatus: "",
				}
			}
		},
		computed: {
			statusList() {
				return getDictDataList("equipment_status")
			}
		},
		methods: {
			importHandle() {
				this.$refs['studentUploadExcel'].init()
			},
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
