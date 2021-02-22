<template>
    <div>
        <el-input
            v-if="type!='goout'"
            placeholder="请输入"
            clearable
            v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <p class="title"></p>
        <el-tree 
        v-if="type=='room'"
        :data="dataList" 
        :props="{ label: 'df_floorname', children: 'children'}"
        highlight-current 
        accordion 
        node-key="df_floorid" 
        ref="tree" 
        check-on-click-node
        :default-expanded-keys="defaultCheckedKeysRoom"
        :default-checked-keys="defaultCheckedKeysRoom"
        :filter-node-method="filterNode" 
        @check="handleNodeClick">
        </el-tree>
        <el-tree 
            v-else-if="type=='electric'"
            :data="dataList" 
            :props="{ label: 'df_floorname', children: 'children'}"
            accordion 
            highlight-current 
            node-key="df_floorid" 
            ref="tree" 
            check-on-click-node
            :default-expanded-keys="defaultCheckedKeysElectric"
            :default-checked-keys="defaultCheckedKeysElectric"
            :filter-node-method="filterNode" 
            @check="handleNodeClick">
        </el-tree>
        <el-tree 
            class="gooutTree"
            v-else-if="type=='goout'"
            :data="dataList" 
            :props="{ label: 'df_floorname', children: 'children'}"
            accordion 
            highlight-current 
            node-key="df_floorid" 
            ref="tree" 
            check-on-click-node
            :default-expanded-keys="defaultCheckedKeysGoout"
            :default-checked-keys="defaultCheckedKeysGoout"
            :filter-node-method="filterNode" 
            @check="handleNodeClick">
        </el-tree>  
    </div>
</template>

<script>
import { treeDataTranslateDis,treeDataTranslate } from '@/utils'
    export default {
        props: {
            type: String
        },
        data(){
            return{
                filterText:'',
                dataList: [],
                defaultCheckedKeysElectric:[],
                defaultCheckedKeysGoout:[],
                defaultCheckedKeysRoom:[],
                keyElectric:'',
                keyGoout:'',
            }
        },
        watch: {
            filterText (val) {
                this.$refs.tree.filter(val);
            },
        },
        mounted(){
            this.initTree();           
        },
        methods:{
            //第一级数据
            initTree(){
                this.$http.get('/system/scdormitoryfloor/roomTree/0').then(({data:res})=>{
                    if(res.code==0){
                        let list=res.data.map(item=>{
                            return {
                                ...item,
                                name:item.df_floorname,
                                id:item.df_floorid,
                                pid:item.df_parentid
                             }
                        })
                        this.dataList= treeDataTranslate(list)
                        // 宿舍电流 展示第一栋 的 第一层 的 第一个房间
                        this.keyElectric=this.dataList[0]['children'][0]['children'][0].id;

                        //外出管理 展示第一栋 的 第一层
                        this.keyGoout=this.dataList[0]['children'][0].id;
                        let type=this.dataList[0]['children'][0].df_type;
                        let valGoout={
                            df_floorid:this.keyGoout,
                            df_type:type
                        }

                        //宿舍房间 展示第一栋
                        this.keyRoom=this.dataList[0].id;
                        let typeroom=this.dataList[0].df_type;
                        let valRoom={
                            df_floorid:this.keyRoom,
                            df_type:typeroom
                        }

                        //树 默认展示 数组结构
                        this.defaultCheckedKeysElectric.push(this.keyElectric);
                        this.defaultCheckedKeysGoout.push(this.keyGoout);
                        this.defaultCheckedKeysRoom.push(this.keyRoom);

                        //储存数据
                        this.$store.state.user.defaultCheckedKeys=this.keyElectric
                        this.$store.state.user.valGoout=valGoout;
                        this.$store.state.user.valRoom=valRoom;

                        //默认展开 的 节点 标亮
                        this.$nextTick(()=>{
                            if(this.type == 'electric'){
                                this.$refs.tree.setCurrentKey(this.keyElectric);  
                            }else if(this.type =='goout'){
                                this.$refs.tree.setCurrentKey(this.keyGoout);  
                            }else if(this.type == 'room'){
                                this.$refs.tree.setCurrentKey(this.keyRoom);  
                            }
                            
                        })
                    }
                    else{
                        this.dataList=[]
                        this.$message.error(data.msg)
                    }
                })
            },
            handleNodeClick(data){
                let a=JSON.parse(JSON.stringify(data));
                let val={
                    df_floorid:a.df_floorid,
                    df_type:a.df_type,
                    df_floorname:a.df_floorname 
                }
                this.$emit('treeFun',val)
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
        }
    }
</script>

<style lang="scss" scoped>
.title{
    color:#fff
}
/* 滚动条 */
.el-tree::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    border-radius: 15px;
    background-color: rgba(255,255,255,0.8);
}
.el-tree::-webkit-scrollbar{
    width: 5px;
    background-color: rgba(179, 174, 174, 0);
}
.el-tree::-webkit-scrollbar-thumb{
    border-radius: 15px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.3);
    background-color: #555;
}
/deep/.el-tree-node__label{
	font-size: 18px;
}
</style>