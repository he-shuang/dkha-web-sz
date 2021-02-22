<template>
	<el-dialog title="配置信息" :visible.sync="dialogVisible" :close-on-click-modal="false" top="10vh">
		<div>
			<el-form ref="dataForm" :model="dataForm" label-width="180px" :rules="rules">
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备名称" prop="deviceName">
							<el-input v-model="dataForm.deviceName" disabled :max="30"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="管理密码" prop="devicePassword">
							<el-input v-model="dataForm.devicePassword" :max="30"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="人脸识别阈值" prop="threshold">
							<el-input-number v-model="dataForm.threshold" :controls="false" :min="0" :max="1" :precision="2">
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="关门延时" prop="openDelay">
							<el-input-number v-model="dataForm.openDelay" :controls="false" :min="0" :max="100" :precision="1"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="识别失败重试间隔" prop="interval">
							<el-input-number v-model="dataForm.interval" :controls="false" :min="1" :max="10" :precision="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="识别成功重试间隔" prop="successRetryDelay">
							<el-input-number v-model="dataForm.successRetryDelay" :controls="false" :min="1" :max="10" :precision="1"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="失败语音模式" prop="strangerVoiceMode">
							<el-select v-model="dataForm.strangerVoiceMode" placeholder="请选择">
								<el-option value="1" label="不播报"></el-option>
								<el-option value="2" label="播报警报音"></el-option>
								<el-option value="3" label="预置音-识别失败"></el-option>
								<el-option value="4" label="预置音-验证不通过"></el-option>
								<!-- <el-option value="100" label="播报自定义内容" ></el-option> -->
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="成功语音模式" prop="voiceMode">
							<el-select v-model="dataForm.voiceMode" placeholder="请选择">
								<el-option value="1" label="不播报"></el-option>
								<el-option value="2" label="播报姓名"></el-option>
								<el-option value="3" label="预置音-识别成功"></el-option>
								<el-option value="4" label="预置音-欢迎光临"></el-option>
								<el-option value="5" label="预置音-门已打开"></el-option>
								<el-option value="6" label="预置音-门已打开，欢迎光临"></el-option>
								<!-- <el-option value="100" label="播报自定义内容" ></el-option> -->
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="失败显示模式" prop="strangerMode">
							<el-select v-model="dataForm.strangerMode" placeholder="请选择">
								<el-option value="1" label="默认标识"></el-option>
								<el-option value="2" label="不反馈"></el-option>
								<!-- <el-option value="100" label="显示自定义内容" ></el-option> -->
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="成功显示模式" prop="displayMode">
							<el-select v-model="dataForm.displayMode" placeholder="请选择">
								<el-option label="显示姓名" value="1"></el-option>
								<el-option label="隐藏姓名最后一个字符" value="2"></el-option>
								<!-- <el-option label="显示自定义内容" value="100"></el-option> -->
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="识别距离" prop="signDistance">
							<el-select v-model="dataForm.signDistance" placeholder="请选择">
								<el-option :value="1" label="0~1米"></el-option>
								<el-option :value="2" label="0~1.5米"></el-option>
								<el-option :value="3" label="0~2米"></el-option>
								<el-option :value="4" label="0~2.5米"></el-option>
								<el-option :value="5" label="0~3.5米"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="公司名称" prop="companyName">
							<el-input v-model="dataForm.companyName" placeholder="请输入" :max="30"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否打开测温" prop="isOpenTemp">
							<el-switch v-model="dataForm.isOpenTemp" :active-value="true" :inactive-value="false"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="是否打开暗屏" prop=" isOpenRadar">
							<el-switch v-model="dataForm.isOpenRadar" :active-value="true" :inactive-value="false"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="识别记录图片上传开关" prop="uploadRecordImage">
							<el-switch v-model="dataForm.uploadRecordImage" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="识别成功重试开关" prop="successRetry">
							<el-switch v-model="dataForm.successRetry" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="IR活体预览显示开关" prop="irLivePreview">
							<el-switch v-model="dataForm.irLivePreview" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="设备每日重启开关" prop="rebootEveryDay">
							<el-switch v-model="dataForm.rebootEveryDay" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="人脸质量检测开关" prop="faceQuality">
							<el-switch v-model="dataForm.faceQuality" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="人脸质量检测阈值" prop="faceQualityThreshold">
							<el-input-number v-model="dataForm.faceQualityThreshold" :controls="false" :min="0" :max="1" :precision="2"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="底部右下角标题" prop="bottomTitle">
							<el-input v-model="dataForm.bottomTitle" placeholder="请输入" :max="30"></el-input>
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
		getDictLabel
	} from "@/utils";
	import debounce from 'lodash/debounce'
	export default {
		filters: {
			typeFilter(value) {
				return getDictLabel("accessEquipType", value);
			}
		},
		data() {
			return {
				dialogVisible: false,
				loading: false,
				dataForm: {},
				rules: {
					deviceName: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					devicePassword: [{
							required: true,
							message: '请输入',
							trigger: ['blur', 'change']
						},
						{
							max: 30,
							message: '最多30个字符',
							trigger: ['blur', 'change']
						},
					],
					threshold: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					openDelay: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					interval: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					successRetryDelay: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					isOpenTemp: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					isOpenRadar: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					uploadRecordImage: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					successRetry: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					signDistance: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					voiceMode: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					displayMode: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					strangerMode: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					strangerVoiceMode: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					irLivePreview: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					rebootEveryDay: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					faceQualityThreshold: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					faceQuality: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					bottomTitle: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
				}
			};
		},
		methods: {
			init(id) {
				this.dialogVisible = true;
				this.loading = true;
				// 获取设备配置信息
				this.$http({
					url: `/system/scaidooreight/getdoorsetting/${id}`,
					method: "get"
				}).then(({
					data: res
				}) => {
					if (res.code != 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm = {
						aeId: id,
						...res.data
					}
				}).finally(() => {
					this.loading = false;
				})
			},
			submitInfo: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					let submitData = {
						...this.dataForm
					}
					for (let key in submitData) {
						if (submitData[key] === "") {
							delete submitData[key]
						}
					}
					// 提交配置信息
					this.$http({
						url: "/system/scaidooreight/setdoorsetting",
						method: 'post',
						data: submitData
					}).then(({
						data
					}) => {
						if (data.code != 0) {
							return this.$message.error(data.msg)
						}
						this.dialogVisible = false;
						this.$parent.$parent.query();
						this.$message.success(data.msg || '操作成功')
					}).finally(() => {
						this.loading = false;
					})
				})

			}, 1000),
		}
	};
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-row {
			color: #fff;
			line-height: 35px;
		}

		.el-input,
		.el-input-number,
		.el-select {
			width: 100%;
		}

		.el-switch {
			margin-left: 20px;

			/deep/.el-switch__label {
				color: #fff;

				&.is-active {
					color: #17B3A3;
				}
			}
		}
	}
</style>
