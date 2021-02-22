<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-row>
			<el-col :span="12">
				<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" ref="ruleForm">
					<el-form-item label="学号" prop="studentNum">
						<el-input v-model="dataForm.studentNum" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
					</el-form-item>
						<el-form-item label="状态" prop="status">
							<el-select v-model="dataForm.status" placeholder="请选择" clearable>
								<el-option label="已归" :value="0"></el-option>
								<el-option label="外出" :value="1"></el-option>
							</el-select>
						<!-- <el-input v-model="dataForm.status" placeholder="请输入" clearable></el-input> -->
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList()">{{ $t('query') }}</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="12">
				<v-chart  :options="barOptions"/>
			</el-col>
		</el-row>
	
		<el-table v-loading="dataListLoading" :data="dataList">
			<!-- <el-table-column :label="'外出'+outTotal+'人'" align="center"></el-table-column> -->
				<el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
				<el-table-column prop="imgUrl" label="照片" header-align="center" align="center">
					<template slot-scope="scope">
						<el-image style="width: 100px; height: 70px" :src="$ImgServerUrl+scope.row.imgUrl" fit="contain" :preview-src-list="previewList">
							<div slot="error" class="image-slot">
								<img class="student-img" src="../../../assets/img/person.jpg">
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
				<el-table-column prop="studentNum" label="学号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="dormitoryNum" label="宿舍号" header-align="center" align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" header-align="center" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 0" style="color:rgb(22, 178, 112);"> 已归</span>
						<span v-else style="color: red;"> 外出</span>
					</template>
				</el-table-column>
				<el-table-column prop="outTime" label="外出时间" header-align="center" align="center"></el-table-column>
				<el-table-column prop="backTime" label="归来时间" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[5,10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
		</el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import ECharts from 'vue-echarts'
	import 'echarts/lib/chart/bar'
	export default {
		name: "people",
		mixins: [mixinViewModule],
		components:{
			'v-chart':ECharts
		},
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/accessrecords/page',
					getDataListIsPage: true,
				},
				dataForm: {
					studentNum: "",
					name: "",
					status:""
				},
				limit:5,
				outTotal: 0,
				barOptions:{
					color:['#FACD91','#95F204'],
					grid: {
						top: 0,
						left: '3%',
						right: '4%',
						bottom: 20,
						containLabel: true
					},
					xAxis:{
						type:"value",
						boundaryGap:[0,0.01],
						axisLabel:{
							show:false,
						},
						axisLine:{
							show:false
						},
						splitLine:{
							show:false
						}
					},
					yAxis:{
						type:"category",
						data:['已归','外出'],
						axisLabel:{
							color:"#fff"
						},
						axisLine:{
							show:false
						}
					},
					series:[
						{
							name:"统计",
							type:"bar",
							barWidth:30,
							label:{
								show:true,
								formatter:'{c}'
							},
							data:[
								{
									name:"已归",
									value:0,
									itemStyle:{
										color:"#67C23A"
									}
								},
								{
									name:"外出",
									value:0,
									itemStyle:{
										color:"#F56C6C"
									}
								}
							]
						}
					]
				}
			}
		},
		computed:{
			previewList(){
				return  this.dataList.map(item=>{
					return  this.$ImgServerUrl+item.imgUrl
				})
			},
		},
		created() {
			this.$http.get("/system/scdormitoryperson/getOutNum").then(({
				data: res
			}) => {
				if (res.code !== 0) {
					return this.$message.error(res.msg)
				}
				this.barOptions.series[0].data[0].value=res.data.backNum
				this.barOptions.series[0].data[1].value=res.data.outNum
			})
		},
		methods: {
		
		}
	}
</script>
<style scoped lang="scss">
.el-table {
  .student-img {
    vertical-align: top;
    width: 53px;
    height: 70px;
  }
}
.echarts {
  width: 100%;
  height: 120px;
}
</style>
