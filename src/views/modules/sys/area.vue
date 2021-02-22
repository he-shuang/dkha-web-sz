<template>
  <el-card shadow="never" class="aui-card--fill building-list">
    <el-form ref="ruleForm" :model="dataForm" label-width="80px" inline>
        <el-form-item label="区域名称" prop="rcName">
          <el-input v-model="dataForm.rcName"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button @click="search">查询</el-button>
           <el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
           <el-button type="primary" @click="addHandle()">新增</el-button>
        </el-form-item>
    </el-form>
    
    <el-table :data="dataList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="rcName" label="区域名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="rcNo" label="区域编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rcAddress" label="区域位置" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rcFloorName" label="楼栋/楼层" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="rcFenceName" label="区域围栏名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rcFenceId" label="区域围栏编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rcType" label="类别" show-overflow-tooltip :formatter="formatterType"></el-table-column>
        <el-table-column  label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <div>
                    <el-button type="text" @click="editHandle(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteHandle(scope.row.rcId)">删除</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    <!-- 新增  编辑 -->
    <add-or-update ref="addOrUpdate"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { treeDataTranslate ,getDictLabel} from '@/utils'
import addOrUpdate from './area-add-or-update'
export default {
  mixins: [mixinViewModule],
  components:{ addOrUpdate },
  data(){
    return{
      dataForm:{
          rcName:'',
      },
       mixinViewModuleOptions: {
        getDataListURL: '/system/scregionconfig/page',
        deleteURL: '/system/scregionconfig',
        getDataListIsPage:true
      },
    }
  },
  methods:{
    search(){
      this.page=1;
      this.query();
    },
    // 编辑
    editHandle(row){
       this.$refs['addOrUpdate'].init(row.rcId)
    },
    addHandle(){
      this.$refs['addOrUpdate'].init()
    },
    formatterType(row){
        return getDictLabel('areaType',row.rcType)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
