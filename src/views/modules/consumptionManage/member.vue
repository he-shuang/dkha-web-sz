<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="80px" inline>
			<el-form-item label="会员姓名" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="会员卡号" prop="cardId">
				<el-input v-model="dataForm.cardId" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList">
			<el-table-column type="selection" label="全选" align="center"></el-table-column>
			<el-table-column type="index" label="序号" align="center"></el-table-column>
			<el-table-column prop="name" label="会员姓名" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="cardId" label="会员卡号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="phone" label="联系电话" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="累计消费金额" align="center" show-overflow-tooltip>
				<template slot-scope="scope">{{(scope.row.costTotal * 1).toFixed(2)}}</template>
			</el-table-column>
			<el-table-column prop="costTotalNum" label="累计消费次数" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="账户总金额" align="center" show-overflow-tooltip>
				<template slot-scope="scope">{{(scope.row.balance * 1).toFixed(2)}}</template>
			</el-table-column>
			<el-table-column prop="registerDate" label="注册时间" align="center" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100,300]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import {
		getDictLabel,
		getDictDataList
	} from '@/utils'
	import mixinViewModule from "@/mixins/view-module"
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scconsumptionsystemvip/page',
					getDataListIsPage: true
				},
				dataForm: {
					name: "",
					cardId: "",
				},
			}
		},
	}
</script>

<style>
</style>
