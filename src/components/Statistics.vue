<template>
  <div style="padding-bottom: 20px;">
    <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div>
    <div style="position: relative;margin-top: 20px;">
      <div id="problemTypeChart" class="chart"></div>
    </div>
    <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div>
    <div style="position: relative;margin-top: 20px;">
      <div id="problemStatusChart" class="chart"></div>
    </div>
  </div>
</template>

<script>
var echarts = require("echarts");

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
          data: ["category1", "category2", "category3", "category4"]
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
            name: "category1",
            type: "line",
            data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "category2",
            type: "line",
            data: [0, 0, 3, 1, 0, 0, 0, 5, 0, 0, 0, 0]
          },
          {
            name: "category3",
            type: "line",
            data: [0, 1, 2, 0, 3, 0, 2, 0, 0, 4, 0, 0]
          },
          {
            name: "category4",
            type: "line",
            data: [0, 0, 5, 0, 0, 5, 0, 0, 6, 0, 4, 0]
          }
        ]
      };
      // 绘制图表
      echart_etl_stat.setOption(echart_etl_stat_option);
    }
  },
  mounted: function() {
    this.init_status_echarts();
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
