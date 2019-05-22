<template id="overview-template">
  <div>
    <el-container class="container">
      <el-main>
        <el-row :gutter="10">
          <el-col style="width:25%">
            <div class="info-shadow" style="height: 380px;">
              <p>与我相关的缺陷</p>
              <div>
                <dl>
                  <dt>{{create}}</dt>
                  <dd>我创建的</dd>
                </dl>
                <dl>
                  <dt>{{trace}}</dt>
                  <dd>我跟踪的</dd>
                </dl>
                <dl>
                  <dt>{{handle}}</dt>
                  <dd>处理中的</dd>
                </dl>
                <dl>
                  <dt>{{belongToMe}}</dt>
                  <dd>指派给我的</dd>
                </dl>
              </div>
            </div>
          </el-col>
          <el-col style="width:75%">
            <div class="info-shadow" style="height: 380px;">
              <p>任务分布</p>
              <el-row>
                <el-col id="myCircle" style="height:310px;width:50%"></el-col>
                <el-col id="allCircle" style="height:310px;width:50%"></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col style="width:25%">
            <div class="info-shadow" style="height: 450px;">
              <p>
                <b>成员</b>
                <i
                  class="el-icon-plus"
                  style="margin-left:75%;cursor:pointer;color:blue"
                  @click="AddUser"
                ></i>
              </p>
              <div>
                <p
                  v-for="user in this.userList"
                  :key="user.id"
                  style="color:#999;font-size:13px"
                >{{user.username}}</p>
              </div>
            </div>
          </el-col>
          <el-col style="width:75%">
            <div class="info-shadow" style="height: 450px;">
              <p>历史记录</p>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="300px">
      <el-form :model="addUserModel" :rules="addUserRules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserModel.username" autocomplete="off" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="buttonConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  .el-main {
    padding-left: 10px;
    padding-top: 0px;
  }
  .el-progress {
    margin-left: 10%;
  }
  .info-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #ffffff;
  }
  p {
    width: 100%;
    height: 15px;
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(23, 43, 77, 1);
    padding-left: 20px;
    padding-top: 15px;
  }
  dl {
    width: 40%;
    float: left;
    margin-left: 20px;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 40px;
    cursor: pointer;
  }

  dt {
    font-size: 40px;
    font-family: San Francisco UI;
    font-weight: 400;
    color: #67c23a;
  }
  dd {
    font-size: 13px;
    font-family: San Francisco UI;
    font-weight: 400;
    color: rgba(168, 172, 185, 1);
    -webkit-margin-start: 0px;
  }
}
</style>

<script>
// require("../../mock/pie");
import { mapGetters } from "vuex";
import {
  initStatistic,
  initMyChart,
  initAllChart,
  addUser,
  getUser
} from "@/api/overview";

//获取echarts
var echarts = require("echarts");

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    return {
      create: "",
      trace: "",
      handle: "",
      belongToMe: "",
      myChartData: [],
      allChartData: [],
      roles: "",
      dialogFormVisible: false,
      addUserModel: {
        username: ""
      },
      addUserRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ]
      },
      userList: ""
    };
  },
  methods: {
    AddUser() {
      this.dialogFormVisible = true;
    },
    buttonConfirm() {
      this.$refs["addUserForm"].validate(valid => {
        if (valid) {
          addUser(this.addUserModel.username)
            .then(res => {
              if (res.data === true) {
                this.$message({
                  type: "success",
                  message: "新增用户成功!"
                });
                this.dialogFormVisible = false;
              }
            })
            .catch(error => {
              this.$Message.error(error.message);
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    //初始化我的任务饼状图
    initCharOfMy(tableData) {
      var myCircle = echarts.init(document.getElementById("myCircle"));
      myCircle.setOption({
        roseType: "angle",
        title: {
          text: "与我相关",
          left: "center",
          bottom: 0,
          textStyle: {
            fontSize: "14",
            fontWeight: "normal",
            color: "gray"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        visualMap: {
          // 不显示 visualMap 组件，只用于明暗度的映射
          show: false,
          // 映射的最小值为 80
          min: 80,
          // 映射的最大值为 600
          max: 600,
          inRange: {
            // 明暗度的范围是 0 到 1
            // colorLightness: [0, 1]
          }
        },
        toolbox: {
          right: "10%",
          //工具栏显示
          show: true,
          feature: {
            // mark: { show: true },
            // dataView: { show: true, readOnly: true },
            // magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            // restore: { show: true },
            // saveAsImage: { show: true }
            dataView: { show: true, readOnly: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: "与我相关",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["50%", "50%"],
            data: tableData
          }
        ]
      });
    },
    //初始化全部任务饼状图
    initCharOfAll(tableData) {
      var allCircle = echarts.init(document.getElementById("allCircle"));
      allCircle.setOption({
        roseType: "angle",
        title: {
          text: "所有缺陷",
          left: "center",
          bottom: 0,
          textStyle: {
            fontSize: "14",
            fontWeight: "normal",
            color: "gray"
          }
        },
        tooltip: {
          //根据series的name来进行显示
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        visualMap: {
          // 不显示 visualMap 组件，只用于明暗度的映射
          show: false,
          // 映射的最小值为 80
          min: 80,
          // 映射的最大值为 600
          max: 600,
          inRange: {
            // 明暗度的范围是 0 到 1
            // colorLightness: [0, 1]
          }
        },
        toolbox: {
          right: "10%",
          //工具栏显示
          show: true,
          feature: {
            dataView: { show: true, readOnly: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: "所有缺陷",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["50%", "50%"],
            data: tableData
          }
        ]
      });
    }
  },

  computed: {
    getRoles() {
      return this.$store.getters["roles"];
    }
  },
  created: function() {},
  mounted: function() {
    // this.$axios.post("/overview/myCircle").then(res => {
    //   this.myChartData = res.data.array;
    //   this.initCharOfMy(this.myChartData);
    // });
    // this.$axios.post("/overview/allCircle").then(res => {
    //   this.allChartData = res.data.array;
    //   this.initCharOfAll(this.allChartData);
    // });
    getUser().then(res => {
      this.userList = res.data;
    });
    initStatistic(this.getRoles, this.getRoles).then(response => {
      for (var key in response.data) {
        //key    data[key] - map
        if (key == "我创建的") {
          this.create = response.data[key];
        }
        if (key == "待我解决") {
          this.handle = response.data[key];
        }
        if (key == "我追踪的") {
          this.trace = response.data[key];
        }
        if (key == "指派给我的") {
          this.belongToMe = response.data[key];
        }
      }
    });
    initMyChart(this.getRoles, this.getRoles).then(response => {
      this.myChartData = response.data;
      this.initCharOfMy(this.myChartData);
    });
    initAllChart(this.getRoles, this.getRoles).then(response => {
      this.allChartData = response.data;
      this.initCharOfAll(this.allChartData);
    });
  }
};
</script>
