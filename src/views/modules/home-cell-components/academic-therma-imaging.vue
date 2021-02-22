<template>
	<div class="academic-therma-imaging">
		<div class="title" @click="$router.push({path:'warningData-therma-imaging'})">
			科研楼管道预警
			<div class="angle-border left-top-border"></div>
			<div class="angle-border right-top-border"></div>
			<div class="angle-border left-bottom-border"></div>
			<div class="angle-border right-bottom-border"></div>
		</div>
		<div class="tables">
			<el-table :data="thermaArr" style="width: 95%" :height="isFullScreen?'440':'300'">
				<el-table-column prop="drNum" label="报警位置" align="center"></el-table-column>
				<el-table-column label="温度(℃)" align="center">
					<template slot-scope="scope">
						<span style="color:red">{{scope.row.tfaEcurrent}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="tfaAlarmtime" label="预警时间" align="center">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	import electricWebsocket from '@/websocket/system'
	import {
		mapGetters
	} from "vuex";
	export default {
		mixins: [electricWebsocket],
		computed: {
			...mapGetters(['isFullScreen']),
		},
		data() {
			return {

			}
		},
		activated() {
			if (localStorage.getItem("thermaData")) {
				this.thermaArr = JSON.parse(localStorage.getItem("thermaData"))
				console.log(this.thermaArr);
			}
		},
		methods: {}
	}
</script>

<style scoped lang="scss">
	.academic-therma-imaging {
		color: #FFF;

		.title {
			cursor: pointer;
			font-size: 18px;
			line-height: 36px;
			background-color: #133C6F;
			width: 156px;
			text-align: center;
			position: relative;
			color: #fff;
			margin-bottom: 20px;

			.angle-border {
				position: absolute;
				width: 12px;
				height: 12px;
			}

			.left-top-border {
				top: -6px;
				left: -6px;
				border-left: 1px solid #01FFFF;
				border-top: 1px solid #01FFFF;
			}

			.right-top-border {
				top: -6px;
				right: -6px;
				border-right: 1px solid #01FFFF;
				border-top: 1px solid #01FFFF;
			}

			.left-bottom-border {
				bottom: -6px;
				left: -6px;
				border-left: 1px solid #01FFFF;
				border-bottom: 1px solid #01FFFF;
			}

			.right-bottom-border {
				bottom: -6px;
				right: -6px;
				border-right: 1px solid #01FFFF;
				border-bottom: 1px solid #01FFFF;
			}
		}

		/deep/ .el-table {
			background: transparent;
		}


		/deep/ .el-table__body-wrapper::-webkit-scrollbar {
			width: 6px; // 横向滚动条
			height: 6px; // 纵向滚动条 必写
		}

		// 滚动条的滑块
		/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
			background-color: #555;
			border-radius: 3px;
		}
	}
</style>
