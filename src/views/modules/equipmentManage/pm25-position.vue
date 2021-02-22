<template>
    <div>
        <el-row>
            <el-col :span="2">左：</el-col>
            <el-col :span="8">
               <p @click="visible=true">{{value[0]}}</p>
            </el-col>
            <el-col :span="2">上：</el-col>
            <el-col :span="8">
              <p @click="visible=true">{{value[1]}}</p>
            </el-col>
            <el-col :span="4">
                <i @click="visible=true" class="el-icon-location"></i>
            </el-col>
        </el-row>
        <el-dialog
            title="选择地图位置"
            :visible.sync="visible"
            width="700px"
            append-to-body
            @open="openHandler"
            >
            <div class="position-box">
               	<el-image  @click="choosePosition($event)" :src="require('../../../assets/img/map/floor-'+pictureid+'.png')"></el-image>
            <el-image class="position-icon" :style="{left:position[0],top:position[1]}" :src="require('@/assets/home/normal.png')"></el-image>
            </div>
            <div slot="footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="submitPosition">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{
        value:{
            type:Array,
            default:()=>[0,0]
        },
        pictureid:{
            type:String,
            default:"1f"
        }
    },
    data(){
        return {
            visible:false,
            naturalWidth:633,
            naturalHeight:338,
            position:[0,0]
        }
    },
    methods:{
        choosePosition(ev){
            let left=Math.round(ev.offsetX/this.naturalWidth*10000);
            let top=Math.round(ev.offsetY/this.naturalHeight*10000);
            this.position=[left/100+'%',top/100+'%'];
        },
        openHandler(){
            this.position=[...this.value];
        },
        submitPosition(){
            this.$emit("input",this.position);
            this.visible=false;
        },
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../assets/scss/variables';
    .el-row{
        .el-col-2{
            text-align: right;
        }
        .el-col-4{
            .el-icon-location{
                font-size: 26px;
                line-height: 1;
                vertical-align: top;
                margin-top: 6px;
                color: $select-background;
                cursor: pointer;
            }
        }
    }
    .el-image{
       text-align: center;
    }
    .position-box{
        position: relative;
        display: inline-block;
        .position-icon{
            width: 24px;
            height: 24px;
            position: absolute;
            transform: translate(-50%,-50%);
        }
    }
    p{
        color: #fff;
        cursor: pointer;
        line-height: 38px;
        margin: 0 10px 0 0;
        padding: 0 15px;
        height: 40px;
        box-sizing: border-box;
        border-radius: 4px;
        border: solid 1px  $color-light-blue;
        // border-color: $color-light-blue !important;
        background:rgba($color: $color-light-blue, $alpha: 0.2) !important;
    }
</style>