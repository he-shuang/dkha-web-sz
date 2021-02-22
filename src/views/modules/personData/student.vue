<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="80px" inline>
			<el-form-item label="姓名" prop="scStuname">
				<el-input v-model="dataForm.scStuname" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="学号" prop="scNo">
				<el-input v-model="dataForm.scNo" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
				<el-button type="primary" @click="addStudent">新建</el-button>
				<el-button type="success" @click="uploadExcel">导入信息</el-button>
				<el-button type="success" @click="uploadImg" v-if="$hasPermission('system:scstudents:importImg')">导入图片</el-button>
				<el-button type="success" @click="exportHandle" v-loading="loading">导出信息</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" @selection-change="checkListHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
			<el-table-column label="照片">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.scPhotoimg" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="scStuname" label="姓名" show-overflow-tooltip></el-table-column>
			<el-table-column prop="scNo" label="学号" show-overflow-tooltip></el-table-column>
			<el-table-column prop="scSex" label="性别" :formatter="formatterSex" show-overflow-tooltip></el-table-column>
			<el-table-column prop="scPhonenum" label="联系电话" show-overflow-tooltip></el-table-column>
			<el-table-column prop="scEducation" label="学历" :formatter="formatterEducation" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<div>
						<el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
						<el-button type="text" @click="editHandle(scope.row)">修改</el-button>
						<el-button type="text" v-if="scope.row.scUwbid" @click="trackHandle(scope.row)">轨迹跟踪</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6,10, 20, 50, 100,500]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 新增修改 -->
		<add-or-update ref="addOrUpdate"></add-or-update>
		<!-- 查看 -->
		<view-student ref="viewStudent"></view-student>
		<!-- 批量上传图片 -->
		<upload ref="studentUploadImg" tips="支持jpg、png文件，文件大小不超过500kb，文件命名方式“学号_姓名”" accept="image/png,image/jpeg,image/jpg"
		 upload-url="/system/scstudents/importImg"></upload>
		<!-- 批量上传信息 -->
		<upload ref="studentUploadExcel" template-url="./template/学生信息导入表模板.xls" upload-url="/system/scstudents/importInfoExcel"></upload>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import addOrUpdate from './student/student-add-or-update'
	import viewStudent from './student/student-view'
	import {
		getDictLabel
	} from '@/utils'
	import upload from '@/components/public/upload-excel-or-img'

	export default {
		mixins: [mixinViewModule],
		components: {
			addOrUpdate,
			viewStudent,
			upload,
		},
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scstudents/page',
					deleteURL: '/system/scstudents',
					getDataListIsPage: true,
				},
				limit: 6,
				dataForm: {
					scStuname: '',
					scNo: ''
				},
				dataList: [],
				checkList: [],
				loading: false,
			}
		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.scPhotoimg
				})
			},
		},
		methods: {
			// 选择需要导出的人员
			checkListHandle(param) {
				this.checkList = param.map(item => {
					return item.scStdid
				})
				console.log(this.checkList)
			},
			// 导出
			exportHandle() {
				if (this.checkList.length === 0) {
					return this.$message.warning(`请勾选需要导出的数据`)
				}
				this.loading = true
				this.$http.post(`/system/scstudents/pageExport`, this.checkList, {
					responseType: "blob"
				}).then(res => {
					const content = res.data;
					const blob = new Blob([content], {
						type: "application/vnd.ms-excel;charset=utf-8"
					});
					const fileName = "学生信息";
					if ("download" in document.createElement("a")) {
						const elink = document.createElement("a");
						elink.download = fileName;
						elink.style.display = "none";
						elink.href = URL.createObjectURL(blob);
						document.body.appendChild(elink);
						elink.click();
						URL.revokeObjectURL(elink.href);
						document.body.removeChild(elink);
					} else {
						navigator.msSaveBlob(blob, fileName);
					}
				}).catch(() => {}).finally(() => {
					this.loading = false
				})
			},

			addStudent() {
				this.$refs['addOrUpdate'].init()
			},
			search() {
				this.page = 1;
				this.query();
			},
			resetQuery() {
				this.page = 1;
				this.dataForm = {
					scStuname: '',
					scNo: ''
				};
				this.query();
			},
			viewHandle(row) {
				this.$refs['viewStudent'].init(row)
			},
			editHandle(row) {
				this.$refs['addOrUpdate'].init(row)
			},
			trackHandle(row) {
				this.$router.push({
					path: "/xwyl-track",
					query: {
						tid: row.scUwbid
					}
				})
			},
			uploadExcel() {
				this.$refs['studentUploadExcel'].init()
			},
			uploadImg() {
				this.$refs['studentUploadImg'].init()
			},
			formatterEducation(row) {
				return getDictLabel('education', row.scEducation)
			},
			formatterSex(row) {
				return getDictLabel('gender', row.scSex)
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
