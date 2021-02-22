<template>
	<el-dialog :visible.sync="visible" title="批量修改密码" :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
			<el-form-item v-model="dataForm.password" placeholder="请选择" label="新密码" prop="password">
				<el-input placeholder="请输入密码" v-model="dataForm.password" show-password show-word-limit></el-input>
			</el-form-item>
			<div class="tip">
				你即将修改<span>{{dataForm.ids.length}}</span>台设备的密码
			</div>
		</el-form>
		<template slot="footer">
			<el-button @click="visible = false">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()" v-loading="loading">{{ $t('confirm') }}</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import debounce from 'lodash/debounce'
	export default {
		name: "accessUpdatepassword",
		data() {
			return {
				visible: false,
				loading: false,
				dataForm: {
					ids: [],
					password: "",
				}
			}
		},
		computed: {
			dataRule() {
				return {
					password: [{
							required: true,
							message: this.$t('validate.required'),
							trigger: 'blur'
						}, {
							min: 5,
							max: 8,
							message: "长度在5到8个字符",
							trigger: "blur"
						},
						{
							validator: (rule, value, callback) => {
								if (value) {
									if (/[^\w\.\/]/ig.test(value)) {
										callback(new Error('请不要输入中文和空格！'));
									} else {
										callback();
									}
								}
								callback();
							},
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			init(params) {
				this.visible = true
				this.dataForm.ids = JSON.parse(params)
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					this.roleIdListDefault = []
				})
			},
			dataFormSubmitHandle: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true
					this.$http.post(`/system/scaidooreight/batchUpatePsw`, this.dataForm).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						return this.$message.success(res.msg)
					}).catch(() => {}).finally(() => {
						this.loading = false
						this.visible = false
					})
				})
			})
		}
	}
</script>

<style scoped lang="scss">
	.tip {
		font-size: 20px;
		color: #FFF;
		font-weight: 600;

		span {
			font-size: 24px;
			color: #C40
		}
	}
</style>
