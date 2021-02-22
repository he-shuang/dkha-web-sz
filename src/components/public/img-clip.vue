<template>
	<div class="clip-upload" v-if="!IEVisible">
		<!-- 上传按钮 -->
		<el-button v-show="!viewUrl" class="upload-btn" icon="el-icon-plus">
			<input ref="uploadInput" @change="chooseImg($event)" class="upload-input" type="file" accept="image/jpg" />
		</el-button>

		<!-- <span v-show="!viewUrl" class="tips">格式为jpg/jpeg/png文件，尺寸必须大于{{clipWidth}}px*{{clipHeight}}px，且不超过{{size}}MB</span> -->
		<!-- 裁剪后 预览显示框 -->
		<div v-show="viewUrl" class="upload-preview" v-loading="uploadLoading">
			<img v-if="viewUrl" :src="$ImgServerUrl+viewUrl" alt="预览地址" />
			<p>
				<i class="el-icon-delete" @click="deleteUpload"></i>
			</p>
		</div>

		<!-- 裁剪框 -->
		<el-dialog class="clip-dialog" title="图片裁剪" :visible.sync="clipVisible" width="644px" :modal="false" :show-close="false">
			<div class="vue-cropper-content" :style="{width:'600px',height:'400px'}">
				<div class="alt-button">
					<el-button type="text" icon="el-icon-refresh-left" @click="rotateLeft"></el-button>
					<el-button type="text" icon="el-icon-refresh-right" @click="rotateRight"></el-button>
				</div>
				<vueCropper ref="cropper" :img="option.img" :autoCrop="option.autoCrop" :autoCropWidth="clipWidth" :autoCropHeight="clipHeight"
				 :outputSize="option.outputSize" outputType="jpeg" :fixed="option.fixed" :fixedNumber="fixedNumber"
				 :fixedBox="option.fixedBox"></vueCropper>
			</div>
			<div class="alt-button">
				<br>
				<el-button @click="cancelClip">取消</el-button>
				<el-button type="primary" @click="clipImg">确认</el-button>
			</div>
		</el-dialog>
	</div>
	<div v-else class="clip-upload">
		<span class="error-tips">检测到当前浏览器版本较低</span><br>
		请使用<span class="error-tips">360浏览器极速模式</span>或使用<span class="error-tips">chrome</span>浏览器等其它高级浏览器
	</div>
</template>
<script>
	import {
		VueCropper
	} from "vue-cropper";

	export default {
		components: {
			VueCropper
		},
		props: {
			folderName: {
				type: String,
				default: "student"
			},
			// 裁剪区域宽度
			clipWidth: {
				type: Number,
				default: 400
			},
			// 裁剪区域高度
			clipHeight: {
				type: Number,
				default: 600
			},
			// 限制图片上传大小
			size: {
				type: Number,
				default: 0.4
			},
			// 初始化  显示图片路劲
			value: {
				type: String,
				default: ""
			},
			// 固定比例裁剪
			fixedNumber: {
				type: Array,
				default: () => [2, 3]
			}
		},
		watch: {
			value(val) {
				// 不为空  切不相等  更新
				if (val) {
					this.viewUrl = val;
				} else {
					this.viewUrl = "";
				}
			}
		},
		data() {
			return {
				IEVisible: false,
				previewVisible: false, //预览图
				uploadLoading: false, //正在上传
				viewUrl: null, //裁剪图url
				clipVisible: false, //显示裁剪区域
				option: {
					img: "", //裁剪图片的地址
					outputType: "jpg", //生成的图片格式
					outputSize: 1, //图片质量0-1
					autoCrop: true, //默认生成截图框
					// autoCropWidth: 200, //默认生成截图框宽度
					// autoCropHeight: 200, //默认生成截图框高度
					fixed: true, //固定截图
					// fixedNumber: [1, 1], //固定截图比例
					fixedBox: true //固定截图框大小 不允许改变
				},
				fileName: "",
				uploadInfo: ""
			};
		},
		created() {
			this.IEVersion();
		},
		methods: {
			init(fiveUrl) {
				this.viewUrl = fiveUrl
			},
			// 选择图片
			chooseImg(e) {
				const files = e.target.files;
				const file = e.target.files[0];

				if (!file.name.includes(".jpg")) {
					this.$message.warning("仅支持.jpg格式的图片");
					return false;
				}
				// 默认限制20MB 以内的图片
				if (file.size > 1024 * 1024 * 20) {
					this.$message.warning("请上传小于20MB的图片");
					return false;
				}

				let formFile = new FormData();
				formFile.append("file", file);
				// staff  职工    student 学生
				formFile.append("folderName", this.folderName);

				this.$http({
						url: window.SITE_CONFIG['apiURL'] + '/system/upload',
						method: "post",
						data: formFile
					})
					.then(({
						data: res
					}) => {
						if (res && res.code === 0) {
							this.$message.success("原图上传成功");
							sessionStorage.setItem("eightPic", res.data.path)
							// 接下来原图处理成5寸门禁需要的
							this.setOutputSize(file.size);
							this.fileName = file.name;
							this.option.img = this.getObjectURL(file);
							this.clipVisible = true;
							this.viewUrl = null;
							this.$refs.uploadInput.value = null;
						} else if (res.msg) {
							this.$message.error(res.msg);
							this.deleteUpload();
						}
					})
					.catch(err => {
						this.deleteUpload();
					})
					.finally(() => {
						this.uploadLoading = false;
					});
			},
			// 裁剪
			clipImg() {
				this.$refs.cropper.getCropData(data => {
					// do something
					// var len = this.calcBase64(data);
					this.viewUrl = data;
					this.clipVisible = false;
					// 上传图片
					this.uploadImg(data);
				});
			},
			// 左旋
			rotateLeft() {
				this.$refs.cropper.rotateLeft();
			},
			// 右旋
			rotateRight() {
				this.$refs.cropper.rotateRight();
			},
			// 删除图片
			deleteUpload() {
				this.fileName = "";
				this.uploadInfo = "";
				this.$emit("input", "");
				this.viewUrl = null;
			},
			//将base64转换为文件
			dataURLtoFile(dataurl, filename) {
				var arr = dataurl.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime
				});
			},
			// 上传图片
			uploadImg(data) {
				var fileObj = this.dataURLtoFile(data, "five" + new Date().getTime() + this.fileName);
				var formFile = new FormData();
				formFile.append("file", fileObj);
				// staff  职工    student 学生
				formFile.append("folderName", this.folderName);
				this.uploadLoading = true;
				this.uploadInfo = "上传中";
				this.$http({
						url: window.SITE_CONFIG['apiURL'] + '/system/upload',
						method: "post",
						data: formFile
					})
					.then(({
						data: res
					}) => {
						if (res && res.code === 0) {
							this.$message.success("上传成功");
							this.$emit("input", res.data.path);
						} else if (res.msg) {
							this.$message.error(res.msg);
							this.deleteUpload();
						}
					})
					.catch(err => {
						this.deleteUpload();
					})
					.finally(() => {
						this.uploadLoading = false;
					});
			},
			// 取消上传
			cancelClip() {
				this.clipVisible = false;
			},
			//计算base64   文件大小
			calcBase64(baseStr) {
				let tag = "base64,";
				baseStr = baseStr.substring(baseStr.indexOf(tag) + tag.length);
				let eqTagIndex = baseStr.indexOf("=");
				baseStr = eqTagIndex != -1 ? baseStr.substring(0, eqTagIndex) : baseStr;
				let strLen = baseStr.length;
				let fileSize = strLen - (strLen / 8) * 2;
				return fileSize / 1024 / 1024;
			},
			// 获取本地图片上传路径
			getObjectURL(file) {
				var url = null;
				if (window.createObjectURL != undefined) {
					// basic
					url = window.createObjectURL(file);
				} else if (window.URL != undefined) {
					// mozilla(firefox)
					url = window.URL.createObjectURL(file);
				} else if (window.webkitURL != undefined) {
					// webkit or chrome
					url = window.webkitURL.createObjectURL(file);
				}
				return url;
			},
			// 设置图片质量  压缩比
			setOutputSize(size) {
				let result = 1;
				if (size / 1024 / 1024 > this.size) {
					result = ((this.size * 1024 * 1024) / size).toFixed(2);
				}
				console.log("当前压缩率：", result);
				this.option.outputSize = Number(result);
			},
			IEVersion() {
				// 取得浏览器的userAgent字符串
				var userAgent = navigator.userAgent;
				// 判断是否为小于IE11的浏览器
				var isLessIE11 = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
				if (isLessIE11) {
					this.IEVisible = true;
				}
			}
		}
	};
</script>
<style lang="scss">
	.clip-upload {
		.error-tips {
			color: #ea0029;
		}

		img {
			max-width: 100%;
			display: block;
			margin: 0 auto;
		}

		.tips {
			color: #b4b4b4;
		}

		.upload-btn {
			position: relative;
			font-size: 22px;
			color: #fff;
			height: 150px;
			width: 106px;
			line-height: 150px;
			text-align: center;
			border: dashed 1px #fff;
			background: transparent;
			margin-left: 20px;

			.el-icon-plus {
				vertical-align: middle;
				margin-top: -24px;
			}

			.upload-input {
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				opacity: 0;
				width: 110px;
			}
		}

		.upload-preview {
			position: relative;
			color: #fff;
			height: 150px;
			width: 106px;
			line-height: 150px;
			text-align: center;
			border: dashed 1px #fff;
			background: transparent;
			overflow: hidden;
			border-radius: 4px;
			margin-left: 20px;

			&:hover {
				p {
					display: block;
				}
			}

			img {
				width: 106px;
				height: 150px;
				object-fit: contain;
				display: block;
				margin: 0 auto;
			}

			p {
				display: none;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(20, 20, 20, 0.3);
				text-align: center;
				font-size: 20px;
				color: #fff;
				line-height: 120px;

				i {
					margin: 0 5px;
					cursor: pointer;
				}
			}

			.upload-info {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				text-align: center;
				font-size: 14px;
				line-height: 30px;
				z-index: 10;
				color: #fff;
				background: rgba(20, 20, 20, 0.3);
			}
		}

		.vue-cropper-content {
			width: 800px;
			height: 800px;
			margin-bottom: 20px;
		}

		.alt-button {
			text-align: center;

			.el-button {
				width: auto;

				&.el-button--text {
					font-size: 24px;
					padding: 0;
					margin: 0 15px;
				}
			}
		}
	}

	.clip-dialog {
		.el-dialog__body {
			padding-top: 0;
		}
	}
</style>
