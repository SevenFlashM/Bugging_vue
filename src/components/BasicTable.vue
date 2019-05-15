<template>
  <div>
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-button class="btn-default" @click="clearFilter">清除所有过滤器</el-button>
        <el-button class="btn-default" @click="refreshTable">
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
      v-loading="loading"
      highlight-current-row
    >
      <!-- type为selection时选择多行数据时使用 Checkbox。 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" v-if="false" width="55"></el-table-column>
      <el-table-column
        prop="typeName"
        label="问题类型"
        v-if="true"
        width="110"
        :filters="typeList"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag size="mini">
              {{scope.row.typeName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="type in typeList"
                :key="type.id"
                @click.native="typeListChoose(scope,type.text)"
              >{{type.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <!-- 如果需要对当前数据进行筛选，需要写filters（筛选类别）以及filter-method属性（返回值） -->
      <el-table-column
        prop="statusName"
        label="问题状态"
        width="100"
        :filters="statusList"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag size="mini">
              {{scope.row.statusName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="status in statusList"
                :key="status.id"
                @click.native="statusListChoose(scope,status.text)"
              >{{status.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column
        prop="priorityName"
        label="优先级"
        width="100"
        :filters="priorityList"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag size="mini">
              {{scope.row.priorityName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="priorities in priorityList"
                :key="priorities.id"
                @click.native="priorityListChoose(scope,priorities.text)"
              >{{priorities.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="100">
        <!-- <template slot-scope="scope">
          <div>
            <el-tag size="medium">{{ scope.row.creator }}</el-tag>
          </div>
        </template>-->
      </el-table-column>
      <el-table-column prop="belongto" label="所属人" width="100"></el-table-column>
      <!-- 这里有个formatter，可以用来格式化选择最终返回值 ,接受一个函数后会或得两个参数row和column-->
      <el-table-column
        prop="brief"
        label="问题描述"
        width="150"
        show-overflow-tooltip
        :formatter="formatter"
      ></el-table-column>
      <el-table-column prop="createtime" label="创建日期" width="180" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ createtimeFormatter(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="180" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ updatetimeFormatter(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <!-- <template slot="header">
          <el-input size="mini" v-model="search" placeholder="输入关键字搜索"/>
        </template>-->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="handleDelete(scope.$index, scope.row)"
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
      :total="tables.length"
    ></el-pagination>

    <!-- 编辑表格信息对话框 -->
    <el-dialog title="问题详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="form.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.brief" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建人" :label-width="formLabelWidth">
          <el-input v-model="form.creator" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属人" :label-width="formLabelWidth">
          <el-input v-model="form.belongto" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="form.createtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" :label-width="formLabelWidth">
          <el-select v-model="form.typeName" :disabled="isDisable">
            <el-option v-for="type in typeList" :key="type.id" :value="type.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题状态" :label-width="formLabelWidth">
          <el-select v-model="form.statusName" :disabled="isDisable">
            <el-option v-for="status in statusList" :key="status.id" :value="status.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-select v-model="form.priorityName" :disabled="isDisable">
            <el-option
              v-for="priorities in priorityList"
              :key="priorities.id"
              :value="priorities.text"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="buttonConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//从mock中获取模拟数据
import * as api from "@/api/detail";

let data = () => {
  return {
    loading: true,
    search: "",
    //查询条件
    filters: {
      name: ""
    },
    //bug信息数据
    tableData: [],
    //bug状态信息
    statusList: [],
    //bug优先级信息
    priorityList: [],
    //bug类型信息
    typeList: [],

    //编辑对话框默认不显示
    dialogFormVisible: false,
    //对话框中select是否可用
    isDisable: true,
    //编辑对话框默中排列位置
    labelPosition: "left",
    //编辑当前行数据的对话框
    form: {
      id: "",
      brief: "",
      creator: "",
      belongto: "",
      typeName: "",
      statusName: "",
      priorityName: "",
      statusID: "",
      typeID: "",
      priorityID: "",
      createtime: ""
    },
    formLabelWidth: "80px",
    pageNo: 1,
    pageSize: 10,
    //表列是否显示
    columnShow: false
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
    //清楚筛选条件
    clearFilter() {
      //清除ref值为filtertable的table中的过滤条件
      this.$refs.filterTable.clearFilter();
    },
    //下拉框选择修改当前值
    statusListChoose: function(scope, value) {
      if (scope.row.statusName != value) {
        this.form = scope.row;
        for (let i = 0; i < this.statusList.length; i++) {
          if (this.statusList[i].value === value) {
            //修改状态id
            this.form.statusID = this.statusList[i].id;
          }
        }
        this.updateTable(this.form);
      }
    },
    priorityListChoose: function(scope, value) {
      if (scope.row.priorityName != value) {
        this.form = scope.row;
        for (let i = 0; i < this.priorityList.length; i++) {
          if (this.priorityList[i].value === value) {
            //修改状态id
            this.form.priorityID = this.priorityList[i].id;
          }
        }
        this.updateTable(this.form);
      }
    },
    //下拉框选择修改当前值
    typeListChoose: function(scope, value) {
      if (scope.row.typeName != value) {
        this.form = scope.row;
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].value === value) {
            //修改状态id
            this.form.typeID = this.typeList[i].id;
          }
        }
        this.updateTable(this.form);
      }
      //这里可以直接写与数据库相关的修改操作了
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
          //数据库删除
          api
            .remove(row.id)
            .then(res => {
              if (res.data === true) {
                this.refreshTable();
              }
            })
            .catch(error => {
              this.$Message.error(error.message);
            });
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

    //添加按钮，点击打开dialog窗口
    buttonAdd() {
      this.dialogFormVisible = true;
      this.isDisable = false;
      //对dialog中的form重新赋值
      for (var element in this.form) {
        this.form[element] = "";
      }
      this.form.creator = this.getRoles;
    },
    //dialog窗口的确认button，点击确认新增
    buttonConfirm() {
      //如果id不为空，则说明当前数据存在，则进行修改，为空则新增
      if ((this.form.id != "") & (this.form.id != null)) {
        this.updateTable(this.form);
      } else {
        api
          .insert(this.form)
          .then(res => {
            if (res.data === true) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.refreshTable();
            }
          })
          .catch(error => {
            this.$Message.error(error.message);
          });
      }

      this.dialogFormVisible = false;
    },

    formatter: function(row, column) {
      return row.brief;
    },
    createtimeFormatter(row) {
      if ((row.createtime != null) & (row.createtime != "")) {
        var time = new Date(row.createtime);
        var times =
          time.getFullYear() +
          "年" +
          (time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1) +
          "月" +
          (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) +
          "日";
      }
      return times;
    },
    updatetimeFormatter(row) {
      if ((row.updatetime != null) & (row.updatetime != "")) {
        var time = new Date(row.updatetime);
        var times =
          time.getFullYear() +
          "年" +
          (time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1) +
          "月" +
          (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) +
          "日";
        // +
        // time.getHours() +
        // ":" +
        // time.getMinutes() +
        // ":" +
        // (time.getSeconds() < 10
        //   ? "0" + time.getSeconds()
        //   : time.getSeconds());
      }
      return times;
    },
    refreshTable() {
      //获取表信息
      api
        .getDetailInfo()
        .then(res => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch(error => {
          this.$Message.error(error.message);
        });
    },
    updateTable(form) {
      api
        .update(form)
        .then(res => {
          if (res.data === true) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.refreshTable();
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },
  created() {},

  mounted: function() {
    //获取表信息
    this.refreshTable();
    //获取bug状态信息
    api
      .getStatusInfo()
      .then(res => {
        res.data.forEach(item => {
          this.statusList.push({
            text: item.statusName,
            value: item.statusName,
            id: item.id
          });
        });
      })
      .catch(error => {
        this.$Message.error(error.message);
      });

    //获取bug类型信息
    api
      .getTypeInfo()
      .then(res => {
        res.data.forEach(item => {
          this.typeList.push({
            text: item.typeName,
            value: item.typeName,
            id: item.id
          });
        });
      })
      .catch(error => {
        this.$Message.error(error.message);
      });

    //获取bug优先级信息
    api
      .getPriorityInfo()
      .then(res => {
        res.data.forEach(item => {
          this.priorityList.push({
            text: item.priorityName,
            value: item.priorityName,
            id: item.id
          });
        });
      })
      .catch(error => {
        this.$Message.error(error.message);
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
    },
    getRoles() {
      return this.$store.getters["roles"];
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
