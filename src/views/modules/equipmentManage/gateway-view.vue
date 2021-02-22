<template>
	<el-dialog :visible.sync="visible" title="详情" :close-on-click-modal="false" :close-on-press-escape="false">

		<el-row>
			<el-col :span="3">IP地址：</el-col>
			<el-col :span="9">{{dataForm.gwIpgateway}}</el-col>
			<el-col :span="3">设备名称：</el-col>
			<el-col :span="9">{{dataForm.gwName}}</el-col>
		</el-row>
		<el-row>
			<el-col :span="3">设备序列号：</el-col>
			<el-col :span="9">{{dataForm.gwSn}}</el-col>
			<el-col :span="3">有效期：</el-col>
			<el-col :span="9">{{dataForm.gwExpirydate}}</el-col>
		</el-row>
		<el-row>
			<el-col :span="3">安装位置：</el-col>
			<el-col :span="9">{{dataForm.gwSetupaddr&&dataForm.gwSetupaddr[0]}}</el-col>
		</el-row>
		<el-row>
			<el-col :span="3">总线：</el-col>
			<el-col :span="21">
				 <el-row>
					 <el-col :span="2">序号</el-col>
					 <el-col :span="2">总线编号</el-col>
					 <el-col :span="4">设备类型</el-col>
					 <el-col :span="4">设备</el-col>
					 <el-col :span="4">接口编号</el-col>
					 <el-col :span="4">分组编号</el-col>
					 <el-col :span="4">围栏编号</el-col>
				 </el-row>
				 <el-row v-for="(item,index) in dataForm.scGatebusdeviceDTOList" :key="index">
					 <el-col :span="2">{{index+1}}</el-col>
					 <el-col :span="2">{{item.gbdLineNum}}</el-col>
					 <el-col :span="4">{{item.gbdDevicetype}}</el-col>
					 <el-col :span="4">{{item.mbdDevicename}}</el-col>
					 <el-col :span="4">{{item.gbdAddr}}</el-col>
					 <el-col :span="4">{{item.gbdGroup}}</el-col>
					 <el-col :span="4">{{item.fenceName}}</el-col>
				 </el-row>
			</el-col>
		</el-row>
			<el-row>
			<el-col :span="3">备注：</el-col>
			<el-col :span="21">{{dataForm.remark}}</el-col>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		name: "electric-add-or-update",
		data() {
			return {
				visible: false,
				dataForm: {
					"id": "",
					gwId: "",
					gwIpgateway: "",
					gwName: "",
					gwSn: "",
					// gwUwbnum: "",
					gwExpirydate: "",
					gwSetupaddr: [],
					scGatebusdeviceDTOList: [],
					remark: "",
				},
			}
		},
		methods: {
			init(id) {
				this.visible = true
				this.dataForm.id = id
				this.$http.get(`/system/scgatewaydc/info/${id}`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm = { ...this.dataForm,
						...res.data
					}
				}).catch(() => {})
			},
		},
	}
</script>

<style scoped lang="scss">
.el-dialog {
  .el-row {
    color: #fff;
    line-height: 35px;
    .el-col-3 {
      text-align: right;
    }
    .student-img {
      width: 106px;
      height: 150px;
    }
  }
}
</style>
