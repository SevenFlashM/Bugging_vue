 <template>
  <div>
    <el-container class="container">
      <!--左边-->
      <el-aside width="120px">
        <el-container>
          <el-header>
            <span class="system-name">{{systemName}}</span>
          </el-header>
          <el-main class="main">
            <el-menu :collapse="collapsed" :default-active="this.$route.path" router>
              <el-menu-item index="/Project">
              <i class="el-icon-document"></i>
              <span slot="title">项目</span>
              </el-menu-item>
              <el-menu-item index="/Overview">
                <i class="el-icon-menu"></i>
                <span slot="title">总览</span>
              </el-menu-item>
              <el-menu-item index="/Problem">
                <i class="el-icon-question"></i>
                <span slot="title">问题</span>
              </el-menu-item>
              <el-menu-item index="/Statistics">
                <i class="el-icon-document"></i>
                <span slot="title">统计</span>
              </el-menu-item>
              
              <!-- <el-menu-item index="/About">
                <i class="el-icon-info"></i>
                <span slot="title">关于</span>
              </el-menu-item> -->
            </el-menu>
          </el-main>
        </el-container>
      </el-aside>
      <!--内容-->
      <el-container>
        <!--页眉-->
        <el-header class="header">
          <el-row>
            <el-col style="text-align:right">
              <el-dropdown trigger="click">
                <span class="userinfo-inner">{{this.getRoles}}</span>
                <i class="el-icon-caret-bottom" style="color:#FFF;margin-right:20px"></i>
                <el-dropdown-menu slot="dropdown">
                  <router-link class="inlineBlock" to="/">
                    <el-dropdown-item>主页</el-dropdown-item>
                  </router-link>
                  <el-dropdown-item divided>
                    <span style="display:block;" @click="logout">注销</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span style="display:block;width:60px" @click="dialogFormVisible=true">修改密码</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <!--中间-->
        <el-main class="main">
          <transition name="el-fade-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        :model="modifyPass"
        :rules="modifyRules"
        ref="modifyPass"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="旧密码" prop="old">
          <el-input
            type="password"
            v-model="modifyPass.old"
            autocomplete="off"
            style="width:250px"
            placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input
            v-model="modifyPass.newPass"
            autocomplete="off"
            style="width:250px"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码确认" prop="newPassConfirm">
          <el-input
            v-model="modifyPass.newPassConfirm"
            autocomplete="off"
            style="width:250px"
            placeholder="请确认新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buttonCancel">取 消</el-button>
        <el-button type="primary" @click="buttonConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { modify } from "@/api/login";

let data = () => {
  const validatePassword = (rule, value, callback) => {
    if (value.length < 5) {
      callback(new Error("密码不能小于5位"));
    }
    if (!value === this.newPassConfirm) {
      callback(
        this.$message({
          type: "warning",
          message: "两次密码输入不一致，请确认"
        })
      );
    } else {
      callback();
    }
  };
  const confirmPassword = (rule, value, callback) => {
    if (value.length < 5) {
      callback(new Error("密码不能小于5位"));
    }
    if (!value === this.newPass) {
      callback(
        this.$message({
          type: "warning",
          message: "两次密码输入不一致，请确认"
        })
      );
    } else {
      callback();
    }
  };
  return {
    dialogFormVisible: false,
    modifyPass: {
      old: "",
      newPass: "",
      newPassConfirm: ""
    },
    modifyRules: {
      old: [
        { required: true, trigger: "blur", validator: validatePassword },
        { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
      ],
      newPass: [
        { required: true, trigger: "blur", validator: validatePassword },
        { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
      ],
      newPassConfirm: [
        { required: true, trigger: "blur", validator: confirmPassword },
        { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
      ]
    },
    collapsed: false,
    systemName: "Bugging"
  };
};

export default {
  data: data,
  methods: {
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    buttonConfirm() {
      this.$refs["modifyPass"].validate(valid => {
        if (valid) {
          modify(this.getRoles, this.modifyPass.old, this.modifyPass.newPass)
            .then(res => {
              if (res.message === "修改成功") {
                this.$message({
                  type: "success",
                  message: res.message
                });
                this.dialogFormVisible = false;
              }
            })
            .catch(error => {
              this.$message({
                type: "warning",
                message: error
              });
            });
          for (var element in this.modifyPass) {
            this.modifyPass[element] = "";
          }
        } else {
          return false;
        }
      });
    },
    buttonCancel() {
      this.dialogFormVisible = false;
      for (var element in this.modifyPass) {
        this.modifyPass[element] = "";
      }
    }
  },
  computed: {
    getRoles() {
      return this.$store.getters["roles"];
    }
  },
  mounted: function() {}
};
</script>

<style lang="scss" scoped>
$width: 100%;
$height: 100%;
$background-color: #3d4c66;
$header-color: #fff;
$header-height: 60px;

.container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: $width;
  .el-aside {
    .el-header {
      line-height: $header-height;
      background-color: $background-color;
      color: $header-color;
      text-align: center;
      // margin-right:0.5px;
      cursor: pointer;
    }
    .el-container {
      height: $height;
    }
  }

  .main {
    width: $width;
    height: $height;
    padding: 0px;
  }

  .menu-button {
    width: 14px;
    cursor: pointer;
  }

  .userinfo-inner {
    cursor: pointer;
    color: #fff;
  }

  .el-menu {
    height: $height;
  }

  .header {
    background-color: $background-color;
    color: $header-color;
    text-align: center;
    line-height: $header-height;
    padding: 0;
  }

  .system-name {
    font-size: medium;
    font-weight: bold;
  }
}
</style>