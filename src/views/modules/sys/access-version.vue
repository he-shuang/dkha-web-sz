<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="100px" inline>
			<el-form-item label="程序包名称" prop="aevPackname">
				<el-input v-model="dataForm.aevPackname" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="主板类型" prop="aeMainboard">
				<el-select v-model="dataForm.aeMainboard" placeholder="请选择" clearable>
					<el-option v-for="item in eightInchesEquipTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:save')" type="primary" @click="addAccess">新建</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:updatealldevice')" type="success" @click="updateVersion">升级</el-button>

			</el-form-item>
		</el-form>
		<el-table :data="dataList" @selection-change="selectionChange">
			<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
			<el-table-column label="设备主板类型" prop="aeMainboard" align="center" :formatter="formatterType" width="160"></el-table-column>
			<el-table-column label="程序包名称" prop="aevPackname" align="center"></el-table-column>
			<el-table-column label="程序版本号" prop="aevVersion" align="center"></el-table-column>
			<el-table-column label="程序版本code" prop="aevVersioncode" align="center" width="160"></el-table-column>
			<el-table-column label="创建日期" prop="createDate" align="center" width="160"> </el-table-column>
			<el-table-column label="成功升级设备数量" prop="updatetotal" align="center" width="160"></el-table-column>
			<el-table-column label="操作" prop="updatetotal" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="deleteHandle(scope.row.aevId)">{{ $t('delete') }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 新增 -->
		<version-add ref="versionAdd"></version-add>
		<!-- 设备列表 -->
		<version-update ref="versionUpdate"></version-update>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictLabel,
		getDictDataList
	} from '@/utils'
	import versionAdd from './access-version-add'
	import versionUpdate from './access-version-update'
	export default {
		mixins: [mixinViewModule],
		components: {
			versionAdd,
			versionUpdate
		},
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scaidooreightversion/page',
					deleteURL: '/system/scaidooreightversion',
					getDataListIsPage: true
				},
				limit: 10,
				dataForm: {
					aeMainboard: '',
					aevPackname: ''
				},
				dataList: [],
				checkedList: [],
				eightInchesEquipTypeList: getDictDataList('eightInchesEquipType'),
			}
		},

		methods: {
			search() {
				this.page = 1;
				this.query();
			},
			addAccess() {
				this.$refs['versionAdd'].init()
			},
			updateVersion() {
				this.$refs['versionUpdate'].init()
			},
			formatterType(row) {
				return getDictLabel('eightInchesEquipType', row.aeMainboard)
			},
			selectionChange(data) {
				this.checkedList = data;
			}
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
