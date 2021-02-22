<template>
	<el-card shadow="never" class="aui-card--fill dormitory-room-detailed">
		<el-form inline :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="姓名">
				<el-input v-model="dataForm.scStuname" clearable placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="学号">
				<el-input v-model="dataForm.scNo" clearable placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="宿舍号">
				<el-input v-model="dataForm.drNum" clearable placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="学院">
				<el-select v-model="dataForm.scSchool" placeholder="请选择" filterable clearable>
					<el-option v-for="item in schoolList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期">
				<el-date-picker v-model="dataForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" style="width: 100%;" border>
			<el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
			<el-table-column label="照片" width="120" align="center">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.scPhotoimg" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="scStuname" label="姓名" align="center" width="100"></el-table-column>
			<el-table-column prop="scNo" label="学号" align="center" width="150"></el-table-column>
			<el-table-column prop="scPhonenum" label="联系电话" align="center" width="150"></el-table-column>
			<el-table-column prop="drNum" label="宿舍号" align="center" width="100"></el-table-column>
			<el-table-column label="学院" align="center">
				<template slot-scope="scope">
					{{$getDictLabel('school',scope.row.scSchool)}}
				</template>
			</el-table-column>
			<el-table-column prop="leaveDoorTime" label="最后一次出宿舍时间" align="center"></el-table-column>
			<el-table-column prop="leaveSchoolTime" label="最后一次出科研楼时间" align="center"></el-table-column>
			<el-table-column prop="date" label="日期" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictDataList,
		getTime
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scstudentsnotinschool/page',
					getDataListIsPage: true,
				},
				limit: 6,
				daterange: null,
				dataForm: {
					scStuname: "",
					scNo: "",
					drNum: "", // 宿舍号
					scSchool: "", // 学院
					date: "",
				},
			}
		},
		computed: {
			schoolList() {
				return getDictDataList("school")
			},
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.scPhotoimg
				})
			},
		},
		methods: {
			reset(formName) {
				this.$refs[formName].resetFields();
				this.dataForm = {
					scStuname: "",
					scNo: "",
					drNum: "", // 宿舍号
					scSchool: "", // 学院
					date: "",
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
