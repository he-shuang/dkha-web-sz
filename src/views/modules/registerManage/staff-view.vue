<template>
	<el-dialog title="详情" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false">
		<div>
			<el-row>
				<el-col :span="3">照片：</el-col>
				<el-col :span="9">
					<el-image class="student-img" :src="$ImgServerUrl+dataForm.scPhotoimg">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</el-col>
				<el-col :span="12">
					<el-row>
						<el-col :span="6">姓名：</el-col>
						<el-col :span="18">{{dataForm.scWaname}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">性别：</el-col>
						<el-col :span="18">{{dataForm.scWasex | filterLabel('gender')}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">类型：</el-col>
						<el-col :span="18">{{dataForm.scEmptype | filterLabel('employType')}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">状态：</el-col>
						<el-col :span="18">{{dataForm.scStatus | filterLabel('staffStatus') }}</el-col>
					</el-row>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">联系电话：</el-col>
				<el-col :span="9">{{dataForm.scPhonenum}}</el-col>
				<el-col :span="3">职工编号：</el-col>
				<el-col :span="9">{{dataForm.scEmpno}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">身份证号：</el-col>
				<el-col :span="9">{{dataForm.scIdno}}</el-col>
				<el-col :span="3">入职时间：</el-col>
				<el-col :span="9">{{dataForm.scHiredate}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3"> UWB标签：</el-col>
				<el-col :span="9">{{dataForm.scUwbid}}</el-col>
				<el-col :span="3"> RFID：</el-col>
				<el-col :span="9">{{dataForm.scRfcardid}}</el-col>
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

			.el-col-3 {
				text-align: right;
			}

			.student-img {
				width: 106px;
				height: 150px;
			}
		}
	}
</style>
