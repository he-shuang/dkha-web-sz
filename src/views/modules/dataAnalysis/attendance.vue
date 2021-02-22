<template>
    <el-card shadow="never" class="aui-card--fill staff-report attendance">
        <el-form inline :model="dataForm" ref="ruleForm" @keyup.enter.native="getDataList">
			<el-form-item label="教职工">
				<el-select v-model="dataForm.scWaid" placeholder="请选择" filterable clearable>
					<el-option v-for="item in staffList" :label="item.scWaname" :value="item.scWaid" :key="item.scWaid"></el-option>
				</el-select>
            </el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
				<el-button type="warning" @click="reset('ruleForm')">重置</el-button>
                <el-button type="success" @click="exportDia()">导出</el-button>
			</el-form-item>
		</el-form>

        <el-table v-loading="loading" :data="dataList" style="width: 100%;" border element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
		 element-loading-background="rgba(0, 0, 0, 0.8)" :span-method="objectSpanMethod">
			<el-table-column prop="scWaname" label="姓名" align="center" width="200"></el-table-column>
			<el-table-column prop="aeDevicename" label="房间号" align="center" width="200"></el-table-column>
			<el-table-column align="center">
				<template slot="header">
					<div style="display: flex;justify-content: center;align-items: center;">
						<div>近7日考勤记录</div>
						<div>（</div>
						<div style="width: 12px;height: 12px;background-color: red;margin: 0 10px;"></div>
						<div>有考情记录</div>
						<div style="width: 12px;height: 12px;background-color: green;margin: 0 10px"></div>
						<div style="margin-right: 10px;">无考勤记录</div>
						<div>）</div>
					</div>

				</template>
				<template slot-scope="scope">
					<div class="squareContent" style="display: flex;flex-wrap:wrap">
						<el-tooltip v-for="(item,index) in dateRange" effect="light" :content="toolComputed(item,scope.row.scAttendanceStatisticsDataInfoDTOList) ? toolComputed(item,scope.row.scAttendanceStatisticsDataInfoDTOList) : item"
						 placement="top-start" :key="index">
							<div class="divSquare" :style="{backgroundColor:toolComputed(item,scope.row.scAttendanceStatisticsDataInfoDTOList) ? 'red' : 'green'}">
							</div>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
            <el-table-column align="center" label="操作" width="180">
				<template slot-scope="scope">
					<el-button type="text" @click="viewHandle(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>
        <v-view ref="viewRef" v-if="viewVisible"></v-view>

        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            :close-on-click-modal="false"
            :before-close="handleDialogClose"
            width="30%"
            center>
            <el-form inline :model="form" ref="form" :rules="ruleform">
                <el-form-item label="时间" prop="date">
                    <el-date-picker
                        v-model="form.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd" 
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="exportHandle()">导出</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<script>
import Cookies from 'js-cookie'
import qs from 'qs'
import {getDictDataList} from '@/utils'
import vView from './v-view'
import {
		buildMerge
	} from "../../../utils/mergeCell.js"
    export default {
        data(){
            return{
                viewVisible: false,
                dataForm: {
                    scWaid:'',
                    startDate:"",
                    endDate:"",
                },
                dataList:[],
                //教职工
                staffList:[],
                centerDialogVisible: false,
                form:{
                    date:'',
                },
                ruleform:{
                    date:{required: true, message: '请选择日期', trigger: 'change'}
                },
                loading: false,
                dateRange:[]
            }
        },
        components: {
			vView
		},
        computed: {
			schoolList() {
				return getDictDataList("school")
            },
            toolComputed() {
				return function(dateStr, row) {
					let str = ""
					row.forEach(item => {
						if (dateStr === item.stDate) {
							str = `${item.stDate}  ${item.stNum}次`
						}
                    })
					return str
				}
            },
            
        },
        mounted(){
            this.getStaffList()
            this.getDataList()

            let current=new Date()
            let dd=new Date((new Date).getTime() - 24 * 60 * 60 * 1000)
            let today=current.toLocaleString('chinese', { hour12: false }).split('/').join('-').substr(0,10)
            let old7=current.setDate(current.getDate()-6)
            let time=(new Date(parseInt(old7))).toLocaleDateString().replaceAll('/','-')
            this.dataForm.startDate=time
            this.dataForm.endDate=today
            this.getBetweenDateStr(time, today);
        },
        methods: {
            getBetweenDateStr(start,end){
                var result = [];
                var beginDay = start.split("-");
                var endDay = end.split("-");
                var diffDay = new Date();
                var dateList = new Array;
                var i = 0;
                diffDay.setDate(beginDay[2]);
                diffDay.setMonth(beginDay[1]-1);
                diffDay.setFullYear(beginDay[0]);
                result.push(start);
                while(i == 0){
                    var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
                    diffDay.setTime(countDay);
                    dateList[2] = diffDay.getDate();
                    dateList[1] = diffDay.getMonth() + 1;
                    dateList[0] = diffDay.getFullYear();
                    if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
                    if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
                    result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
                    if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;
                    }
                };               
               this.dateRange=result;
            },
            getDataList(){
                this.loading = true
                this.$http.get('/system/scattendancestatistics/dataInfo',{params: this.dataForm})
                .then(({data:res})=>{
                    if (res.data.length > 0) {
                        buildMerge(res.data, 'scWaname', 'aeDevicename')             
						this.dataList = res.data
						this.loading = false
					} else {
						this.dataList = []
					}
                }).catch(() => {}).finally(() => {
					this.loading = false
				})
            },
            exportDia(){
                this.centerDialogVisible=true;
            },
            // 导出
			exportHandle() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let params={
                            endDate: this.form.date[1],
                            startDate: this.form.date[0],
                            scWaid:this.dataForm.scWaid
                        }

                        this.$http
                            .get(`/system/scattendancestatistics/export`, {
                                responseType: "blob",
                                params
                            })
                            .then(res => {
                                if(res.data.type == 'application/json'){
                                    return this.$message.info("暂无数据导出")
                                }
                                const content = res.data;
                                const blob = new Blob([content], {
                                    type: "application/vnd.ms-excel;charset=utf-8"
                                });
                                const fileName ="考勤统计表("+res.config.params.startDate+"-"+res.config.params.endDate+")";
                                if ("download" in document.createElement("a")) {
                                    // 非IE下载
                                    const elink = document.createElement("a");
                                    elink.download = fileName;
                                    elink.style.display = "none";
                                    elink.href = URL.createObjectURL(blob);
                                    document.body.appendChild(elink);
                                    elink.click();
                                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                                    document.body.removeChild(elink);
                                } else {
                                    // IE10+下载
                                    navigator.msSaveBlob(blob, fileName);
                                }
                            })
                            .catch(err => {});
                    } else {
                        return false;
                    }
                });		
			},
			reset(formName) {
                this.dataForm.scWaid='';
                this.getDataList()
            },
            // 获取职工信息
			getStaffList() {
				this.$http.get(`/system/scworkersarchives/getAll`).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.staffList = res.data
				}).catch(() => {})
            },
            handleDialogClose(){
                this.centerDialogVisible=false;
                this.form.date=''
            },
            objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 0) {
					return this.ret(row, 'firstSpan')
				} else if (columnIndex === 1) {
					return this.ret(row, 'secondSpan')
				} else if (columnIndex === 2) {
					return this.ret(row, 'thirdSpan')
				}
			},
			ret(row, obj) {
				if (row && row[obj] != 0) {
					return {
						rowspan: row[obj],
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
            },
            //xiangqing
            viewHandle(row) {
				this.viewVisible = true
				this.$nextTick(() => {
					this.$refs.viewRef.init(row,this.dataForm,"/system/scattendancestatistics/dataInfo")
				})
			},
		}
    }
</script>

<style lang="scss" scoped>
	.attendance {
		.squareContent {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;

			.divSquare {
				margin: 8px;
				width: 10px;
				height: 10px;
				cursor: pointer;
			}
		}
	}
</style>