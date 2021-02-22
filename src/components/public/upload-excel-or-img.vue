<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    :close-on-click-modal="false"
    @close="clearFileList"
  >
    <div>
      <el-upload
        ref="upload"
        class="upload-demo"
        :accept="accept"
        :action="baseUrl+uploadUrl"
        :headers="uploadHeaders"
        :on-success="handleSuccess"
		:before-upload="beforeUpload"
        multiple
        :file-list="fileList"
      >
        <el-button size="small" type="primary" ref="uploadBtn">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          {{tips}}
          <a v-if="templateUrl" target="_blank" download :href="templateUrl">下载模板</a>
        </div>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script>
	import Cookies from 'js-cookie'
	export default {
		props: {
			accept: {
				type: String,
				default: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			},
			uploadUrl: {
				type: String,
				default: null
			},
			title: {
				type: String,
				default: "导入信息"
			},
			tips: {
				type: String,
				default: "只能上传excel文件"
			},
			templateUrl: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				dialogVisible: false,
				fileList: [],
				uploadHeaders: {},
				count:0,
				errorList:[],
				baseUrl: window.SITE_CONFIG['apiURL']
			}
		},
		created() {
			this.uploadHeaders = {
				Authorization: 'Bearer ' + Cookies.get('access_token') || ''
			}
		},
		methods: {
			init() {
				this.dialogVisible = true;
				// this.$nextTick(()=>{
				//     this.$refs['uploadBtn'].$el.click();
				// })
			},
			beforeUpload(file){
				this.count++;
				return true
			},
			handleSuccess(res) {
				this.count--;
				if (res.code != 0) {
					// this.$message({
					// 	type: "error",
					// 	showClose: true,
					// 	duration: 0,
					// 	message: res.msg
					// })
					this.errorList.push(res.msg)
				} 
				// 上传完后提示 上传完成信息
				if(this.count==0){
					if(this.errorList.length==0){
						this.$message({
							type:"success",
							message:"上传完成"
						})
					}
					else{
						// for(let i=0;i<this.errorList.length;i++){
						// 	this.$message({
						// 		type: "error",
						// 		showClose: true,
						// 		duration: 0,
						// 		message: this.errorList[i]
						// 	})
						// }
						 this.$notify({
							type:"error",
							title: '上传失败',
							dangerouslyUseHTMLString:true,
							message: this.errorList.join("<br>"),
							duration: 0
						});
						// 置空错误列表
						this.errorList=[]
					}

				}
			},
			clearFileList(){
				this.$refs['upload'].clearFiles();
				if(this.$parent.$parent.search){
					this.$parent.$parent.search()
				}
				else{
					this.$parent.$parent.resetForm("ruleForm")
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-row {
    color: #fff;
    line-height: 35px;

    .el-col-3 {
      text-align: right;
    }

    .student-img {
      width: 106px;
      height: 150px;
    }
  }
}
</style>
