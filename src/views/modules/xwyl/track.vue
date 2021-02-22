<template>
    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="menuSelect">
            <el-menu-item  index="index">实时定位</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:track')" index="track">轨迹追踪</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:fence')" index="fence">电子围栏</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:rollcall')" index="rollcall">电子点名</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:camera')" index="camera">视频联动</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:alarm')" index="alarm">报警</el-menu-item>
            <el-menu-item v-if="$hasPermission('sys:position:deviceManage')" index="deviceManage">设备管理</el-menu-item>
        </el-menu>
        <iframe :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>
<script>
export default {
    data(){
        return{
            iframeSrc:"",
            startTime:'',
            endTime:'',
            activeIndex:'index'
        }
    },
    created() {
        this.iframeSrc=window.GLOBAL_CONFIG['BASE_URL_NGINX']+"/#/positionService/"+this.activeIndex
    },
    activated(){
        this.initDate();//获取最新 15分钟时间
        let params=this.$route.query;
        if(params.tid){
            let url=window.GLOBAL_CONFIG['BASE_URL_NGINX']+"/#/positionService/track";
            url+='?tid='+params.tid;
            let start=this.startTime;
            let end=this.endTime;
            if(params.start){
                start=params.start;
            }
            if(params.end){
                end=params.end;
            }
            url+='&start='+start;
            url+='&end='+end;
            if(params.vrid){
                url+='&vrid='+params.vrid;
            }
            this.iframeSrc=url
        }
        if(params.url){
            this.activeIndex=params.url;
            this.iframeSrc=window.GLOBAL_CONFIG['BASE_URL_NGINX']+"/#/positionService/"+params.url
        }
    },
    methods:{
        initDate(){
            let end=new Date().getTime();
            let start=end-1000*60*15;
            this.startTime=start;
            this.endTime=end;
        },
        menuSelect(val){
            let url=window.GLOBAL_CONFIG['BASE_URL_NGINX']+"/#/";
            if(val=='deviceManage'){
                 url+=val;
            }
            else{
                 url=url+"positionService/"+val;
            }
            this.activeIndex=val;
            this.iframeSrc=url;
        }
    }
}
</script>
<style lang="scss" scoped>
    div{
        width: 100%;
        height: calc(100vh - 146px);
        padding: 34px 0 0 0;
        box-sizing: border-box;
        position: relative;
    }
    .el-menu{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: rgb(195, 223, 253);
        border-bottom-color: transparent;
        .el-menu-item{
            height: 34px;
            line-height: 34px;
            color:#1881ff;
            &.is-active{
                border-bottom-color: #1881ff;
            }
        }
    }
</style>