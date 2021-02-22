<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
	 :close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item prop="imId" label="id" style="display: none;">
				<el-input v-model="dataForm.imId" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="imDevicename" label="设备名称">
				<el-input v-model="dataForm.imDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="imDevicesn" label="设备序列号">
				<el-input v-model="dataForm.imDevicesn" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="uwb" label="UWB标签">
				<el-input v-model="dataForm.uwb" placeholder="请输入" clearable :disabled="status"></el-input>
			</el-form-item>
			<el-form-item prop="imSetupaddr" label="安装位置">
				<el-cascader v-model="dataForm.imSetupaddr" :props="{ value: 'df_floorid', label: 'df_floorname',checkStrictly: true}"
				 clearable placeholder="请选择" :options="tfSetupaddrList" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item prop="imExpirydate" label="有效期">
				<el-date-picker v-model="dataForm.imExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></el-date-picker>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" v-model="dataForm.remark" clearable></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<el-button @click="visible = false">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()" v-loading="loading">{{ $t('confirm') }}</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import throttle from 'lodash/throttle'
	import {
		validateIP,
	} from '@/utils/validate.js'
	import {
		treeDataTranslate
	} from '@/utils'
	export default {
		name: "electric-add-or-update",
		data() {
			return {
				visible: false,
				loading: false,
				status: false,
				tfSetupaddrList: [], // 楼栋、楼层级联
				dataForm: {
					"id": "",
					imId: "",
					imDevicename: "",
					"imDevicesn": "",
					uwb: "",
					"imSetupaddr": [],
					imExpirydate: "",
					remark: "",
				},
			}
		},
		computed: {
			dataRule() {
				const asyncValidate = (rule, value, callback) => {
					if (this.status) {
						return callback()
					}
					this.$http({
						url: "/system/globalValidation/checkUwb",
						method: "get",
						params: {
							id: this.dataForm.scWaid,
							uwb: value
						}
					}).then(({
						data: res
					}) => {
						if (res) {
							callback()
						} else if (!this.dataForm.id) {
							callback(new Error('UWB标签重复'))
						}
					}).catch(err => {
						callback(new Error(err.msg))
					})
				};
				return {
					imDevicename: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					imDevicesn: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					uwb: [{
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
					imSetupaddr: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					imExpirydate: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
				}
			}
		},
		methods: {
			init() {
				this.visible = true
				this.status = false
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					Promise.all([this.getTfSetupaddrList()]).then(() => {
						if (this.dataForm.id) {
							this.status = true
							this.getInfo()
						}
					})
				})
			},
			// 获取楼栋和楼层的cascader
			getTfSetupaddrList() {
				// -1是获取所有楼栋
				this.$http.get(`/system/scdormitoryfloor/roomTree/-1`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.tfSetupaddrList = treeDataTranslate(res.data, 'df_floorid', 'df_parentid')
				}).catch(() => {})
			},
			// 获取信息
			getInfo() {
				this.$http.get(`/system/scimportantdevice/${this.dataForm.id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm = { ...this.dataForm,
						...res.data
					}
				}).catch(() => {})
			},
			// 表单提交
			dataFormSubmitHandle: throttle(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/scimportantdevice' :
						'/system/scimportantdevice', this.dataForm).then(({
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
					}).catch(() => {}).finally(() => {
						this.loading = false
					})
				})
			}, 1000, {
				'leading': true,
				'trailing': false
			})
		}
	}
</script>

<style scoped lang="scss">
	/deep/ .el-input__inner[disabled] {
		text-align: center;
	}
</style>
