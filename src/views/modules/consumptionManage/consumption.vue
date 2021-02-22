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
			<el-table-column label="消费总金额" align="center" show-overflow-tooltip>
				<template slot-scope="scope">{{(scope.row.costTotal * 1).toFixed(2)}}</template>
			</el-table-column>
			<el-table-column label="消费优惠金额" align="center" show-overflow-tooltip>
				<template slot-scope="scope">{{(scope.row.discountAmt * 1).toFixed(2)}}</template>
			</el-table-column>
			<el-table-column prop="billid" label="消费单号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="business" label="消费商家名称" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="createDate" label="消费时间" align="center" show-overflow-tooltip>
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
					getDataListURL: '/system/scconsumptionsystemconsume/page',
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
