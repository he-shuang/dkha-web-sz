<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="dataForm" :model="dataForm" label-width="80px" inline>
			<el-form-item label="姓名" prop="vrName">
				<el-input v-model="dataForm.vrName" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="vrSex">
				<el-select v-model="dataForm.vrSex" placeholder="请选择" clearable>
					<el-option v-for="item in genderList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="人证设备">
				<el-select v-model="dataForm.deviceNumber" placeholder="请选择" @change="setVistorEquip" clearable filterable>
					<el-option v-for="item in equipList" :key="item.pieEquipsn" :label="item.pieDevicename" :value="item.pieEquipsn">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="warning" @click="resetForm('dataForm')">重置</el-button>
				<el-button type="primary" @click="addVisitor">新建</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList">
			<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
			<el-table-column label="照片" align="center" width="100">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.vrPhoneimg" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="vrName" label="姓名" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrPhone" label="访客电话" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrInterviewedName" label="被访人员" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrInterviewedPhone" label="被访人电话" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrAddress" label="访问地址" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrTemperature" label="体温(℃)" width="100" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>
						<span style="color:#f56c6c;" v-if="scope.row.vrTemperature>=37.3">{{scope.row.vrTemperature}}</span>
						<span style="color:#67C23A;" v-else>{{scope.row.vrTemperature}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="vrVistorbegintime" label="进入时间" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="vrVistorendtime" label="离开时间" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<div>
						<el-button type="text" v-if="scope.row.vrUwbid" @click="trackHandle(scope.row)">轨迹跟踪</el-button>
						<el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
						<el-button type="text" v-if="!scope.row.vrReturnuwb&&scope.row.vrUwbid" @click="returnCardHandle(scope.row)">还卡</el-button>
						<el-button type="text" v-if="!scope.row.vrUwbid&&!scope.row.vrVistorendtime" @click="editVisitor(scope.row)">绑卡</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6,10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
		<!-- 新增修改 -->
		<add-or-update ref="addOrUpdate"></add-or-update>
		<!-- 查看 -->
		<view-visitor ref="viewVisitor"></view-visitor>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import addOrUpdate from '@/views/modules/visitor/visitor-add-or-update'
	import viewVisitor from '@/views/modules/visitor/visitor-view'
	import {
		getDictLabel,
		getDictDataList
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		components: {
			addOrUpdate,
			viewVisitor
		},
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scvisitorrecord/page',
					deleteURL: '/system/scvisitorrecord',
					getDataListIsPage: true
				},
				genderList: getDictDataList('gender').filter(item => item.dictValue < 2),
				dataForm: {
					scStuname: '',
					vrName:'',
					scSex: '',
					deviceNumber: ''
				},
				equipList: [],
				dataList: [],
				limit: 6,
			}
		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.vrPhoneimg
				})
			},
		},
		created() {
			this.getEquipList();
		},
		activated() {
			//let params = this.$route.params;	
		
			// // 判断从闸机设备过来  查询对应出入数据
			// let visitorName = window.sessionStorage.getItem('visitorName');
			// if (visitorName) {
			// 	window.sessionStorage.removeItem('visitorName');
			// 	this.dataForm.vrName = visitorName;
			// 	this.search();
			// }
		},
		methods: {
			addVisitor() {
				this.$refs['addOrUpdate'].init()
			},
			editVisitor(row) {
				this.$refs['addOrUpdate'].init(row)
			},
			search() {
				this.page = 1;
				this.query();
			},
			resetQuery() {
				this.dataForm = {
					scStuname: '',
					scSex: ''
				};
				this.search();
			},
			// 详情
			viewHandle(row) {
				this.$refs['viewVisitor'].init(row)
			},
			// 还卡
			returnCardHandle(row) {
				this.$confirm('确认进行还卡操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: `/system/scvisitorrecord/returncard/${row.vrId}`,
						method: "put",
					}).then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						this.query();
						this.$message.success(res.msg)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			trackHandle(row) {
				let start = new Date(row.vrVistorbegintime).getTime();
				let end = new Date(row.vrVistorendtime).getTime() || '';
				let query = {
					tid: row.vrUwbid,
					start: start,
					end: end
				};
				// 历史访客   添加历史访客id 
				if (row.vrReturnuwb) {
					query.vrid = row.vrId
				}
				this.$router.push({
					path: "/xwyl-track",
					query: query
				})
			},
			// formatterSex(row) {
			// 	return getDictLabel('gender', row.vrSex)
			// },
			getEquipList() {
				this.$http({
					url: "/system/scpersonidequip/getAll",
					method: "get"
				}).then(({
					data: res
				}) => {
					if (res.code != 0) {
						return this.$message.error(res.msg)
					}
					this.equipList = res.data;
					// 判断是否更新了设备
					let id = window.localStorage.getItem("visitor_eqid");
					if (id) {
						let state = res.data.some(item => item.pieEquipsn == id);
						this.dataForm.deviceNumber = id;
						// 更新了设备绑定值   清除设备
						if (!state) {
							window.localStorage.removeItem("visitor_eqid");
							this.dataForm.deviceNumber = '';
						}
					}
				})
			},
			setVistorEquip(val) {
				window.localStorage.setItem("visitor_eqid", val)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-table {
		.student-img {
			vertical-align: top;
			width: 53px;
			height: 70px;
		}
	}
</style>
