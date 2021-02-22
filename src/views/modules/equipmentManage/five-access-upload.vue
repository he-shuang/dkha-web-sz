<template>
	<el-dialog :visible.sync="visible" :title="$t('oss.upload')" :close-on-click-modal="false" :close-on-press-escape="false"
	 :append-to-body=true>
		<el-upload name="file" :action="url" :file-list="fileList" drag multiple :before-upload="beforeUploadHandle"
		 :on-success="successHandle" class="text-center" :headers="headers">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text" v-html="$t('upload.text')"></div>
			<div class="el-upload__tip" slot="tip">{{ $t('upload.tip', { 'format': 'jpg、png' }) }}</div>
		</el-upload>
	</el-dialog>
</template>

<script>
	import Cookies from 'js-cookie'
	export default {
		data() {
			return {
				visible: false,
				url: '',
				fileList: [],
				headers: {
					Authorization: 'Bearer ' + Cookies.get('access_token') || ''
				}
			}
		},
		methods: {
			init(id) {
				this.visible = true
				this.url =
					`${window.SITE_CONFIG['apiURL']}/system/fvscdevice/setUpScree`
				this.fileList = []
			},
			// 上传之前
			beforeUploadHandle(file) {
				if (!/.+\.jpg$/.test(file.name) && !/.+\.png$/.test(file.name)) {
					this.$message.error(this.$t('upload.tip', {
						'format': 'jpg、png'
					}))
					return false
				}
			},
			// 上传成功
			successHandle(res, file, fileList) {
				if (res.code !== 0) {
					return this.$message.error(res.msg)
				}
				this.$message({
					message: this.$t('prompt.success'),
					type: 'success',
					duration: 500,
					onClose: () => {
						this.visible = false
					}
				})
			}
		}
	}
</script>
