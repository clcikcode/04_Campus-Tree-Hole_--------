<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                style="width: 95%"
                v-model="searchObj.dynamicKeyWord"
                placeholder="动态标题"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="关 键 字">
              <el-input
                style="width: 95%"
                v-model="searchObj.commentKeyWord"
                placeholder="评论内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetData"
            >重置</el-button
          > -->
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :loading="loading"
            @click="fetchData()"
            >搜索</el-button
          >
          <el-button class="btn-add" size="mini" @click="batchRemove()"
            >批量删除</el-button
          >
        </el-row>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- <el-table-column prop="commentId" label="动态类型" /> -->
      <el-table-column prop="dynamicTitle" label="评论动态标题" />
      <el-table-column prop="commentUserName" label="评论人" />
      <el-table-column prop="content" label="评论内容" />
      <el-table-column prop="commentDate" label="评论日期" />

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row)"
            title="删除"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
// import api from "@/api/system/sysUser";
// import roleApi from "@/api/system/sysRole";
import api from "@/api/system/comment";
const defaultForm = {
  id: "",
  username: "",
  password: "",
  name: "",
  phone: "",
  status: 1,
  page: 1, // 页码
  limit: 10, // 每页记录数
};
export default {
  data() {
    return {
      type: {
        id: "",
        status: "",
        typeName: "",
        description: "",
        createTimes: "",
      },

      type1: {
        id: "",
        status: "",
        typeName: "",
        description: "",
        createTimes: "",
      },

      addVisible: false,
      dialogVisible: false,
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {
        dynamicKeyWord: "",
        commentKeyWord: "",
      }, // 查询表单对象

      createTimes: [],

      dialogVisible: false,
      dynamic: defaultForm,
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
      loading1: false, // 是否显示加载状态
      multipleSelection: [], // 批量删除选中的记录列表
      dialogVisible: false, // 弹出层是否显示
      multipleSelection: [], // 批量删除选中的记录列表
    };
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log("list created......");
    this.fetchData();
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log("list mounted......");
  },

  methods: {
    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的记录！");
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确定，远程调用ajax
          // 遍历selection，将id取出放入id列表
          var idList = [];
          this.multipleSelection.forEach((item) => {
            console.log(item.commentId);
            idList.push(item.commentId);
          });
          // 调用api
          console.log(idList);
          return api.batchRemove(idList);
          this.$message.success(response.message || "操作成功");
        })
        .then((response) => {
          this.fetchData();
          this.$message.success(response.message || "操作成功");
        });
    },
    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size);
      this.limit = size;
      this.fetchData(1);
    },

    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection);
      this.multipleSelection = selection;
    },

    // 加载banner列表数据
    fetchData(page = 1) {
      debugger;
      this.page = page;
      console.log("翻页。。。" + this.page);

      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.startTime = this.createTimes[0];
        this.searchObj.endTime = this.createTimes[1];
      }

      api
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          //this.list = response.data.list
          this.list = response.data.records;
          this.total = response.data.total;
          console.log(this.list);
          // 数据加载并绑定成功
          this.listLoading = false;
        });
    },

    // 根据id删除数据
    removeDataById(row) {
      // debugger
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          console.log("row:", row);
          return api.removeById(row.commentId);
        })
        .then((response) => {
          this.fetchData(this.page);
          this.$message.success(response.message || "删除成功");
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },

    edit(id) {
      this.dialogVisible = true;
      this.fetchDataById(id);
    },

    fetchDataById(id) {
      api.getById(id).then(
        function (response) {
          this.type.id = response.data.id;
          this.type.status = response.data.status;
          this.type.typeName = response.data.typeName;
          this.type.description = response.data.description;
          this.type.createTimes = response.data.createTimes;
          console.log(response.data.typeName);
        }.bind(this)
      );
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true; // 防止表单重复提交
      if (!this.type.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },

    saveData() {
      //   this.type.typeName = "";
      api.save(this.type1).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.addVisible = false;
        this.fetchData(this.page);
      });
    },

    add() {
      this.addVisible = true;
    },
    // 根据id更新记录
    updateData() {
      console.log(this.type);
      api.updateById(this.type).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData(this.page);
      });
    },
  },
};
</script>