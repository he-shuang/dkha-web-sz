<template>
  <el-dialog
    :visible.sync="visible"
    title="修改个人信息"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item prop="realName" :label="$t('user.realName')">
        <el-input v-model="dataForm.realName"  :placeholder="$t('user.realName')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="联系电话">
        <el-input v-model="dataForm.mobile"  :placeholder="$t('user.mobile')"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="dataForm.email"  :placeholder="$t('user.email')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" v-loading="loading" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { isEmail, isMobile } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      loading:false,
      roleList: [],
      roleIdListDefault: [],
      dataForm: {
        realName: '',
        mobile: '',
        email: ''
      }
    }
  },
  computed: {
    dataRule () {
       var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
        }
        callback()
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
        }
        callback()
      }
      return {
        realName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: isEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: isMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.dataForm.id=this.$store.state.user.id;
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        this.roleIdListDefault = [];
          Promise.all([
            this.getRoleList()
            ]).then(() => {
              if (this.dataForm.id) {
                this.getInfo()
              }
            })
      })
    },
     // 获取角色列表
    getRoleList () {
      return this.$http.get('/sys/role/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.roleList = res.data
      }).catch(() => {})
    },
    getInfo(){
       this.$http.get(`/sys/user/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data,
          roleIdList: []
        }
        // 角色配置, 区分是否为默认角色
        for (var i = 0; i < res.data.roleIdList.length; i++) {
          if (this.roleList.filter(item => item.id === res.data.roleIdList[i])[0]) {
            this.dataForm.roleIdList.push(res.data.roleIdList[i])
            continue
          }
          this.roleIdListDefault.push(res.data.roleIdList[i])
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading=true;
        this.$http['put']('/sys/user', {
          ...this.dataForm,
          roleIdList: [
            ...this.dataForm.roleIdList,
            ...this.roleIdListDefault
          ]
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        })
        .finally(()=>{
          this.loading=true;
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
