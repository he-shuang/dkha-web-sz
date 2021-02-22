<template>
	<el-dialog :title="type=='post'?'新建':'编辑'" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<div>
			<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
				<el-row>
					<el-col>
						<el-form-item class="block-item" label="照片" prop="vrPhoneimg">
							<el-upload class="avatar-uploader" :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false"
							 :on-success="handleUploadSuccess" :before-upload="beforeUpload" :data="{folderName:'visitor'}">
								<img v-if="dataForm.vrPhoneimg" :src="$ImgServerUrl+dataForm.vrPhoneimg" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名" prop="vrName">
							<el-input v-model="dataForm.vrName" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="身份证号" prop="vrIdno">
							<el-input v-model="dataForm.vrIdno" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="UWB标签" prop="vrUwbid">
							<el-input v-model="dataForm.vrUwbid" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="性别" prop="vrSex">
							<el-radio-group v-model="dataForm.vrSex" placeholder="请输入">
								<el-radio disabled v-for="item in  genderList" :key="item.dictLable" :label="item.dictValue">{{item.dictLabel}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="被访人员" prop="vrInterviewed">
							<el-select v-model="dataForm.vrInterviewed" clearable placeholder="请选择" filterable @change="getPhoneHandle">
								<el-option v-for="item in staffList" :label="item.scWaname" :value="item.scWaid" :key="item.scWaid"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="访客体温" prop="vrTemperature">
							<el-input-number :controls="false" v-model="dataForm.vrTemperature" placeholder="请输入" clearable></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="被访人电话" prop="vrInterviewedPhone">
							<el-input v-model="dataForm.vrInterviewedPhone" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="访客电话" prop="vrPhone">
							<el-input v-model="dataForm.vrPhone" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="访问地址" prop="vrAddress">
							<el-input v-model="dataForm.vrAddress" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="访问楼层" prop="dfFloorid">
							<el-cascader v-model="dataForm.dfFloorid" :props="{ value: 'df_floorid', label: 'df_floorname',emitPath:false}"
							 clearable placeholder="请选择" :options="FloorList" style="width: 100%;"></el-cascader>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="访问事由" prop="vrReasons">
							<el-input type="textarea" :rows="3" resize="none" v-model="dataForm.vrReasons" placeholder="请输入" clearable></el-input>
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
	import {
		treeDataTranslate
	} from '@/utils'
	import debounce from 'lodash/debounce'
	import Cookies from 'js-cookie'
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters(['uwbId']),
		},
		watch: {
			'dataForm.vrIdno': {
				immediate: true,
				handler(val) {
					let gender = '0';
					if (val && val.length == 18) {
						gender = val[16] % 2 == 0 ? '0' : '1';
					}
					this.dataForm.vrSex = gender
				}
			},
			uwbId(val) {
				// 覆盖到当前id绑定
				if (val) {
					this.dataForm.vrUwbid = val;
					this.$store.commit("visitor/UPDATE_VISITOR", '')
				}
			}
		},
		data() {
			const asyncValidate = (rule, value, callback) => {
				this.$http({
					url: "/system/globalValidation/checkUwb",
					method: "get",
					params: {
						id: null,
						uwb: value
					}
				}).then(({
					data: res
				}) => {
					if (res) {
						callback()
					} else {
						callback(new Error('UWB标签重复'))
					}
				}).catch(err => {
					callback(new Error(err.msg))
				})
			};
			return {
				dialogVisible: false,
				loading: false,
				type: 'post',
				FloorList: [], // 楼栋、楼层级联
				staffList: [], // 教职工列表 
				dataForm: {
					vrPhoneimg: '',
					vrName: '',
					vrIdno: '',
					vrSex: '0',
					vrUwbid: '',
					scWaid: '',
					vrTemperature: undefined,
					vrAddress: '',
					dfFloorid: [],
					vrReasons: '',
					vrInterviewed: "", // 被访人员ID
					vrInterviewedPhone: "", // 被访问人员电话
					vrPhone: "", // 访客电话
				},
				genderList: getDictDataList('gender').filter(item => item.dictValue < 2),
				rules: {
					vrName: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					vrInterviewed: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					vrSex: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					vrIdno: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					scWaid: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					vrUwbid: [{
							required: true,
							validator: (rule, value, callback) => {
								if (!/^[0-9]+$/.test(value)) {
									return callback(new Error("UWB标签只能是数字"));
								}
								callback()
							},
							trigger: ['change']
						},
						{
							required: true,
							validator: asyncValidate,
							trigger: ['change']
						}
					],
					vrPhone: [{
						required: true,
						validator: isMobile,
						trigger: ['blur', 'change']
					}],
					vrAddress: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					vrReasons: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					vrTemperature: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					dfFloorid: [{
						required: true,
						validator: (rule, value, callback) => {
							if (value.length === 0) {
								return callback(new Error("请选择"));
							} else if (value.length === 1) {
								return callback(new Error("请选择楼层"));
							} else {
								return callback();
							}
						},
						trigger: 'change'
					}],
				},
				uploadHeaders: {},
				uploadUrl: window.SITE_CONFIG['apiURL'] + '/system/upload',
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
				this.getTfSetupaddrList() // 获取楼栋、楼层
				this.getStaffList() // 获取职工信息
				// 编辑
				if (data) {
					this.type = "put";
					this.dataForm = {
						...data,
						vrSex: String(data.vrSex),
					}
				}
				// 新增
				else {
					this.type = "post";
					this.dataForm = {
						vrPhoneimg: '',
						vrPhone: "",
						vrName: '',
						vrIdno: '',
						vrSex: '0',
						vrUwbid: '',
						scWaid: '',
						vrTemperature: undefined,
						vrAddress: '',
						vrReasons: '',
						dfFloorid: [],
						vrInterviewed: "", // 被访人员ID
						vrInterviewedPhone: "", // 被访问人员电话
						scPhonenum: "", // 访客电话

					};
					this.$nextTick(() => {
						this.$refs['dataForm'].clearValidate();
					})
				}
			},
			// 获取楼栋和楼层的cascader
			getTfSetupaddrList() {
				// -1是获取所有楼栋
				this.$http.get(`/system/scdormitoryfloor/tree/-1`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.FloorList = treeDataTranslate(res.data, 'df_floorid', 'df_parentid')
				}).catch(() => {})
			},
			// 获取职工信息
			getStaffList() {
				this.$http.get(`/system/scworkersarchives/getAll`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.staffList = res.data
				}).catch(() => {})
			},
			// 根据职工联动手机号码
			getPhoneHandle(e) {
				if (e) {
					this.staffList.forEach(item => {
						if (e === item.scWaid) {
							this.dataForm.vrInterviewedPhone = item.scPhonenum
						}
					})
				} else {
					this.dataForm.vrInterviewedPhone = ""
				}
			},
			submitInfo: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					this.dataForm.vrTemperature = this.dataForm.vrTemperature.toFixed(2)
					this.$http({
						url: "/system/scvisitorrecord",
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
			handleUploadSuccess(res) {
				if (res.code != 0) {
					return this.$message.error(res.msg)
				}
				this.dataForm.vrPhoneimg = res.data.path
			},
			beforeUpload(file) {
				const isJPG = file.type == 'image/jpeg' || file.type == 'image/png';
				const isLess2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
				}
				if (!isLess2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLess2M;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-form {
			.el-form-item {

				.el-date-editor--date,
				.el-input-number,
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
