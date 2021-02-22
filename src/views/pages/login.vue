<template>
	<div class="aui-wrapper aui-page__login">
		<div class="aui-content__wrapper">
			<main class="aui-content">
				<!--<img class="logo" src="../../assets/img/logo.png" alt="logo">-->
				<div class="login-header">
					<!--<h2 class="login-brand"><img src="../../assets/img/login-title.png" alt="title"></h2>-->
				</div>
				<div class="login-body">
					<!-- <h3 class="login-title">{{ $t('login.title') }}</h3> -->
					<el-form :model="dataForm" :rules="dataRule" inline ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
					 status-icon>
						<el-form-item prop="username">
							<!-- 用户接收chrome自动填充  避免input背景色不透明 start-->
							<input type="text" name="username" style="display:none" />
							<input type="password" name="password" style="display:none" />
							<!-- 用户接收chrome自动填充  避免input背景色不透明 end-->
							<el-input v-model="dataForm.username" @keypress="detectCapsLock($event)" :placeholder="$t('login.username')"
							 auto-complete="new-password">
								<span slot="prefix" class="el-input__icon">
									<svg class="icon-svg" aria-hidden="true">
										<use xlink:href="#icon-user" />
									</svg>
								</span>
							</el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')" auto-complete="new-password">
								<span slot="prefix" class="el-input__icon">
									<svg class="icon-svg" aria-hidden="true">
										<use xlink:href="#icon-lock" />
									</svg>
								</span>
							</el-input>
						</el-form-item>
						<el-form-item prop="captcha">
							<el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
								<span slot="prefix" class="el-input__icon">
									<svg class="icon-svg" aria-hidden="true">
										<use xlink:href="#icon-safetycertificate" />
									</svg>
								</span>
							</el-input>
						</el-form-item>
						<el-form-item>
							<img class="login-captcha" :src="captchaPath" @click="getCaptcha()" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-loading="loading" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="login-footer">
					<!-- <p>
						<a href="https://demo.cloud.renren.io/renren-cloud" target="_blank">{{ $t('login.demo') }}</a>
					</p> -->
					<p>版本号 © V1.0</p>
				</div>

			</main>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie'
	import debounce from 'lodash/debounce'
	import {
		messages
	} from '@/i18n'
	import {
		getUUID,
		clearLoginInfo
	} from '@/utils'
	import ajax from '@/utils/login'
	export default {
		data() {
			return {
				i18nMessages: messages,
				loading: false,
				captchaPath: '',
				dataForm: {
					username: '',
					password: '',
					uuid: '',
					captcha: '',
					grant_type: 'password'
				}
			}
		},
		computed: {
			dataRule() {
				return {
					username: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}],
					captcha: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			this.getCaptcha()
		},
		methods: {
			// 获取验证码
			getCaptcha() {
				this.dataForm.uuid = getUUID()
				this.captchaPath = `${window.SITE_CONFIG['apiURL']}/auth/captcha?uuid=${this.dataForm.uuid}`
			},
			loginSelf() {
				return new Promise((resolve, reject) => {
					this.$http.post('/auth/oauth/token', this.dataForm, {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
						}
					}).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							reject(res.msg)
							this.getCaptcha()
						}
						resolve('success')
						Cookies.set('access_token', res.access_token)
					}).catch(err => {
						reject(err.response.data)
					})
				})
			},
			login3dSystem() {
				return new Promise((resolve, reject) => {
					ajax({
						url: "/map/account/token",
						method: "post",
						headers: {
							'Authorization': ''
						},
						data: {
							loginName: this.dataForm.username,
							password: this.dataForm.password
						}
					}).then(({
						data: res
					}) => {
						if (res.status != 200) {
							reject(res.result)
						}
						resolve('success')
						Cookies.set('token', res.result.token)
					}).catch(err => {
						reject(err.data.msg)
					})
				})
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.loading = true;
					// this.login3dSystem()
					// 两个系统全部登录成功后 进入系统 ,this.login3dSystem()
					Promise.all(process.env.NODE_ENV === "development" ? [this.loginSelf()] : [this.loginSelf(), this.login3dSystem()])
						.then(result => {
							this.$router.replace({
								name: 'home'
							})
						}).catch(err => {
							clearLoginInfo()
							console.error(err)
							if (err.indexOf("Service") >= 0) {
								this.$message.error("系统升级中，请耐心等待！")
							} else {
								this.$message.error(err)
							}
						}).finally(() => {
							this.loading = false
						})
				})
			},
		}
	}
</script>
<style lang="scss">
	body {
		.aui-page__login {
			background-size: 100% 100%;
			padding: 0;

			&::before {
				/*background: url('../../assets/img/login-bg.jpg') left top no-repeat;*/
				background-size: 100% 100%;
			}

			.logo {
				position: absolute;
				left: 30px;
				top: 30px;
			}

			.aui-content {
				// justify-content: flex-end;
				align-items: flex-end;

				.login-header {
					text-align: center;
					display: block;
					margin: 0 auto;
					z-index: 2;

					.login-brand {
						font-size: 40px;
						font-weight: bold;
						letter-spacing: 10px;
						background-image: -webkit-linear-gradient(top, #F4FDFE, #73EDFD, #05E2FF);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}

				.login-body {
					z-index: 2;
					width: auto;
					text-align: left;
					background: transparent;
					margin: 0 auto;
					padding: 50px 30px;
					box-shadow: 0px 0px 20px rgba($color: #00bff6, $alpha: 0.5) inset;
					border: 1px solid rgba($color: #00bff6, $alpha: 0.5);

					.login-title {
						color: #00bff6;
						text-align: center;
						font-size: 26px;
						letter-spacing: 5px;
						margin: 15px 0 35px 0;
					}

					.el-form {
						.el-form-item {
							margin-bottom: 0;
							margin-right: 20px;

							.login-captcha {
								height: 40px;
								width: auto;
								display: block;
							}

							&.user-record {
								text-align: left;
								color: #fff;

								.el-checkbox {
									.el-checkbox__label {
										color: #fff;
									}

									.el-checkbox__inner {
										border-color: rgba($color: #fff, $alpha: 0.2);
										background: rgba($color: #fff, $alpha: 0.2);
										box-shadow: 0px 0px 55px rgba($color: #fff, $alpha: 0.2) inset;
									}
								}

								.el-button {
									float: right;
									color: #fff;
								}
							}

							.el-input {
								width: 220px;

								img {
									width: 18px;
									height: 18px;
									vertical-align: top;
									margin-top: 8px;
									margin-left: 15px;
								}

								.el-input__inner {
									color: #fff;
									padding-left: 45px;
									border-radius: 5px;
									border-color: transparent !important;
									background: rgba($color: #fff, $alpha: 0.2) !important;

									// box-shadow: 0px 0px 10px rgba($color: #fff, $alpha: 0.2) inset;
									&:-webkit-autofill {
										-webkit-box-shadow: 0 0 0 1000px rgba($color: #fff, $alpha: 0.3) inset;
									}

									&::-webkit-input-placeholder {
										color: #fff;
									}
								}

								.el-input__icon {
									color: #fff;
									font-size: 20px;
									line-height: 38px;
									vertical-align: top;
								}
							}

							.el-button--primary {
								background: #0ba1f8;
								letter-spacing: 5px;
								font-size: 16px;
								height: 40px;
							}
						}
					}
				}

				video {
					position: fixed;
					-webkit-filter: grayscale(20%);
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					z-index: 1;
					object-fit: cover;
				}
			}
		}
	}
</style>
