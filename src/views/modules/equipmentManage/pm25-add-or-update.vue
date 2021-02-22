<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
	 :close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item prop="mbdId" label="id" style="display: none;">
				<el-input v-model="dataForm.mbdId" placeholder="请输入" clearable></el-input>
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
				<el-cascader ref="cascader" v-model="dataForm.mbdUwbaddr" :props="{ value: 'df_floorid', label: 'df_floorname',checkStrictly: true}"
				 clearable placeholder="请选择" :options="tfSetupaddrList" style="width: 100%;" @change="positonChangeHandler"></el-cascader>
			</el-form-item>
			<el-form-item v-if="positionVisible" prop="mbdCoordinate" label="地图位置">
				<position v-model="dataForm.mbdCoordinate" :pictureid="pictureId"></position>
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
	import position from './pm25-position'
	import {
		treeDataTranslate
	} from '@/utils'
	export default {
		name: "pir-add-or-update",
		components:{
			position
		},
		data() {
			return {
				loading: false,
				visible: false,
				positionVisible:false,
				tfSetupaddrList: [], // 楼栋、楼层级联
				dataForm: {
					id: "",
					mbdId: "",
					mbdDevicetype: 2, // 设备类型
					mbdNetwork: 0, // 是否组网
					mbdDevicename: "",
					mbdDevicesn: "",
					mbdExpirydate: "",
					mbdUwbaddr: [],
					remark: "",
					mbdCoordinate:[0,0]
				},
				pictureId:"1f",
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
					mbdCoordinate:[
						{required: true, message:'请选择', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			init() {
				this.visible = true;
				this.positionVisible=false;
				this.dataForm.mbdNetwork = 0
				this.$nextTick(() => {
					this.dataForm.mbdCoordinate=[0,0];
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
				return new Promise((resolve,reject)=>{
					this.$http.get(`/system/scdormitoryfloor/roomTree/-1`).then(({
					data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.tfSetupaddrList = treeDataTranslate(res.data, 'df_floorid', 'df_parentid')
						resolve()
					}).catch(() => {
						reject()
					})
				})
				
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
						...res.data,
						mbdCoordinate:res.data.mbdCoordinate?res.data.mbdCoordinate.split(","):""
					}
					// 查询当前设备安装位置楼层性质以及楼层
					let buildId=res.data.mbdUwbaddr[0];
					let building=this.tfSetupaddrList.filter(item=>item.df_floorid==buildId);
					let type=building&&building[0].df_purpose;
					let floor;
					// 判断是否有楼层
					let floorId=res.data.mbdUwbaddr[1];
					if(floorId){
						floor=building[0].children.filter(item=>item.df_floorid==floorId);
					}
					// 判断是否需要显示 地图位置
					if(type==2&&floor){
						this.positionVisible=true;
						this.pictureId=floor[0].df_floorname;
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
					// 位置数组转为string
					let submitData=JSON.parse(JSON.stringify(this.dataForm));
					submitData.mbdCoordinate=submitData.mbdCoordinate?submitData.mbdCoordinate.join(","):"";
					// 提交
					this.$http[!this.dataForm.id ? 'post' : 'put'](!this.dataForm.id ? '/system/scmodbusdevicedc' :
						'/system/scmodbusdevicedc', submitData).then(({
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
			}),
			findNodeLevelFirst(node){
				if(node.level==1){
					return node
				}
				return this.findNodeLevelFirst(node.parent)
			},
			findNodeFloorLayer(node){
				if(node.level==1){
					this.pictureId=0;
					return null
				}
				else if(node.level==2){
					return node.label
				}
				return  this.findNodeFloorLayer(node.parent)
			},
			positonChangeHandler(data){
				// 获取当前选中节点信息
				let node=this.$refs['cascader'].getCheckedNodes()[0];
				// 查找楼层信息
				let floor=this.findNodeFloorLayer(node);
				// 查找到第一级
				let first=this.findNodeLevelFirst(node);
				// df_purpose=2  楼栋属性为教学楼
				if(first.data.df_purpose==2&&floor){
					this.positionVisible=true;
					this.pictureId=floor;
				}
				else{
					this.positionVisible=false;
				}
			}
		}
	}
</script>
