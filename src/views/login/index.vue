<template>
  <div class="login">
    登陆页面

    <!-- 导航栏 -->
    <van-nav-bar title="标题" />
    <!-- 登陆表单 -->
    <ValidationObserver ref="loginForm">
      <van-cell-group>
      <ValidationProvider name="手机号" rules="required" v-slot="{ errors }">
       <van-field
        v-model="user.mobile"
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
        :error-message="errors[0]"
      />
      </ValidationProvider>
    <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
        <van-field v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required  :error-message="errors[0]"/>
      </ValidationProvider>
      </van-cell-group>
    </ValidationObserver>
    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button @click="onLogin" type="info" class="btn">登录</van-button>
    </div>

  </div>
</template>

<script>
import { login } from '@/api/user'
import { setItem } from '@/utils/storage'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15001230123', // 手机号
        code: '246810'// 验证码
      }
    }
  },
  methods: {
    async  onLogin () {
      // 表单验证
      const isValid = await this.$refs.loginForm.validate()
      if (!isValid) {
        return
      }
      // 验证通过，loading请求
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中'

      })

      try {
        // 请求提交表单数据
        const { data } = await login(this.user)
        console.log(data)
        // 先清除loading
        toast.clear()

        // 登录成功，将数据存储到容器中
        this.$store.commit('setUser', data.data)
        // 为了防止页面书信数据丢失，将数据存到本地数据
        setItem('user', data.data)

        this.$toast.success('登陆成功')

        // 跳转到之前的页面或首页
        this.$router.push(this.$route.query.redirect || '/')
      // 根据响应结果处理错误
      } catch (err) {
        toast.clear()
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登陆失败，手机或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  .btn-wrap{
    padding: 20px;
    .btn{
      width: 100%;
      background-color: #6db4fb;
      color: #fff;
    }
  }

}
</style>>
