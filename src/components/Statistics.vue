<template>
  <div style="padding-bottom: 20px;">
    <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div>
    <div style="position: relative;margin-top: 20px;">
      <div id="problemTypeChart" class="chart"></div>
    </div>
    <div style="position: relative;margin-top: 20px;">
      <div id="problemPriorityChart" class="chart"></div>
    </div>
    <!-- <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div> -->
  </div>
</template>

<script>
import echarts from "echarts";
import * as api from "@/api/statistics";

export default {
  methods: {
    init_status_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemStatusChart")
      );
      // 设置option setOption
      echart_etl_stat.setOption({
        title: {
          top: "1%",
          left: "1%",
          text: "问题状态统计",
          textStyle: {
            fontSize: "14",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["新建", "已解决", "处理中", "已验收", "已拒绝", "延期"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          left: "8%",
          //工具栏显示
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.monthList
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新建",
            type: "bar",
            data: this.status.createList
          },
          {
            name: "已解决",
            type: "bar",
            data: this.status.solvedList
          },
          {
            name: "处理中",
            type: "bar",
            data: this.status.handlingList
          },
          {
            name: "已验收",
            type: "bar",
            data: this.status.checkList
          },
          {
            name: "已拒绝",
            type: "bar",
            data: this.status.refuseList
          },
          {
            name: "延期",
            type: "bar",
            data: this.status.delayList
          }
        ]
      });
    },
    init_type_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemTypeChart")
      );
      // 设置option
      echart_etl_stat.setOption({
        title: {
          top: "1%",
          left: "1%",
          text: "问题类型统计",
          textStyle: {
            fontSize: "14",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            "UI缺陷",
            "功能缺陷",
            "数据错误",
            "反馈意见",
            "异常",
            "任务",
            "需求",
            "其他"
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          left: "8%",
          //工具栏显示
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.monthList
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "UI缺陷",
            type: "bar",
            data: this.type.UIBugList
          },
          {
            name: "功能缺陷",
            type: "bar",
            data: this.type.functionBugList
          },
          {
            name: "数据错误",
            type: "bar",
            data: this.type.dataMistakeList
          },
          {
            name: "反馈意见",
            type: "bar",
            data: this.type.feedbackList
          },
          {
            name: "异常",
            type: "bar",
            data: this.type.exceptionList
          },
          {
            name: "任务",
            type: "bar",
            data: this.type.missionList
          },
          {
            name: "需求",
            type: "bar",
            data: this.type.demandList
          },
          {
            name: "其他",
            type: "bar",
            data: this.type.otherList
          }
        ]
      });
    },
    init_priority_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemPriorityChart")
      );
      // 设置option
      echart_etl_stat.setOption({
        title: {
          top: "1%",
          left: "1%",
          text: "问题优先级统计",
          textStyle: {
            fontSize: "14",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["致命", "严重", "一般", "轻微"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          left: "8%",
          //工具栏显示
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.monthList
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "致命",
            type: "bar",
            data: this.priority.fatalList
          },
          {
            name: "严重",
            type: "bar",
            data: this.priority.seriousList
          },
          {
            name: "一般",
            type: "bar",
            data: this.priority.generalList
          },
          {
            name: "轻微",
            type: "bar",
            data: this.priority.slightList
          }
        ]
      });
    }
  },
  mounted: function() {
    api
      .getStatusDataList()
      .then(res => {
        this.status.createList = res.data["新建"];
        this.status.handlingList = res.data["处理中"];
        this.status.solvedList = res.data["已解决"];
        this.status.refuseList = res.data["已拒绝"];
        this.status.checkList = res.data["已验收"];
        this.status.delayList = res.data["延期"];
        this.init_status_echarts();
      })
      .catch(error => {
        this.$Message.error(error.message);
      });

    api
      .getTypeDataList()
      .then(res => {
        this.type.functionBugList = res.data["功能缺陷"];
        this.type.UIBugList = res.data["UI缺陷"];
        this.type.dataMistakeList = res.data["数据错误"];
        this.type.feedbackList = res.data["反馈意见"];
        this.type.exceptionList = res.data["异常"];
        this.type.missionList = res.data["任务"];
        this.type.demandList = res.data["需求"];
        this.type.otherList = res.data["其他"];
        this.init_type_echarts();
      })
      .catch(error => {
        this.$Message.error(error.message);
      });

    api
      .getPriorityDataList()
      .then(res => {
        this.priority.fatalList = res.data["致命"];
        this.priority.seriousList = res.data["严重"];
        this.priority.generalList = res.data["一般"];
        this.priority.slightList = res.data["轻微"];
        this.init_priority_echarts();
      })
      .catch(error => {
        this.$Message.error(error.message);
      });
  },
  data() {
    return {
      monthList: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      status: {
        createList: [],
        handlingList: [],
        solvedList: [],
        refuseList: [],
        checkList: [],
        delayList: []
      },
      type: {
        functionBugList: [],
        UIBugList: [],
        dataMistakeList: [],
        feedbackList: [],
        exceptionList: [],
        missionList: [],
        demandList: [],
        otherList: []
      },
      priority: {
        fatalList: [],
        seriousList: [],
        generalList: [],
        slightList: []
      }
    };
  }
};
</script>

<style scoped>
.chart {
  width: 98%;
  height: 370px;
  background: #fff;
  padding-top: 20px;
  margin-left: 1%;
  box-shadow: 0 4px 8px 0 rgba(34, 58, 156, 0.07);
  background-color: #fff;
}
</style>
