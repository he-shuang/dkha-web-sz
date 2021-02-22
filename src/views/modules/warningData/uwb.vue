<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-form :model="dataForm" :inline="true">
            <el-form-item label="报警时间">
                <el-date-picker
                    v-model="dateTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
           <!-- <el-form-item label="采集地址">
                <el-input v-model="dataForm.ubaAddress" clearable></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button @click="getDataList">查询</el-button>
                <el-button type="warning" @click="clickReset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="dataListLoading" :data="dataList" style="width: 100%">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="uwbname" label="名称" align="center"></el-table-column>
            <el-table-column prop="ubaAlarmtype" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.ubaAlarmtype == '0'">重控设施越界报警</span>
                    <span v-else-if="scope.row.ubaAlarmtype == '1'">访客越界报警</span>
                    <span v-else>保密区域入界报警</span>
                </template>
            </el-table-column>
            <el-table-column prop="ubaAddress" label="区域名称" align="center"></el-table-column>
            <el-table-column prop="ubaAlarmtime" label="报警时间" align="center"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

    </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data(){
            return{
                mixinViewModuleOptions: {
                    getDataListURL: 'system/scuwbalarm/page',
                    getDataListIsPage: true,
                },
                dateTime:null,
                dataForm:{
                    startDate:'',
                    endDate:'',
                    // ubaAddress:'',
                },
            }
        },
        watch:{
            dateTime(val) {
				if(val){
					this.dataForm.startDate = val[0];
					this.dataForm.endDate = val[1];
				}else{
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
				}     
			},
        },
        methods:{
            clickReset(){
                this.dateTime=null
                this.dataForm.startDate = "";
				this.dataForm.endDate = "";
                // this.dataForm.ubaAddress="";
                this.getDataList()
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>