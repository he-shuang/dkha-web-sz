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
                    <!-- <div class="top">
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
                    </div> -->
                    <div class="roomContent">
                        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                            <el-form-item label="姓名：">
                                <el-input v-model="formSearch.scStuname" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="学号：">
                                <el-input v-model="formSearch.scNo" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="状态：">
                                <el-select v-model="formSearch.scType" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="onSubmit">查询</el-button>
                                <el-button type="warning" @click="clickReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <div v-if="picArr.length=='0'" class="zanwu"><h1>暂无数据</h1></div>
                        <div v-else class="roomBox">     
                            <div class="floorBox" v-for="(item,key) in testList" :key="key">
                                <div class="floorIndex">
                                    {{item.type}}<br>楼
                                </div>
                                <div class="floorRoom">
                                    <div class="rooms" v-for="(i,id) in item.roomList" :key="id">
                                        <div>{{i.drNum}}</div>
                                        <div>应到：{{i.total}}</div>
                                        <div>实到：{{i.num}}</div>
                                    </div>
                                    
                                </div>
                                
                            </div>  
                            <!-- <div class="room" v-for="(item,key) in picArr" :key="key">                               
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
                            </div>   -->  
                        </div>
                        <div class="total">
                            <div class="title">统计</div>
                            <el-row :gutter="20" class="statistics">
                                <el-col :span="6">
                                    <el-card shadow="always" class="aui-card--fill one">
                                        <p>{{currentTime}}</p>
                                        <p>信息统计时间</p>
                                    </el-card>
                                </el-col>
                                <el-col :span="6">
                                    <el-card shadow="always" class="two">
                                        <p class="num">{{totalNum}}</p>
                                        <p>入住总人数</p>
                                    </el-card>
                                </el-col>
                                <el-col :span="6">
                                    <el-card shadow="always" class="three">
                                        <p class="num">{{backNum}}</p>
                                        <p>应到</p>
                                    </el-card>
                                </el-col>
                                <el-col :span="6">
                                    <el-card shadow="always" class="four">
                                        <p class="num">{{outNum}}</p>
                                        <p>实到</p>
                                    </el-card>
                                </el-col>
                            </el-row> 
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
                    scNo: '',
                    scType:''
                },
                options: [{
                    value: '0',
                    label: '未归寝'
                    }, {
                    value: '1',
                    label: '已归寝'
                }],
                picArr:[],
                backNum:0,
                outNum:0,
                totalNum:0,
                currentTime:"",
                testList:[
                    {
                        type:1,
                        roomList:[
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:1002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:1001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:1002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                        ],                                            
                    },
                    {
                        type:2,
                        roomList:[
                            {
                                drNum:2001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:2001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:2002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:2002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:2001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:2002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            }
                        ],                       
                    },
                    {
                        type:3,
                        roomList:[
                            {
                                drNum:3001,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:3001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:3002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            },
                            {
                                drNum:3002,
                                total:2,
                                num:1, 
                                stuList:[
                                    {
                                        room:3001,
                                        name:'老王',
                                        type:'未归寝'
                                    },
                                    {
                                        room:3002,
                                        name:'老王2',
                                        type:'已归寝'
                                    },
                                ]
                            }
                        ],                       
                    },                  
                ]
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
                if(!this.$store.state.user.val){
                    return this.$message.info('请选择宿舍在查询')
                }
                if(!this.treeValue){
                    this.dataFun(this.treeValue)
                }else{
                    this.dataFun(this.$store.state.user.val)
                }               
            },
            //重置
            clickReset(){
                this.formSearch.scStuname=''
                this.formSearch.scNo=''
                this.formSearch.scType=''
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
    // background: rgba(20, 30, 40, 0.8);
    // box-shadow: 0px 0px 55px rgba($color: #00BFFF, $alpha: 0.5) inset;
    // border: 2px solid rgba($color: #00BFFF, $alpha: 0.5);     
}
@mixin title-style{
    width: 40px;
    color: #fff;
    font-size: 20px;
    background-color: #1890FF;
    text-align: center;
    padding: 3px;
    margin-right: 20px;
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
            height: 570px;
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
            .floorBox{
                width: 1200px;
                height: 180px;
                display: flex;
                .floorIndex{
                    height: 100%;
                    line-height: 90px;
                    @include title-style;
                }
                .floorRoom{
                    width: 100%;
                    height: 180px;
                    display: flex;
                    flex-wrap: wrap;
                    .rooms{
                        width: 80px;
                        height: 80px;
                        margin-right: 26px;
                        background-color: #fff;
                        box-shadow: 2px 2px 2px #9b9090;
                        border-radius: 2px;
                    }
                }
            }         
        }
        .total{
            z-index: 9;
            display: flex;
            .title{
                height: 100px;
                line-height: 46px;
                @include title-style;
            }
            .el-card {
                background: transparent;
                border-color: transparent;
                background-color: transparent;
                width: 220px;
                height: 100px;
                @include box-style; 
                .num{
                    font-size: 30px;
                    margin: 0px 0px;
                }
            }
            .one{
                background-color: #FFBB48;
            }
            .two{
                background-color: #57CD60;
            }
            .three{
                background-color:#7189FF;
            }
            .four{
                background-color:#DAA2FE;
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