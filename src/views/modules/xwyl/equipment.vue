<template>
    <div>
        <iframe :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>
<script>
export default {
    data(){
        return{
            iframeSrc:"",
        }
    },
    activated(){
        this.iframeSrc=window.GLOBAL_CONFIG['BASE_URL_NGINX']+'/#/deviceManage'
    },
    deactivated(){
        // 销毁实例  避免3d地图加载过多 内存爆炸
        this.$destroy()
    },
}
</script>
<style lang="scss" scoped>
    div{
        width: 100%;
        height: calc(100vh - 140px);
    }
</style>