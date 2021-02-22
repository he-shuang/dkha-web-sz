<template>
	<el-dialog title="固件升级" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%">
		<el-form ref="ruleForm" :model="dataForm" label-width="100px" inline>
			<el-form-item label="设备IP" prop="aeClientip">
				<el-input v-model="dataForm.aeClientip" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备名称" prop="devicename">
				<el-input v-model="dataForm.devicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备状态" prop="state">
				<el-select v-model="dataForm.state" placeholder="请选择" clearable>
					<el-option v-for="item in equipStatusList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="success" @click="updateEquip">升级</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" @selection-change="selectionChange" height="50vh">
			<el-table-column type="selection" label="全选" width="50" align="center"></el-table-column>
			<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
			<el-table-column prop="aeClientip" label="设备IP"  width="200" align="center"></el-table-column>
			<el-table-column prop="aeDevicename" label="设备名称" width="200" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="aeVersionname" label="设备程序版本号" align="center"></el-table-column>
			<el-table-column prop="aeState" label="设备状态" :formatter="formatterState" width="100" align="center"></el-table-column>
			<!-- <el-table-column prop="aeSigntype" label="设备签到类型" :formatter="formatterType"  align="center"></el-table-column> -->
			<!-- <el-table-column prop="aeDevicetype" label="设备类型" :formatter="formatterDevinceType"  align="center"></el-table-column> -->
			<el-table-column prop="floorName" label="安装位置" align="center"></el-table-column>
			<!-- <el-table-column prop="aeSetupdate" label="安装时间" align="center"></el-table-column> -->
			<!-- <el-table-column prop="aeExpirydate" label="有效期"   align="center"></el-table-column> -->
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-dialog>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictLabel,
		getDictDataList
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scaidooreight/page',
					deleteURL: '/system/scaidooreight',
					getDataListIsPage: true
				},
				limit: 10,
				dataForm: {
					aeClientip: "",
					devicename: '',
					state: ''
				},
				dialogVisible: false,
				dataList: [],
				checkedList: [],
				equipStatusList: getDictDataList('equipment_status'),
			}
		},

		methods: {
			init() {
				this.dialogVisible = true;
				this.page = 1;
				this.query();
			},
			search() {
				this.page = 1;
				this.query();
			},
			selectionChange(data) {
				this.checkedList = data;
			},
			formatterType(row) {
				return getDictLabel('accessEquipType', row.aeSigntype)
			},
			formatterDevinceType(row) {
				return getDictLabel('accessDevinceType', row.aeDevicetype)
			},
			formatterState(row) {
				return getDictLabel('equipment_status', row.aeState)

			},
			updateEquip() {
				let updateAllState = false;
				if (this.checkedList.length == 0) {
					updateAllState = true;
				}
				this.$confirm(updateAllState ? '将对全部设备升级' : '将对已选中设备升级', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: updateAllState ? "/system/scaidooreight/updateAlldevice" : "/system/scaidooreight/updatedevicelist",
						method: updateAllState ? "get" : 'post',
						data: this.checkedList.map(item => item.aeId)
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
					})
				}).catch(() => {})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.el-table {
		.el-button--text {
			padding: 8px 0;
		}

		.el-dropdown {
			margin-left: 10px;
		}
	}

	.el-dropdown-menu__item {
		&.danger {
			color: #F56C6C !important;
		}
	}
</style>
