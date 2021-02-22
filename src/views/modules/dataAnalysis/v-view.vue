<template>
	<el-dialog title="详情" :visible.sync="dialogVisible" :close-on-click-modal="false" width="25%">
		<div class="calendar">
			<div class="main">
				<div class="nav">
					<div class="name" v-if="row.scStuname">{{row.scStuname}}</div>
					<div class="name" v-else>{{scWaname}}</div>
					<div class="yearMonth">{{yearMonth}}</div>
					<div class="btn-div">
						<span class="el-icon-arrow-up" @click="monthHandle('pre')"></span>
						<span class="el-icon-arrow-down" @click="monthHandle('next')"></span>
					</div>
				</div>
				<div class="weeks">
					<div v-for="item in weekArr" class="week">
						{{item}}
					</div>
				</div>
				<div class="content">
					<div v-for="item in dateArr" class="content-item">
						<div class="content-item-div" v-if="loadData(item.date)" style="background-color: #C40;border-radius: 50%;">
							<div :style="{color:item.color}">{{item.day}}</div>
							<div style="color:darkred" v-if="url != '/system/dataAnalysis/onlyInNotOut'">{{loadData(item.date)}}</div>
						</div>
						<div class="content-item-div" v-else>
							<div :style="{color:item.color}">{{item.day}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				weekArr: ["一", "二", "三", "四", "五", "六", "日"], // 周列表
				dateArr: [], // 日期列表
				yearMonth: "", // XXXX年XX月
				dateOf1: "", // 1号的日期
				dateOf28: "", // 28号的日期,

				row: {}, // 父组件传递的表格数据 
				rows: {}, // 父组件传递的表格数据 
				obj: {}, // 父组件传递的表单数据
				url: "",
				name: "",
				scWaname:""
			}
		},
		computed: {
			loadData() {
				return function(date) {
					let num = ""
					if(this.rows.scAttendanceStatisticsDataInfoDTOList){
						this.rows.scAttendanceStatisticsDataInfoDTOList.forEach(item => {
							if (date === item.stDate) {
								num = item.stNum + "次"
							}
						})
					}else{
						this.row.dataAnalysisInfoDTOList.forEach(item => {
							if (date === item.createDate) {
								num = item.num + "次"
							}
						})
					}
					
					return num
				}
			},
		},
		methods: {
			init(row, obj, url) {
				this.scWaname=row.scWaname;
				this.rows=row;
				this.dialogVisible = true
				this.row = JSON.parse(JSON.stringify(row))
				this.obj = JSON.parse(JSON.stringify(obj))
				this.url = url
				this.renderCalender(new Date(this.obj.startDate))
			},

			renderCalender(date) {
				console.log(date);
				let year = date.getFullYear() // 年
				let month = date.getMonth() + 1 // 月
				this.yearMonth = `${year}年${month}月` // XXXX年XX月

				this.dateOf1 = new Date(`${year},${month},1`) // 1号的日期（年月日）
				this.dateOf28 = new Date(`${year},${month},28`) // 28号的日期（年月日）

				let monthArr = [31, this.isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 每月的天数
				let days = monthArr[month - 1] // 本月多少天
				let week = this.dateOf1.getDay() === 0 ? 7 : this.dateOf1.getDay() // 1号是周几

				let preDays = monthArr[new Date(new Date(this.dateOf1).getTime() - 2 * 24 * 60 * 60 * 1000).getMonth()] // 上个月多少天

				let preStamp = new Date(this.dateOf1).getTime() - 2 * 24 * 60 * 60 * 1000
				let preYearMonthDay = new Date(preStamp).getFullYear() + "-" + (new Date(preStamp).getMonth() + 1) // 上个月年月
				let curYearMonthDay = year + "-" + month // 当前年月
				let nextStamp = new Date(this.dateOf28).getTime() + 4 * 24 * 60 * 60 * 1000
				let nextYearMonthDay = new Date(nextStamp).getFullYear() + "-" + (new Date(nextStamp).getMonth() + 1) // 下个月年月
				this.dateArr = []
				for (let i = 1; i < 43; i++) {
					let obj = {
						day: "",
						date: "",
						color: "#000",
					}
					if (i < week) {
						obj.day = preDays - week + i + 1
						obj.date = preYearMonthDay + "-" + obj.day
						obj.color = "gray"
						this.dateArr.push(obj)
					} else if (i > week + days - 1) {
						obj.day = i - week - days + 1
						obj.date = nextYearMonthDay + "-" + obj.day
						obj.color = "gray"
						this.dateArr.push(obj)
					} else {
						obj.day = i - week + 1
						obj.date = curYearMonthDay + "-" + obj.day
						this.dateArr.push(obj)
					}
				}
				this.getData()
			},

			getData() {
				this.obj.startDate = this.dateArr[0].date
				this.obj.endDate = this.dateArr[this.dateArr.length - 1].date

				this.$http.get(this.url, {
					params: this.obj
				}).then(({
					data: res
				}) => {
					res.data.forEach(item => {
						
						if(item.scStuname){
							if (item.scStuname === this.row.scStuname) {
								this.row = item
							}
						}
						else if(item.scWaname){
							if((item.aeDevicename === this.rows.aeDevicename)&&(item.scWaname === this.rows.scWaname)){
								this.rows = item
							}
						}
					})
				}).catch(() => {}).finally(() => {
					this.loading = false
				})
			},

			//上个月、下个月
			monthHandle(monthStatus) {
				let date = monthStatus === 'pre' ? new Date(this.dateOf1).getTime() - 2 * 24 * 60 * 60 * 1000 : new Date(this.dateOf28)
					.getTime() + 4 * 24 * 60 * 60 * 1000
				this.renderCalender(new Date(date))
			},
			/**
			 * 是否为闰年
			 * @param {Number} year
			 */
			isLeapYear(year) {
				if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
					return 29
				} else {
					return 28
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	/deep/.el-dialog__body {
		padding: 0 0 30px 0;
	}

	.calendar {
		display: flex;
		justify-content: center;

		.main {
			background-color: #FFF;
			border-radius: 4px;

			.nav {
				font-size: 24px;
				color: #FFF;
				height: 40px;
				display: flex;
				justify-content: space-between;
				background-color: #c40;
				padding: 0 20px;
				box-sizing: border-box;

				.name {
					display: flex;
					align-items: center;
					width: 30%;
				}

				.yearMonth {
					display: flex;
					align-items: center;
					width: 50%;
				}

				.btn-div {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 18px;
					width: 20%;
					cursor: pointer;
				}
			}

			.weeks {
				font-size: 22px;
				height: 40px;
				display: flex;

				.week {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-basis: 60px;
					color: #000;
				}
			}

			.content {
				font-size: 18px;
				width: 420px;
				height: 360px;
				display: flex;
				flex-wrap: wrap;

				.content-item {
					height: 60px;
					width: 60px;
					display: flex;
					align-items: center;
					justify-content: center;

					.content-item-div {
						height: 50px;
						width: 50px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
</style>
