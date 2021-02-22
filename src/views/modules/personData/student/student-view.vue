<template>
	<el-dialog title="详情" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false">
		<div>
			<el-row>
				<el-col :span="3">照片：</el-col>
				<el-col :span="9">
					<el-image class="student-img" :src="$ImgServerUrl+dataForm.scPhotoimg">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../../assets/img/person.jpg">
						</div>
					</el-image>
				</el-col>
				<el-col :span="12">
					<el-row>
						<el-col :span="6">姓名：</el-col>
						<el-col :span="18">{{dataForm.scStuname}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">性别：</el-col>
						<el-col :span="18">{{dataForm.scSex | filterLabel('gender')}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">学号：</el-col>
						<el-col :span="18">{{dataForm.scNo}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">学历：</el-col>
						<el-col :span="18">{{dataForm.scEducation | filterLabel('education')}}</el-col>
					</el-row>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">入学时间：</el-col>
				<el-col :span="9">{{dataForm.scRegisterdate}}</el-col>
				<el-col :span="3">联系电话：</el-col>
				<el-col :span="9">{{dataForm.scPhonenum}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">毕业时间：</el-col>
				<el-col :span="9">{{dataForm.scGraduationdate?dataForm.scGraduationdate:'-'}}</el-col>
				<el-col :span="3">身份证号：</el-col>
				<el-col :span="9">{{dataForm.scIdno}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">学生状态：</el-col>
				<el-col :span="9">{{dataForm.scStatus | filterLabel('studentStatus') }}</el-col>
				<el-col :span="3"> UWB标签：</el-col>
				<el-col :span="9">{{dataForm.scUwbid}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">所属学院：</el-col>
				<el-col :span="9">{{$getDictLabel('school', dataForm.scSchool) }}</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>
<script>
	import {
		getDictLabel
	} from '@/utils'
	export default {
		filters: {
			filterLabel(val, type) {
				return getDictLabel(type, val)
			},
		},
		data() {
			return {
				dialogVisible: false,
				dataForm: {},
			}
		},
		methods: {
			init(data) {
				this.dataForm = { ...data
				};
				this.dialogVisible = true;
			},
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-row {
			color: #fff;
			line-height: 35px;

			.el-col-3,
			.el-col-6 {
				text-align: right;
			}

			.student-img {
				width: 106px;
				height: 150px;
			}
		}
	}
</style>
