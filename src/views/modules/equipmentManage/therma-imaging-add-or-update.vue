<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
	 :close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item prop="tfId" label="id" style="display: none;">
				<el-input v-model="dataForm.tfId" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="tfDevicename" label="设备名称">
				<el-input v-model="dataForm.tfDevicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="tfDevicesn" label="设备序列号">
				<el-input v-model="dataForm.tfDevicesn" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="tfIpgateway" label="IP地址">
				<el-input v-model="dataForm.tfIpgateway" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="tfDevicetype" label="安装场景">
				<el-select filterable v-model="dataForm.tfDevicetype" placeholder="请选择" clearable style="width: 100%;">
					<el-option v-for="item in sceneTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="tfSetupaddr" label="安装位置">
				<el-cascader v-model="dataForm.tfSetupaddr" :props="{ value: 'df_floorid', label: 'df_floorname'}" clearable
				 placeholder="请选择" :options="tfSetupaddrList" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item prop="tfExpirydate" label="有效期">
				<el-date-picker v-model="dataForm.tfExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></el-date-picker>
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
		treeDataTranslate,
		getDictDataList
	} from '@/utils'
	export default {
		name: "electric-add-or-update",
		data() {
			return {
				visible: false,
				loading: false,
				sceneTypeList: getDictDataList("sceneType"),
				tfSetupaddrList: [], // 楼栋、楼层级联
				dataForm: {
					"id": "",
					tfId: "",
					tfDevicename: "",
					"tfDevicesn": "",
					"tfIpgateway": "",
					tfDevicetype: "",
					tfSetupaddr: [],
					"tfExpirydate": "",
					remark: "",
				},
			}
		},
		computed: {
			dataRule() {
				return {
					tfDevicename: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					tfDevicesn: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					tfIpgateway: [{
						required: true,
						validator: validateIP,
						trigger: 'blur'
					}],
					tfDevicetype: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					tfSetupaddr: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					tfExpirydate: [{
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
				// -1是获取所有楼栋
				this.$http.get(`/system/scdormitoryfloor/tree/-1`).then(({
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
				this.$http.get(`/system/scthermalimaging/${this.dataForm.id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm = { ...this.dataForm,
						...res.data,
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
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/scthermalimaging' :
						'/system/scthermalimaging', this.dataForm).then(({
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
</style>
