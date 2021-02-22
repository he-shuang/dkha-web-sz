<template>
	<el-dialog :title="'('+roomName+')已下发人员'" width="900px" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form ref="ruleForm" :model="formData" label-width="80px" inline @keyup.enter.native="getDataList">
			<el-form-item label="姓名" prop="name">
				<el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" v-loading="loading" height="50vh">
			<el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
			<el-table-column prop="photoimg" label="照片" align="center" width="100">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.photoimg" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="username" label="姓名" align="center" width="70"></el-table-column>
			<el-table-column prop="statusNote" label="下发状态" align="center"></el-table-column>
			<el-table-column prop="downfaceTime" label="下发时间" align="center"></el-table-column>
			<el-table-column prop="completeTime" label="完成时间" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" align="center" fixed="right" width="80">
				<template slot-scope="scope">
					<el-button type="text" @click="deleteHandle(scope.row)">{{$t('delete')}}</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	import qs from 'qs'
	export default {
		data() {
			return {
				dialogVisible: false,
				loading: false,
				dataList: [],
				id: "",
				roomName: "",
				formData:{name:''}
			};
		},
		methods: {
			init(id) {
				this.formData.name='';
				this.id = id
				this.dialogVisible = true;
				this.getDataList();

			},
			// 查询
			getDataList() {
				this.$http.get(`/system/fvscdevice/${this.id}/${this.formData.name}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataList = res.data.personList
					this.roomName = res.data.fname
				}).catch(err => {

				})
			},
			// 删除
			deleteHandle(obj) {
				this.$confirm(this.$t('prompt.info', {
					'handle': this.$t('delete')
				}), this.$t('prompt.title'), {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					var params = qs.stringify({
						imgId: obj.imgId,
						password: obj.password,
						serial: obj.serial
					})
					this.$http.post(`/system/fvscdevice/deleteFace`, params).then(({
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
								this.getDataList()
							}
						})
					}).catch(() => {}).finally(res => {
						this.loading = false
					})
				}).catch(() => {})
			}
		}
	};
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
