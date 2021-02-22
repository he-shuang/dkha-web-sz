<template>
	<div class="home" ref="home">
		<img class="full" src="../../assets/img/shouye/full.png" alt="" :title="isFullScreen?'退出':'全屏'" @click="fullScreen">
		<admin v-if="$hasPermission('sys:home:root')"></admin>
		<home-dormitory v-else-if="$hasPermission('sys:home:dormitory')"></home-dormitory>
        <home-building v-else-if="$hasPermission('sys:home:building')"></home-building>
	</div>
</template>

<script>
	import admin from './home-components/admin.vue'
	import homeDormitory from './home-components/home_dormitory'
	import homeBuilding from './home-components/home_building'
	import { mapGetters } from 'vuex'
    import screenfull from "screenfull";
	export default {
		components: {
			/*admin,homeDormitory ,homeBuilding*/
		},
		computed:{
            ...mapGetters(['isFullScreen'])
        },
		data() {
			return {}
		},
		activated(){
            if(this.isFullScreen){
                screenfull.toggle(this.$refs["home"])
            }
        },
		mounted(){
			screenfull.on('change',()=>{
				this.$store.commit("SET_FULL_SCREEN",!!screenfull.element)
			}) 
		},
		methods:{
			//返回首页
            fullScreen(){
              //// 如果不允许进入全屏，发出不允许提示
              if (!screenfull.enabled) {
                return this.$message({
                  message: this.$t("fullscreen.prompt"),
                  type: "warning",
                  duration: 500
                });
              }
              this.$store.commit( "SET_FULL_SCREEN", !this.$store.state.user.isFullScreen );
              screenfull.toggle(this.$refs["home"]);
            }
		}
	}
</script>
<style scoped lang="scss">
.home{
	position: relative;
	.full{
		position:absolute;
		top: 4px;
		right: 6px;
		cursor: pointer;
	}
}
</style>
