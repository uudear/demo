<template>
  <div class="login-wrap">
    <el-form
     ref="loginForm"
     :model="loginForm"
     :rules="formRule"
    >
    <el-form-item
      label="用户名"
      prop="username"
    >
    <el-input
      type="text"
      v-model="loginForm.username"
      auto-complete
    />
    </el-form-item>

    <el-form-item
      label="密码"
      prop="password"
    >
    <el-input
      type="text"
      v-model="loginForm.password"
      auto-complete
    />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitFn">确认</el-button>
      <el-button>重置</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  data () {
    return {
      loginForm: {
        username: 'test_sunyan@qq.com',
        password: '123456'
      }
    }
  },
  computed: {
    formRule () {
      return {
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$http.post('/auth/login', {
            ...this.loginForm,
            uuid: uuidv4()
          }).then(res => {
            this.$store.commit('setToken', res.token)
            this.$router.replace({ path: '/' })
          }).catch(() => {
            this.$message.error('用户名或密码错误')
          })

          // this.$store.dispatch('login')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap{
  width: 320px;
  border: 1px solid #ece2e2;
  border-radius: 6px;
  position: absolute;
  top: 40%;
  right: 200px;
  transform: translateY(-50%);
  padding: 20px 80px;
}
</style>
