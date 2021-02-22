<template>
	<el-card shadow="always" class="aui-card--fill">
		<el-form inline :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="检测位置" prop="tfDevicename">
				<el-input v-model="dataForm.tfDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="IP地址" prop="tfIpgateway">
				<el-input v-model="dataForm.tfIpgateway" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList">
			<el-table-column align="center" type="index" label="序号"> </el-table-column>

			<el-table-column align="center" prop="name" label="检测位置">

			</el-table-column>
			<el-table-column align="center" prop="ip" label="IP地址">

			</el-table-column>
			<el-table-column align="center" label="安装场景">
				<template slot-scope="scope">
					{{$getDictLabel('sceneType',scope.row.type)}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="temperature" label="温度值℃">
				<template slot-scope="scope">
					<span style="color:red" v-if="scope.row.temperature *1>= $getDictLabel('thermalImaging','0' )">{{(scope.row.temperature*1).toFixed(2)}}</span>
					<span v-else-if="scope.row.temperature*1 < $getDictLabel('thermalImaging','1' )">{{(scope.row.temperature*1).toFixed(2)}}</span>
					<span style="color:orange" v-else>{{(scope.row.temperature*1).toFixed(2)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="date" label="采集时间">
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictLabel
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scthermalimaging/thermalList/2',
					getDataListIsPage: false,
				},
				dataForm: {
					tfIpgateway: "",
					tfDevicename: "",
				},
			}
		},
		activated() {
			const timer = setInterval(() => {
				this.getDataList();
			}, 5000);
			this.$once("hook:deactivated", () => {
				clearInterval(timer)
			})
			this.$once("hook:destroyed", () => {
				clearInterval(timer)
			})
		},
	}
</script>

<style lang="scss" scoped>
</style>
