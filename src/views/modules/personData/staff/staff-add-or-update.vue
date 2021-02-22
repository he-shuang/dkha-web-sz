<template>
  <el-dialog
    :title="type=='post'?'新建':'修改'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item class="block-item" label="照片" prop="scPhotoimg">
              <!-- <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
                :data="{folderName:'staff'}"
              >
                <img v-if="dataForm.scPhotoimg" :src="$ImgServerUrl+dataForm.scPhotoimg" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" v-loading="imgLoading"></i>
              </el-upload> -->
              <img-clip v-model="dataForm.scPhotoimg"  folder-name="staff"></img-clip>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="scWaname">
              <el-input v-model.trim="dataForm.scWaname" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="身份证号" prop="scIdno">
              <el-input v-model="dataForm.scIdno" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="scPhonenum">
              <el-input v-model="dataForm.scPhonenum" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="性别" prop="scWasex">
              <el-radio-group v-model="dataForm.scWasex" placeholder="请输入">
                <el-radio
                  disabled
                  v-for="item in  genderList"
                  :key="item.dictLabel"
                  :label="item.dictValue"
                >{{item.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职工编号" prop="scEmpno">
              <el-input v-model="dataForm.scEmpno" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="类型" prop="scEmptype">
              <el-select v-model="dataForm.scEmptype" placeholder="请选择" clearable>
                <el-option
                  v-for="item in employTypeList"
                  :key="item.dictLabel"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="scHiredate">
              <el-date-picker
                v-model="dataForm.scHiredate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="状态" prop="scStatus">
              <el-select v-model="dataForm.scStatus" placeholder="请选择" clearable>
                <el-option
                  v-for="item in staffStatusList"
                  :key="item.dictLabel"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
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
import { getDictDataList} from '@/utils'
import { isMobile,idCardValidate } from '@/utils/validate'
import debounce from 'lodash/debounce'
import Cookies from 'js-cookie'
import imgClip from '@/components/public/img-clip'
export default {
    components:{ imgClip },
    watch:{
        'dataForm.scIdno':{
            immediate:true,
            handler(val){
                let gender='0';
                if(val&&val.length==18){
                    gender=val[16]%2==0?'0':'1';
                }
                this.dataForm.scWasex=gender
            }
        }
    },
    data(){
        return {
            dialogVisible:false,
            loading:false,
            imgLoading:false,
            type:'post',
            dataForm:{
                scPhotoimg:'',
                scWaname:'',
                scIdno:'',
                scWasex:'0',
                scPhonenum:'',
                scEmpno:'',
                scStatus:'',
                scEmptype:'',
                scHiredate:'',
                scGraduationdate:''
            },
            genderList:getDictDataList('gender').filter(item=>item.dictValue<2),
            staffStatusList:getDictDataList('staffStatus'),
            employTypeList:getDictDataList('employType').filter(item=>item.dictLabel!='学生'&&item.dictLabel!='访客'),
            rules:{
                scPhotoimg:[
                    {required: true, message:'请上传图片', trigger: ['blur','change']},
                ],
                 scWaname:[
                    {required: true, message:'请输入', trigger: ['blur','change']},
                    {max: 50, message:'最多50个字符', trigger: ['blur','change']}
                ],
                 scIdno:[
                    {required: true, message:'请输入', trigger: ['blur','change']},
                    { validator: idCardValidate, trigger: ['blur','change'] }
                ],
                 scWasex:[
                    {required: true, message:'请输入', trigger: ['blur','change']}
                ],
                 scPhonenum:[
                    {required: true, message:'请输入', trigger: ['blur','change']},
                    { validator: isMobile, trigger: ['blur','change'] }
                ],
                 scEmpno:[
                    {required: true, message:'请输入', trigger: ['blur','change']},
                    {max: 15, message:'最多15个字符', trigger: ['blur','change']}
                ], scEmptype:[
                    {required: true, message:'请选择', trigger: ['blur','change']}
                ], scHiredate:[
                    {required: true, message:'请选择', trigger: ['blur','change']}
                ]
                , scStatus:[
                    {required: true, message:'请选择', trigger: ['blur','change']}
                ]

            },
            uploadHeaders:{},
            uploadUrl:window.SITE_CONFIG['apiURL']+'/system/upload'
        }
    },
    created(){
        this.uploadHeaders={
            Authorization:'Bearer ' + Cookies.get('access_token') || ''
        }
    },
    methods:{
        init(data){
            this.dialogVisible=true;
            // 编辑
            if(data){
                this.type="put";
                this.dataForm={
                    ...data,
                    scWasex:String(data.scWasex),
                    scStatus:String(data.scStatus),
                    scEmptype:String(data.scEmptype),
                }
            }
            else{
                this.type="post";
                this.dataForm={
                  scPhotoimg:'',
                      scWaname:'',
                      scIdno:'',
                      scWasex:'0',
                      scPhonenum:'',
                      scEmpno:'',
                      scStatus:'',
                      scEmptype:'',
                      scHiredate:'',
                      scGraduationdate:''
                }
                this.$nextTick(()=>{
                  this.$refs['dataForm'].clearValidate()
                })
            }
        },
        submitInfo:debounce(function(){
            this.$refs['dataForm'].validate((valid)=>{
                if(!valid){
                    return  false
                }
                this.loading=true;
                 this.$http({
                    url:"/system/scworkersarchives",
                    method:this.type,
                    data:this.dataForm
                }).then(({data})=>{
                    if(data.code!=0){
                        return this.$message.error(data.msg)
                    }
                    this.dialogVisible=false;
                    if(this.type=='post'){
                      this.$parent.$parent.resetQuery();
                    }
                    else{
                      this.$parent.$parent.search();
                    }
                    this.$message.success(data.msg)
                }).finally(()=>{
                  this.loading=false;
                })
            })
           
        },1000),
        handleUploadSuccess(res){
            this.imgLoading=false;
            if(res.code!=0){
                return this.$message.error(res.msg)
            }
            this.dataForm.scPhotoimg=res.data.path;
        },
        beforeUpload(file){
            const isJPG=file.type=='image/jpeg'||file.type=='image/png';
            const isLess2M=file.size/1024 /1024<2;
            if(!isJPG){
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if(!isLess2M){
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            this.imgLoading=isJPG && isLess2M;
            return isJPG && isLess2M;
        }
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
      /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-left: 20px;
        .avatar-uploader-icon {
          font-size: 28px;
          color: #fff;
          height: 150px;
          width: 106px;
          line-height: 150px;
          text-align: center;
        }
        .avatar {
          height: 150px;
          width: 106px;
          display: block;
        }
      }
    }
  }
}
</style>