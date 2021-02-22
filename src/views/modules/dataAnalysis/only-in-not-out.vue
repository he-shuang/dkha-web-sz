<template>
	<el-card shadow="never" class="aui-card--fill staff-report not-in-or-out">
		<el-form :model="dataForm" :inline="true" @keyup.enter.native="getDataList()" ref="ruleForm">
			<el-form-item label="时间选择">
				<el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="次数">
				<el-input v-model="dataForm.num"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="typeArr">
				<el-select filterable v-model="typeArr" placeholder="请选择" multiple clearable style="width: 500px;">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
		 element-loading-background="rgba(0, 0, 0, 0.8)" border ref="table" :span-method="objectSpanMethod" :data="dataList"
		 style="width: 100%" :header-cell-style="{fontSize:'16px'}">
			<el-table-column prop="scStuname" align="center" label="姓名" width="100">
			</el-table-column>
			<el-table-column align="center" label="性别" width="100">
				<template slot-scope="scope">
					{{ $getDictLabel("gender", scope.row.scSex) }}
				</template>
			</el-table-column>
			<el-table-column prop="scPhonenum" align="center" label="联系电话" width="200">
			</el-table-column>
			<el-table-column prop="type" align="center" label="位置" width="200">
				<template slot-scope="scope">
					<span v-if="scope.row.type == 1">宿舍闸机</span>
					<span v-else-if="scope.row.type == 2">教学楼闸机</span>
					<span v-else-if="scope.row.type == 4">UWB</span>
				</template>
			</el-table-column>
			<el-table-column prop="times" align="center" label="异常次数" width="180">
			</el-table-column>
			<el-table-column align="center">
				<template slot="header">
					<div style="display: flex;justify-content: center;align-items: center;">
						<div>结果描述</div>
						<div>（</div>
						<div style="width: 12px;height: 12px;background-color: red;margin: 0 10px;"></div>
						<div>异常</div>
						<div style="width: 12px;height: 12px;background-color: green;margin: 0 10px"></div>
						<div style="margin-right: 10px;">正常</div>
						<div>）</div>
					</div>

				</template>
				<template slot-scope="scope">
					<div class="squareContent" style="display: flex;flex-wrap:wrap">
						<el-tooltip v-for="(item,index) in dateRange" effect="light" :content="toolComputed(item,scope.row.dataAnalysisInfoDTOList) ? toolComputed(item,scope.row.dataAnalysisInfoDTOList) : item"
						 placement="top-start" :key="index">
							<div class="divSquare" :style="{backgroundColor:toolComputed(item,scope.row.dataAnalysisInfoDTOList) ? 'red' : 'green'}">
							</div>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="180">
				<template slot-scope="scope">
					<el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<v-view ref="viewRef" v-if="viewVisible">

		</v-view>
	</el-card>
</template>
<script>
	import {
		getAllDate,
		getNowFormatDate
	} from "../../../utils/dateTime.js"
	import {
		buildMerge
	} from "../../../utils/mergeCell.js"
	import vView from './v-view'
	export default {
		components: {
			vView
		},
		data() {
			return {
				viewVisible: false,
				loading: false,
				options: [{
					value: '1',
					label: '宿舍闸机'
				}, {
					value: '2',
					label: '教学楼闸机'
				}, {
					value: '4',
					label: 'UWB'
				}],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 86400000;
					},
				},
				daterange: [new Date(new Date().getTime() - 1296000000), new Date(new Date() - 86400000)],
				typeArr: ["1", "2"], // 默认选择'宿舍闸机'和'教学楼闸机'
				dataForm: {
					startDate: '',
					endDate: '',
					num: 3,
					type: "",
				},
				dataList: [],
				dateRange: [],
			}
		},
		watch: {
			daterange(val) {
				if (val) {
					this.dataForm.startDate = val[0];
					this.dataForm.endDate = val[1];
				} else {
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}
			},
		},
		computed: {
			toolComputed() {
				return function(dateStr, row) {
					let str = ""
					row.forEach(item => {
						if (dateStr === item.createDate) {
							str = `${item.createDate}  ${item.num}次`
						}
					})
					return str
				}
			},
		},
		mounted() {
			this.getDataList()
		},
		methods: {
			viewHandle(row) {
				this.viewVisible = true
				this.$nextTick(() => {
					this.$refs.viewRef.init(row,this.dataForm,"/system/dataAnalysis/onlyInNotOut")
				})
			},
			// 列表查询
			getDataList() {
				if (this.typeArr.length === 0) {
					return this.$message.warning("类型不能为空")
				} else {
					this.dataForm.type = this.typeArr.join()
				}
				if (this.daterange) {
					this.dataForm.startDate = this.daterange[0];
					this.dataForm.endDate = this.daterange[1];
					if (typeof this.dataForm.startDate === 'object') {
						this.dateRange = getAllDate(getNowFormatDate(this.dataForm.startDate), getNowFormatDate(this.dataForm.endDate))
					} else {
						this.dateRange = getAllDate(this.dataForm.startDate, this.dataForm.endDate)
					}
				}
				this.loading = true
				this.$http.get("/system/dataAnalysis/onlyInNotOut", {
					params: this.dataForm
				}).then(({
					data: res
				}) => {
					if (res.data.length > 0) {
						buildMerge(res.data, 'scStuname', 'scSex', 'scPhonenum')
						this.dataList = res.data.map(item => {
							item.times = 0
							item.dataAnalysisInfoDTOList.forEach(item1 => {
								item.times = item.times + item1.num
							})
							return item
						})
						this.loading = false
					} else {
						this.dataList = []
					}
				}).catch(() => {}).finally(() => {
					this.loading = false
				})
			},

			// 重置
			reset(formName) {
				this.$refs[formName].resetFields();
				this.daterange = [new Date(new Date().getTime() - 1296000000), new Date(new Date() - 86400000)]
				this.typeArr = ["1", "2"]
				this.getDataList()
			},
			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 0) {
					return this.ret(row, 'firstSpan')
				} else if (columnIndex === 1) {
					return this.ret(row, 'secondSpan')
				} else if (columnIndex === 2) {
					return this.ret(row, 'thirdSpan')
				}
			},
			ret(row, obj) {
				if (row && row[obj] != 0) {
					return {
						rowspan: row[obj],
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.not-in-or-out {
		.squareContent {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;

			.divSquare {
				margin: 8px;
				width: 10px;
				height: 10px;
				cursor: pointer;
			}
		}
	}
</style>
