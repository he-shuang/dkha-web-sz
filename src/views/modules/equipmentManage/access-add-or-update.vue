<template>
	<el-dialog :title="type=='post'?'新建':'修改'" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<div>
			<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备端IP" prop="aeClientip">
							<el-input v-model="dataForm.aeClientip"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="设备端端口" prop="aeClientport">
							<el-input v-model="dataForm.aeClientport"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备名称" prop="aeDevicename">
							<el-input v-model="dataForm.aeDevicename"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="设备签到类型" prop="aeSigntype">
							<el-select v-model="dataForm.aeSigntype" placeholder="请选择">
								<el-option v-for="item in accessEquipTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备序列号" prop="aeSerialnumber">
							<el-input v-model="dataForm.aeSerialnumber"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="安装位置" prop="dfFloorid">
							<el-cascader v-model="dataForm.dfFloorid" ref="floor" :props="{ value: 'df_floorid', label: 'df_floorname'}"
							 clearable placeholder="请选择" :options="addressList"></el-cascader>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="有效期" prop="aeExpirydate">
							<el-date-picker v-model="dataForm.aeExpirydate" type="date" value-format="yyyy-MM-dd" placeholder="请选择"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1">
						<el-form-item label="设备类型" prop="aeDevicetype">
							<el-select v-model="dataForm.aeDevicetype" placeholder="请选择">
								<el-option v-for="item in accessDevinceTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备主板类型" prop="aeMainboard">
							<el-select v-model="dataForm.aeMainboard" placeholder="请选择">
								<el-option v-for="item in eightInchesEquipTypeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11" :offset="1" v-if="type=='post'">
						<el-form-item label="签名密钥" prop="aeSignkey">
							<el-input v-model="dataForm.aeSignkey"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="备注">
							<el-input type="textarea" v-model="dataForm.remark" :rows="3" resize="none" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="部门">
							<el-tree
									:data="deptList"
									:props="{ label: 'name', children: 'children' }"
									node-key="id"
									ref="deptListTree"
									accordion
									:check-strictly="true"
									show-checkbox>
							</el-tree>
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
		getDictDataList,
		treeDataTranslate
	} from '@/utils'
	import {
		validateIP
	} from '@/utils/validate'
	import debounce from 'lodash/debounce'
	export default {
		data() {
			return {
				deptList: [],
				dialogVisible: false,
				loading: false,
				type: 'post',
				addressList: [],
				dataForm: {
					aeClientip: '192.168.24.',
					dfFloorid: [],
					aeClientport: '3639',
					aeSerialnumber: 'NZ53M',
					aeDevicename: '',
					aeSigntype: '1',
					aeExpirydate: new Date(2030, 10, 10),
					aeSignkey: '123456',
					floorName: '',
					aeMainboard: '0',
					remark: ''
				},
				accessEquipTypeList: getDictDataList('accessEquipType'),
				accessDevinceTypeList: getDictDataList('accessDevinceType'),
				eightInchesEquipTypeList: getDictDataList('eightInchesEquipType'),
				rules: {
					aeClientip: [{
						required: true,
						validator: validateIP,
						trigger: ['blur', 'change']
					}, ],
					dfFloorid: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					aeDeviceid: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					aeClientport: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					aeSerialnumber: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					aeDevicename: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}],
					aeSigntype: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					aeExpirydate: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					aeSignkey: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					aeDevicetype: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					aeMainboard: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
				},
			}
		},
		methods: {
			// 获取部门列表
			getDeptList () {
				return this.$http.get('/sys/dept/list').then(({ data: res }) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.deptList = res.data
				}).catch(() => {})
			},
			// 获取选中的部门列表
			getDeptCheckList () {
				return this.$http.get('/system/scaidooreight/dept/'+this.dataForm.aeId).then(({ data: res }) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm.deptIdList = res.data.map(item => item.deptId);
					this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList)
					//this.deptList = res.data
				}).catch(() => {})
			},
			init(data) {

				this.dialogVisible = true;
				// 获取最新楼层信息
				this.getAddressList();
				this.getDeptList();
				// 编辑
				if (data) {
					this.type = "put";
					this.dataForm = {
						...data,
						aeSigntype: String(data.aeSigntype),
						aeDevicetype: String(data.aeDevicetype),
						aeMainboard: String(data.aeMainboard),
						dfFloorid: data.dfFloorid.split(",")
					}
				} else {
					this.type = "post";
					this.dataForm = {
						aeClientip: '192.168.24.',
						dfFloorid: [],
						aeClientport: '3639',
						aeSerialnumber: 'NZ53M',
						aeDevicename: '',
						aeSigntype: '1',
						aeExpirydate: new Date(2030, 10, 10),
						aeSignkey: '123456',
						floorName: '',
						aeMainboard: '0',
						remark: ''
					}
					this.$nextTick(() => {
						this.$refs['dataForm'].clearValidate()
					})
				}

				this.$nextTick(() => {
					this.$refs.deptListTree.setCheckedKeys([]);
				})
				if (this.dataForm.aeId){
					this.getDeptCheckList();
				}
			},
			submitInfo: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					let submitData = {
						...this.dataForm,
						dfFloorid: this.dataForm.dfFloorid.join(","),
						deptIdList:this.$refs.deptListTree.getCheckedKeys()
					}
					this.$http({
						url: "/system/scaidooreight",
						method: this.type,
						data: submitData
					}).then(({
						data
					}) => {
						if (data.code != 0) {
							return this.$message.error(data.msg)
						}
						this.dialogVisible = false;
						if (this.type == 'post') {
							this.$parent.$parent.search();
							this.$parent.$parent.resetForm('ruleForm');
						} else {
							// this.$parent.$parent.search();
						}
						this.$message.success(data.msg || '操作成功')
					}).finally(() => {
						this.loading = false;
					})
				})

			}, 1000),
			// 获取楼栋和楼层的cascader
			getAddressList() {
				// -1是获取所有楼栋
				this.$http.get(`/system/scdormitoryfloor/tree/-1`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.addressList = treeDataTranslate(res.data, 'df_floorid', 'df_parentid')
				}).catch(() => {})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-form {
			.el-form-item {

				.el-date-editor--date,
				.el-cascader,
				.el-select {
					width: 100%;
				}
			}
		}
	}
</style>
