<template>
  <div>
    <el-row style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button @click="clearFilter">清除所有过滤器</el-button>
        </el-form-item>
        <div style="float:right">
          <el-form-item>
            <el-input v-model="filters.query" placeholder="姓名/手机号等条件"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus">添加</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      :default-sort="{prop: 'date', order: 'descending'}"
      highlight-current-row
    >
      <!-- type为selection时选择多行数据时使用 Checkbox。 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- 如果需要对当前数据进行筛选，需要写filters（筛选类别）以及filter-method属性（返回值） -->
      <el-table-column
        prop="status"
        label="问题状态"
        width="100"
        :filters="statusDropdown"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag>
              {{scope.row.status}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="status in statusDropdown"
                :key="status.value"
                @click.native="statusDropdownChoose(scope,status.text)"
              >{{status.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100">
        <template slot-scope="scope">
          <div>
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- 这里有个formatter，可以用来格式化选择最终返回值 ,接受一个函数后会或得两个参数row和column-->
      <el-table-column prop="address" label="地址" :formatter="formatter"></el-table-column>
      <el-table-column
        prop="priority"
        label="优先级"
        :filters="priorityDropdown"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag>
              {{scope.row.priority}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="priorities in priorityDropdown"
                :key="priorities.value"
                @click.native="priorityDropdownChoose(scope,priorities.text)"
              >{{priorities.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="belongto" label="指派关系"></el-table-column>
      <el-table-column prop="date" label="日期" width="140" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-input size="mini" v-model="search" placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="问题详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="指派关系" :label-width="formLabelWidth">
          <el-input v-model="form.belongto" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-input v-model="form.date" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" disabled>
            <el-option v-for="status in statusDropdown" :key="status.text" :value="status.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-select v-model="form.priority" disabled>
            <el-option
              v-for="priorities in priorityDropdown"
              :key="priorities.text"
              :value="priorities.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Mock from "mockjs";

//自定义mock数据
var Random = Mock.Random;
Random.extend({
  status: function(date) {
    var statusDropdown = ["新建","处理中","已拒绝","已验收","已解决"];
    return this.pick(statusDropdown);
  },
  priority: function(date) {
    var priorityDropdown = ["致命","严重","一般","轻微"];
    return this.pick(priorityDropdown);
  }
});
let tableData = [];
for (let i = 0; i < 60; i++) {
  tableData.push(
    Mock.mock({
      date:Random.datetime('yyyy-MM-dd'),
      name: "@cname",
      address: '@province@city',
      status: "@status",
      priority: "@priority",
      belongto: "@name"
    })
  );
}
let statusDropdown = [
  { text: "新建", value: "新建" },
  { text: "处理中", value: "处理中" },
  { text: "已拒绝", value: "已拒绝" },
  { text: "已验收", value: "已验收" },
  { text: "已解决", value: "已解决" }
];
let priorityDropdown = [
  { text: "致命", value: "致命" },
  { text: "严重", value: "严重" },
  { text: "一般", value: "一般" },
  { text: "轻微", value: "轻微" }
];

let data = () => {
  return {
    search: "",
    //查询条件
    filters: {},
    //问题状态数组
    statusDropdown,
    //优先级数组
    priorityDropdown,
    tableData,
    dialogFormVisible: false,
    labelPosition: "left",
    form: {
      name: "",
      status: "",
      priority: "",
      date: "",
      belongto: "",
      address: ""
    },
    formLabelWidth: "80px"
  };
};

export default {
  data: data,
  methods: {
    formatter: function(row, column) {
      return row.address;
    },
    //清楚筛选条件
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    //下拉框选择修改当前值
    statusDropdownChoose: function(scope, text) {
      scope.row.status = text;
      //这里可以直接写与数据库相关的修改操作了
    },
    priorityDropdownChoose: function(scope, text) {
      scope.row.priority = text;
    },
    filterHandler: function(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      // this.form = Object.assign({}, row);
      //直接将row值对应赋值给form对应
      this.form = row;
    }
  },
  mounted: function() {}
};
</script>
