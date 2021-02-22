<template>
  <el-dialog
    :visible.sync="visible"
    title="详情"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
	width="700px"
  >
    <el-row>
      <el-col :span="4">设备名称：</el-col>
      <el-col :span="8">{{dataForm.tfDevicename}}</el-col>
      <el-col :span="4">设备序列号：</el-col>
      <el-col :span="8">{{dataForm.tfDevicesn}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">IP地址：</el-col>
      <el-col :span="8">{{dataForm.tfIpgateway}}</el-col>
      <el-col :span="4">安装位置：</el-col>
      <el-col :span="8">{{dataForm.tfSetupaddr.join("/")}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">有效期：</el-col>
      <el-col :span="8">{{dataForm.tfExpirydate}}</el-col>
    </el-row>
	 <el-row>
      <el-col :span="4">检测端编号：</el-col>
      <el-col :span="20">
		  <el-row v-for="(item,index) in dataForm.scTransformerroomDTOList" :key="index">
			  <el-col :span="1">{{item.tfrPortaddr}}</el-col>
			  <el-col :span="9">{{item.tfrDrroomno}}</el-col>
		  </el-row>
		  <!-- {{dataForm.scTransformerroomDTOList}} -->
	  </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">备注：</el-col>
      <el-col :span="20">{{dataForm.remark}}</el-col>
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
					tfId: "",
					tfDevicename: "",
					"tfDevicesn": "",
					"tfIpgateway": "",
					tfSetupaddr: [],
					"tfExpirydate": "",
					scTransformerroomDTOList: [{
							tfrPortaddr: 1,
							drId: "",
						},
						{
							tfrPortaddr: 2,
							drId: "",
						},
						{
							tfrPortaddr: 3,
							drId: "",
						},
						{
							tfrPortaddr: 4,
							drId: "",
						},
					],
					remark: "",
				},
			}
		},
	
		methods: {
			init(id) {
				this.dataForm.id = id
				this.visible = true
				this.$http.get(`/system/sctransformerdc/info/${id}`).then(({
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
		}
	}
</script>

<style scoped lang="scss">
.el-dialog {
  .el-row {
    color: #fff;
    line-height: 35px;
    .el-col-4 {
      text-align: right;
    }
    .student-img {
      width: 106px;
      height: 150px;
    }
  }
}
</style>
