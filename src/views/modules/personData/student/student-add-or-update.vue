<template>
	<el-dialog :title="type=='post'?'新建':'修改'" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<div>
			<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
				<el-row>
					<el-col>
						<el-form-item class="block-item" label="照片" prop="scPhotoimg">
							<img-clip v-model="dataForm.scHeadphotoimg" folder-name="student" ref="img"></img-clip>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名" prop="scStuname">
							<el-input v-model.trim="dataForm.scStuname" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="身份证号" prop="scIdno">
							<el-input v-model="dataForm.scIdno" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="scPhonenum">
							<el-input v-model="dataForm.scPhonenum" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="性别" prop="scSex">
							<el-radio-group v-model="dataForm.scSex" placeholder="请输入">
								<el-radio disabled v-for="item in  genderList" :key="item.dictLabel" :label="item.dictValue">{{item.dictLabel}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="学号" prop="scNo">
							<el-input v-model="dataForm.scNo" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="学历" prop="scEducation">
							<el-select v-model="dataForm.scEducation" placeholder="请选择" clearable>
								<el-option v-for="item in educationList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="入学时间" prop="scRegisterdate">
							<el-date-picker v-model="dataForm.scRegisterdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="学生状态" prop="scStatus">
							<el-select v-model="dataForm.scStatus" placeholder="请选择" clearable>
								<el-option v-for="item in studentStatusList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="type=='put'">
					<el-col :span="12">
						<el-form-item label="毕业时间">
							<el-date-picker v-model="dataForm.scGraduationdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择"
							 :picker-options="pickerOptions"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="学院" prop="scSchool">
							<el-select v-model="dataForm.scSchool" placeholder="请选择" clearable>
								<el-option v-for="item in schoolList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div slot="footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" v-loading="loading" @click="submitInfo">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {
		getDictDataList
	} from '@/utils'
	import {
		isMobile,
		idCardValidate
	} from '@/utils/validate'
	import debounce from 'lodash/debounce'
	import Cookies from 'js-cookie'
	import imgClip from '@/components/public/img-clip'
	export default {
		components: {
			imgClip
		},
		watch: {
			'dataForm.scIdno': {
				immediate: true,
				handler(val) {
					let gender = '0';
					if (val && val.length == 18) {
						gender = val[16] % 2 == 0 ? '0' : '1';
					}
					this.dataForm.scSex = gender
				}
			}
		},
		data() {
			let _this = this;
			return {
				dialogVisible: false,
				loading: false,
				imgLoading: false,
				type: 'post',
				dataForm: {
					scPhotoimg: '',
					scStuname: '',
					scIdno: '',
					scSex: '0',
					scPhonenum: '',
					scNo: '',
					scStatus: '',
					scEducation: '',
					scRegisterdate: '',
					scGraduationdate: '',
					scHeadphotoimg: "",
					scSchool:"", // 学院
				},
				pickerOptions: {
					disabledDate: (time) => {
						return time.getTime() < new Date(this.dataForm.scRegisterdate).getTime()
					}
				},
				genderList: getDictDataList('gender').filter(item => item.dictValue < 2),
				studentStatusList: getDictDataList('studentStatus'),
				educationList: getDictDataList('education'),
				schoolList: getDictDataList('school'), // 电子科技大学深圳高等研究院 学院列表
				rules: {
					scHeadphotoimg: [{
						required: true,
						message: '请上传图片',
						trigger: ['blur', 'change']
					}, ],
					scStuname: [{
							required: true,
							message: '请输入',
							trigger: ['blur', 'change']
						},
						{
							max: 50,
							message: '最多50个字符',
							trigger: ['blur', 'change']
						}
					],
					scIdno: [{
							required: true,
							message: '请输入',
							trigger: ['blur', 'change']
						},
						{
							validator: idCardValidate,
							trigger: ['blur', 'change']
						}
					],
					scSex: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					scPhonenum: [{
							required: true,
							message: '请输入',
							trigger: ['blur', 'change']
						},
						{
							validator: isMobile,
							trigger: ['blur', 'change']
						}
					],
					scNo: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					scEducation: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					scRegisterdate: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					scStatus: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}]

				},
				uploadHeaders: {},
				uploadUrl: window.SITE_CONFIG['apiURL'] + '/system/upload'
			}
		},
		created() {
			this.uploadHeaders = {
				Authorization: 'Bearer ' + Cookies.get('access_token') || ''
			}
		},
		methods: {
			init(data) {
				this.dialogVisible = true;
				// 编辑
				if (data) {
					this.type = "put";
					this.dataForm = {
						...data,
						scSex: String(data.scSex),
						scStatus: String(data.scStatus),
						scEducation: String(data.scEducation),
					}
					this.$nextTick(()=>{
						this.$refs['img'].init(this.dataForm.scHeadphotoimg)
					})
				}
				// 新增
				else {
					this.type = "post";
					this.dataForm = {
						scPhotoimg: '',
						scStuname: '',
						scIdno: '',
						scSex: '0',
						scPhonenum: '',
						scNo: '',
						scStatus: '',
						scEducation: '',
						scRegisterdate: '',
						scGraduationdate: null,
						scHeadphotoimg: "",
						scSchool:"", // 学院
					};
					this.$nextTick(() => {
						this.$refs['dataForm'].clearValidate()
					})
				}
			},
			submitInfo: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					this.dataForm.scPhotoimg = sessionStorage.getItem("eightPic")
					sessionStorage.removeItem("fivePic")
					this.dataForm.scGraduationdate = this.dataForm.scGraduationdate ? this.dataForm.scGraduationdate : null;
					this.$http({
						url: "/system/scstudents",
						method: this.type,
						data: this.dataForm
					}).then(({
						data
					}) => {
						if (data.code != 0) {
							return this.$message.error(data.msg)
						}
						this.dialogVisible = false;
						if (this.type == 'post') {
							this.$parent.$parent.resetQuery();
						} else {
							this.$parent.$parent.search();
						}
						this.$message.success(data.msg)
					}).finally(() => {
						this.loading = false
					})
				})

			}, 1000),
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-form {
			.el-form-item {

				.el-date-editor--date,
				.el-select {
					width: 100%;
				}

				/deep/ .el-upload {
					border: 1px dashed #d9d9d9;
					border-radius: 6px;
					cursor: pointer;
					position: relative;
					overflow: hidden;
					margin-left: 20px;

					.avatar-uploader-icon {
						font-size: 28px;
						color: #fff;
						height: 150px;
						width: 106px;
						line-height: 150px;
						text-align: center;
					}

					.avatar {
						height: 150px;
						width: 106px;
						display: block;
					}
				}
			}
		}
	}
</style>
