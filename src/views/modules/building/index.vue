<template>
  <el-card shadow="never" class="aui-card--fill building-list">
    <!-- <el-form ref="form" :model="formData" label-width="80px" inline>
        <el-form-item label="名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary">查询</el-button>
           <el-button >重置</el-button>
        </el-form-item>
    </el-form>-->
    <el-row>
      <el-col>
        <el-button v-if="$hasPermission('system:scdormitoryfloor:save')" type="primary" @click="addHandle">新增</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="dataList"
      :load="load"
      lazy
      row-key="dfFloorid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="dfFloorname" label="名称"></el-table-column>
      <el-table-column prop="dfType" label="类型" :formatter="formatterType"></el-table-column>
      <el-table-column prop="dfPurpose" label="用途" :formatter="formatterPurpose"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <div>
            <el-button v-if="$hasPermission('system:scdormitoryfloor:update')" type="text" @click="editHandle(scope.row)">修改</el-button>
            <el-button v-if="$hasPermission('system:scdormitoryfloor:delete')" type="text" @click="deleteHandle(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增  编辑 -->
    <add-or-update ref="addOrUpdate"></add-or-update>
  </el-card>
</template>

<script>
import addOrUpdate from './add-or-update'
import { treeDataTranslate ,getDictLabel} from '@/utils'
export default {
  components:{
    addOrUpdate
  },
  inject: ['refresh'],
  data(){
    return{
      formData:{
          name:'',
          total:0,
          pageNo:1,
          pageSize:10
      },
      dataList:[],
      expandList:[],
      allData:[]
    }
  },
  created(){
    this.initTree()
  },
  methods:{
    initTree(){
      //type  0:楼栋  1：房间
      this.$http({
        url:`/system/scdormitoryfloor/page`,
        methods:"get",
        params:{
          pid:'0',
          type:0 
        },
      }).then(({data})=>{
        if(data.code==0){
            this.dataList = data.data
        }
        else{
           this.dataList=[]
           this.$message.error(data.msg)
        }
      })
    },
    // 编辑
    editHandle(row){
       this.$refs['addOrUpdate'].init(row.dfFloorid,row.dfType)
    },
    // 删除
    deleteHandle(row){
     this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
      }).then(()=>{
         this.$http({
           url:`/system/scdormitoryfloor/${row.dfFloorid}/${row.dfType}`,
           method:'delete',
         }).then(({data})=>{
           if(data.code==0){
              // this.initTree()
							this.refresh();
             this.$message.success(data.msg)
           }
           else{
             this.$message.error(data.msg)
           }
         })
      })
    },
    addHandle(){
      this.$refs['addOrUpdate'].init()
    },
    load (tree, treeNode, resolve) {
      this.$http({
        url:"/system/scdormitoryfloor/page",
        method:'get',
        params:{
          pid:tree.dfFloorid,
          type:tree.dfType
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => {})
    },
    formatterType(row){
      return getDictLabel('buildingType',row.dfType)
    },
     formatterPurpose(row){
      return getDictLabel('purpose',row.dfPurpose)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
