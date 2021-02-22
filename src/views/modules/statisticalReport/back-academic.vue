<template>
	<el-card shadow="never" class="aui-card--fill academic">
		<el-row :gutter="10">
			<el-col :span="6">
				<div class="grid-content bg-purple">
					<bar :params="params" ref="weekPepleRef"></bar>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple">

				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
	</el-card>
</template>

<script>
	import bar from '../../../components/public/echarts/bar'
	export default {
		components: {
			bar,
		},
		data() {
			return {
				params: {},
			}
		},
		created() {
			this.getWeekData()
			this.getMonthData()
			this.getWeekDataTime()
			this.getMonthDataTime()
		},
		mounted() {

		},
		methods: {
			/**
			 * 周 人
			 * 
			 */
			getWeekData() {
				this.$http.get("/system/reportForm/visitorFloorWeek").then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res, msg)
					}

					this.commonFun(res, "每层楼访客人数（周）", "周", "人", "weekPepleRef", "weeks")

				})
			},
			commonFun(res, title, xTitle, yTitle, ref, xType) {
				let type = []
				let seriesData = []
				let xAxisData = []
				res.data.forEach(item => {
					type.push(item.name)
					xAxisData.push(item[xType])
				})
				type = [...new Set(type)];
				xAxisData = [...new Set(xAxisData)];


				type.forEach((item1, index1) => {
					seriesData.push({
						data: [],
						name: item1
					})
					xAxisData.forEach((item2, index2) => {
						let status = true
						res.data.forEach((item3, index3) => {
							if (item1 === item3.name && item2 === item3.weeks) {
								seriesData[index1].data[index2] = item3.count
								status = false
							}
						})
						if (status) {
							seriesData[index1].data[index2] = 0
						}
					})
				})










				// xAxisData.forEach((item1, index1) => {
				// 	type.forEach((item2, index2) => {
				// 		seriesData.push({
				// 			data: [],
				// 			name: item2
				// 		})

				// 		res.data.forEach((item3, index3) => {
				// 			if (item2 === item3.name && item1 === item.weeks) {
				// 				seriesData[index1].data.push(item3.count)
				// 			}
				// 		})

				// 	})
				// })














				this.params.seriesData = seriesData
				this.params.xAxisData = xAxisData
				this.params.title = title
				this.params.xTitle = xTitle
				this.params.yTitle = yTitle

				this.$nextTick(() => {
					this.$refs[ref].init()
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.academic {
		.el-row {
			margin-bottom: 20px;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.grid-content {
			border-radius: 4px;
			background: #99a9bf;
			min-height: calc(calc(100vh - 210px)/2);
		}

	}
</style>
