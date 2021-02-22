<template>
	<el-dialog :title="type==='post'?'新增':'修改'" :visible.sync="dialogVisible" width="500px" class="add-update-building"
	 :close-on-click-modal="false">
		<div>
			<el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="80px">
				<el-form-item label="上级">
					<building-tree v-model="dataForm.dfParentid" placeholder="选择上级" :build-type.sync="dataForm.dfType" :purpose.sync="dataForm.dfPurpose" :parent-name.sync="dataForm.dfParentName"></building-tree>

				</el-form-item>
				<el-form-item label="类型" prop="dfType">
					<el-select v-model="dataForm.dfType" :disabled="dataForm.dfParentid!='0'"  placeholder="请选择" @change="typeHandle">
						<el-option v-for="item in dfTypeList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="位置" prop="uwbFloors" v-if="dataForm.dfType=='1'">
					<el-cascader v-model="dataForm.uwbFloors" clearable placeholder="请选择" :options="uwbFloorList" style="width: 100%;"></el-cascader>
				</el-form-item>
				<el-form-item v-if="dataForm.dfType=='2'" label="房间人数" prop="drCapacity">
					<el-input-number v-model="dataForm.drCapacity" :min="0" :controls="false" placeholder="请输入"></el-input-number>
				</el-form-item>
				<el-form-item label="用途" prop="dfPurpose">
					<el-select v-model="dataForm.dfPurpose" :disabled="type==='put'||dataForm.dfParentid!='0'" placeholder="请选择">
						<el-option v-for="item in dfPurposeList"  :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称" prop="dfFloorname">
					<el-input v-model="dataForm.dfFloorname"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="dfOrder">
					<el-input-number v-model="dataForm.dfOrder" :min="0" :controls="false" placeholder="请输入"></el-input-number>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" v-loading="loading" @click="submitForm">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {
		getDictDataList
	} from '@/utils'
	import debounce from 'lodash/debounce'
	import buildingTree from '@/views/modules/building/building-tree'
	import ajax from '@/utils/login'
	export default {
		components: {
			buildingTree
		},
  		inject: ['refresh'],
		data() {
			const validateType = (rule, value, UWBallback) => {
				if (value != '0' && !this.dataForm.dfParentName) {
					UWBallback(new Error('请选择楼层或房间上级'))
				} else {
					UWBallback()
				}
			}
			return {
				showFloorCascader: false, // 是否显示楼层的cascader(当选择楼层"1"时展示)
				uwbFloorList: [], // 楼栋、楼层
				dialogVisible: false,
				loading: false,
				type: 'post',
				dfTypeList: getDictDataList('buildingType'),
				dfPurposeList: getDictDataList('purpose'),
				dataForm: {
					dfParentid: '0',
					dfParentName: '',
					dfType: '',
					uwbFloors: [],
					dfFloorname: '',
					dfPurpose: '',
					dfOrder: 0,
					drCapacity: 1
				},
				rules: {
					dfType: [{
							required: true,
							message: '请选择',
							trigger: ['blur', 'change']
						},
						{
							validator: validateType,
							trigger: ['blur', 'change']
						}
					],
					uwbFloors: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}],
					dfPurpose: [{
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					}, ],
					dfFloorname: [{
							required: true,
							message: '请输入',
							trigger: ['blur', 'change']
						},
						{
							max: 30,
							message: '最多 30 个字符',
							trigger: ['blur', 'change']
						}
					],
					dfOrder: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ],
					drCapacity: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}, ]
				}
			}
		},
		created() {
				// 获取UWB楼栋和楼层的cascader
				ajax({
					url:"/map/map",
					// url:"/system/scdormitoryfloor/uwbbuildingtree",
					method:"get"
				}).then(({
					data: res
				}) => {
					// status  200
					if (res.status !==200) {
						return this.$message.error(res.msg)
					}
					// this.uwbFloorList = res.data.map(item => {
					// 	item.children = item.children.map(item1 => {
					// 		return {
					// 			label: item1.label,
					// 			value: item1.value
					// 		}
					// 	})
					// 	return item
					// })
					this.uwbFloorList=res.result.filter(item=>{
						return item.mapType==1
					}).map(item=>{
						item.children=JSON.parse(item.floorList).map(label=>{
							return {
								label: label,
								value: label
							}
						})
						item.label=item.buildingName;
						item.value=String(item.id);
						return item
					})
				}).catch((err) => {
					console.log('building error',err)
				})
		},
		methods: {
			init(id, type) {
				this.dialogVisible = true;
					// 编辑
					if (id) {
						this.type = 'put';
						this.$http({
							url: `/system/scdormitoryfloor/${id}/${type}`,
							method: "get"
						}).then(({
							data
						}) => {
							if (data.code == 0) {
								// 1 是楼层
								if (data.data.dfType == 1) {
									this.showFloorCascader = true
								}
								else{
									this.showFloorCascader = false
									data.data.uwbFloors = []
								}
								this.dataForm = {
									...data.data,
									dfPurpose: String(data.data.dfPurpose),
									dfType: String(data.data.dfType),
									dfParentName: data.data.parentName
								}
							} else {
								this.$message.warning(data.msg)
							}
						})
					}
					// 新增
					else {
						this.type = 'post';
						this.dataForm = {
							dfParentid: '0',
							dfParentName: '',
							dfType: '',
							uwbFloors: [],
							dfFloorname: '',
							dfPurpose: '',
							dfOrder: 0,
							drCapacity: 1
						}
						this.showFloorCascader = false
						this.dataForm.uwbFloors = []
						this.$nextTick(() => {
							this.$refs['dataForm'].resetFields();
						})
					}
			},
			typeHandle(e) {
				if (e == 1) {
					this.showFloorCascader = true
				} else {
					this.showFloorCascader = false
					this.dataForm.uwbFloors = []
				}
			},
			submitForm: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					// 当uwbFloors没数据时,后端返回的时"",但是提交数据时后端接收的是[]
					if(this.dataForm.uwbFloors === ""){
						this.dataForm.uwbFloors = []
					}
					this.loading = true;
					this.$http({
						url: "/system/scdormitoryfloor",
						method: this.type,
						data: {
							...this.dataForm
						}
					}).then(({
						data
					}) => {
						if (data.code == 0) {
							this.dialogVisible = false;
							// this.$parent.$parent.initTree();
							this.refresh();
							this.$message.success(data.msg)
						} else {
							this.$message.warning(data.msg)
						}
					}).finally(() => {
						this.loading = false;
					})

				})
			}, 1000, {
				'leading': true,
				'trailing': false
			})
		}
	}
</script>
<style lang="scss" scoped>
	.add-update-building {
		.el-form {
			.el-form-item {
				.el-select {
					width: 100%;
				}

				.el-input-number {
					width: 100%;
				}
			}
		}
	}
</style>
