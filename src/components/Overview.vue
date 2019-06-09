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
            <div
              class="info-shadow"
              style="height:450px;overflow-y:scroll;overflow-x:hidden;margin-top:15px"
            >
              <p style="padding-top:0px">历史记录</p>
              <div>
                <ul>
                  <el-row
                    :gutter="50"
                    v-for="history in this.historyList"
                    :key="history.id"
                    style="padding-top:5px"
                  >
                    <el-col :span="4">
                      <span class="col">Bug #{{numFormatter(history.num)}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span class="col1">{{history.updater}}</span>
                    </el-col>
                    <el-col :span="10">
                      <span class="col2">{{history.remark}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span class="col3">{{timeFormatter(history.updatetime)}}</span>
                    </el-col>
                  </el-row>
                </ul>
              </div>
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
  .col {
    font-size: 12px;
    color: #999;
  }
  .col1 {
    font-size: 12px;
  }
  .col2 {
    font-size: 12px;
    color: blue;
    text-align: left;
  }
  .col3 {
    color: #999;
    font-size: 12px;
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
import * as api from "@/api/overview";

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
      //接受用户列表
      userList: "",
      historyList: ""
    };
  },
  methods: {
    AddUser() {
      this.dialogFormVisible = true;
      console.log(this.getProjectID);
    },
    buttonConfirm() {
      this.$refs["addUserForm"].validate(valid => {
        if (valid) {
          api
            .addUser(this.addUserModel.username)
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
    timeFormatter(inputTime) {
      if ((inputTime != null) & (inputTime != "")) {
        //前后端的时间类型不同，所以需要先转换一下。
        var time = new Date(inputTime);
        var times =
          time.getFullYear() +
          "年" +
          (time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1) +
          "月" +
          (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) +
          "日 " +
          time.getHours() +
          ":" +
          (time.getMinutes() < 10
            ? "0" + time.getMinutes()
            : time.getMinutes()) +
          ":" +
          (time.getSeconds() < 10
            ? "0" + time.getSeconds()
            : time.getSeconds()) +
          "";
      }
      return times;
    },
    //用来得出特定的Bug信息ID样式
    numFormatter(num) {
      var result =
        parseInt(num) < 10 ? "00" + num : parseInt(num) < 100 ? "0" + num : num;
      return result;
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
    },
    getProjectID() {
      return this.$store.getters["project"];
    }
  },
  created: function() {},
  mounted: function() {
    //获取用户列表
    api
      .getUser()
      .then(res => {
        this.userList = res.data;
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
    //获取历史列表
    api
      .getHistory()
      .then(res => {
        this.historyList = res.data;
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
    //初始化数据
    api
      .initStatistic(this.getRoles, this.getRoles)
      .then(response => {
        //key    data[key] - map
        this.create = response.data["我创建的"];
        this.handle = response.data["待我解决"];
        this.trace = response.data["我追踪的"];
        this.belongToMe = response.data["指派给我的"];
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
    //初始化“关于我的”图表
    api
      .initMyChart(this.getRoles, this.getRoles)
      .then(response => {
        this.myChartData = response.data;
        this.initCharOfMy(this.myChartData);
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
    //初始化“所有”图表
    api
      .initAllChart(this.getRoles, this.getRoles)
      .then(response => {
        this.allChartData = response.data;
        this.initCharOfAll(this.allChartData);
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
  }
};
</script>