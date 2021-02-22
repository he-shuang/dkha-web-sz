<template>
  <el-dialog
    :title="type=='post'?'新建':'修改'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域名称" prop="rcName">
              <el-input v-model.trim="dataForm.rcName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="区域编号" prop="rcNo">
              <el-input v-model="dataForm.rcNo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域位置" prop="rcAddress">
              <el-input v-model="dataForm.rcAddress" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="楼层/楼栋" prop="rcFloor">
             <el-cascader v-model="dataForm.rcFloor" clearable placeholder="请选择" :options="buildList" :props="{value:'df_floorid',label:'df_floorname'}"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域围栏" prop="rcFenceId">
              <el-select v-model="dataForm.rcFenceId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in fenceList"
                  :key="item.id"
                  :label="item.fenceName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="类别" prop="rcType">
              <el-select v-model="dataForm.rcType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in areaList"
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
import { getDictDataList,treeDataTranslate} from '@/utils'
import debounce from 'lodash/debounce'
export default {
    data(){
        return {
            dialogVisible:false,
            loading:false,
            type:'post',
            dataForm:{
                rcName:'',
                rcNo:'',
                rcAddress:'',
                rcFloor:'',
                rcFenceId:'',
                rcFenceName:'',
                rcType:'',
            },
            rules:{
                rcName:[{required: true, message:'请输入', trigger: ['blur','change']},],
                rcNo:[{required: true, message:'请输入', trigger: ['blur','change']},],
                rcAddress:[{required: true, message:'请输入', trigger: ['blur','change']},],
                rcFloor:[{required: true, message:'请选择', trigger: ['blur','change']},],
                rcFenceId:[{required: true, message:'请选择', trigger: ['blur','change']},],
                rcType:[{required: true, message:'请选择', trigger: ['blur','change']},],
            },
            genderList:[],
            buildList:[],
            fenceList:[],
            areaList:getDictDataList('areaType')
        }
    },
    created(){
        this.getBuildTree()
        this.getAreaFence()
    },
    methods:{
        init(id){
            this.dialogVisible=true;
            // 编辑
            if(id){
                this.type="put";
                if(id){
                    this.$http({
                        url:`/system/scregionconfig/${id}`,
                        method:"get"
                    }).then(({data:res})=>{
                        if(res.code!=0){
                           return this.$message.error(res.msg)
                        }
                        this.dataForm={
                            ...res.data,
                            rcType:String(res.data.rcType)
                        };
                    }).catch(err=>{
                        this.$message.error(err)
                    })
                }
            }
            // 新增
            else{
                this.type="post";
                this.dataForm={
                    rcName:'',
                    rcNo:'',
                    rcAddress:'',
                    rcFloor:'',
                    rcFenceId:'',
                    rcFenceName:'',
                    rcType:'',
                };
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
                // 提交需要区域围栏名称  回显
                let currentFence=this.fenceList.filter(item=>item.id==this.dataForm.rcFenceId)[0];
                this.dataForm.rcFenceName=currentFence.floor+currentFence.fenceName;
                 this.$http({
                    url:"/system/scregionconfig",
                    method:this.type,
                    data:this.dataForm
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
                    this.$message.success(data.msg)
                }).finally(()=>{
                  this.loading=false
                })
            })
           
        },1000),
        getBuildTree () {
            this.$http.get('/system/scdormitoryfloor/tree/-1').then(({ data: res }) => {
                if (res.code !== 0) {
                return this.$message.error(res.msg)
                }
                this.buildList = treeDataTranslate(res.data,'df_floorid','df_parentid')
            }).catch(() => {})
        },
        getAreaFence(){
            this.$http({
                url:"/system/scregionconfig/getUwbRegionList",
                method:"get"
            }).then(({data:res})=>{
                console.log(res)
                this.fenceList=res.data;
            }).catch(()=>{})
        }
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
  }
}
</style>