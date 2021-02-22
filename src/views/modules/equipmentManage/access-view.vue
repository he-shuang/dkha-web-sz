<template>
  <el-dialog title="详情" width="700px" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div>
      <el-row>
        <el-col :span="4">设备端IP：</el-col>
        <el-col :span="8">{{dataForm.aeClientip}}</el-col>
        <el-col :span="4">设备端端口：</el-col>
        <el-col :span="8">{{dataForm.aeClientport}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">设备名称：</el-col>
        <el-col :span="8">{{dataForm.aeDevicename}}</el-col>
        <el-col :span="4">设备签到类型：</el-col>
        <el-col :span="8">{{dataForm.aeSigntype | typeFilter}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">有效期：</el-col>
        <el-col :span="8">{{dataForm.aeExpirydate}}</el-col>
        <el-col :span="4">安装位置：</el-col>
        <el-col :span="8">{{dataForm.floorName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">设备序列号：</el-col>
        <el-col :span="8">{{dataForm.aeSerialnumber}}</el-col>
        <el-col :span="4">签名密钥：</el-col>
        <el-col :span="8">{{dataForm.aeSignkey}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">备注：</el-col>
        <el-col :span="21">{{dataForm.remark}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">所属部门：</el-col>
        <el-col :span="20" > <span v-for="deptDoor in deptDoorList">{{deptDoor.deptName}} </span></el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { getDictLabel } from "@/utils";
export default {
  filters: {
    typeFilter(value) {
      return getDictLabel("accessEquipType", value);
    }
  },
  data() {
    return {
      deptDoorList:[],
      dialogVisible: false,
      dataForm: {}
    };
  },
  methods: {
    getDeptCheckList () {
      return this.$http.get('/system/scaidooreight/dept/'+this.dataForm.aeId).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptDoorList = res.data;
        //this.deptList = res.data
      }).catch(() => {})
    },

    init(data) {
      this.dialogVisible = true;
      this.dataForm = {
        ...data
      };
      this.getDeptCheckList();
    }


  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-row {
    color: #fff;
    line-height: 35px;
    .el-col-4 {
      text-align: right;
    }
  }
}
</style>