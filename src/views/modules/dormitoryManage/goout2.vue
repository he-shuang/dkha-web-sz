<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="left">
                    <dormitory-tree ref="dormitoryTree" type='goout' @treeFun="treeFun"></dormitory-tree>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="right">
                    <div class="top">
                        <el-row :gutter="20" class="statistics">
                            <el-col :span="6">
                                <el-card shadow="always" class="aui-card--fill">
                                    <div>
                                        <p>信息统计时间</p>
                                        <p>{{currentTime}}</p>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card shadow="always" >
                                    <div>
                                        <p>入住总人数</p>
                                        <p>{{totalNum}}</p>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card shadow="always" >
                                    <div>
                                        <p>宿舍内人数</p>
                                        <p>{{backNum}}</p>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card shadow="always" >
                                    <div>
                                        <p>宿舍外人数</p>
                                        <p>{{outNum}}</p>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="roomContent">
                        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                            <el-form-item label="姓名：">
                                <el-input v-model="formSearch.scStuname" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="学号：">
                                <el-input v-model="formSearch.scNo" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="onSubmit">查询</el-button>
                                <el-button type="warning" @click="clickReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <div v-if="picArr.length=='0'" class="zanwu"><h1>暂无数据</h1></div>
                        <div v-else class="roomBox">       
                            <div class="room" v-for="(item,key) in picArr" :key="key">                               
                                <el-tooltip v-if="item.dormitorypersonDTOS.length!='0'" class="item" placement="right" effect="light">
                                    <div slot="content">
                                        <div class="picCon" v-for='(i,ids) in item.dormitorypersonDTOS' :key="ids">
                                            <el-image style="width:80px;height:80px;margin:10px 20px 10px 0px;" :src="$ImgServerUrl+i.scPhotoimg" fit='fill'>
                                                <div slot="error" class="image-slot">
                                                    <img class="student-img" src="../../../assets/img/person.jpg">
                                                </div>
                                            </el-image>
                                            <p class="name">{{i.scStuname}}</p>
                                            <p class="wgq" v-if="i.isOut == '1'">未归寝</p>
                                            <p class="ygq" v-else-if="i.isOut == '0'">已归寝</p>
                                        </div>                                      
                                    </div>                                   
                                    <div class="content">
                                        <div class="title">{{item.drNum}}</div>
                                        <div>宿舍内：{{item.backNum}}</div>
                                        <div style="cursor: pointer;">宿舍外：{{item.outNum}}</div>
                                    </div>
                                </el-tooltip>
                                <div v-else-if="item.dormitorypersonDTOS.length =='0'">
                                    <div class="content">
                                        <div class="title">{{item.drNum}}</div>
                                        <div>宿舍内：{{item.backNum}}</div>
                                        <div style="cursor: pointer;">宿舍外：{{item.outNum}}</div>
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

    </el-card>
</template>

<script>
import dormitoryTree from '../../../components/public/dormitory-tree'
    export default {
        components:{dormitoryTree},
        data(){
            return{
                type:'',
                //树形 传参
                treeValue:{
                    df_floorid:'',
                    df_type:'',
                },
                //搜索
                formSearch: {
                    scStuname: '',
                    scNo: ''
                },
                picArr:[],
                backNum:0,
                outNum:0,
                totalNum:0,
                currentTime:"",
            }
        },
        watch: {
            '$store.state.user.valGoout': {
                handler(val){
                    if(val){
                        this.dataFun(val);
                    }
                },
                deep:true,
                //immediate:true
            },
        },
        activated(){
            this.initTime()
        },
        mounted(){
        },
        methods:{
            //当前年月日
            initTime(){
                this.currentTime=new Date().toLocaleString('zh',{hour12:false})
            },
            //左边 树形控件 回调函数
            treeFun(val){
                this.treeValue=val;
                this.dataFun(this.treeValue)
            },
            //分页 数据
            dataFun(val){
                let params={
                    floorId:val.df_floorid,
                    type:val.df_type,
                    scNo:this.formSearch.scNo,
                    scStuname:this.formSearch.scStuname,
                }
                this.$http.get('/system/scdormitoryperson/getRoomCheckInInfo',{params})
                .then(({data:res})=>{
                    if(res.code !=0){
                        return this.$message.error(res.msg)
                    }
                    let {backNum,outNum}=res.data
                    this.totalNum=Number(backNum)+Number(outNum);
                    this.backNum=backNum;
                    this.outNum=outNum;
                    this.picArr=res.data.data.map(item=>{
                        return{
                            ...item,
                            backNum:0,
                            outNum:0,
                        }
                    })
                    this.picArr.map(item=>{
                        item.backNum=0
                        item.outNum=0
                        if(item.dormitorypersonDTOS.length>0){
                            item.dormitorypersonDTOS.map(v=>{                           
                                v.isOut == 1 ?item.outNum++:item.backNum++                         
                            }) 
                        }
                    })                   
                })
            },
            //查询
            onSubmit(){
                if(!this.$store.state.user.valGoout){
                    return this.$message.info('请选择宿舍在查询')
                }
                if(!this.treeValue){
                    this.dataFun(this.treeValue)
                }else{
                    this.dataFun(this.$store.state.user.valGoout)
                }               
            },
            //重置
            clickReset(){
                this.formSearch.scStuname=''
                this.formSearch.scNo=''
                this.onSubmit()
            },
        },
    }
</script>

<style lang="scss" scoped>
@mixin box-style{
    color: #fff;
    border-radius: 6px;   
    position: relative;
    background: rgba(20, 30, 40, 0.8);
    box-shadow: 0px 0px 55px rgba($color: #00BFFF, $alpha: 0.5) inset;
    border: 2px solid rgba($color: #00BFFF, $alpha: 0.5);     
}
.left{
    /deep/ .el-tree{
        height: 710px;
        padding-right: 10px;
        overflow-y: auto;
    }
}

.right{
    height: calc(100vh - 30px - 50px - 150px);
    .top{
        margin-bottom: 20px;
        .el-card {
            background: transparent;
            border-color: transparent;
            background-color: transparent;
            @include box-style; 
            div{
                font-size: 20px;
                text-align: center;
            }
        }
    }
    .roomContent{
        .roomBox{
            display: flex;
            flex-wrap: wrap;
            height: 510px;
            overflow-y: auto;
            .room{
                width: 120px;
                height: 120px;
                padding: 20px;
                margin: 0px 52px 35px 0px;
                cursor: pointer;
               @include box-style;
                // &:nth-child(7n){
                //     margin-right: 0px;
                // }
               .content{
                    cursor: pointer;         
                    .title{
                        margin-top: 0px;
                        color:#00BFFF;
                    } 
                    div{
                        margin-bottom: 10px;
                    }
               }                 
            }          
        }
        .zanwu{
            color: #fff;
            text-align: center;
        }
        
    }
    /* 滚动条 */
    .roomBox::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
        border-radius: 15px;
        background-color: rgba(255,255,255,0.8);
    }
    .roomBox::-webkit-scrollbar{
        width: 5px;
        background-color: rgba(179, 174, 174, 0);
    }
    .roomBox::-webkit-scrollbar-thumb{
        border-radius: 15px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.3);
        background-color: #555;
    }
}
.el-tooltip__popper {
    .picCon{
        display: flex;
        .name{
            display: inline-block;
            font-size: 16px;
            line-height: 70px;
        }
        .wgq{
            color:red;
            font-size:16px;
            margin:40px 20px 0px 20px;
        }
        .ygq{
            color:green;
            font-size:16px;
            margin:40px 20px 0px 20px;
        }
    }
}
</style>