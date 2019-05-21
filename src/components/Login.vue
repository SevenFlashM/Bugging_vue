<template>
  <div id="loginWindow" class="loginPage">
    <h1 class="title">登录</h1>
    <el-form ref="loginUser" :model="loginUser" :rules="loginRules">
      <el-form-item prop="username">
        <el-input v-model="loginUser.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginUser.password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item prop="verify" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
				<el-input v-model="loginUser.verify" placeholder="请输入验证码"></el-input>
      </el-form-item>-->
      <el-form-item class="button-class">
        <el-button type="primary" style="width:45%" @click="reload">重置</el-button>
        <el-button
          type="primary"
          style="margin-left:20px;width:45%"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.loginPage {
  position: absolute;
  top: 10%;
  left: 50%;
  margin-top: 70px;
  margin-left: -175px;
  width: 400px;
  min-height: 300px;
  padding: 0px 20px 20px;
  border-radius: 8px;
  box-sizing: border-box;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.12), 0 0 50px rgba(0, 0, 0, 0.04);
  background-color: white;
}
.button-class {
  padding-top: 20px;
}
.title {
  /* color: red; */
  text-align: center;
}
</style>

<script>
//导入判断用户名方法
// import { isvalidUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginUser: {
        username: "007",
        password: "admin"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
          { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginUser.validate(valid => {
        //如果用户名不为空
        if (valid) {
          this.loading = true;
          //调用store中的actions中的Login方法->Login方法执行mutations中login方法->将账号密码请求发送给后端
          this.$store
            .dispatch("Login", this.loginUser)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reload() {
      this.loginUser.username = "admin";
      this.loginUser.password = "admin";
    }
  }
};
</script>

