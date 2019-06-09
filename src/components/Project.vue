<template>
  <el-container style="background-color:#FFF;height:100%">
    <el-header></el-header>
    <el-main>
      <h1 style="padding-left:5%;color:#999;font-size:16px">
        我所在的项目({{this.allProjects.length}})
        <el-button type="text">新建项目</el-button>
      </h1>
      <el-row>
        <el-col :span="4" v-for="project in this.allProjects" :key="project.id" :offset="2">
          <el-card :body-style="{ padding: '10px' }">
            <img src="@/assets/folder.jpg" class="image">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <p class="show">{{project.projectName}}</p>
                <el-button
                  style="float:left"
                  type="text"
                  class="button"
                  @click.native.prevent="getProjectID(project.projectName)"
                >去此项目</el-button>
                <el-button
                  type="text"
                  class="button"
                  @click.native.prevent="getProjectID(project.projectName)"
                >删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style>
.show {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 5px;
  line-height: 5px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

<script>
import { getInfo } from "@/api/project";
export default {
  data() {
    return {
      currentDate: new Date(),
      allProjects: ""
    };
  },
  methods: {
    getProjectID(priorityName) {
      this.$store
        .dispatch("GetProjectID", priorityName)
        .then(() => {
          this.loading = false;
          this.$router.push({ path: this.redirect || "Overview" });
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  mounted: function() {
    getInfo().then(res => {
      this.allProjects = res.data;
    });
  },
  computed: {
    getRoles() {
      return this.$store.getters["roles"];
    }
  }
};
</script>