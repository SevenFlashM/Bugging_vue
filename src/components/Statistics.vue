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
    <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  methods: {
    init_status_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemStatusChart")
      );
      // 设置option
      var echart_etl_stat_option = {
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
          data: ["新建", "已解决", "处理中", "已验收","已拒绝","延期"]
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
          data: [
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
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新建",
            type: "line",
            data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "已解决",
            type: "line",
            data: [0, 0, 3, 1, 0, 0, 0, 5, 0, 0, 0, 0]
          },
          {
            name: "处理中",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 0, 0, 4, 0, 0]
          },
          {
            name: "已验收",
            type: "line",
            data: [0, 0, 5, 0, 0, 5, 0, 0, 6, 0, 4, 0]
          },
           {
            name: "已拒绝",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 2, 0, 4, 4, 0]
          },
           {
            name: "延期",
            type: "line",
            data: [0, 1, 2, 0, 4, 0, 2, 0, 0, 4, 7, 0]
          },
        ]
      };
      // 绘制图表
      echart_etl_stat.setOption(echart_etl_stat_option);
    },
    init_type_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemTypeChart")
      );
      // 设置option
      var echart_etl_stat_option = {
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
          data: ["UI缺陷", "功能缺陷", "数据错误", "反馈意见","异常","任务","需求","其他"]
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
          data: [
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
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "UI缺陷",
            type: "line",
            data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "功能缺陷",
            type: "line",
            data: [0, 0, 3, 1, 0, 0, 0, 5, 0, 0, 0, 0]
          },
          {
            name: "数据错误",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 0, 0, 4, 0, 0]
          },
          {
            name: "反馈意见",
            type: "line",
            data: [0, 0, 5, 0, 0, 5, 0, 0, 6, 0, 4, 0]
          },
           {
            name: "异常",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 2, 0, 4, 4, 0]
          },
           {
            name: "任务",
            type: "line",
            data: [0, 1, 2, 0, 4, 0, 2, 0, 0, 4, 7, 0]
          },
          {
            name: "需求",
            type: "line",
            data: [0, 1, 2, 0, 4, 0, 2, 0, 0, 4, 7, 0]
          },
          {
            name: "其他",
            type: "line",
            data: [0, 1, 2, 0, 4, 0, 2, 0, 0, 4, 7, 0]
          },
        ]
      };
      // 绘制图表
      echart_etl_stat.setOption(echart_etl_stat_option);
    },
     init_priority_echarts() {
      // 基于准备好的dom，初始化echarts实例
      var echart_etl_stat = echarts.init(
        document.getElementById("problemPriorityChart")
      );
      // 设置option
      var echart_etl_stat_option = {
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
          data: [
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
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "致命",
            type: "line",
            data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "严重",
            type: "line",
            data: [0, 0, 3, 1, 0, 0, 0, 5, 0, 0, 0, 0]
          },
          {
            name: "一般",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 0, 0, 4, 0, 0]
          },
          {
            name: "轻微",
            type: "line",
            data: [0, 0, 5, 0, 0, 5, 0, 0, 6, 0, 4, 0]
          },
        ]
      };
      // 绘制图表
      echart_etl_stat.setOption(echart_etl_stat_option);
    }
  },
  mounted: function() {
    this.init_status_echarts();
    this.init_type_echarts();
    this.init_priority_echarts();

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
