<template>
	<div class="content">
		<div class="main">
			<el-row :gutter="20">
				<!-- 宿舍总入住人数、宿舍分配状况 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="9">
					<div class="grid-content">
						<dormitory-room style="width: 100%;"></dormitory-room>
					</div>
				</el-col>
				<!-- 宿舍楼照片信息 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="9">
					<div class="grid-content">
						<div :style="isFullScreen?'height:500px':'height:364px'" @click="$router.push({ path: '/dormitoryManage-room' })">
							<img style="width: 500px;height:100%" src="../../../assets/img/shouye/layer.png" alt="">
						</div>
					</div>
				</el-col>
				<!-- 宿舍最近一周未归人员 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="6">
					<div class="grid-content">
						<dormitory-not-returned></dormitory-not-returned>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<!-- 宿舍通行记录 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="9">
					<div class="grid-content">
						<dormitory-traffic></dormitory-traffic>
					</div>
				</el-col>
				<!-- 宿舍用电报警 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="9">
					<div class="grid-content">
						<dormitory-electricity-warning></dormitory-electricity-warning>
					</div>
				</el-col>
				<!-- 宿舍今日用电量TOP10 -->
				<el-col :class="[isFullScreen?'cols':'','col']" :span="6">
					<div class="grid-content">
						<dormitory-electricity></dormitory-electricity>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import DormitoryRoom from '../home-cell-components/dormitory-room'
	import DormitoryNotReturned from '../home-cell-components/dormitory-not-returned.vue'
	import DormitoryTraffic from '../home-cell-components/dormitory-traffic'
	import DormitoryElectricityWarning from '../home-cell-components/dormitory-electricity-warning'
	import DormitoryElectricity from '../home-cell-components/dormitory-electricity'
	import {
		mapGetters
	} from "vuex";
	export default {
		components: {
			DormitoryRoom,
			DormitoryNotReturned,
			DormitoryTraffic,
			DormitoryElectricityWarning,
			DormitoryElectricity,
		},
		computed: {
			...mapGetters(['isFullScreen']),
		},
		data() {
			return {}
		},
		mounted() {
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
