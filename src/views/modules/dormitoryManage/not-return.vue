<template>
	<el-card shadow="always" class="aui-card--fill">
		<el-form inline :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="点名时间" prop="date">
				<el-date-picker v-model="dataForm.date" default-time="22:00:00" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList">
			<el-table-column align="center" type="index" label="序号"> </el-table-column>
			<el-table-column align="center" label="照片">
				<template slot-scope="scope">
					<el-image class="student-img" :src="$ImgServerUrl+scope.row.scPhotoimg" :preview-src-list="previewList">
						<div slot="error" class="image-slot">
							<img class="student-img" src="../../../assets/img/person.jpg">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="scStuname" label="姓名">

			</el-table-column>
			<el-table-column align="center" prop="scNo" label="学号">

			</el-table-column>
			<el-table-column align="center" prop="scUwbid" label="uwb编号">

			</el-table-column>
			<el-table-column align="center" prop="scPhonenum" label="联系电话">

			</el-table-column>
			<el-table-column align="center" prop="scEducation" label="学历" :formatter="formatterEducation">

			</el-table-column>
			<el-table-column align="center" prop="createDate" label="点名时间">
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[6,10,20,50,100]" :page-size="limit" :total="total" layout="total,sizes,prev,pager,next,jumper"
		 @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"></el-pagination>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import {
		getDictLabel
	} from '@/utils'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				mixinViewModuleOptions: {
					getDataListURL: '/system/scstudentsouteverydaydetails/page',
					getDataListIsPage: true,
				},
				dataForm: {
					date: "",
				},
				limit: 6,
			}
		},
		activated() {
			// 判断从闸机设备过来  查询对应出入数据
			let date = window.sessionStorage.getItem('date');
			if (date) {
				window.sessionStorage.removeItem('date');
				this.dataForm.date = date;
				this.getDataList();
			}
		},
		computed: {
			previewList() {
				return this.dataList.map(item => {
					return this.$ImgServerUrl + item.scPhotoimg
				})
			},
		},
		methods: {
			formatterEducation(row) {
				return getDictLabel('education', row.scEducation)
			},
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
	}
</style>
