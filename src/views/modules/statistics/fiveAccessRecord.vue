<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :inline="true" :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="姓名" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="房间号" prop="deviceName">
				<el-input v-model="dataForm.deviceName" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<!--<el-form-item label="设备序列号" prop="serialNumber">
				<el-input v-model="dataForm.serialNumber" placeholder="请输入" clearable></el-input>
			</el-form-item>-->
			<el-form-item label="时间" prop="daterange">
				<el-date-picker v-model="daterange" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :range-separator="$t('datePicker.range')"
				 :start-placeholder="$t('datePicker.start')" :end-placeholder="$t('datePicker.end')">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" style="width: 100%;">
			<el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
			<el-table-column label="照片" width="120" align="center">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.faceUrl" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
			<el-table-column prop="deviceName" label="房间号" align="center"></el-table-column>
			<!--<el-table-column prop="serialNumber" label="设备序列号" align="center"></el-table-column>-->
			<el-table-column prop="addDate" label="开门时间" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6,10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	export default {
		name: "fiveAccessRecord",
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scaidoorfiveopenlog/page',
					getDataListIsPage: true,
				},
				daterange: null,
				dataForm: {
					name: "",
					deviceName: '',
					serialNumber: "",
					startDate: '',
					endDate: '',
				},
				limit: 6,
			}
		},
		activated() {
			// 判断从5寸闸机设备跳转过来  查询对应出入数据
			let fserialNumber = window.sessionStorage.getItem('fserialNumber');
			if (fserialNumber) {
				window.sessionStorage.removeItem('fserialNumber');
				this.dataForm.serialNumber = fserialNumber;
				this.getDataList();
			}
		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.faceUrl
				})
			},
		},
		watch: {
			daterange(val) {
				if (val == null) {
					this.dataForm.startDate = null
					this.dataForm.endDate = null
				} else {
					this.dataForm.startDate = val[0]
					this.dataForm.endDate = val[1]
				}
			}
		},
		methods: {
			reset(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
				}
				this.page = 1
				this.limit = 6
				this.query()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-table {
		.student-img {
			vertical-align: top;
			width: 53px;
			height: 70px;
		}
	}
</style>
