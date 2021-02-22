<template>
	<el-dialog :visible.sync="visible" title="配置" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item prop="pieEquipsn" label="设备序列号">
						<el-input v-model="dataForm.pieEquipsn" placeholder="请输入" clearable disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="最新版本号" prop="version">
						<el-input v-model="dataForm.version" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item prop="thresholdvalue" label="阈值">
						<el-select v-model="dataForm.thresholdvalue" placeholder="请选择" clearable style="width: 100%;">
							<el-option v-for="item in thresholdvalueList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="ttsmodel" label="语音类型">
						<el-select v-model="dataForm.ttsmodel" placeholder="请选择" clearable style="width: 100%;">
							<el-option v-for="item in ttsmodelList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="登录账号" prop="adminaccount">
						<el-input v-model="dataForm.adminaccount" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="登陆密码" prop="adminpwd">
						<el-input v-model="dataForm.adminpwd" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="成功提示" prop="passstr">
						<el-input v-model="dataForm.passstr" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="失败提示" prop="failedstr">
						<el-input v-model="dataForm.failedstr" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="设备上报URL" prop="devicereportbaseurl">
						<el-input v-model="dataForm.devicereportbaseurl" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="设备上报sub URL" prop="devicereportsuburl">
						<el-input v-model="dataForm.devicereportsuburl" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="认证记录URL" prop="cardrecordbaseurl">
						<el-input v-model="dataForm.cardrecordbaseurl" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="认证记录sub URL" prop="cardrecordsuburl">
						<el-input v-model="dataForm.cardrecordsuburl" placeholder="请输入" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="4.5">
					<el-form-item prop="openmonocular" label="单目活体">
						<el-switch v-model="dataForm.openmonocular"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="4.5">
					<el-form-item prop="openbioliveness" label="双目活体">
						<el-switch v-model="dataForm.openbioliveness"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="4.5">
					<el-form-item prop="configurable" label="是否可配">
						<el-switch v-model="dataForm.configurable"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="4.5">
					<el-form-item prop="isidservervalidate" label="开启人证校验">
						<el-switch v-model="dataForm.isidservervalidate"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="4.5">
					<el-form-item label="服务器校验URL" prop="idservervalidateurl">
						<el-switch v-model="dataForm.idservervalidateurl"></el-switch>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template slot="footer">
			<el-button @click="visible = false">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import throttle from 'lodash/throttle'
	import {
		getDictDataList
	} from '@/utils'
	export default {
		name: "witness-configure",
		data() {
			return {
				visible: false,
				status: false, // 修改
				dataForm: {
					pieEquipsn: "",
					thresholdvalue: "",
					openmonocular: false,
					openbioliveness: false,
					adminaccount: "",
					adminpwd: "",
					configurable: false,
					ttsmodel: "",
					passstr: "",
					failedstr: "",
					devicereportbaseurl: "",
					devicereportsuburl: "",
					cardrecordbaseurl: "",
					cardrecordsuburl: "",
					isidservervalidate: false,
					idservervalidateurl: false,
					version: "",
				},
			}
		},
		computed: {
			thresholdvalueList() {
				return getDictDataList("threshold")
			},
			ttsmodelList() {
				return getDictDataList("voice_type")
			},
			dataRule() {
				return {
					thresholdvalue: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					adminaccount: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					adminpwd: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					ttsmodel: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					passstr: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					failedstr: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					devicereportbaseurl: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					devicereportsuburl: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					cardrecordbaseurl: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					cardrecordsuburl: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					version: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			init(id) {
				this.dataForm.pieEquipsn = id
				this.visible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					this.getInfo()
				})
			},
			// 获取信息
			getInfo() {
				this.$http.get(`/system/scpersonidequipconf/getByEquipsn/${this.dataForm.pieEquipsn}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					if (!res.data) {
						this.status = true
					} else {
						this.status = false
						this.dataForm = { ...this.dataForm,
							...res.data
						}
						this.dataForm.ttsmodel = String(this.dataForm.ttsmodel)
						this.dataForm.thresholdvalue = String(this.dataForm.thresholdvalue)
					}
				}).catch(() => {})
			},
			// 表单提交
			dataFormSubmitHandle: throttle(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.$http[this.status ? 'post' : 'put'](this.status ?
						'/system/scpersonidequipconf' :
						'/system/scpersonidequipconf', this.dataForm).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.$message({
							message: this.$t('prompt.success'),
							type: 'success',
							duration: 500,
							onClose: () => {
								this.visible = false
								this.$emit('refreshDataList')
							}
						})
					}).catch(() => {})
				})
			}, 1000, {
				'leading': true,
				'trailing': false
			})
		}
	}
</script>
