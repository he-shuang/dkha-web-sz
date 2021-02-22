<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="时间选择">
				<el-date-picker v-model="daterange" type="daterange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
				 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 500px;">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="是否高温">
				<el-select v-model="dataForm.ysfr" placeholder="是否高温" filterable clearable>
					<el-option v-for="item in ysfrOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" style="width: 100%">
			<el-table-column type="index" label="序号"></el-table-column>
			<el-table-column prop="face" label="照片">
				<template slot-scope="scope">
					<el-image class="student-img" :src="scope.row.face" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="temperature" label="体温(℃)">
				<template slot-scope="scope">
					<span v-if="scope.row.temperature<37.3" style="color:#67C23A;"> {{ scope.row.temperature}}</span>
					<span v-else style="color:#f56c6c;"> {{ scope.row.temperature }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="采集时间"></el-table-column>
			<el-table-column prop="equipmentAddress" label="采集地址"></el-table-column>
		</el-table>
		<el-pagination :current-page="pageObj.pageNo" :page-sizes="[6,10, 20, 50, 100]" :page-size="pageObj.pageSize" :total="total"
		 layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"></el-pagination>
	</el-card>
</template>
<script>
	import {
		getDictDataList,
	} from '@/utils'
	export default {
		data() {
			return {
				dataListLoading: false,
				daterange: null,
				dataForm: {
					ysfr: "",
					startTime: "",
					endTime: "",
				},
				pageObj: {
					pageNo: 1,
					pageSize: 6,
					note: {}
				},
				total: 0,
				dataList: [],
			}
		},
		watch: {
			daterange(val) {
				if (val) {
					this.dataForm.startTime = val[0];
					this.dataForm.endTime = val[1];
				} else {
					this.dataForm.startTime = "";
					this.dataForm.endTime = "";
				}
			},
		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return item.face
				})
			},
			ysfrOptions() {
				return getDictDataList("temp_type")
			},
		},
		created() {
			this.initData()
		},
		methods: {
			pageSizeChangeHandle(pageSize) {
				this.pageObj.pageSize = pageSize;
				this.pageCurrentChangeHandle(this.pageObj.pageNo);
			},
			pageCurrentChangeHandle(pageNo) {
				this.pageObj.pageNo = pageNo;
				this.initData();
			},
			initData() {
				this.pageObj.note = {
					...this.pageObj.note,
					...this.dataForm
				}
				this.dataListLoading = true
				this.$http.post(window.SITE_CONFIG['temperatureUrl'], this.pageObj).then(res => {
					//console.log(res)
					if (res.data.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataList = res.data.data.records
					this.total = Number(res.data.data.total)

				}).catch(() => {}).finally(() => {
					this.dataListLoading = false
				})
			},
			getDataList() {
				this.pageObj.pageNo = 1
				this.initData()
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				if (this.daterange) {
					this.daterange = null
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
				this.dataForm.ysfr = ""
				this.getDataList()
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
