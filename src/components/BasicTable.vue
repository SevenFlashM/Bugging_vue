<template>
  <div>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-button class="btn-default" @click="clearFilter">清除所有过滤器</el-button>
        <el-button class="btn-default">
          <i class="el-icon-refresh"></i>
          <span>刷新</span>
        </el-button>
      </el-form-item>
      <div style="float:right">
        <el-form-item>
          <el-input v-model="search" placeholder="输入任意查询内容"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="buttonQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="buttonAdd">添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="filterTable"
      :data="tables | pagination(pageNo,pageSize)"
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
      <el-table-column prop="creater" label="创建人" width="100">
        <template slot-scope="scope">
          <div>
            <el-tag size="medium">{{ scope.row.creater }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- 这里有个formatter，可以用来格式化选择最终返回值 ,接受一个函数后会或得两个参数row和column-->
      <el-table-column prop="brief" label="问题描述" :formatter="formatter"></el-table-column>
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
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="float:right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
    ></el-pagination>

    <!-- 编辑表格信息对话框 -->
    <el-dialog title="问题详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.brief" autocomplete="off"></el-input>
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
          <el-select v-model="form.status" :disabled="isDisable">
            <el-option v-for="status in statusDropdown" :key="status.text" :value="status.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-select v-model="form.priority" :disabled="isDisable">
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
//从mock中获取模拟数据
require("../../mock/table");

let tableData = [];
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
    filters: {
      name: ""
    },
    //问题状态数组
    statusDropdown,
    //优先级数组
    priorityDropdown,
    //表格数据
    tableData,
    //编辑对话框默认不显示
    dialogFormVisible: false,
    //对话框中select是否可用
    isDisable: true,
    //编辑对话框默中排列位置
    labelPosition: "left",
    //编辑当前行数据的对话框
    form: {
      name: "",
      status: "",
      priority: "",
      date: "",
      belongto: "",
      brief: ""
    },
    formLabelWidth: "80px",
    pageNo: 1,
    pageSize: 10
  };
};
export default {
  data: data,
  filters: {
    //分页函数
    pagination(data, pageNo, pageSize) {
      let offset = (pageNo - 1) * pageSize;
      let result =
        offset + pageSize >= data.length
          ? data.slice(offset, data.length)
          : data.slice(offset, offset + pageSize);
      return result;
    }
  },
  methods: {
    formatter: function(row, column) {
      return row.brief;
    },
    //清楚筛选条件
    clearFilter() {
      //清除ref值为filtertable的table中的过滤条件
      this.$refs.filterTable.clearFilter();
    },
    //下拉框选择修改当前值
    statusDropdownChoose: function(scope, text) {
      if (scope.row.status != text) {
        scope.row.status = text;
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
      }
      //这里可以直接写与数据库相关的修改操作了
    },
    priorityDropdownChoose: function(scope, text) {
      if (scope.row.priority != text) {
        scope.row.priority = text;
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
      }
    },
    filterHandler: function(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //编辑表格
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      this.isDisable = true;
      // this.form = Object.assign({}, row);
      //直接将row值对应赋值给form对应
      this.form = row;
    },
    //删除按钮操作
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除当前行
          row.splice(index, 1);
          //数据库删除

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //当分页的每页数目(10/page->20/page)发生变变化
    handleSizeChange(val) {
      //动态更改pagesize
      this.pageSize = val;
      // console.log(`每页 ${val} 条`);
    },
    //当前页发生变化
    handleCurrentChange(val) {
      this.pageNo = val;
      // console.log(`当前页: ${val}`);
    },
    buttonQuery() {},
    buttonAdd() {
      this.dialogFormVisible = true;
      this.isDisable = false;
    },

    test(data) {
      let search = this.search;
      console.log(data);
      return !search || data.name.toLowerCase().includes(search.toLowerCase());
    }
  },
  created() {},
  mounted: function() {
    //使用axios的post请求
    this.$axios.post("/Problem/All").then(res => {
      this.tableData = res.data.array;
    });
  },
  computed: {
    // 模糊搜索
    tables() {
      const search = this.search;
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.tableData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            //key是data中所包含的属性（date，name.....）
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      return this.tableData;
    }
  },
  watch: {
    //监听路由变化
    $route: function(to, from) {
      if (this.$route.path == "/Problem/All") {
        this.$axios.post("/Problem/All").then(res => {
          this.tableData = res.data.array;
        });
      }
      if (this.$route.path == "/Problem/ToSolve") {
        this.$axios.post("/Problem/ToSolve").then(res => {
          this.tableData = res.data.array;
        });
      }
      if (this.$route.path == "/Problem/Mine") {
        this.$axios.post("/Problem/Mine").then(res => {
          this.tableData = res.data.array;
        });
      }
      if (this.$route.path == "/Problem/Create") {
        this.$axios.post("/Problem/Create").then(res => {
          this.tableData = res.data.array;
        });
      }
      if (this.$route.path == "/Problem/Distr") {
        this.$axios.post("/Problem/Distr").then(res => {
          this.tableData = res.data.array;
        });
      }
      if (this.$route.path == "/Problem/Unsolve") {
        this.$axios.post("/Problem/Unsolve").then(res => {
          this.tableData = res.data.array;
        });
      }
    }
  }
};
</script>
<style scoped>
.el-form {
  background-color: #ffffff;
}
.el-form-item {
  margin-top: 10px;
  margin-bottom: 10px;
}
.btn-default {
  box-shadow: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
