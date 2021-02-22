<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="70px" inline>
			<el-form-item label="设备IP" prop="aeClientip">
				<el-input v-model="dataForm.aeClientip" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备名称" prop="devicename">
				<el-input v-model="dataForm.devicename" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备状态" prop="state">
				<el-select v-model="dataForm.state" placeholder="请选择" clearable>
					<el-option v-for="item in equipStatusList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="安装位置" prop="dfFloorid">
				<el-cascader v-model="dfFloorid" ref="floor" :props="{ checkStrictly: true, value: 'df_floorid', label: 'df_floorname'}"
				 clearable placeholder="请选择" :options="addressList"></el-cascader>
			</el-form-item>
<!--			<el-form-item label="姓名" prop="username">
				<el-input v-model="dataForm.username" placeholder="请输入" clearable></el-input>
			</el-form-item>-->
			<el-form-item label="学号/工号" prop="userno">
				<el-input v-model="dataForm.userno" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="warning" @click="resetFormHandle()">重置</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:save')" type="primary" @click="addAccess">新建</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:transfacelisttodoor')" type="success" @click="sendFaceToEquip">下发指定</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:allFaceto')" type="success" @click="sendFaceAll">下发所有</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:disconnectAll')" type="danger" @click="closeAllDevice">断开所有设备</el-button>
				<el-button v-if="$hasPermission('system:scaidooreight:batchUpatePsw')" type="danger" @click="updatePassWordHandle">批量修改密码</el-button>
				<el-button v-if="$hasPermission('system:scaidooreightpersonlist:delete')" type="danger" @click="delAllPerson" :loading="loading">一键删除图像</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" label="全选" width="60" align="center"></el-table-column>
			<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
			<el-table-column prop="aeClientip" label="设备IP" align="center"></el-table-column>
			<!-- <el-table-column prop="aeSerialnumber" label="设备序列号"   align="center"></el-table-column> -->
			<el-table-column prop="aeDevicename" label="设备名称" align="center" show-overflow-tooltip width="160">
				<!-- <template slot-scope="scope">
					<div>
						<el-button class="hide-text" type="text" @click="gotoAccessRecord(scope.row.aeId)">{{scope.row.aeDevicename}}</el-button>
					</div>
				</template> -->
			</el-table-column>
			<el-table-column label="设备状态" align="center" width="80">
				<template slot-scope="scope">
					<div>
						<span v-if="scope.row.aeState==0" style="color:#67C23A;">{{$getDictLabel('equipment_status', scope.row.aeState)}}</span>
						<span v-else style="color:#f56c6c;">{{$getDictLabel('equipment_status', scope.row.aeState)}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="设备签到类型" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.aeSigntype==1" style="color:#67C23A;" class="el-icon-d-arrow-right"> {{ $getDictLabel("accessEquipType", scope.row.aeSigntype) }}</span>
					<span v-else style="color:#f56c6c;" class="el-icon-d-arrow-left"> {{ $getDictLabel("accessEquipType", scope.row.aeSigntype) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="
					 aeDevicetype" label="设备类型" :formatter="formatterDevinceType" align="center" width="80"></el-table-column>
			<el-table-column prop="floorName" label="安装位置" align="center" width="120"></el-table-column>
			<el-table-column prop="aeSetupdate" label="安装时间" align="center" width="120"></el-table-column>
			<el-table-column prop="aeExpirydate" label="有效期" align="center" width="120"></el-table-column>
			<el-table-column prop="aeFacedowntime" label="最后下发时间" align="center" width="180"></el-table-column>
			<!-- <el-table-column prop="aeTransstate" label="下发状态"   align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.aeTransstate" style="color:#ebb563;">正在传输</span>
            <span v-else style="color:#85ce61;">已完成</span>
          </div>
        </template>
      </el-table-column> -->
			<el-table-column prop="aeFacetotal" label="已下发人数" width="100" align="center">
				<template slot-scope="scope">
					<el-link type="primary" :underline="false" @click="showPersonList(scope.row)">{{scope.row.aeFacetotal}}</el-link>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="330">
				<template slot-scope="scope">
					<div>
						<el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
						<el-button v-if="$hasPermission('system:scaidooreight:update')" type="text" @click="editHandle(scope.row)">修改</el-button>
						<el-button v-if="$hasPermission('system:scaidooreight:openRemoteDoor')" type="text" @click="optionsHanlder({path:'openRemoteDoor/',id:scope.row.aeId})">远程开门</el-button>
						<el-button v-if="$hasPermission('system:scaidooreight:allFaceto')&&scope.row.aeTransstate==0" type="text" @click="sendHandle(scope.row)">下发所有</el-button>
						<el-button v-if="$hasPermission('system:scaidooreight:delete')" type="text" @click="deleteHandle(scope.row.aeId)"
						 style="color:#f56c6c">删除</el-button>
						<el-dropdown @command="optionsHanlder">
							<el-button type="text">
								更多<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-if="$hasPermission('system:scaidooreight:setting')" :command="{path:'config',id:scope.row.aeId}">配置信息</el-dropdown-item>
								<el-dropdown-item v-if="$hasPermission('system:scaidooreight:reboot')" :command="{path:'rebootDevice/',id:scope.row.aeId}">重启设备端</el-dropdown-item>
								<el-dropdown-item v-if="$hasPermission('system:scaidooreight:openRemoteDoor')" :command="{path:'openRemoteDoor/',id:scope.row.aeId}">远程开门</el-dropdown-item>
								<el-dropdown-item v-if="$hasPermission('system:scaidooreight:disconnect')" :command="{path:'disconnectToDevice/',id:scope.row.aeId}">断开设备</el-dropdown-item>
								<el-dropdown-item v-if="$hasPermission('system:scaidooreight:clean')" class="danger" :command="{path:'cleanDeviceData/',id:scope.row.aeId}">重置设备</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100,300]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 新增修改 -->
		<add-or-update ref="addOrUpdate"></add-or-update>
		<!-- 查看 -->
		<view-access ref="viewAccess"></view-access>
		<!-- 已下发人数列表 -->
		<person-list ref="personList"></person-list>
		<!-- 下发操作 -->
		<send-face ref="sendFace" :aeids="aeIds" accessType="eight"></send-face>
		<!-- 配置信息 -->
		<access-config ref="accessConfig"></access-config>
		<!-- 批量修改密码 -->
		<access-update-password ref="accessUpdatePassword" v-if="accessUpdatePasswordVisible"></access-update-password>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		treeDataTranslate,
		getDictLabel,
		getDictDataList
	} from '@/utils'
	import addOrUpdate from './access-add-or-update'
	import viewAccess from './access-view'
	import personList from './access-person-list'
	import sendFace from './access-send-face'
	import accessConfig from './access-config'
	import AccessUpdatePassword from './access-update-password'
	export default {
		mixins: [mixinViewModule],
		components: {
			addOrUpdate,
			viewAccess,
			personList,
			sendFace,
			accessConfig,
			AccessUpdatePassword
		},
		data() {
			return {
				loading : false,
				mixinViewModuleOptions: {
					getDataListURL: '/system/scaidooreight/page',
					deleteURL: '/system/scaidooreight',
					getDataListIsPage: true
				},
				addressList: [], // 安装位置
				dfFloorid: [], // 选中id数组
				equipStatusList: getDictDataList('equipment_status'),
				limit: 10,
				dataForm: {
					aeClientip: "",
					state: '',
					devicename: '',
					floorid: '', // 安装位置的id
					username:'',
					userno:''
				},
				checkList: [],
				dataList: [],
				accessUpdatePasswordVisible: false
			}
		},
		created() {
			this.getAddressList()
		},
		watch: {
			'dfFloorid': {
				handler(val) {
					if (val.length === 0) {
						this.dataForm.floorid = ""
					} else {
						this.dataForm.floorid = val[val.length - 1]
					}
				}
			}
		},
		computed: {
			aeIds() {
				return this.checkList.map(item => {
					return item.aeId
				})
			},
			// 根据 数据 aeTransstate  判断是否有设备正在下发  1 有   0  否    如有下发  每1 分钟刷新一次数据
			// isNeedRefresh(){
			//   return  this.dataList.some(item=>item.aeTransstate)
			// }
		},
		// watch:{
		//   // 监听是否需要刷新数据    执行定时任务
		//   isNeedRefresh(state){
		//     // 需要刷新 且 定时器未启动  则启动定时器
		//      if(state&&!this.timer){
		//        this.timer=setInterval(() => {
		//           this.query();
		//        }, 1000*30);
		//        this.$once("hook:beforeDestroy",()=>{
		//           clearInterval(this.timer);
		//           this.timer=null;
		//        })
		//         this.$once("hook:deactivated",()=>{
		//           clearInterval(this.timer);
		//           this.timer=null;
		//        })
		//      }
		//     //  不需要刷新  定时器仍在运行   则清除定时器
		//      else if(!state&&this.timer){
		//        clearInterval(this.timer);
		//        this.timer=null;
		//      }
		//   }
		// },
		methods: {

			//一键删除图像
			delAllPerson(){
				let userNo = this.dataForm.userno;
				if (userNo == ''){
					return this.$message.warning("请输入学号或工号！")
				}

				this.loading = true
				this.$http({
					url:`/system/scaidooreightpersonlist/` + userNo,
					method:"delete",
				}).then(({data:res})=>{
					this.loading = false;
					if(res.code!=0){
						return this.$message.error(res.msg)
					}
					this.$message.success(res.msg)
					this.query();//刷线当前
				})
			},
			// 安装位置列表
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
			// 重置
			resetFormHandle() {
				this.dfFloorid = []
				this.dataForm = {
					aeClientip: "",
					state: '',
					devicename: '',
					dfFloorid: '',
				}
				this.page = 1;
				this.query();
			},

			addAccess() {
				this.$refs['addOrUpdate'].init()
			},
			search() {
				this.page = 1;
				this.query();
			},
			viewHandle(row) {
				this.$refs['viewAccess'].init(row)
			},
			editHandle(row) {
				this.$refs['addOrUpdate'].init(row)
			},
			showPersonList(row) {
				this.$refs['personList'].init(row.aeId, row.aeDevicename)
			},
			formatterDevinceType(row) {
				return getDictLabel('accessDevinceType', row.aeDevicetype)
			},
			// formatterState(row) {
			// 	return getDictLabel('equipment_status', row.aeState)

			// },
			handleSelectionChange(data) {
				this.checkList = data
			},
			optionsHanlder(options) {
				// 配置设备信息
				if (options.path == 'config') {
					this.$refs['accessConfig'].init(options.id)
					return false
				}
				this.$confirm('此操作存在一定风险，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 重启设备端 远程开门  断开设备  重置设备
					this.$http({
						url: "/system/scaidooreight/" + options.path + options.id,
						method: "get",
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
						this.query();
					})
				})

			},
			sendFaceToEquip() {
				if (this.checkList.length == 0) {
					return this.$message.warning("请选择需要下发的设备！")
				}
				this.$refs['sendFace'].init();

			},
			sendFaceAll() {
				this.$confirm('确认下发到所有设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: "/system/scaidooreight/allFacetoAllDc",
						method: "get",
						timeout: 0,
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.warning("正在下发中...")
						this.dataList.foreach(item => {
							item.aeTransstate = 1
						})
						// this.$message.success('设备已全部下发完成')
						// this.query();
					})
				}).catch(() => {})
			},
			sendHandle(row) {
				this.$confirm('确认下发到设备？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: `/system/scaidooreight/allFacetoDc/${row.aeId}`,
						method: "get",
						timeout: 0,
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.warning("正在下发中...")
						row.aeTransstate = 1;
						// this.$message.success(row.aeDevicename+' 下发完成')
						// this.query();
					})
				}).catch(() => {});

			},
			// 断开所有设备
			closeAllDevice() {
				this.$confirm('确认断开所有设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: "/system/scaidooreight/disconnectAllDevice",
						method: "get",
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.$message.success(res.msg)
					})
				})
			},
			// 批量修改密码
			updatePassWordHandle() {
				if (this.checkList.length === 0) {
					return this.$message.warning(`请勾选需要变更密码的设备`)
				}
				let idArr = this.checkList.map(item => {
					return item.aeId
				})
				let ids = JSON.stringify(idArr)
				this.accessUpdatePasswordVisible = true
				this.$nextTick(() => {
					this.$refs['accessUpdatePassword'].init(ids)
				})
			},
			// 跳转到出入记录页面
			gotoAccessRecord(id) {
				window.sessionStorage.setItem('access_record_aeid', id);
				this.$router.push({
					name: 'statistics-accessRecord',
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-table {
		.el-button--text {
			padding: 8px 0;

			&.hide-text {
				max-width: 120px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				word-break: break-all;
			}
		}

		.el-dropdown {
			margin-left: 10px;
		}
	}

	.el-dropdown-menu__item {
		&.danger {
			color: #F56C6C !important;
		}
	}
</style>
