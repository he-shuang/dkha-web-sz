<template>
	<div class="content">
		<div class="main">
			<el-row :gutter="20">
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<admin-people></admin-people>
					</div>
				</el-col>
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<!-- <academic-sensors></academic-sensors> -->
						<admin-floor></admin-floor>
					</div>
				</el-col>
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<academic-visitor></academic-visitor>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<!-- <dormitory-room style="width: 100%;"></dormitory-room> -->
						<admin-temperature></admin-temperature>
					</div>
				</el-col>
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<!-- <dormitory-electricity></dormitory-electricity> -->
						<academic-sensors></academic-sensors>
					</div>
				</el-col>
				<el-col :class="[isFullScreen?'cols':'','col']" :span="8">
					<div class="grid-content">
						<AcademicTraffic></AcademicTraffic>
						<!-- <dormitory-not-returned></dormitory-not-returned> -->
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import AdminPeople from '../home-cell-components/admin-people'
	import AdminFloor from '../home-cell-components/admin-floor'
	import AdminTemperature from '../home-cell-components/admin-temperature'
	import AdminPassage from '../home-cell-components/admin-passage'
	import AcademicSensors from '../home-cell-components/academic-sensors'
	import AcademicVisitor from '../home-cell-components/academic-visitor.vue'
	import AcademicTraffic from '../home-cell-components/academic-traffic'

	import DormitoryRoom from '../home-cell-components/dormitory-room'
	import DormitoryElectricity from '../home-cell-components/dormitory-electricity'
	import DormitoryNotReturned from '../home-cell-components/dormitory-not-returned.vue'
	import {
		mapGetters
	} from "vuex";
	export default {
		components: {
/*			AdminPeople,
			AdminTemperature,
			AdminPassage,
			AdminFloor,
			AcademicSensors,
			AcademicVisitor,
			AcademicTraffic,		
			DormitoryRoom,
			DormitoryElectricity,
			DormitoryNotReturned,*/
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
