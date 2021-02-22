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
			<el-form-item prop="tfSetupaddr" label="安装位置">
				<el-cascader v-model="dataForm.tfSetupaddr" :props="{ value: 'df_floorid', label: 'df_floorname'}" clearable
				 placeholder="请选择" :options="tfSetupaddrList" @change="handleRoomChange" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item prop="tfExpirydate" label="有效期">
				<el-date-picker v-model="dataForm.tfExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></el-date-picker>
			</el-form-item>
			<el-form-item prop="scTransformerroomDTOList" label="检测端编号">
				<el-row v-for="(item,index) in dataForm.scTransformerroomDTOList" :key="index">
					<el-col :span="2">
						<el-input v-model="item.tfrPortaddr" :disabled="true">
						</el-input>
					</el-col>
					<el-col :span="22">
						<el-select v-model="item.drId" placeholder="请选择" clearable style="width: 100%;" @change="selectHandle($event,item)">
							<el-option v-for="item in roomList" :key="item.drId" :label="item.drNum" :value="item.drId">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
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
				tfSetupaddrList: [], // 楼栋、楼层级联
				dataForm: {
					"id": "",
					tfId: "",
					tfDevicename: "",
					"tfDevicesn": "",
					"tfIpgateway": "",
					tfSetupaddr: [],
					"tfExpirydate": "",
					scTransformerroomDTOList: [{
							tfrPortaddr: 1,
							drId: "",
						},
						{
							tfrPortaddr: 2,
							drId: "",
						},
						{
							tfrPortaddr: 3,
							drId: "",
						},
						{
							tfrPortaddr: 4,
							drId: "",
						},
					],
					remark: "",
				},
				roomList: [], // 房间号列表
			}
		},
		computed: {
			dataRule() {
				var validateRoom = (rule, value, callback) => {
					let status = value.some(item => {
						return item.drId !== ""
					})
					if (status) {
						callback();
					} else {
						callback(new Error(this.$t('validate.required')));
					}
				}
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
					scTransformerroomDTOList: [{
						required: true,
						validator: validateRoom,
						trigger: 'change'
					}],
				}
			}
		},
		methods: {
			init() {
				this.visible = true
				this.roomList = []
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
			// 根据楼层id获取房间列表
			handleRoomChange(e) {
				this.dataForm.scTransformerroomDTOList = [{
						tfrPortaddr: 1,
						drId: "",
					},
					{
						tfrPortaddr: 2,
						drId: "",
					},
					{
						tfrPortaddr: 3,
						drId: "",
					},
					{
						tfrPortaddr: 4,
						drId: "",
					},
				]
				this.roomList = []
				if (e.length === 0) {
					return
				} else if (e.length === 1) {
					this.$message.info("请选择楼层")
				} else {
					let floorId = e[e.length - 1]
					this.$http.get(`/system/scdormitoryfloor/getByFloorId/${floorId}`).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.roomList = res.data
					}).catch(() => {})
				}
			},
			// 房间号和暴漏的接口关联
			selectHandle(e, obj) {
				this.dataForm.scTransformerroomDTOList.forEach(item => {
					if (obj.tfrPortaddr !== item.tfrPortaddr && e === item.drId) {
						item.drId = ""
					}
				})
				// if (e.drId === "") {
				// 	this.dataForm.scTransformerroomDTOList[e.tfrPortaddr - 1].drId = ""
				// } else {
				// 	let i = 0
				// 	this.dataForm.scTransformerroomDTOList.forEach(item => {
				// 		if (item.drId === e.drId) {
				// 			i++
				// 			if (i > 1) {
				// 				this.dataForm.scTransformerroomDTOList[e.tfrPortaddr - 1].drId = ""
				// 				return this.$message.info("此房间号已被使用")
				// 			}
				// 		}
				// 	})
				// }
			},

			// 获取信息
			getInfo() {
				this.$http.get(`/system/sctransformerdc/${this.dataForm.id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.handleRoomChange(res.data.tfSetupaddr)
					let ports=res.data.scTransformerroomDTOList.map(item=>{ return item.tfrPortaddr});
					let list=[
						{
							tfrPortaddr: 1,
							drId: "",
						},
						{
							tfrPortaddr: 2,
							drId: "",
						},
						{
							tfrPortaddr: 3,
							drId: "",
						},
						{
							tfrPortaddr: 4,
							drId: "",
						},
					];
					list.forEach((item,index)=>{
						let order=ports.indexOf(item.tfrPortaddr);
						if(order>=0){
							list[index]=res.data.scTransformerroomDTOList[order]
						}
					})
                    console.log("getInfo -> list", list)
					
					this.dataForm = { ...this.dataForm,
						...res.data,
						scTransformerroomDTOList:list
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
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/sctransformerdc' :
						'/system/sctransformerdc', this.dataForm).then(({
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
