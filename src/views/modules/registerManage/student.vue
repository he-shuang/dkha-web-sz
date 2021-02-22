<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form ref="dataForm" :model="dataForm" label-width="80px" inline>
      <el-form-item label="姓名" prop="scStuname">
        <el-input v-model="dataForm.scStuname" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="scNo">
        <el-input v-model="dataForm.scNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  @click="search">查询</el-button>
        <el-button type="warning" @click="resetForm('dataForm')">重置</el-button>
        <el-button type="success" @click="uploadExcel">导入</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column label="照片">
        <template slot-scope="scope">
          <el-image class="student-img" :src="$ImgServerUrl+scope.row.scPhotoimg" :preview-src-list="previewList">
             <div slot="error" class="image-slot">
                <img class="student-img" src="../../../assets/img/person.jpg">
            </div>
          </el-image>
        </template>
      </el-table-column>
	  <el-table-column prop="scStuname" label="姓名"></el-table-column>
      <el-table-column prop="scNo" label="学号"></el-table-column>
      <el-table-column prop="scSex" label="性别" :formatter="formatterSex"></el-table-column>
      <el-table-column prop="scIdno" label="身份证号码"></el-table-column>
      <el-table-column prop="scRfcardid" label="RFID"></el-table-column>
      <el-table-column prop="scUwbid" label="UWB标签"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
            <el-button
              type="text" 
              class="danger-button"
              v-if="scope.row.scRfcardid||scope.row.scUwbid"
              @click="unbindHandle(scope.row)"
            >解绑</el-button>
            <el-button type="text" v-else @click="editHandle(scope.row)">绑卡</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[6,10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    ></el-pagination>
    <!-- 新增修改 -->
    <add-or-update ref="addOrUpdate"></add-or-update>
    <!-- 查看 -->
    <view-student ref="viewStudent"></view-student>
          <!-- 批量上传信息 -->
    <upload ref="studentUploadExcel" template-url="./template/学生卡登记表导入模板.xls" upload-url="/system/scstudents/importRegisterInfoExcel"></upload>

  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import addOrUpdate from '@/views/modules/registerManage/student-bind'
import viewStudent from '@/views/modules/registerManage/student-view'
import { getDictLabel} from '@/utils'
import upload from '@/components/public/upload-excel-or-img'
export default {
  mixins: [mixinViewModule],
  components:{ addOrUpdate,viewStudent,upload },
  data(){
    return{
      mixinViewModuleOptions: {
        getDataListURL: '/system/scstudents/page',
        deleteURL: '/system/scstudents',
        getDataListIsPage:true
      },
      limit:6,
      dataForm:{
        scStuname:'',
        scNo:''
      },
      dataList:[]
    }
  },
    computed:{
    previewList(){
      return  this.dataList.map(item=>{
         return  this.$ImgServerUrl+item.scPhotoimg
      })
    },
  },
  methods:{
    addStudent(){
       this.$refs['addOrUpdate'].init()
    },
    search(){
      this.page=1;
      this.query();
    },
    resetQuery(){
      this.dataForm={
        scStuname:'',
        scNo:''
      };
      this.page=1;
      this.query();
    },
    viewHandle(row){
      this.$refs['viewStudent'].init(row)
    },
    editHandle(row){
      this.$refs['addOrUpdate'].init(row)
    },
    uploadExcel(){
      this.$refs['studentUploadExcel'].init()
    },
    unbindHandle(row){
        this.$confirm('确定进行解绑操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dataForm={
            ...row,
            scGraduationdate:row.scGraduationdate?row.scGraduationdate:null,
            scUwbid:'',
            scRfcardid:'',
          };
          this.$http({
                    url:"/system/scstudents",
                    method:'put',
                    data:dataForm
                }).then(({data})=>{
                    if(data.code!=0){
                        return this.$message.error(data.msg)
                    }
                    this.query();
                    this.$message.success(data.msg)
                })
        })
    },
     formatterSex(row){
      return getDictLabel('gender',row.scSex)
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
   .danger-button{
    color: #FF4040;
  }
}
</style>