<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="80px" inline @keyup.enter.native="getDataList">
			<el-form-item label="房间号" prop="fName">
				<el-input v-model="dataForm.fName" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备状态" prop="fstate">
				<el-select v-model="dataForm.fstate" placeholder="请选择" clearable>
					<el-option v-for="item in equipStatusList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
				<el-button type="success" @click="sendFaceToEquip">下发指定</el-button>
				<el-button type="success" @click="uploadHandle()">下发屏保</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" label="全选" align="center"></el-table-column>
			<el-table-column type="index" label="序号" align="center"></el-table-column>
			<el-table-column prop="fname" label="房间号" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="text" @click="gotoAccessRecord(scope.row.fserialNumber)">{{scope.row.fname}}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="设备状态" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.fstate==-1" style="color:#f56c6c;">离线</span>
					<span v-else-if="scope.row.fstate==0" style="color:#67C23A;">正常</span>
					<span v-else style="color:#f56c6c;">停用</span>
				</template>
			</el-table-column>
			<el-table-column prop="fserialNumber" label="设备序列号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="faddDate" label="设备安装日期" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="已下发人数" align="center" width="150">
				<template slot-scope="scope">
					<el-button type="text" @click="showPersonList(scope.row.fid)">{{scope.row.ffaceTotal}}</el-button>
				</template>
			</el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="300">
				<template slot-scope="scope">
					<el-button type="text" @click="openDoorHandle(scope.row)">远程开门</el-button>
					<el-button type="text" @click="issueAgainHandle(scope.row)" style="color:#f56c6c">重新下发</el-button>
					<el-button type="text" @click="rebootDeviceHandle(scope.row)" style="color:#f56c6c">重启设备</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100,300]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 下发操作 -->
		<send-face ref="sendFace" :aeids="checkDataList"></send-face>
		<!-- 已下发人数列表 -->
		<person-list ref="personList"></person-list>
		<!-- 弹窗, 上传 -->
		<five-access-upload v-if="uploadVisible" ref="upload"></five-access-upload>
	</el-card>
</template>

<script>
	import FiveAccessUpload from './five-access-upload'
	import mixinViewModule from "@/mixins/view-module"
	import {
		getDictLabel,
		getDictDataList,
	} from '@/utils'
	import sendFace from './other-five-face'
	import personList from './five-access-person-list'
	import qs from "qs"
	export default {
		mixins: [mixinViewModule],
		components: {
			sendFace,
			personList,
			FiveAccessUpload,
		},
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/fvscdevice/page',
					getDataListIsPage: true
				},
				dataForm: {
					fName: "",
					fstate: "",
					eqType: "1",
				},
				checkDataList: [],
				uploadVisible: false,
				equipStatusList: getDictDataList('equipment_status'),
			}
		},
		methods: {
			// 复选
			handleSelectionChange(data) {
				this.checkDataList = data.map(item => {
					return {
						fname: item.fname,
						fpassword: item.fpassword,
						fserial: item.fserial,
					}
				})
			},
			// 跳转到5寸出入记录页面
			gotoAccessRecord(id) {
				window.sessionStorage.setItem('fserialNumber', id);
				this.$router.push({
					name: 'statistics-fiveAccessRecord',
				})
			},
			// 下发指定
			sendFaceToEquip() {
				if (this.checkDataList.length == 0) {
					return this.$message.warning("请选择需要下发的设备！")
				}
				this.$refs['sendFace'].init();

			},
			//  下发屏保
			uploadHandle(id) {
				this.uploadVisible = true
				this.$nextTick(() => {
					this.$refs.upload.init()
				})
			},
			// 下发人数
			showPersonList(id) {
				this.$refs['personList'].init(id)
			},
			// 远程开门
			openDoorHandle(obj) {
				this.$confirm('此操作存在一定风险，是否继续?', '提示', {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					var params = qs.stringify({
						password: obj.fpassword,
						serial: obj.fserial
					})
					this.$http.post(`/system/fvscdevice/doorOpen`, params).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
					}).catch(err => {

					})
				})
			},
			// 重启设备
			rebootDeviceHandle(obj) {
				this.$confirm('此操作存在一定风险，是否继续?', '提示', {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					var params = qs.stringify({
						password: obj.fpassword,
						serial: obj.fserial
					})
					this.$http.post(`/system/fvscdevice/doorReset`, params).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
					}).catch(err => {

					})
				})
			},
			// 重新下发
			issueAgainHandle(obj) {
				this.$confirm('此操作存在一定风险，是否继续?', '提示', {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					var params = qs.stringify({
						password: obj.fpassword,
						serial: obj.fserial
					})
					this.$http.post(`/system/fvscdevice/redownFace`, params).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
					}).catch(err => {

					})
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.el-table {
		.el-button--text {
			padding: 8px 0;
		}
	}
</style>
