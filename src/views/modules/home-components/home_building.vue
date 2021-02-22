<template>
	<div class="content">
		<div class="main">
			<el-row :gutter="20">
				<!-- 教学楼今日进入总人次、教学楼今日离开总人次、实时楼层人数 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<academic-people></academic-people>
					</div>
				</el-col>
				<!-- 预警动态图片 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8" style="display: flex;justify-content: center;align-items: center;">
					<div class="grid-content">
						<academic-warning></academic-warning>
					</div>
				</el-col>
				<!-- 教学楼今日访客人员 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<academic-visitor></academic-visitor>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<!-- 教学楼通行记录 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<AcademicTraffic></AcademicTraffic>
					</div>
				</el-col>
				<!-- 教学楼管道环境报警 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<AcademicThermaImaging></AcademicThermaImaging>
					</div>
				</el-col>
				<!-- 宿舍最近一周未归人员 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<academic-sensors></academic-sensors>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import AcademicPeople from '../home-cell-components/academic-people'
	import AcademicSensors from '../home-cell-components/academic-sensors'
	import AcademicVisitor from '../home-cell-components/academic-visitor.vue'
	import AcademicTraffic from '../home-cell-components/academic-traffic'
	import AcademicThermaImaging from '../home-cell-components/academic-therma-imaging'
	import AcademicWarning from '../home-cell-components/academic-warning'
	import {
		mapGetters
	} from "vuex";
	export default {
		components: {
			AcademicPeople,
			AcademicSensors,
			AcademicVisitor,
			AcademicTraffic,
			AcademicThermaImaging,
			AcademicWarning,
		},
		computed: {
			...mapGetters(['isFullScreen']),
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>
<style scoped lang="scss">
	.content {
		padding: 20px 20px 0 20px;

		&::before,
		&::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: -1;
			content: "";
		}

		&::before {
			background-image: url(~@/assets/home/bg.jpg);
			background-size: cover;
		}

		.el-row {

			&:last-child {
				margin-top: 16px;
				margin-bottom: 0;
			}
		}

		.col {
			height: calc(calc(100vh - 190px)/2);
			border-radius: 4px;
		}
		.cols {
			height: calc(calc(100vh - (14px))/2);
			border-radius: 4px;
		}

		.grid-content {
			border-radius: 4px;
		}

	}
</style>
