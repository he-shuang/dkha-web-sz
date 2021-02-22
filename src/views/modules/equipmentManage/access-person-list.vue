<template>
  <el-dialog :title="'('+aeDevicename+')已下发人员'" width="700px" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div>
      <el-form ref="form" :model="pageInfo" label-width="80px" inline>
          <el-form-item label="姓名">
            <el-input v-model="pageInfo.username" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search">查询</el-button>
            <el-button v-if="$hasPermission('system:scaidooreightpersonlist:delete')" type="danger" @click="deletePerson()">批量删除</el-button>
          </el-form-item>
      </el-form>
      <el-table :data="dataList" v-loading="loading" @selection-change="selectionChangeHanlder" height="50vh">
        <el-table-column type="selection"  align="center" width="100"></el-table-column>
        <el-table-column prop="photoimg" label="照片" align="center" width="120">
          <template slot-scope="scope">
          <el-image class="student-img" :src="$ImgServerUrl+scope.row.photoimg" :preview-src-list="previewList">
             <div slot="error" class="image-slot">
                <img class="student-img" src="../../../assets/img/person.jpg">
            </div>
          </el-image>
        </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="persontype" label="类型" :formatter="formatterPersonType" align="center"></el-table-column>
        <el-table-column  label="操作" align="center">
           <template slot-scope="scope">
             <div>
               <el-button type="text" v-if="$hasPermission('system:scaidooreightpersonlist:delete')" @click="deletePerson(scope.row.apId)">删除</el-button>
             </div>
           </template>
        </el-table-column>

      </el-table>
       <el-pagination
       small
        :current-page="pageInfo.page"
        :page-sizes="[10, 20, 50, 1000]"
        :page-size="pageInfo.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { getDictLabel,getDictDataList } from "@/utils";
export default {
  data() {
    return {
      dialogVisible: false,
      dataForm: {
        name:'',
      },
      loading:false,
      dataList:[],
      checkList:[],
      pageInfo:{
        aeId:'',
        username:'',
        page:1,
        limit:10,
      },
      total:0,
	  aeDevicename:"",// 设备名称
      // employTypeList:getDictDataList('employType'),
    };
  },
  computed:{
    previewList(){
      return  this.dataList.map(item=>{
         return  this.$ImgServerUrl+item.photoimg
      })
    },
  },
  methods: {
    init(id,aeDevicename) {
      if(!id){
        return  this.$message.error("找不到id!")
      }
	  this.aeDevicename = aeDevicename
      this.dialogVisible = true;
      this.page=1;
      this.dataList=[];
      this.pageInfo.aeId=id;
      this.pageInfo.username='';
      this.query();
    },
     search(){
      this.page=1;
      this.query();
    },
    query(){
      this.loading=true;
      this.$http({
        url:"/system/scaidooreightpersonlist/page",
        method:"get",
        params:{
          ...this.pageInfo
        },
      }).then(({data:res})=>{
        if(res.code!=0){
          return this.$message.error(res.msg)
        }
        this.total=res.data.total;
        this.dataList=res.data.list;
      }).finally(()=>{
        this.loading=false
      })
    },
    pageSizeChangeHandle(size){
      this.pageInfo.limit=size;
      this.query()
    },
     pageCurrentChangeHandle(page){
      this.pageInfo.page=page;
      this.query()
    },
    selectionChangeHanlder(val){
      this.checkList=val
    },
    deletePersonHandler(id){
      let ids=id?[id]:this.checkList.map(item=>item.apId);
      this.$http({
        url:`/system/scaidooreightpersonlist`,
        method:"delete",
        data:ids,
      }).then(({data:res})=>{
        if(res.code!=0){
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.query();//刷线当前
        this.$parent.$parent.query();//刷线父级
      })
    },
    deletePerson(id){
      if(!id&&this.checkList.length==0){
        return  this.$message.warning("请选择要删除的条目")
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePersonHandler(id)
      })
    },
    formatterPersonType(row){
      return getDictLabel('employType',row.persontype)
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-row{
    margin-bottom: 20px;
    text-align: right;
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