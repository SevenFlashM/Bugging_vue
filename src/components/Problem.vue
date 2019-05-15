<!-- 问题详情模板 -->
<template id="problem-template">
  <el-container class="container">
    <el-aside width="150px">
      <el-menu router :default-active="this.$route.path" text-color="#929395">
        <el-menu-item index="/Problem/All">
          <template slot="title">
            <i class="el-icon-message"></i>全部问题
          </template>
        </el-menu-item>
        <el-menu-item index="/Problem/ToSolve">
          <i class="el-icon-message"></i>
          <span slot="title">待我解决</span>
        </el-menu-item>
        <el-menu-item index="/Problem/Mine">
          <i class="el-icon-message"></i>
          <span slot="title">指派给我的</span>
        </el-menu-item>
        <el-menu-item index="/Problem/Create">
          <i class="el-icon-message"></i>
          <span slot="title">我创建的</span>
        </el-menu-item>
        <el-menu-item index="/Problem/Distr">
          <i class="el-icon-message"></i>
          <span slot="title">我分配的</span>
        </el-menu-item>
        <el-menu-item index="/Problem/Unsolve">
          <i class="el-icon-message"></i>
          <span slot="title">未关闭的问题</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>
<script>
export default {
  methods: {},
  mounter: function() {}
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  .el-main {
    padding: 10px;
  }
  .el-menu {
    position: fixed;
    width: 150px;
    height: 100%;
  }
  .el-menu-item {
    font-size: 13px;
  }
}
</style>
