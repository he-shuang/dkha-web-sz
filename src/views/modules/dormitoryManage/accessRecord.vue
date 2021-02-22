<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-form ref="ruleForm" :model="dataForm" label-width="80px" inline>
			<el-form-item label="姓名" prop="recognitionName">
				<el-input v-model="dataForm.recognitionName" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="工号/学号" prop="no">
				<el-input v-model="dataForm.no" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备名称" prop="aeId">
				<el-select v-model="dataForm.aeId" placeholder="请选择" clearable filterable>
					<el-option v-for="item in eqList" :key="item.aeId" :label="item.aeDevicename" :value="item.aeId">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间" prop="time">
				<el-date-picker clearable v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至"
								start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="search">查询</el-button>
				<el-button type="warning" @click="resetSearch">重置</el-button>
				<el-button type="success" @click="exportHandle()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList">
			<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
			<el-table-column prop="imageUrl" label="照片" width="120" align="center">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.imageUrl" :preview-src-list="[$ImgServerUrl + scope.row.imageUrl]">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="recognitionName" label="姓名" width="120" align="center"></el-table-column>
			<el-table-column prop="aeDevicename" label="设备名称" align="center"></el-table-column>
			<el-table-column prop="recordType" label="记录类型" align="center">
				<template slot-scope="scope">
					<div>
						{{scope.row.recordType==1?'刷脸记录':'刷IC卡记录'}}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="verificationType" label="签到类型" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.verificationType==1" style="color:#67C23A;" class="el-icon-d-arrow-right"> {{ $getDictLabel("accessEquipType", scope.row.verificationType) }}</span>
					<span v-else style="color:#f56c6c;" class="el-icon-d-arrow-left"> {{ $getDictLabel("accessEquipType", scope.row.verificationType) }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="icCardNo" label="IC卡号"   align="center"></el-table-column> -->
			<el-table-column prop="temperature" label="体温(℃)" align="center">
				<template slot-scope="scope">
					<div>
						<span style="color:#f56c6c;" v-if="scope.row.temperature>=37.3">{{scope.row.temperature}}</span>
						<span style="color:#67C23A;" v-else>{{scope.row.temperature}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="签到时间" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
					   @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import qs from 'qs'
	import Cookies from 'js-cookie'
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictLabel,
		getDictDataList
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scfaceverification/page',
					getDataListIsPage: true,
				},
				equipStatusList: getDictDataList('equipment_status'),
				limit: 6,
				time: [],
				eqList: [],
				dataForm: {
					aeId: '',
					state: '',
					recognitionName: '',
					startDate: '',
					endDate: '',
					type: 2, // 1教学楼；2宿舍
					no:''
				},
			}
		},
		watch: {
			time: {
				deep: true,
				handler(newval) {
					if (newval && newval.length) {
						this.dataForm.startDate = newval[0];
						this.dataForm.endDate = newval[1];
					} else {
						this.dataForm.startDate = '';
						this.dataForm.endDate = '';
					}
				}
			},

		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.imageUrl
				})
			},
		},
		created() {
			this.getEquipList()

		},
		activated() {
			//let params = this.$route.params;	
		},
		methods: {
			pushFun(){
				let params = this.$route.params;
				/* // 设备管理-8寸闸机设备
				let aeId = window.sessionStorage.getItem('access_record_aeid');
				// 首页温度预警跳转（安保人员）
				let tempName = window.sessionStorage.getItem('tempName');
				// 首页通行人员跳转（宿管人员）
				let peerName = window.sessionStorage.getItem('peerName');
				if (aeId) {
					window.sessionStorage.removeItem('access_record_aeid');
					this.dataForm.aeId = aeId;
					this.search();
				}
				if (tempName) {
					window.sessionStorage.removeItem('tempName');
					this.dataForm.recognitionName = tempName;
					this.search();
				}
				if (peerName) {
					window.sessionStorage.removeItem('peerName');
					this.dataForm.recognitionName = peerName;
					this.search();
				} */
			},
			// 导出
			exportHandle() {
				if (this.dataList.length === 0) {
					return this.$message.info("报表暂无数据")
				}
				var params = qs.stringify({
					'access_token': Cookies.get('access_token'),
					...this.dataForm,
					...{
						page: this.page,
						limit: this.limit
					}
				})
				window.location.href = `${window.SITE_CONFIG['apiURL']}/system/scfaceverification/export?${params}`
			},
			search() {
				this.page = 1;
				this.query();
			},
			resetSearch() {
				this.dataForm = {
					state: '',
					recognitionName: '',
					startDate: '',
					endDate: '',
					type: 1,
				}
				this.time = [];
				this.query()
			},
			getEquipList() {
				this.$http({
					url: "/system/scaidooreight/getAllByType/3",
					method: "get"
				}).then(({
							 data: res
						 }) => {
					if (res.code != 0) {
						return this.$message(res.msg)
					}
					this.eqList = res.data
				})
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
