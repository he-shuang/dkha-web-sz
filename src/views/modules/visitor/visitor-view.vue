<template>
	<el-dialog title="详情" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
		<div>
			<el-row>
				<el-col :span="3">照片：</el-col>
				<el-col :span="9">
					<el-image class="student-img" :src="$ImgServerUrl+dataForm.vrPhoneimg">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</el-col>
				<el-col :span="12">
					<el-row>
						<el-col :span="6">姓名：</el-col>
						<el-col :span="18">{{dataForm.vrName}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">性别：</el-col>
						<el-col :span="18">{{dataForm.vrSex | filterLabel('gender')}}</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">体温：</el-col>
						<el-col :span="18">
							<span v-if="!dataForm.vrTemperature">
								-
							</span>
							<span v-else-if="dataForm.vrTemperature<37.3" style="color:#67C23A;">
								{{dataForm.vrTemperature}}℃
							</span>
							<span v-else style="color:#f56c6c;">
								{{dataForm.vrTemperature}}℃
							</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">访客电话：</el-col>
						<el-col :span="18">{{dataForm.vrPhone}}</el-col>
					</el-row>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">UWB标签：</el-col>
				<el-col :span="9">{{dataForm.vrUwbid | filterLabel('employType')}}</el-col>
				<el-col :span="3">身份证号码：</el-col>
				<el-col :span="9">{{dataForm.vrIdno | filterLabel('employType')}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">访客对象：</el-col>
				<el-col :span="9">{{dataForm.vrInterviewedName}}</el-col>
				<el-col :span="3">离开时间：</el-col>
				<el-col :span="9">{{dataForm.vrVistorendtime?dataForm.vrVistorendtime:'-'}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">被访人电话：</el-col>
				<el-col :span="9">{{dataForm.vrInterviewedPhone?dataForm.vrInterviewedPhone:'-'}}</el-col>
				<el-col :span="3">进入时间：</el-col>
				<el-col :span="9">{{dataForm.vrVistorbegintime}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">访问地址：</el-col>
				<el-col :span="9">{{dataForm.vrAddress}}</el-col>
				<el-col :span="3">访问楼层：</el-col>
				<el-col :span="9">{{dataForm.parentfloorname}} - {{dataForm.floorname}}</el-col>
			</el-row>
			<el-row>
				<el-col :span="3">访问事由：</el-col>
				<el-col :span="21">{{dataForm.vrReasons}}</el-col>
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
