<template>
  <nav class="aui-navbar" :class="`aui-navbar--${$store.state.navbarLayoutType}`">
    <div class="aui-navbar__header">
      <h1 class="aui-navbar__brand" @click="$router.push({ name: 'home' })">
        <!-- <a class="aui-navbar__brand-lg" href="javascript:;">{{ $t('brand.lg') }}</a> -->
        <!-- <a class="aui-navbar__brand-mini" href="javascript:;">{{ $t('brand.mini') }}</a> -->
         <a class="aui-navbar__brand-lg" href="javascript:;">
         <!-- <img class="header-logo" src="../assets/img/logo.png" alt="logo">-->
        </a>
        <a class="aui-navbar__brand-mini" href="javascript:;">
          <!--<img class="header-logo" src="../assets/img/logo-small.png" alt="logo">-->
        </a>
      </h1>
    </div>
    <div class="aui-navbar__body">
      <el-menu class="aui-navbar__menu mr-auto" mode="horizontal">
        <el-menu-item index="1" @click="$store.state.sidebarFold = !$store.state.sidebarFold">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--switch" aria-hidden="true"><use xlink:href="#icon-outdent"></use></svg>
        </el-menu-item>
        <el-menu-item index="2" @click="refresh()">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--refresh" aria-hidden="true"><use xlink:href="#icon-sync"></use></svg>
        </el-menu-item>
        <el-menu-item index="2" @click="openindex()">
					<svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--refresh" aria-hidden="true">
						<use xlink:href="#icon-home"></use>
					</svg>
				</el-menu-item>
      </el-menu>
      
      <el-menu class="aui-navbar__menu mr-auto menu-title" mode="horizontal">
				<el-menu-item index="1"  @click="$router.push({ name: 'home' })">
					<span style="font-size: 22px;user-select: none;">{{ $t('brand.lg') }}</span>
				</el-menu-item>
			</el-menu>
      
      <el-menu class="aui-navbar__menu" mode="horizontal">
        <el-menu-item index="1">
          <!-- <el-dropdown placement="bottom" :show-timeout="0">
            <el-button size="mini">{{ $t('_lang') }}</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(val, key) in i18nMessages" :key="key" @click.native="$i18n.locale = key">{{ val._lang }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </el-menu-item>
        <!-- <el-menu-item index="2">
         <a href="//www.renren.io/" target="_blank"> 
            <svg class="icon-svg aui-navbar__icon-menu" aria-hidden="true"><use xlink:href="#icon-earth"></use></svg>
          </a> 
        </el-menu-item> -->
        <!-- <el-menu-item index="4" v-if="$hasPermission('sys:notice:all')">
          <el-badge :is-dot="messageTip">
            <a href="#"  @click="myNoticeRouter()"><i class="el-icon-bell"></i></a>
          </el-badge>
        </el-menu-item> -->
        <!-- <el-menu-item index="3" @click="fullscreenHandle()">
          <svg class="icon-svg aui-navbar__icon-menu" aria-hidden="true"><use xlink:href="#icon-fullscreen"></use></svg>
        </el-menu-item> -->
        <el-menu-item index="4" class="aui-navbar__avatar">
          <el-dropdown placement="bottom" :show-timeout="0">
            <span class="el-dropdown-link">
              <!-- <img src="~@/assets/img/avatar.png"> -->
              <i class="el-icon-s-custom"></i>
              <span>{{ $store.state.user.realName }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$store.state.user.superAdmin!==1" @click.native="updateSelfInfoHandle()">个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="updatePasswordHandle()">{{ $t('updatePassword.title') }}</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    <!-- 弹窗 修改个人信息 -->
    <update-info v-if="updateInfoVisible" ref="updateInfo"></update-info>
  </nav>
</template>

<script>
import { messages } from '@/i18n'
import screenfull from 'screenfull'
import UpdatePassword from './main-navbar-update-password'
import updateInfo from './main-navbar-update-info'
import { clearLoginInfo } from '@/utils'
export default {
  inject: ['refresh'],
  data () {
    return {
      i18nMessages: messages,
      updatePasswordVisible: false, 
      updateInfoVisible:false,
      messageTip: false
    }
  },
  components: {
    UpdatePassword,
    updateInfo
  },
  created () {
    // 未读通知数
    this.getUnReadCount()
  },
  methods: {
    myNoticeRouter () {
      this.$router.replace('sys-notice-user')
    },
    getUnReadCount () {
      this.$http.get(`/sys/notice/mynotice/unread`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (res.data > 0) {
          this.messageTip = true
        }
      }).catch(() => {})
    },
    openindex(){
      if(this.$route.name == 'home'){
				let dom=document.querySelectorAll(".home")[0];
							screenfull.toggle(dom)
				}else{
					this.$router.replace({name:'home'})
				}
				this.$store.commit("SET_FULL_SCREEN",true)
    },
    // 全屏
    fullscreenHandle () {
      if (!screenfull.enabled) {
        return this.$message({
          message: this.$t('fullscreen.prompt'),
          type: 'warning',
          duration: 500
        })
      }
      screenfull.toggle()
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    updateSelfInfoHandle(){
      this.updateInfoVisible=true;
       this.$nextTick(() => {
        this.$refs.updateInfo.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('logout') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.post('/auth/oauth/logout').then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu-title{
    .el-menu-item{
      &:hover{
        background: transparent;
      }
    }
  }
  .aui-navbar__header{
    overflow: hidden;
    .header-logo{
      height: 30px;
      width: auto;
      margin:10px;
    }
  }
</style>