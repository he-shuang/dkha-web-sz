<template>
  <el-dialog
    title="新建"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
         <el-row>
           <el-col :span="12">
             <el-form-item label="设备主板芯片" prop="aeMainboard">
                <el-select v-model="dataForm.aeMainboard" placeholder="请选择">
                 <el-option
                   v-for="item in eightInchesEquipTypeList"
                   :key="item.dictValue"
                   :label="item.dictLabel"
                   :value="item.dictValue">
                 </el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="1">
             <el-form-item label="程序包名称" prop="aevPackname">
               <el-input v-model="dataForm.aevPackname" placeholder="请输入"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
          <el-row>
           <el-col :span="12">
             <el-form-item label="程序版本号" prop="aevVersion">
               <el-input v-model="dataForm.aevVersion" placeholder="请输入"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="1">
             <el-form-item label="程序版本code" prop="aevVersioncode">
                <el-input v-model="dataForm.aevVersioncode" placeholder="请输入"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="固件地址"  prop="aevUpdatefilepath">
                <el-input readonly v-model="dataForm.aevUpdatefilepath" placeholder="请点击右侧按钮上传"></el-input>
             </el-form-item>
            
           </el-col>
           <el-col :span="11" :offset="1">
               <el-upload
                ref="upload"
                class="upload-box"
                accept="application/vnd.android.package-archive"
                :action="baseUrl+uploadUrl"
                :headers="uploadHeaders"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
                :show-file-list="false"
                >
              <el-button  type="warning" v-loading="uploadLoading">点击上传</el-button><span>请上传apk文件</span>
            </el-upload>
           </el-col>
         </el-row>
         <el-row>
           <el-col>
              <el-form-item label="版本说明" prop="aevNote">
                <el-input type="textarea" v-model="dataForm.aevNote" :rows="3" resize="none" placeholder="请输入"></el-input>
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
import { getDictDataList,treeDataTranslate} from '@/utils'
import  debounce from 'lodash/debounce';
import Cookies from 'js-cookie';
export default {
    data(){
        return {
            dialogVisible:false,
            loading:false,
            uploadLoading:false,
            dataForm:{
              aeMainboard:'',
              aevPackname:'',
              aevVersion:'',
              aevVersioncode:'',
              aevUpdatefilepath:'',
              aevNote:'',
            },
            eightInchesEquipTypeList:getDictDataList('eightInchesEquipType'),
            rules:{
                aeMainboard:[
                  {required: true, message:'请选择', trigger: ['blur','change']}
                ],
                aevPackname:[
                  {required: true, message:'请输入', trigger: ['blur','change']},
                ],
                aevVersion:[
                  {required: true, message:'请输入', trigger: ['blur','change']},
                ],
                aevVersioncode:[
                  {required: true, message:'请输入', trigger: ['blur','change']},
                  {validator: (rule, value, callback)=>{
                      if (!/^[0-9]+$/.test(value)) {
                        return callback(new Error("版本号必须全部为数字"));
                      }
                      callback()
                    }, trigger: ['blur','change']}
                ],
                aevUpdatefilepath:[
                  {required: true, message:'请输入', trigger: ['blur','change']}
                ],
                aevNote:[
                {required: true, message:'请选择', trigger: ['blur','change']}
                ]
            },
            baseUrl: window.SITE_CONFIG['apiURL'],
              uploadUrl:'/system/scaidooreightversion/uploadapkfile',
              uploadHeaders: {},
            }
    },
    created() {
      this.uploadHeaders = {
        Authorization: 'Bearer ' + Cookies.get('access_token') || ''
      }
    },
    methods:{
        init(data){
            this.dialogVisible=true;
            // 新增
            this.dataForm={
              aeMainboard:'',
              aevPackname:'',
              aevVersion:'',
              aevVersioncode:'',
              aevUpdatefilepath:'',
              aevNote:'',
            }
            this.$nextTick(()=>{
              this.$refs['dataForm'].clearValidate()
            })
        },
        submitInfo:debounce(function(){
            this.$refs['dataForm'].validate((valid)=>{
                if(!valid){
                    return  false
                }
                this.loading=true;
                let submitData={
                  ...this.dataForm,
                }
                 this.$http({
                    url:"/system/scaidooreightversion",
                    method:'post',
                    data:submitData
                }).then(({data})=>{
                    if(data.code!=0){
                        return this.$message.error(data.msg)
                    }
                    this.dialogVisible=false;
                    if(this.type=='post'){
                      this.$parent.$parent.resetForm('ruleForm');
                    }
                    else{
                      this.$parent.$parent.search();
                    }
                    this.$message.success(data.msg||'操作成功')
                }).finally(()=>{
                  this.loading=false;
                })
            })
           
        },1000),
        beforeUpload(file){
          this.uploadLoading=true;
          return true
        },
        handleError(err,file){
          this.uploadLoading=false;
          this.$message.error(err)
        },
      handleSuccess(res) {
        this.uploadLoading=false;
				if (res.code != 0) {
          return this.$message.error(res.msg)
        } 
        this.dataForm.aevUpdatefilepath=res.data;
        this.$message.success(res.msg||'上传成功')
			},
    }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-form {
    .el-form-item {
      .el-date-editor--date,
      .el-cascader,
      .el-select {
        width: 100%;
      }
    }
    .el-upload{
      .el-button{
        margin-right: 20px;
      }
      span{
        color: #fff;
      }
    }
  }
}
</style>