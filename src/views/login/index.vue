<template>
  <div class="login-container">
    <div class="loginForm">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <img src="@/assets/common/logo.png" alt="" class="login-logo">
        </div>
        <!-- 账号 -->
        <el-form-item prop="loginName">
          <span class="svg-container iconfont icon-shouji">
            <!-- <svg-icon icon-class="user" /> -->
          </span>
          <el-input
            ref="loginName"
            v-model.trim="loginForm.loginName"
            placeholder="请输入账号"
            name="loginName"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <span class="svg-container iconfont icon-mima" />
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <span class="svg-container iconfont icon-yanzhengma2" />
          <el-input
            v-model.trim="loginForm.code"
            placeholder="请输入验证码"
            name="code"
            tabindex="3"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="code" @click="updateCode">
            <img :src="codeUrl" alt="">
          </span>

        </el-form-item>
        <!-- 登录按钮 -->
        <el-button :loading="loading" class="login-btn" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      </el-form>
      <el-alert
        v-if="errShow"
        class="err-tip"
        title="验证码错误"
        type="error"
        show-icon
      />
    </div>

  </div>
</template>

<script>
import { valiCodeAPI } from '@/api/valiCode'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        loginName: 'admin',
        password: 'admin',
        code: '',
        clientToken: 0,
        loginType: 0
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      codeUrl: '',
      loading: false,
      errShow: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.valiCode()
  },
  methods: {
    async  valiCode() {
      this.loginForm.clientToken = Math.floor(Math.random() * 16 + 1)
      const res = await valiCodeAPI(this.loginForm.clientToken)
      this.codeUrl = res.request.responseURL
    },
    updateCode() {
      this.valiCode()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loading = true
        await this.$store.dispatch('user/loginAction', this.loginForm)
        if (this.$store.state.user.msg === '登录成功') {
          console.log(111)
          this.$router.push('/dashboard')
        } else {
          this.errShow = true
          setTimeout(() => {
            this.errShow = false
          }, 2000)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#999;
$cursor: #999;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/background.png');
  background-position: center;
  .loginForm{
    position: absolute;
    width: 518px;
    height: 388px;
    top: 50%;
    left: 50%;
    margin-top: -194px;
    margin-left: -259px;
    padding: 76px 35px 0;
    background: #fff;
    -webkit-box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    border-radius: 10px;
    .login-logo{
    display: block;
    position: absolute;
    width: 96px;
    height: 96px;
    top: -120px;
    left: 50%;
    margin-left: -48px;
    }
  }
  .err-tip{
    position: fixed;
    top:20px;
    left: 35%;
    width: 50%;
  }
  .el-alert {
    width: 30%;
    height: 50px;
    .el-alert__closebtn{
      top:20px
    }
    }
  .code{
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    user-select: none;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    width: 100%;
    height: 52px;
    margin-bottom: 24px;
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }
  .login-btn{
    width: 100%;
    height: 52px;
    background: linear-gradient(262deg,#2e50e1,#6878f0);
    opacity: .91;
    border-radius: 8px;
    color: #fff;
    text-shadow: 0 7px 22px #cfcfcf;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 518px;
    height: 388px;
    top: 50%;
    left: 50%;
    margin-top: -194px;
    margin-left: -259px;
    padding: 76px 35px 0;
    background: #fff;
    -webkit-box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
