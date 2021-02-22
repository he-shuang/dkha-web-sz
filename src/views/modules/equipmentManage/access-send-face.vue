<template>
	<el-dialog title="下发" width="600px" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<div>
			<el-form ref="form" :model="dataForm" label-width="80px" inline>
				<el-form-item label="人员类型" v-if="accessType==='eight'">
					<el-select v-model="dataForm.type" placeholder="请选择" @change="search">
						<el-option v-for="item in personTypeList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictValue">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="search">查询</el-button>
					<el-button type="success" @click="sendFace">下发选中</el-button>
				</el-form-item>


			</el-form>
			<el-table :data="dataList" @selection-change="handleSelectionChange" height="50vh">
				<el-table-column type="selection" width="60" align="center"></el-table-column>
				<el-table-column prop="imgUrl" label="照片" width="200">
					<template slot-scope="scope">
						<el-image class="student-img" :src="scope.row.imgUrl" :preview-src-list="previewList">
							<div slot="error" class="image-slot">
								<img class="student-img" src="../../../assets/img/person.jpg">
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
			</el-table>
			<el-pagination small :current-page="pageInfo.page" :page-sizes="[10, 20, 50, 1000]" :page-size="pageInfo.limit"
			 :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
			</el-pagination>
		</div>
	</el-dialog>
</template>
<script>
	import {
		getDictDataList
	} from "@/utils";
	export default {
		props: {
			aeids: {
				type: Array,
				default: []
			},
			accessType: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				dialogVisible: false,
				dataForm: {
					type: 1,
					name: '',
					scStuname: '', //学生姓名
					scWaname: '', //职工信息
					vrName: '', //访客姓名
				},
				total: 0,
				pageInfo: {
					page: 1,
					limit: 10
				},
				checkedList: [],
				dataList: [],
				personTypeList: [{
						dictLabel: "学生",
						dictValue: 1
					},
					{
						dictLabel: "职工",
						dictValue: 2
					},
					{
						dictLabel: "访客",
						dictValue: 3
					}
				],
			};
		},
		watch: {
			'dataForm.name'(val) {
				this.dataForm.scStuname = val; //学生姓名
				this.dataForm.scWaname = val; //职工信息
				this.dataForm.vrName = val; //访客姓名
			}
		},
		computed: {
			httpUrl() {
				const urlList = ["/system/scstudents/page", "/system/scworkersarchives/page", "/system/scvisitorrecord/page"];
				return urlList[this.dataForm.type - 1]
			},
			previewList() {
				return this.dataList.map(item => {
					return item.imgUrl
				})
			},
			userids() {
				return this.checkedList.map(item => item.id)
			}
		},
		methods: {
			init() {
				this.dialogVisible = true;
				this.dataForm.name = '';
				this.pageInfo.page = 1;
				this.query();
			},
			search() {
				this.pageInfo.page = 1;
				this.query();
			},
			query() {
				this.$http({
					url: this.httpUrl,
					method: "get",
					params: {
						// scState:1,
						...this.dataForm,
						...this.pageInfo
					}
				}).then(({
					data: res
				}) => {
					if (res.code != 0) {
						return this.$messsage.error(res.msg)
					}
					this.total = res.data.total;
					let baseurl = this.$ImgServerUrl;
					this.dataList = res.data.list.map(item => {
						return {
							name: item.scStuname || item.scWaname || item.vrName,
							imgUrl: baseurl + (item.scPhotoimg || item.vrPhoneimg),
							id: item.scStdid || item.scWaid || item.vrId
						}
					});
				})
			},
			sendFace() {

				// console.log({
				// 	fiveDoors: this.aeids,
				// 	ids: this.userids,
				// })
				// return



				if (this.checkedList.length == 0) {
					return this.$message.warning(`请勾选需要变更密码的设备`)
				}
				this.$http(this.accessType === "eight" ? {
					url: "/system/scaidooreight/transfacelisttodoor",
					method: "post",
					timeout: 0,
					data: {
						aeids: this.aeids,
						userids: this.userids,
						usertype: this.dataForm.type
					}
				} : {
					url: "/system/fvscdevice/saveEqToFace",
					method: "post",
					timeout: 0,
					data: {
						fiveDoors: this.aeids,
						ids: this.userids,
						// userids: this.userids,
						// usertype: this.dataForm.type
					}
				}).then(({
					data: res
				}) => {
					if (res.code != 0) {
						return this.$message.error(res.msg)
					}
					this.$message.warning("正在下发中...")
					// this.$message.success('所选人员已下发到指定设备')
					// this.$parent.$parent.query();
				})
			},
			handleSelectionChange(data) {
				this.checkedList = data;
			},
			pageSizeChangeHandle(size) {
				this.pageInfo.limit = size;
				this.query()
			},
			pageCurrentChangeHandle(page) {
				this.pageInfo.page = page;
				this.query()
			},
		},
	};
</script>
<style lang="scss" scoped>
	.el-dialog {
		.el-button {
			margin-left: 20px;
		}

		.el-table {
			.student-img {
				vertical-align: top;
				width: 53px;
				height: 70px;
			}
		}
	}
</style>
