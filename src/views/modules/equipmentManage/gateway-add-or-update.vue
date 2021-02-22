<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
	 :close-on-press-escape="false" width="85%">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item prop="gwId" label="id" style="display: none;">
				<el-input v-model="dataForm.gwId" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="gwIpgateway" label="IP地址">
				<el-input v-model="dataForm.gwIpgateway" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="gwName" label="设备名称">
				<el-input v-model="dataForm.gwName" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item prop="mbdDevicetype" label="设备类型">
				<el-select filterable v-model="dataForm.mbdDevicetype" placeholder="请选择" clearable style="width: 100%;">
					<el-option v-for="item in eqTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="gwSn" label="设备序列号">
				<el-input v-model="dataForm.gwSn" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item prop="gwUwbnum" label="UWB区域编号">
				<el-input v-model="dataForm.gwUwbnum" placeholder="请输入" clearable></el-input>
			</el-form-item> -->
			<el-form-item prop="gwExpirydate" label="有效期">
				<el-date-picker v-model="dataForm.gwExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></el-date-picker>
			</el-form-item>
			<el-form-item prop="gwSetupaddr" label="安装位置">
				<el-cascader v-model="dataForm.gwSetupaddr" :props="{ value: 'df_floorid', label: 'df_floorname',checkStrictly: true}"
				 clearable placeholder="请选择" :options="tfSetupaddrList" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item prop="scGatebusdeviceDTOList" label="总线">
				<el-row>
					<el-col class="col-title" :span="2">序号</el-col>
					<el-col class="col-title" :span="3">总线编号</el-col>
					<el-col class="col-title" :span="3">设备类型</el-col>
					<el-col class="col-title" :span="3">设备</el-col>
					<el-col class="col-title" :span="2">灯口编号</el-col>
					<el-col class="col-title" :span="3">接口编号</el-col>
					<el-col class="col-title" :span="3">分组编号</el-col>
					<el-col class="col-title" :span="3">围栏编号</el-col>
					<el-col class="col-title" :span="2">
						<el-button size="small" type="primary" icon="el-icon-plus" circle @click="handleAddClick"></el-button>
					</el-col>
				</el-row>
				<el-row v-for="(item,index) in dataForm.scGatebusdeviceDTOList" :key="index">
					<el-col class="col-title" :span="2">{{index+1}}</el-col>
					<!-- 总线编号 -->
					<el-col :span="3">
						<el-select filterable v-model="item.gbdLineNum" placeholder="请选择" clearable style="width: 100%;" @change="handleLineChange($event,item,index)">
							<el-option v-for="item in busList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
							</el-option>
						</el-select>
					</el-col>
					<!-- 设备类型 -->
					<el-col :span="3">
						<el-select filterable v-model="item.gbdDevicetype" placeholder="请选择" clearable style="width: 100%;" @change="handleEqTypeChange(index)">
							<el-option v-for="item in eqTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
							</el-option>
						</el-select>
					</el-col>
					<!-- 设备 -->
					<el-col :span="3">
						<el-select filterable v-if="item.gbdDevicetype==='0'" v-model="item.mbdId" placeholder="请选择" clearable style="width: 100%;"
						 @change="handleEqChange($event,index,item)">
							<el-option v-for="item in pirList" :key="item.mbdId" :label="item.mbdDevicename" :value="item.mbdId">
							</el-option>
						</el-select>
						<el-select filterable v-else-if="item.gbdDevicetype=='1'" v-model="item.mbdId" placeholder="请选择" clearable style="width: 100%;"
						 @change="handleEqChange($event,index,item)">
							<el-option v-for="item in lightList" :key="item.mbdId" :label="item.mbdDevicename" :value="item.mbdId">
							</el-option>
						</el-select>
						<el-select filterable v-else-if="item.gbdDevicetype==='2'" v-model="item.mbdId" placeholder="请选择" clearable style="width: 100%;"
						 @change="handleEqChange($event,index,item)">
							<el-option v-for="item in pm25List" :key="item.mbdId" :label="item.mbdDevicename" :value="item.mbdId">
							</el-option>
						</el-select>
						<el-select v-else placeholder="请先选择设备类型" style="width: 100%;" disabled>
						</el-select>
					</el-col>
					<el-col :span="2">
						<!-- XX{{item.fourEightTwelve}}XX -->
						<el-select v-if="item.fourEightTwelve==-1" filterable v-model="item.lightroadnum" placeholder="请选择" clearable
						 style="width: 100%;">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<el-select v-else-if="item.fourEightTwelve==0" filterable v-model="item.lightroadnum" placeholder="请选择" clearable
						 style="width: 100%;">
							<el-option v-for="item in 4" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
						<el-select v-else-if="item.fourEightTwelve==1" filterable v-model="item.lightroadnum" placeholder="请选择" clearable
						 style="width: 100%;">
							<el-option v-for="item in 8" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
						<el-select v-else filterable v-model="item.lightroadnum" placeholder="请选择" clearable style="width: 100%;">
							<el-option v-for="item in 12" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="3">
						<el-select filterable v-model="item.gbdAddr" placeholder="请选择" clearable style="width: 100%;" @change="handleNumChange($event,item,index)">
							<el-option v-for="item in 31" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="3">
						<el-select filterable v-model="item.gbdGroup" placeholder="请选择" clearable style="width: 100%;">
							<el-option v-for="item in 31" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="3">
						<el-select filterable v-model="item.gbdFenceId" placeholder="请选择" clearable style="width: 100%;">
							<el-option v-for="item in uwbRegionList" :key="item.id" :label="item.fenceName" :value="item.id">
							</el-option>
						</el-select>
					</el-col>
					<el-col class="col-title" :span="2">
						<el-button size="small" type="danger" icon="el-icon-delete" circle @click="handleDeleteClick(item,index)"></el-button>
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
		treeDataTranslate,
		getDictDataList
	} from '@/utils'
	export default {
		name: "electric-add-or-update",
		data() {
			return {
				loading: false,
				visible: false,
				tfSetupaddrList: [], // 安装地址
				eqTypeList: [], // 设备类型
				busList: [], // 总线
				eqNumberList: [], // 设备路数
				eqList: [], // 设备(新增使用)
				pirList: [], // 修改使用
				lightList: [], // 修改使用
				pm25List: [], // 修改使用
				uwbRegionList: [], // "区域围栏列表"
				dataForm: {
					"id": "",
					gwId: "",
					gwIpgateway: "",
					gwName: "",
					mbdDevicetype: "",
					gwSn: "",
					// gwUwbnum: "",
					gwExpirydate: "",
					gwSetupaddr: [],
					scGatebusdeviceDTOList: [],
					remark: "",
				},
				options: [{
					value: '-1',
					label: '-1'
				}]
			}
		},
		methods: {
			// 新增总线
			handleAddClick() {
				let obj = {
					gbdLineNum: "",
					gbdDevicetype: "",
					mbdId: "",
					lightroadnum: "", // 灯口编号
					gbdAddr: "",
					gbdGroup: "",
					gbdFenceId: "",
					fourEightTwelve: "", // 灯口编号类型
				}

				let isZero = this.dataForm.scGatebusdeviceDTOList.length === 0 // 空数组
				if (isZero) {
					this.dataForm.scGatebusdeviceDTOList.unshift(obj)
				} else {
					let isEmpty = false // 默认每个字段都有值
					let i = 0
					this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
						if (item.gbdLineNum === "" || item.gbdDevicetype === "" || item.mbdId === "" || item.gbdAddr === "") {
							i = index
							isEmpty = true
						}
					})
					if (isEmpty) {
						this.$message.info(`请先完善第${i+1}条数据信息再新增`)
					} else {
						this.dataForm.scGatebusdeviceDTOList.unshift(obj)
					}
				}
			},
			// 删除
			handleDeleteClick(obj, index) {
				this.dataForm.scGatebusdeviceDTOList.splice(index, 1)
			},
			// 选择总线
			handleLineChange(e, obj, i) {
				if (e === "") {
					return this.dataForm.scGatebusdeviceDTOList[i].gbdLineNum = ""
				}
				// 当表单"设备类型"和总线"设备类型"都选择智能控灯设备时，不做设备是否被使用的校验
				if (obj.gbdDevicetype === "1") {
					return
				}
				let j = 0
				this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
					if (obj.gbdAddr == item.gbdAddr && item.gbdLineNum == e) {
						j++
						if (j > 1) {
							this.dataForm.scGatebusdeviceDTOList[i].gbdLineNum = ""
							return this.$message.info(`第${i+1}条数据的编号已使用`)
						}
					}
				})
			},
			// 选择设备类型
			handleEqTypeChange(i) {
				this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
					if (index == i) {
						return item.mbdId = ""
					}
				})
			},
			// 选择设备
			handleEqChange(e, i, obj) {
				if (e === "") {
					return this.dataForm.scGatebusdeviceDTOList[i].mbdId = ""
				}

				this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
					if (i === index && item.gbdDevicetype === "1") {
						this.lightList.forEach(item1 => {
							if (e === item1.mbdId) {
								item.fourEightTwelve = item1.mbdLightroads
							}
						})
					} else if (i === index && item.gbdDevicetype != "1") {
						item.fourEightTwelve = -1
					}
				})

				// 当表单"设备类型"和总线"设备类型"都选择智能控灯设备时，不做设备是否被使用的校验
				if (obj.gbdDevicetype === "1") {
					return
				}
				let j = 0
				this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
					if (item.mbdId == e) {
						j++
						if (j > 1) {
							this.dataForm.scGatebusdeviceDTOList[i].mbdId = ""
							return this.$message.info(`第${i+1}条数据的设备已使用`)
						}
					}
				})
			},
			// 选择编号
			handleNumChange(e, obj, i) {
				if (e === "") {
					return this.dataForm.scGatebusdeviceDTOList[i].gbdAddr = ""
				}
				// 当表单"设备类型"和总线"设备类型"都选择智能控灯设备时，不做设备是否被使用的校验
				if (obj.gbdDevicetype === "1") {
					return
				}
				let j = 0
				this.dataForm.scGatebusdeviceDTOList.forEach((item, index) => {
					if (obj.gbdLineNum == item.gbdLineNum && item.gbdAddr == e) {
						j++
						if (j > 1) {
							this.dataForm.scGatebusdeviceDTOList[i].gbdAddr = ""
							return this.$message.info(`第${i+1}条数据的编号已使用`)
						}
					}
				})
			},
			init() {
				this.visible = true
				this.busList = getDictDataList("bus")
				this.eqTypeList = getDictDataList("eq_type")
				this.eqNumberList = getDictDataList("eq_number")
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					Promise.all([this.getTfSetupaddrList(), this.getEqList(), this.getUwbRegionList()]).then(result => {
						if (this.dataForm.id) {
							// 传递下拉框数据
							this.getInfo(result[1])
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
			// 获取三种类型的设备列表
			getEqList() {
				// return new Promise((resolve, reject) => {
				// 	this.$http.get(`/system/scmodbusdevicedc/type/-1`).then(({
				// 		data: res
				// 	}) => {
				// 		if (res.code !== 0) {
				// 			return this.$message.error(res.msg)
				// 		}
				// 		// res.data.mbdDevicetype  0： pirList  1： lightList 2：pm25List
				// 		let pirList = res.data.filter(item => item.mbdDevicetype == 0);
				// 		let lightList = res.data.filter(item => item.mbdDevicetype == 1);
				// 		let pm25List = res.data.filter(item => item.mbdDevicetype == 2);

				// 		this.pirList = pirList
				// 		this.lightList = lightList
				// 		this.pm25List = pm25List

				// 		// 返回列表数据   供后续操作使用
				// 		resolve({
				// 			pirList: pirList,
				// 			lightList: lightList,
				// 			pm25List: pm25List,
				// 		})
				// 	}).catch(err => {
				// 		reject(err)
				// 	})
				// })
				this.$http.get(`/system/scmodbusdevicedc/type/0`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.pirList = res.data
				}).catch(() => {})
				this.$http.get(`/system/scmodbusdevicedc/type/1`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.lightList = res.data
				}).catch(() => {})
				this.$http.get(`/system/scmodbusdevicedc/type/2`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.pm25List = res.data
				}).catch(() => {})
			},
			// 获取区域编号
			getUwbRegionList() {
				this.$http.get(`/system/scregionconfig/getUwbRegionList`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.uwbRegionList = res.data
				}).catch(() => {})
			},
			// 获取信息
			getInfo(eqList) {
				this.$http.get(`/system/scgatewaydc/${this.dataForm.id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					// 组装灯口类型 fourEightTwelve（-1，0，1，2，3）
					res.data.scGatebusdeviceDTOList.forEach(item => {
						if (item.gbdDevicetype != 1) {
							item.fourEightTwelve = -1
						} else {
							this.lightList.forEach(item1 => {
								if (item1.mbdId === item.mbdId) {
									item.fourEightTwelve = item1.mbdLightroads
								}
							})
						}
					})

					this.dataForm = { ...this.dataForm,
						...res.data
					}
					this.dataForm.mbdDevicetype = String(this.dataForm.mbdDevicetype)

					console.log(this.dataForm)

					// 是否组网：mbdNetwork   0否  1是
					let ids = res.data.scGatebusdeviceDTOList.map(item => item.mbdId);
					// 筛选未组网和当前项组网列表集合
					this.pirList = eqList.pirList.filter(item => {
						return item.mbdNetwork == 0 || ids.includes(item.mbdId)
					});
					this.lightList = eqList.lightList.filter(item => {
						return item.mbdNetwork == 0 || ids.includes(item.mbdId)
					});
					this.pm25List = eqList.pm25List.filter(item => {
						return item.mbdNetwork == 0 || ids.includes(item.mbdId)
					});
				}).catch(() => {})
			},
			// 表单提交
			dataFormSubmitHandle: throttle(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					// 总线  根据围栏编号还原  围栏名称返回给后端  纯数字key 有问题 加key字段拼接
					let uwbListObj = {};
					this.uwbRegionList.forEach(item => {
						uwbListObj['key' + item.id] = item.fenceName;
					})
					this.dataForm.scGatebusdeviceDTOList.forEach(item => {
						item.fenceName = uwbListObj['key' + item.gbdFenceId]
					})
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/scgatewaydc' :
						'/system/scgatewaydc', this.dataForm).then(({
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
		},
		computed: {
			dataRule() {
				var validateLine = (rule, value, callback) => {
					if (value.length === 0) {
						callback(new Error(this.$t('validate.required')));
					} else {
						value.forEach((item, index) => {
							if (item.gbdLineNum === "" || item.gbdDevicetype === "" || item.mbdId === "" || item.gbdAddr === "") {
								callback(new Error(this.$t('validate.required')));
							}
						})
						callback();
					}
				}
				return {
					gwIpgateway: [{
						required: true,
						validator: validateIP,
						trigger: 'blur'
					}],
					gwName: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					mbdDevicetype: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					gwSn: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					// gwUwbnum: [{
					// 	required: true,
					// 	message: this.$t('validate.required'),
					// 	trigger: 'blur'
					// }],
					gwExpirydate: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					gwSetupaddr: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					scGatebusdeviceDTOList: [{
						required: true,
						validator: validateLine,
						trigger: 'change'
					}],
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	/deep/ .col-title {
		text-align: center;
		background: rgba(0, 191, 255, 0.2);
		border: 1px solid rgba(0, 191, 255, 0.5)
	}
</style>
