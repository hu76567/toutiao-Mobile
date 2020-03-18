<template>
 <div class='container'>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 手机号  验证码  登录按钮 -->
    <van-cell-group>
      <!-- v-model有一个trim修饰符,用于去除空格 -->
      <!-- error-message动态绑定提示信息 -->
      <!-- @blur自动校验用input也可以  -->
      <van-field @blur="checkMobile" :error-message='errorMseeage.mobile' v-model.trim="loginForm.mobile"  label="手机号" placeholder="请输入手机号"></van-field>
      <van-field @blur="checkCode" :error-message='errorMseeage.code' v-model.trim="loginForm.code"  label="验证码" placeholder="请输入验证码">
        <!-- slot指定给哪个坑填内容 -->
        <van-button  slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class='btn-box'>
      <!-- 做表单校验 -->
      <van-button @click="login" type="info" size="small" round block>登录</van-button>
    </div>
  </div>
</template>

<script>
// 引入user中的login方法
import { login } from '@/api/user'
import { mapMutations } from 'vuex' // 把mutations函数映射到methods中
export default {
  data () {
    return {
      // 定义表单数据 然后跟视图绑定
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      errorMseeage: {
        // 定义两个用来提示错误信息的变量
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 把vuex中updateUser方法映射
    checkMobile () {
    // 手机号校验  非空  格式  null 空 undefined取反为true
      if (!this.loginForm.mobile) {
        this.errorMseeage.mobile = '手机号不能为空奥'
        return false // 此轮校验未通过
      }
      // 第二轮 格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 不满足正则的话
        this.errorMseeage.mobile = '手机号格式不对哦'
        return false
      }
      // 经过两轮校验,到达这个位置说明校验通过
      this.errorMseeage.mobile = '' // 通过了不提示消息了
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMseeage.code = '验证码不能为空哦'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMseeage.code = '验证码格式不对哦'
        return false
      }
      // 经过两轮校验,到达这个位置说明校验通过
      this.errorMseeage.mobile = '' // 通过了不提示消息了
      return true
    },
    async login () {
    //  登录校验
      if (this.checkMobile() && this.checkCode()) {
        // console.log('校验通过')
        try {
          // 调用登录方法
          const res = await login(this.loginForm) // 返回的值有token和refresh_token
          this.updateUser({ user: res }) // 更新token 和refreshtoken

          // 判断是否有需要跳转的页面？ 还是直接登录调到主页
          // redirectUrl是否有值
          const { redirectUrl } = this.$route.query // query参数 ?后面的参数
          this.$router.push(redirectUrl || '/') // 短路表达式 前true执行前,前为false执行后
        } catch (error) {
          // 登录不成功的时候  提示消息
          this.$notify({ message: '用户信息不正确,登录失败', duration: 2000 })
        }
      }
    }
  }

}
</script>

<style scoped lang="less">
.btn_box{
  padding: 10px;
}
</style>
