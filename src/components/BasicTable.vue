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
        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="buttonQuery">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="buttonAdd">添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="filterTable"
      :data="tables | pagination(pageNo,pageSize)"
      :default-sort="{prop:'createtime', order: 'descending'}"
      v-loading="loading"
      highlight-current-row
    >
      <!-- type为selection时选择多行数据时使用 Checkbox。 -->
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="num" label="ID" width="40">
        <template slot-scope="scope">
          <span style="font-size:11px">{{numFormatter(scope.row.num)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="问题类型"
        v-if="true"
        width="105"
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
        width="90"
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
      <el-table-column prop="belongto" label="所属人" width="100">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-tag size="mini">
              {{scope.row.belongto}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="user in userList"
                :key="user.id"
                @click.native="userListChoose(scope,user.value)"
              >{{user.value}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
          <el-tooltip placement="top">
            <div slot="content">{{getDetailTimeForToolTip(scope.row.createtime)}}</div>
            <span>{{ timeFormatter(scope.row.createtime) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="180" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <el-tooltip placement="top">
            <div
              slot="content"
              style="font-size:12px"
            >{{getDetailTimeForToolTip(scope.row.updatetime)}}</div>
            <span>{{ timeFormatter(scope.row.updatetime) }}</span>
          </el-tooltip>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form
        :model="form"
        :label-position="labelPosition"
        :label-width="formLabelWidth"
        :rules="dialogRules"
        ref="form"
        inline-message
      >
        <el-form-item label="ID" v-show="false">
          <el-input v-model="form.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-col :span="15">
            <el-input v-model="form.creator" autocomplete="off" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属人" prop="belongto">
          <el-select v-model="form.belongto" :disabled="isDisable">
            <el-option v-for="user in userList" :key="user.id" :value="user.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上次更新人" v-show="false">
          <el-col :span="15">
            <el-input v-model="form.updater" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建日期" v-show="false">
          <el-input v-model="form.createtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="typeName">
          <el-select v-model="form.typeName" :disabled="isDisable">
            <el-option v-for="type in typeList" :key="type.id" :value="type.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题状态" prop="statusName">
          <el-select v-model="form.statusName" :disabled="isDisable">
            <el-option v-for="status in statusList" :key="status.id" :value="status.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priorityName">
          <el-select v-model="form.priorityName" :disabled="isDisable">
            <el-option
              v-for="priorities in priorityList"
              :key="priorities.id"
              :value="priorities.text"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="brief" :inline-message="false">
          <el-col :span="23">
            <el-input
              type="textarea"
              v-model="form.brief"
              autocomplete="off"
              maxlength="1000"
              show-word-limit
              :autosize="{ minRows: 6}"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="buttonConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//从mock中获取模拟数据
import * as api from "@/api/detail";
import { getUser } from "@/api/overview";

export default {
  data() {
    const validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("当前项不能为空"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      search: "",
      //bug信息数据
      tableData: [],
      //bug状态信息
      statusList: [],
      //bug优先级信息
      priorityList: [],
      //bug类型信息
      typeList: [],

      filters: {
        name: ""
      },
      //编辑对话框默认不显示
      dialogFormVisible: false,
      //对话框中select是否可用
      isDisable: true,
      //dialig标题
      title: "",
      //编辑对话框默中排列位置
      labelPosition: "left",
      //编辑当前行数据的对话框
      form: {
        id: "",
        num: "",
        brief: "",
        creator: "",
        belongto: "",
        updater: "",
        typeName: "",
        statusName: "",
        priorityName: "",
        statusID: "",
        typeID: "",
        priorityID: "",
        createtime: "",
        remark: ""
      },
      formLabelWidth: "80px",
      pageNo: 1,
      pageSize: 10,
      dialogModel: {},
      dialogRules: {
        belongto: [{ required: true, trigger: "change", validator: validate }],
        statusName: [
          { required: true, trigger: "change", validator: validate }
        ],
        typeName: [{ required: true, trigger: "change", validator: validate }],
        priorityName: [
          { required: true, trigger: "change", validator: validate }
        ],
        brief: [{ required: true, trigger: "blur", validator: validate }]
      },
      userList: []
    };
  },

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
        let before = this.form.statusName;
        let after = "";
        for (let i = 0; i < this.statusList.length; i++) {
          if (this.statusList[i].value === value) {
            //修改状态id
            this.form.statusID = this.statusList[i].id;
            after = this.statusList[i].value;
          }
        }
        let remark =
          "将Bug状态从 " + '"' + before + '"' + " 修改为 " + '"' + after + '"';
        //赋值更新人
        this.form.updater = this.getRoles;
        this.form.remark = remark;
        this.updateTable(this.form);
      }
    },
    priorityListChoose: function(scope, value) {
      if (scope.row.priorityName != value) {
        this.form = scope.row;
        let before = this.form.priorityName;
        let after = "";
        for (let i = 0; i < this.priorityList.length; i++) {
          if (this.priorityList[i].value === value) {
            //修改状态id
            this.form.priorityID = this.priorityList[i].id;
            after = this.priorityList[i].value;
          }
        }
        let remark =
          "将Bug优先级从 " +
          '"' +
          before +
          '"' +
          " 修改为 " +
          '"' +
          after +
          '"';
        this.form.updater = this.getRoles;
        this.form.remark = remark;
        this.updateTable(this.form);
      }
    },
    //下拉框选择修改当前值
    typeListChoose: function(scope, value) {
      if (scope.row.typeName != value) {
        this.form = scope.row;
        let after = "";
        let before = this.form.typeName;
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].value === value) {
            //修改状态id
            this.form.typeID = this.typeList[i].id;
            after = this.typeList[i].value;
          }
        }
        let remark =
          "将Bug类型从 " + '"' + before + '"' + " 修改为 " + '"' + after + '"';
        this.form.updater = this.getRoles;
        this.form.remark = remark;
        this.updateTable(this.form);
      }
    },
    userListChoose: function(scope, value) {
      if (scope.row.belongto != value) {
        this.form = scope.row;
        let before = this.form.belongto;
        let after = "";
        this.form.belongto = value;
        after = value;
        let remark =
          "将任务所属人从 " +
          '"' +
          before +
          '"' +
          " 修改为 " +
          '"' +
          after +
          '"';
        this.form.updater = this.getRoles;
        this.form.remark = remark;
        this.updateTable(this.form);
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
      this.title = "编辑记录";
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
          row.updater = this.getRoles;
          row.remark = "删除了一条记录";
          //数据库删除
          api
            .remove(row)
            .then(res => {
              if (res.data === true) {
                this.refreshTable();
              }
            })
            .catch(error => {
              this.$message({
                type: "warning",
                message: error
              });
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
      this.title = "新增记录";
      //对dialog中的form重新赋值
      for (var element in this.form) {
        this.form[element] = "";
      }
      this.form.creator = this.getRoles;
    },
    //dialog窗口的确认button，点击确认新增
    buttonConfirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.updater = this.getRoles;
          //如果id不为空，则说明当前数据存在，则进行修改，为空则新增
          if ((this.form.id != "") & (this.form.id != null)) {
            this.form.remark = "修改了描述";
            this.updateTable(this.form);
          } else {
            this.form.remark = "新增了一条记录";
            api
              .insert(this.form)
              .then(res => {
                if (res.data === true) {
                  this.$message({
                    type: "success",
                    message: "新增信息成功!"
                  });
                  this.refreshTable();
                }
              })
              .catch(error => {
                this.$message({
                  type: "warning",
                  message: error
                });
              });
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },

    formatter: function(row, column) {
      return row.brief;
    },
    //将时间格式化->这里只需要显示年月日
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
          "日";
      }
      return times;
    },
    //将Bug信息的ID计数返回特定样式
    numFormatter(num) {
      var result =
        parseInt(num) < 10 ? "00" + num : parseInt(num) < 100 ? "0" + num : num;
      return result;
    },
    //获取详细时间->时分秒来给Tooltip显示
    getDetailTimeForToolTip(inputTime) {
      var time = new Date(inputTime);
      var resultTime =
        time.getHours() +
        "时" +
        (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) +
        "分" +
        (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()) +
        "秒";
      return resultTime;
    },
    //通过路由的变化来获取不同数据
    refreshTable() {
      //所有Bug信息
      if (this.$route.path == api.all) {
        api
          .getDetailInfo()
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
      //待我解决的Bug信息
      if (this.$route.path == api.handling) {
        api
          .getMyHandlingInfo(this.getRoles)
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
      //我创建的Bug信息
      if (this.$route.path == api.create) {
        api
          .getMyCreateInfo(this.getRoles)
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
      //属于我的Bug信息
      if (this.$route.path == api.belong) {
        api
          .getBelongtoMeInfo(this.getRoles)
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
      //我追踪的Bug信息
      if (this.$route.path == api.trace) {
        api
          .getMyTraceInfo(this.getRoles, this.getRoles)
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
      //未关闭的(状态为！已验收和！已拒绝)Bug信息
      if (this.$route.path == api.unclose) {
        api
          .getAllUnclosedInfo()
          .then(res => {
            this.tableData = res.data;
            this.loading = false;
          })
          .catch(error => {
            this.$message({
              type: "warning",
              message: error
            });
          });
      }
    },
    //修改Bug信息发出的异步请求函数
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
          this.$message({
            type: "warning",
            message: error
          });
        });
    }
  },
  created() {},

  mounted: function() {
    //获取表信息
    this.refreshTable();
    //获取bug状态信息列表
    api
      .getStatusInfo()
      .then(res => {
        res.data.forEach(item => {
          //重新修改获取列表的形式->将list.statusName改为list.text模式
          //因为table的filters属性只接受该格式来筛选信息（text，value）
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

    //获取bug类型信息列表
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
        this.$message({
          type: "warning",
          message: error
        });
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
        this.$message({
          type: "warning",
          message: error
        });
      });
    getUser()
      .then(res => {
        this.userList.push({
          value: "无",
          id: "0"
        });
        res.data.forEach(item => {
          this.userList.push({
            value: item.username,
            id: item.id
          });
        });
      })
      .catch(error => {
        this.$message({
          type: "warning",
          message: error
        });
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
      this.refreshTable();
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
