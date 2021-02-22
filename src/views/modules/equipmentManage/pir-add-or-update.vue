<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
	 :close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item prop="mbdId" label="id" style="display: none;">
				<el-input v-model="dataForm.mbdId" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item prop="mbdDevicename" label="设备名称">
				<el-input v-model="dataForm.mbdDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="mbdDevicesn" label="设备序列号">
				<el-input v-model="dataForm.mbdDevicesn" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="mbdExpirydate" label="有效期">
				<el-date-picker v-model="dataForm.mbdExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></el-date-picker>
			</el-form-item>
			<el-form-item prop="mbdUwbaddr" label="安装位置">
				<el-cascader v-model="dataForm.mbdUwbaddr" :props="{ value: 'df_floorid', label: 'df_floorname',checkStrictly: true}"
				 clearable placeholder="请选择" :options="tfSetupaddrList" style="width: 100%;"></el-cascader>
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
		treeDataTranslate
	} from '@/utils'
	export default {
		name: "pir-add-or-update",
		data() {
			return {
				loading: false,
				visible: false,
				tfSetupaddrList: [], // 楼栋、楼层级联
				dataForm: {
					id: "",
					mbdId: "",
					mbdDevicetype: 0, // 设备类型
					mbdNetwork: 0, // 是否组网
					mbdDevicename: "",
					mbdDevicesn: "",
					mbdExpirydate: "",
					mbdUwbaddr: [],
					remark: "",
				},
			}
		},
		computed: {
			dataRule() {
				return {
					mbdDevicename: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					mbdDevicesn: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					mbdExpirydate: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					mbdUwbaddr: [{
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
				// this.dataForm.mbdUwbaddr = ""
				this.dataForm.mbdNetwork = 0
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					Promise.all([this.getTfSetupaddrList()]).then(() => {
						if (this.dataForm.id) {
							this.getInfo()
						}
					})
				})
			},
			// 获取楼栋和楼层的cascader
			getTfSetupaddrList() {
				// -1所有 0 学生宿舍  1 教师宿舍 2 教学楼
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
				this.$http.get(`/system/scmodbusdevicedc/${this.dataForm.id}`).then(({
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
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/scmodbusdevicedc' :
						'/system/scmodbusdevicedc', this.dataForm).then(({
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
