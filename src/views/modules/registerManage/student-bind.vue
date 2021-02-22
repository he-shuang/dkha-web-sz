<template>
  <el-dialog title="绑卡" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item class="block-item" label="照片" prop="scPhotoimg">
              <el-image :src="$ImgServerUrl+dataForm.scPhotoimg" class="avatar">
                <div slot="error" class="image-slot">
                  <img class="student-img" src="../../../assets/img/person.jpg" />
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="scStuname">
              <p>{{dataForm.scStuname}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="身份证号" prop="scIdno">
              <p>{{dataForm.scIdno}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学号" prop="scNo">
              <p>{{dataForm.scNo}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="联系电话" prop="scPhonenum">
              <p>{{dataForm.scPhonenum}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="UWB标签" prop="scUwbid">
              <el-input v-model="dataForm.scUwbid" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="RFID" prop="scRfcardid">
              <el-input v-model="dataForm.scRfcardid" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" v-loading="loading" @click="submitInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getDictLabel} from '@/utils'
import debounce from 'lodash/debounce'
export default {
   filters:{
    filterLabel(val,type){
      return getDictLabel(type,val)
    },
  },
    data(){
        const asyncValidate=(rule, value, callback) => {
          this.$http({
            url: "/system/globalValidation/checkUwb",
            method: "get",
            params: {
                id: this.dataForm.scStdid,
                uwb: value
              }
          }).then(({ data: res }) => {
              if (res) {
                  callback()
              } else {
                  callback(new Error('UWB标签重复'))
              }
          }).catch(err => {
              callback(new Error(err.msg))
          })
        };
        const asyncValidateRf=(rule, value, callback) => {
          this.$http({
            url: "/system/globalValidation/checkRfid",
            method: "get",
            params: {
                id: this.dataForm.scWaid,
                uwb: value
              }
          }).then(({ data: res }) => {
              if (res) {
                  callback()
              } else {
                  callback(new Error('RFID重复'))
              }
          }).catch(err => {
              callback(new Error(err.msg))
          })
        };
        return {
            dialogVisible:false,
            loading:false,
            type:'post',
            dataForm:{},
            rules:{
                scRfcardid:[
                  {required: true, message:'请输入', trigger: ['blur','change']},
                   {
                    required: true,
                    validator: asyncValidateRf,
                    trigger: ['change']
                  }
                ],
                scUwbid:[
                  {
                    required: true,
                    validator: (rule, value, callback)=>{
                      if (!/^[0-9]+$/.test(value)) {
                        return callback(new Error("UWB标签只能是数字"));
                      }
                      callback()
                    },
                    trigger: ['change']
                  },
                  {
                    required: true,
                    validator: asyncValidate,
                    trigger: ['change',]
                  }
                ]

            },
        }
    },
    methods:{
        init(data){
            this.dialogVisible=true;
            this.dataForm={
              ...data,
              scSex:String(data.scSex),
              scStatus:String(data.scStatus),
              scEducation:String(data.scEducation),
            }
            this.$nextTick(()=>{
              this.$refs['dataForm'].clearValidate();
            })
        },
        submitInfo:debounce(function(){
            this.$refs['dataForm'].validate((valid)=>{
                if(!valid){
                    return  false
                }
                this.loading=true;
                this.dataForm.scGraduationdate=this.dataForm.scGraduationdate?this.dataForm.scGraduationdate:null;
                 this.$http({
                    url:"/system/scstudents",
                    method:'put',
                    data:this.dataForm
                }).then(({data})=>{
                    if(data.code!=0){
                        return this.$message.error(data.msg)
                    }
                    this.dialogVisible=false;
                    this.$parent.$parent.search();
                    this.$message.success(data.msg)
                }).finally(()=>{
                  this.loading=false
                })
            })
           
        },1000)
    }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-form {
    .el-form-item {
      .el-date-editor--date,
      .el-select {
        width: 100%;
      }
      .avatar {
        height: 150px;
        width: 106px;
        margin-left: 20px;
        display: block;
      }
      .student-img {
        width: 106px;
        height: 150px;
      }
      p {
        margin: 0;
        padding: 0 10px;
      }
    }
  }
}
</style>