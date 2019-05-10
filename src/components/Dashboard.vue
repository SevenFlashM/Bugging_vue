 <template>
  <el-container class="container">
    <!--左边-->
    <el-aside width="120px">
      <el-container>
        <el-header>
          <span class="system-name">{{systemName}}</span>
        </el-header>
        <el-main class="main">
          <el-menu :collapse="collapsed" :default-active="this.$route.path" router>
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
            <el-menu-item index="/About">
              <i class="el-icon-info"></i>
              <span slot="title">关于</span>
            </el-menu-item>
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
              <span class="userinfo-inner">{{roles}}</span>
              <i class="el-icon-caret-bottom" style="color:#FFF;margin-right:20px"></i>
              <el-dropdown-menu slot="dropdown">
                <router-link class="inlineBlock" to="/">
                  <el-dropdown-item>Home</el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout">LogOut</span>
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
</template>

<script>
import { mapGetters } from "vuex";

let data = () => {
  return {
    collapsed: false,
    systemName: "Bugging",
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
  },
  computed: {
    ...mapGetters(["roles"])
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