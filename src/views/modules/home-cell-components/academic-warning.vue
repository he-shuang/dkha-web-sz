<template>
	<div class="academic-warning">
		<div v-if="status">
			<img src="../../../assets/img/shouye/static.png" alt="暂无报警信息">
		</div>
		<div v-else>
			<img src="../../../assets/img/shouye/war.gif" alt="存在报警信息">
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters(['environmentList']),
		},
		data() {
			return {
				status: true,
			}
		},
		watch: {
			// 监听环境传感器报警数据改变
			environmentList: {
				deep: true,
				handler(newData) {
					if (newData.length > 0) {
						// 是否有报警设备  优先显示
						let warn = newData.filter(item => item.isSendAlarm == 'true');
						if (warn.length > 0) {
							this.status = false
						} else {
							this.status = true
						}
					}
				}
			}
		},
		methods: {

		}
	}
</script>
<style scoped lang="scss">
</style>
