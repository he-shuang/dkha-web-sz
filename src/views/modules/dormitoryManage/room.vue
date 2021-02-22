<template>
	<el-card shadow="never" class="aui-card--fill">
		<div class="roomBox">
			<div class="top">
				<div class="topRoom">
					<div class="box" v-for="(item,key) in topArr" :key="key">
						<div :class="item.dormitorypersonDTOS.length > 1 ? 'drNum' : 'drNums'">{{item.drNum}}</div>
						<!-- 有人住 -->
						<div class="imgs" v-if="item.dormitorypersonDTOS.length >0">
							<div class="imgg" v-for="(i,k) in item.dormitorypersonDTOS" :key="k">
								<el-tooltip class="item" placement="bottom" effect="light">
									<div slot="content">
										<div>
											<div>姓名：{{i.scStuname}}</div>
											<div>学号：{{i.scNo}}</div>
											<div>联系电话：{{i.scPhonenum}}</div>
										</div>
									</div>
									<div class="content">
										<el-image :src='$ImgServerUrl+i.scPhotoimg' fit='fill'>
											<div slot="error" class="image-slot">
												<img class="student-img" src="../../../assets/img/person.jpg">
											</div>
										</el-image>
										<div v-if="i.isOut == '1'" class="out"><span>未归寝</span></div>
										<div v-else-if="i.isOut == '-1'" class="dont"><span>未入住</span></div>
										<div class="name">{{i.scStuname}}</div>
									</div>
								</el-tooltip>
							</div>
							<div class="con_pic" v-show="item.dormitorypersonDTOS.length == 1">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">暂无人住</div>
							</div>
						</div>
						<!-- 暂无人住 -->
						<div class="imgs" v-else>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">暂无人住</div>
							</div>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">暂无人住</div>
							</div>
						</div>
						<div class="operation">
							<span class="fp" @click="modifyAllocation('two',item)"><img src="../../../assets/img/room/fp.png" alt="" v-if="$hasPermission('system:scdormitoryperson:save'||'system:scdormitoryperson:update')"></span>
							<el-popover placement="right" width="350" v-model="item.visible">
								<el-checkbox-group v-model="checkList">
									<el-checkbox class='bbox' v-for="v in item.dormitorypersonDTOS" :key="v.dpId" :label="v.scStuname" size="medium" style="font-size:20px">
										<span style="font-size: 20px;width:100px;margin-right:10px;display:inline-block">{{v.scStuname}}</span>
										<span style="font-size: 20px">{{v.scNo}}</span>
									</el-checkbox>
								</el-checkbox-group>
								<div style="margin-left:100px">
									<el-button type="text" style="font-size:20px" @click="item.visible = false">取消</el-button>
									<el-button type="text" style="font-size:20px;margin-left:15px" @click="clickDel(checkList,item)">确定</el-button>
								</div>
								<el-button type="text" icon="el-icon-delete" slot="reference" style="fontSize:20px;padding-top:0px;color:#fff"
								 :disabled='item.dormitorypersonDTOS && item.dormitorypersonDTOS.length>0 ? false : true' @click="clickCheck"
								 v-if="$hasPermission('system:scdormitoryperson:delete')"></el-button>
							</el-popover>
						</div>
					</div>
				</div>
			</div>
			<div class="center">
				<div class="lRoom">
					<div class="box" v-for="(item,key) in leftArr" :key="key">
						<div :class="item.dormitorypersonDTOS.length ==0 ? 'drNums' : 'drNum'">{{item.drNum}}</div>
						<!-- 有人住 -->
						<div class="imgs" v-if="item.dormitorypersonDTOS.length >0">
							<div class="imgg" v-for="(i,k) in item.dormitorypersonDTOS" :key="k">
								<el-tooltip class="item" placement="bottom" effect="light">
									<div slot="content">
										<div>
											<div>姓名：{{i.scStuname}}</div>
											<div>学号：{{i.scNo}}</div>
											<div>联系电话：{{i.scPhonenum}}</div>
										</div>
									</div>
									<div class="content">
										<el-image :src='$ImgServerUrl+i.scPhotoimg' fit='fill'>
											<div slot="error" class="image-slot">
												<img class="student-img" src="../../../assets/img/person.jpg">
											</div>
										</el-image>
										<div v-if="i.isOut == '1'" class="out"><span>未归寝</span></div>
										<div v-else-if="i.isOut == '-1'" class="dont"><span>未入住</span></div>
										<div class="name">{{i.scStuname}}</div>
									</div>
								</el-tooltip>
							</div>
						</div>
						<!-- 暂无人住 -->
						<div class="imgs" v-else>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">
									<div>暂无人住</div>
								</div>
							</div>
						</div>
						<div class="operation">
							<span class="fp" @click="modifyAllocation('one',item)"><img src="../../../assets/img/room/fp.png" alt="" v-if="$hasPermission('system:scdormitoryperson:save'||'system:scdormitoryperson:update')"></span>
							<el-popover placement="right" width="300" v-model="item.visible">
								<el-checkbox-group v-model="checkList">
									<el-checkbox v-for="(v,key) in item.dormitorypersonDTOS" :key="v.dpId" :label="v.scStuname">
										<span style="font-size: 20px;width:100px;margin-right:10px;display:inline-block">{{v.scStuname}}</span>
										<span style="font-size: 20px">{{v.scNo}}</span>
									</el-checkbox>
								</el-checkbox-group>
								<div style="margin-left:50px">
									<el-button type="text" style="font-size:20px" @click="item.visible = false">取消</el-button>
									<el-button type="text" style="font-size:20px;margin-left:15px" @click="clickDel(checkList,item)">确定</el-button>
								</div>
								<el-button type="text" icon="el-icon-delete" slot="reference" style="fontSize:20px;padding-top:0px;color:#fff"
								 :disabled='(item.dormitorypersonDTOS && item.dormitorypersonDTOS.length>0 ? false : true)' @click="clickCheck"
								 v-if="$hasPermission('system:scdormitoryperson:delete')"></el-button>
							</el-popover>
						</div>
					</div>
				</div>
				<div class="content">
					<div class="left">
						<div class="floor" v-for="(item,key) in dataList" :key="key" @click="clickFloor(item)" :style="{marginLeft: item.ml+'px',backgroundColor:checkFloor==item.df_floorid?'#73C060':'#C6C7CB',color:checkFloor==item.df_floorid?'#fff':'#000'}">{{item.df_floorname}}</div>
					</div>
					<div class="right">
						<div class="btn">
							<el-button v-if="$hasPermission('system:scdormitoryperson:import')" type="success" @click="importHandle()">导入</el-button>
							<el-button  type="success" @click="exportHandle()">导出</el-button>
						</div>
						<h1>宿舍楼&nbsp;{{floorF}}</h1>
						<div>
							<span class="yd">应到：{{backNum}}人</span>
							<span class="yd">实到：{{outNum}}人</span>
							<span style="color: red;">未到：{{backNum-outNum}}人</span>
						</div>
					</div>
				</div>
				<div class="rRoom">
					<div class="box" v-for="(item,key) in rightArr" :key="key">
						<div :class="item.dormitorypersonDTOS.length ==0 ? 'drNums' : 'drNum'">{{item.drNum}}</div>
						<!-- 有人住 -->
						<div class="imgs" v-if="item.dormitorypersonDTOS.length >0">
							<div class="imgg" v-for="(i,k) in item.dormitorypersonDTOS" :key="k">
								<el-tooltip class="item" placement="bottom" effect="light">
									<div slot="content">
										<div>
											<div>姓名：{{i.scStuname}}</div>
											<div>学号：{{i.scNo}}</div>
											<div>联系电话：{{i.scPhonenum}}</div>
										</div>
									</div>
									<div class="content">
										<el-image :src='$ImgServerUrl+i.scPhotoimg' fit='fill'>
											<div slot="error" class="image-slot">
												<img class="student-img" src="../../../assets/img/person.jpg">
											</div>
										</el-image>
										<div v-if="i.isOut == '1'" class="out"><span>未归寝</span></div>
										<div v-else-if="i.isOut == '-1'" class="dont"><span>未入住</span></div>
										<div class="name">{{i.scStuname}}</div>
									</div>
								</el-tooltip>
							</div>
						</div>
						<!-- 暂无人住 -->
						<div class="imgs" v-else>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">
									<div>暂无人住</div>
								</div>
							</div>
						</div>
						<div class="operation">
							<span class="fp" @click="modifyAllocation('one',item)"><img src="../../../assets/img/room/fp.png" alt="" v-if="$hasPermission('system:scdormitoryperson:save'||'system:scdormitoryperson:update')"></span>
							<el-popover placement="right" width="300" v-model="item.visible" class="tooltip">
								<el-checkbox-group v-model="checkList">
									<el-checkbox v-for="(v,key) in item.dormitorypersonDTOS" :key="v.dpId" :label="v.scStuname">
										<span style="font-size: 20px;width:100px;margin-right:10px;display:inline-block">{{v.scStuname}}</span>
										<span style="font-size: 20px">{{v.scNo}}</span>
									</el-checkbox>
								</el-checkbox-group>
								<div style="margin-left:50px">
									<el-button type="text" style="font-size:20px" @click="item.visible = false">取消</el-button>
									<el-button type="text" style="font-size:20px;margin-left:15px" @click="clickDel(checkList,item)">确定</el-button>
								</div>
								<el-button type="text" icon="el-icon-delete" slot="reference" style="fontSize:20px;padding-top:0px;color:#fff"
								 :disabled='(item.dormitorypersonDTOS && item.dormitorypersonDTOS.length>0 ? false : true)' @click="clickCheck"
								 v-if="$hasPermission('system:scdormitoryperson:delete')"></el-button>
							</el-popover>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom">
				<div class="btRoom">
					<div class="box" v-for="(item,key) in bottomArr" :key="key">
						<div :class="item.dormitorypersonDTOS.length > 1 ? 'drNum' : 'drNums'">{{item.drNum}}</div>
						<!-- 有人住 -->
						<div class="imgs" v-if="item.dormitorypersonDTOS.length >0">
							<div class="imgg" v-for="(i,k) in item.dormitorypersonDTOS" :key="k">
								<el-tooltip class="item" placement="bottom" effect="light">
									<div slot="content">
										<div>
											<div>姓名：{{i.scStuname}}</div>
											<div>学号：{{i.scNo}}</div>
											<div>联系电话：{{i.scPhonenum}}</div>
										</div>
									</div>
									<div class="content">
										<el-image :src='$ImgServerUrl+i.scPhotoimg' fit='fill'>
											<div slot="error" class="image-slot">
												<img class="student-img" src="../../../assets/img/person.jpg">
											</div>
										</el-image>
										<div v-if="i.isOut == '1'" class="out"><span>未归寝</span></div>
										<div v-else-if="i.isOut == '-1'" class="dont"><span>未入住</span></div>
										<div class="name">{{i.scStuname}}</div>
									</div>
								</el-tooltip>
							</div>
							<div class="con_pic" v-show="item.dormitorypersonDTOS.length == 1">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">
									<div>暂无人住</div>
								</div>
							</div>
						</div>
						<!-- 暂无人住 -->
						<div class="imgs" v-else>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">
									<div>暂无人住</div>
								</div>
							</div>
							<div class="con_pic">
								<img class="img" src="../../../assets/img/person.jpg" alt="">
								<div class="no">
									<div>暂无人住</div>
								</div>
							</div>
						</div>
						<div class="operation">
							<span class="fp" @click="modifyAllocation('two',item)"><img src="../../../assets/img/room/fp.png" alt="" v-if="$hasPermission('system:scdormitoryperson:save'||'system:scdormitoryperson:update')"></span>
							<el-popover placement="right" width="350" v-model="item.visible">
								<el-checkbox-group v-model="checkList">
									<el-checkbox v-for="(v,key) in item.dormitorypersonDTOS" :key="v.dpId" :label="v.scStuname">
										<span style="font-size: 20px;width:100px;margin-right:10px;display:inline-block">{{v.scStuname}}</span>
										<span style="font-size: 20px">{{v.scNo}}</span>
									</el-checkbox>
								</el-checkbox-group>
								<div style="margin-left:100px">
									<el-button type="text" style="font-size:20px" @click="item.visible = false">取消</el-button>
									<el-button type="text" style="font-size:20px;margin-left:15px" @click="clickDel(checkList,item)">确定</el-button>
								</div>
								<el-button type="text" icon="el-icon-delete" slot="reference" style="fontSize:20px;padding-top:0px;color:#fff"
								 :disabled='(item.dormitorypersonDTOS && item.dormitorypersonDTOS.length>0 ? false : true)' @click="clickCheck"
								 v-if="$hasPermission('system:scdormitoryperson:delete')"></el-button>
							</el-popover>
						</div>
					</div>
				</div>
			</div>

			<el-dialog title="分配" :visible.sync="centerDialogVisible" width="50%" :close-on-click-modal="false" :before-close="handleClose"
			 center>
				<el-form :model="formInline" ref="formInline" label-width="100px" class="demo-dynamic">
					<el-row>
						<el-col :span="10" style="marginLeft:110px">
							<el-form-item prop="scStdid" label="姓名" v-for="(item, key) in formInline.stus" :key="key.index">
								<el-select v-model="item.scStdid" filterable placeholder="请选择" @change='changeName($event,item)'>
									<el-option v-for="item in optNameNo" :key="item.scStdid" :label="item.scStuname" :value="item.scStdid">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<el-form-item label="学号：" prop="scNo" v-for="(item, key) in formInline.stus" :key="key.index">
								<div class="item">
									<el-select v-model="item.scNo" filterable placeholder="请选择" @change='changeNo($event,item)'>
										<el-option v-for="item in optNameNo" :key="item.scIdno" :label="item.scNo" :value="item.scIdno">
										</el-option>
									</el-select>
								</div>

							</el-form-item>

						</el-col>
					</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="resetForm">取 消</el-button>
					<el-button type="primary" @click="confirm" v-loading="loading">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<!-- 批量上传信息 -->
		<upload ref="roomExcel" template-url="./template/宿舍信息导入表模板.xlsx" upload-url="/system/scdormitoryperson/importInfoExcel"></upload>
	</el-card>
</template>

<script>
	import debounce from 'lodash/debounce'
	import upload from '@/components/public/upload-excel-or-img'
	import {
		treeDataTranslate
	} from '@/utils'
	import Cookies from 'js-cookie'
	import qs from 'qs'
	export default {
		components: {
			upload
		},
		data() {
			return {
				loading: false,
				checkList: [],
				topArr: [],
				leftArr: [],
				rightArr: [],
				bottomArr: [],
				//分页
				pages: {
					pageNo: 1,
					pageSize: 6000
				},
				title: '',
				centerDialogVisible: false,
				formInline: {
					stus: [{
							scStdid: '',
							scNo: '',
							dpId: '',
							key: '0'
						},
						{
							scStdid: '',
							scNo: '',
							dpId: '',
							key: '1'
						},
					],
				},
				//学生姓名 / 学号
				optNameNo: [],
				//楼层
				dataList: [],
				floorF: '',
				floor: {},
				checkFloor: '',
				//房间id
				drId: '',
				//入住id
				dpId: '',
				idsItem: [],
				backNum: '',
				outNum: '',
			}
		},
		mounted() {
			this.getCode()
			if (!window.sessionStorage.getItem('floorId')) {
				this.search()
			}
		},
		activated() {
			// 首页宿舍今日用电量TOP10跳转进来
			let floorId = window.sessionStorage.getItem('floorId');
			if (floorId) {s
				window.sessionStorage.removeItem('floorId');ss
				this.search(floorId)
			}
		},
		methods: {
			// 导入
			importHandle() {
				this.$refs['roomExcel'].init()
			},
			exportHandle(){
				var params = qs.stringify({
				 'access_token': Cookies.get('access_token')
				})
				window.location.href = `${window.SITE_CONFIG['apiURL']}/system/scdormitoryperson/exportInfoExcel?${params}`
			},
			//分页 数据
			dataFun(item) {
				this.floorF = item.df_floorname
				this.getTotalNum(item)
				let params = {
					page: this.pages.pageNo,
					limit: this.pages.pageSize,
					floorId: item.df_floorid,
					type: item.df_type,
					scNo: "",
					scStuname: "",
				}
				this.$http.get('/system/scdormitoryperson/page', {
						params
					})
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						let arr = res.data.list.map(item => {
							return {
								...item,
								visible: false
							}
						});
						this.topArr = arr.slice(0, 11);
						this.rightArr = arr.slice(11, 14);
						this.bottomArr = arr.slice(14, 24).reverse();
						this.leftArr = arr.slice(24).reverse();
					})
			},
			getTotalNum(item) {
				let params = {
					floorId: item.df_floorid,
					type: item.df_type,
					scNo: '',
					scStuname: '',
				}
				this.$http.get('/system/scdormitoryperson/getRoomCheckInInfo', {
						params
					})
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						let {
							backNum,
							outNum
						} = res.data
						this.backNum = backNum;
						this.outNum = outNum;
					})
			},
			//楼层
			search(floorId) {
				this.$http.get('/system/scdormitoryfloor/roomTree/0').then(({
					data: res
				}) => {
					if (res.code == 0) {
						let list = res.data.map(item => {
							return {
								...item,
								name: item.df_floorname,
								id: item.df_floorid,
								pid: item.df_parentid
							}
						})
						let arr = treeDataTranslate(list)
						let crr = arr[0].children.map((v, index) => {
							return {
								df_floorname: v.df_floorname,
								df_type: v.df_type,
								df_floorid: v.df_floorid,
								ml: 30 * index
							}
						})
						this.dataList = crr.reverse()

						// 路由跳转过来，floorId有值
						if (floorId) {
							this.dataList.forEach(item => {
								if (floorId === item.df_floorid) {
									this.floor = item
								}
							})
						} else {
							this.floor = {
								df_floorname: this.dataList[this.dataList.length - 1].df_floorname,
								df_type: this.dataList[this.dataList.length - 1].df_type,
								df_floorid: this.dataList[this.dataList.length - 1].df_floorid,
							}
						}
						this.dataFun(this.floor)
						this.checkFloor = this.floor.df_floorid
					} else {
						this.dataList = []
						this.$message.error(data.msg)
					}
				})
			},
			//切换楼层
			clickFloor(item) {
				this.floor = item
				this.dataFun(item)
				this.checkFloor = item.df_floorid
			},
			//分配 修改
			modifyAllocation(type, item) {
				this.idsItem = item.dormitorypersonDTOS;
				this.formInline.stus = []
				if (type == 'one') {
					this.formInline.stus.push({
						scStdid: '',
						scNo: '',
						key: '0',
						dpId: ''
					});
				} else if (type == 'two') {
					this.formInline.stus.push({
						scStdid: '',
						scNo: '',
						key: '0',
						dpId: ''
					}, {
						scStdid: '',
						scNo: '',
						key: '1',
						dpId: ''
					}, );
				}
				this.drId = item.drId; //房间id
				let key = 0
				let dpIds = item.dormitorypersonDTOS.map(item => {
					return {
						...item,
						key: key++
					}
				})
				if (dpIds.length > 0) {
					this.getCode(dpIds)
				} else {
					this.getCode()
				}

				this.centerDialogVisible = true;
			},
			//学生姓名 下拉
			getCode(ids) {
				this.formInline.stus.forEach(v => {
					v.scStdid = '';
					v.scNo = ''
				})
				let val = []
				if (ids) {
					ids.forEach(v => {
						val.push(v.scStdid)
					})
				}
				this.$http.post('/system/scstudents/getStudentsInfo', val)
					.then(({
						data: res
					}) => {
						if (res.code == 0) {
							this.optNameNo = res.data;
							if (ids) {
								this.formInline.stus.forEach(item => {
									ids.forEach(k => {
										if (item.key == k.key) {
											item.scStdid = k.scStdid;
											item.scNo = k.scIdno;
										}
									})
								})
							}
						}
					})
			},
			//下拉 配置
			changeName(e, v) {
				let arr = this.optNameNo.filter(item => {
					if (v.scStdid == item.scStdid) {
						return item
					}
				})
				for (let i of this.formInline.stus) {
					if (i.key == v.key) {
						i.scNo = arr[0].scNo
					}
				}
			},
			changeNo(e, v) {
				let arr = this.optNameNo.filter(item => {
					if (v.scNo == item.scIdno) {
						return item
					}
				})
				for (let i of this.formInline.stus) {
					if (i.key == v.key) {
						i.scStdid = arr[0].scStdid
					}
				}
			},
			//修改 分配 / 表单提交
			confirm: debounce(function() {
				let length = 0
				this.formInline.stus.forEach(v => {
					if (v.scStdid == '') {
						length++
					}
				})
				if (length == 2) {
					return this.$message.info('请至少分配一条信息！！')
				}
				let params = {};
				let arr = this.idsItem;
				let brr = this.formInline.stus;
				let crr = []
				let drr = []
				let err = []
				if (arr.length > 0) {
					arr.forEach((item, index) => {
						brr.forEach(v => {
							v.drId = this.drId
							if (index == v.key) {
								v.dpId = item.dpId
							}
						})
					})
				} else if (arr.length == 0) {
					brr.forEach(v => {
						v.drId = this.drId
					})
				}
				brr.forEach((val, index) => {
					if (val.scStdid) {
						crr.push(val)
					}
				})
				crr.forEach(item => {
					//修改
					if (item.dpId) {
						drr.push(item)
						//分配
					} else {
						err.push(item)
					}

				})
				if (drr.length > 0) {
					this.loading = true
					this.$http.put('/system/scdormitoryperson', drr)
						.then(({
							data: res
						}) => {
							if (res.code != 0) {
								return this.$message.error(res.msg)
							}
							this.loading = false
							this.centerDialogVisible = false;
							this.dataFun(this.floor)
							this.$message.success(res.msg)
							this.$refs['formInline'].resetFields();
						}).catch(() => {}).finally(() => {
							this.loading = false
						})
				}
				if (err.length > 0) {
					this.loading = true
					this.$http.post('/system/scdormitoryperson', err)
						.then(({
							data: res
						}) => {
							if (res.code != 0) {
								return this.$message.error(res.msg)
							}
							this.loading = false
							this.centerDialogVisible = false;
							this.dataFun(this.floor)
							this.$message.success(res.msg)
							this.$refs['formInline'].resetFields();
						}).catch(() => {}).finally(() => {
							this.loading = false
						})
				}
			}, 1000),
			clickCheck() {
				this.checkList = []
			},
			clickQx() {
				this.visible = false
			},
			//删除
			clickDel(id, arr) {
				let visible = arr.visible;
				let arrDOTS = arr.dormitorypersonDTOS
				if (id.length == 0) {
					return this.$message.info('请选择人员再删除！')
				}
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let parmas = [];
					id.forEach(item => {
						arrDOTS.forEach(v => {
							if (v.scStuname == item) {
								parmas.push(v.dpId)
							}
						})
					})
					this.$http.post('/system/scdormitoryperson/id', parmas)
						.then(({
							data: res
						}) => {
							if (res.code != 0) {
								return this.$message.error(res.msg)
							}
							this.dataFun(this.floor)
							visible = false
							this.$message.success(res.msg)
						})
				})
			},
			resetForm() {
				this.centerDialogVisible = false;
			},
			handleClose() {
				this.centerDialogVisible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@mixin dm-style {
		width: 100%;
		height: 180px;
		background-color: #2C405B;
		border-radius: 4px;
		font-size: 26px;
		text-align: center;
		color: #fff;
	}

	@mixin drNum-style {
		text-align: center;
		font-size: 22px;
		border-radius: 4px;
		color: #fff;
	}

	@mixin box-style {
		background-color: #2C405B;
		margin-bottom: 9px;
		border-radius: 4px;
	}

	/deep/ .el-card__body {
		padding: 0;
	}

	.roomBox {

		.top,
		.bottom {
			width: 100%;
			height: 180px;
			display: flex;
			margin-bottom: 6px;

			.topRoom,
			.btRoom {
				display: flex;
				flex-wrap: nowrap;

				.box {
					@include box-style;
					width: 140px;
					height: 100%;
					margin-right: 11px;

					.drNum {
						@include drNum-style;
						margin-bottom: 10px;
						background-color: #73C060;
					}

					.drNums {
						@include drNum-style;
						margin-bottom: 10px;
						background-color: #FFC945;
					}

					.imgs {
						display: flex;
						justify-content: space-around;
						color: #fff;

						.imgg {
							position: relative;
							z-index: 1;

							.out {
								position: absolute;
								cursor: pointer;
								background: rgba(245, 54, 54, 0.55);
								z-index: 2;
								width: 60px;
								height: 80px;
								top: 0;
								left: 0;

								span {
									display: inline-block;
									vertical-align: middle;
									width: 100%;
									line-height: 80px;
									text-align: center;
								}
							}

							.dont {
								position: absolute;
								cursor: pointer;
								background: rgba(0, 0, 0, 0.75);
								;
								z-index: 2;
								width: 60px;
								height: 80px;
								top: 0;
								left: 0;

								span {
									display: inline-block;
									vertical-align: middle;
									width: 100%;
									line-height: 80px;
									text-align: center;
								}
							}
						}

						.el-image {
							width: 60px;
							height: 80px;

							.student-img {
								width: 60px;
								height: 80px;
							}
						}

						.name {
							width: 60px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							margin-top: 6px;
							text-align: center;
						}

						.con_pic {
							.img {
								width: 60px;
								height: 80px;
							}

							.no {
								margin-top: 10px;
								text-align: center;
							}
						}
					}

					.operation {
						color: #fff;
						display: flex;
						justify-content: space-around;
						margin-top: 10px;

						.fp,
						.del {
							cursor: pointer;
						}

						
					}
				}
			}

			.topDm,
			.btDm {
				@include dm-style;

				img {
					margin-top: 30px;
				}
			}
		}

		.center {
			width: 100%;
			display: flex;

			.lRoom,
			.rRoom {
				.box {
					display: flex;
					width: 160px;
					@include box-style;

					.drNum {
						@include drNum-style;
						background-color: #73C060;
						font-size: 20px;
						line-height: 130px;
					}

					.drNums {
						@include drNum-style;
						background-color: #FFC945;
						font-size: 20px;
						line-height: 130px;
					}

					.imgs {
						width: 100px;
						margin: 10px;
						color: #fff;

						.imgg {
							position: relative;
							z-index: 1;

							.content {
								display: flex;

								.out {
									position: absolute;
									cursor: pointer;
									background: rgba(245, 54, 54, 0.55);
									z-index: 2;
									width: 60px;
									height: 80px;
									top: 0;

									span {
										display: inline-block;
										vertical-align: middle;
										width: 100%;
										line-height: 80px;
										text-align: center;
									}
								}

								.dont {
									position: absolute;
									cursor: pointer;
									background: rgba(0, 0, 0, 0.75);
									z-index: 2;
									width: 60px;
									height: 80px;
									top: 0;
									left: 0;

									span {
										display: inline-block;
										vertical-align: middle;
										width: 100%;
										line-height: 80px;
										text-align: center;
									}
								}

								.el-image {
									width: 60px;
									height: 80px;
									position: relative;

									.student-img {
										width: 60px;
										height: 80px;
									}
								}

								.name {
									width: 60px;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									margin-top: 90px;
									margin-left: -90px;
									text-align: center;
									color: #fff;
								}
							}
						}

						.con_pic {
							.img {
								width: 60px;
								height: 80px;
							}

							.no {
								margin-top: 10px;
								text-align: center;
							}
						}
					}

					.operation {
						margin-top: 20px;
						cursor: pointer;

						.fp {
							img {
								margin-bottom: 30px;
							}
						}
					}
				}
			}

			.content {
				width: 100%;
				display: flex;
				justify-content: space-between;
				color: #fff;

				.left {
					margin-left: 50px;

					.floor {
						font-size: 24px;
						cursor: pointer;
						width: 200px;
						height: 30px;
						color: black;
						line-height: 30px;
						text-align: center;
						box-shadow: 6px 4px 10px #949ba5;
						margin-bottom: 10px;
					}
				}

				.right {
					width: 50%;
					text-align: center;

					.btn {
						margin-bottom: 80px;
					}

					h1 {
						font-size: 38px;
					}

					span {
						font-size: 26px;
					}

					.yd {
						margin-right: 40px;
					}
				}
			}
		}

		.bottom {
			.btRoom {
				.box {
					@include box-style;
					width: 150px;
					height: 100%;
					margin-right: 17px;
				}
			}
		}
	}

</style>
