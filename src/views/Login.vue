<template>
  <div class="login-container">
    <Card class="login-card">
      <div slot="title">登录</div>
      <Form :model="loginForm" :rules="loginFormRule" ref="loginForm" :status-icon="true">
        <FormItem label="用户名" prop="userName">
          <Input v-model="loginForm.userName" prefix="md-contact" placeholder="请输入用户名" ref="username"
            :maxlength="40">
          <!-- eslint-disable-next-line vue/no-parsing-error -->
          </Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="loginForm.password" prefix="md-lock" placeholder="请输入密码" type="password"
            :maxlength="40">
          <!-- eslint-disable-next-line vue/no-parsing-error -->
          </Input>
        </FormItem>
      </Form>
      <Button type="primary" shape="circle" long @click="login">登 录</Button>
    </Card>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { web } from '@/config'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginFormRule: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginForm.validate((success) => {
        if (success) {
          this.$http.request({
            method: 'post',
            url: '/api/login',
            data: {
              userName: this.loginForm.userName,
              password: md5(this.loginForm.password)
            }
          }).then((res) => {
            if (res.data.data) {
              sessionStorage.setItem('account', JSON.stringify(res.data.data))
              this.$store.commit('account', res.data.data)
              setTimeout(() => {
                location.href = web
              }, 500)
            }
          })
        }
      })
    }
  }
}
</script>
