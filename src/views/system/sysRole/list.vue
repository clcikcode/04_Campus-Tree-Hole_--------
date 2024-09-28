<template>
  <div class="app-container">
    <!-- 工具条 -->

    <!--查询表单-->

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input
                style="width: 100%"
                v-model="searchObj.keyword"
                placeholder="角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :loading="loading"
            @click="fetchData()"
            >搜索</el-button
          >
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetData"
            >重置</el-button
          > -->

          <el-button class="btn-add" size="mini" @click="batchRemove()"
            >批量删除</el-button
          >
        </el-row>
      </el-form>
    </div>

    <!-- 表格 -->
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
      <el-table-column label="头像" width="90px" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatarUrl"
            style="height: 50px; border-radius: 990px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名称" width="200px" />
      <el-table-column prop="hobbies" label="爱好">
        <template slot-scope="scope">
          <div class="line-clamp-2 overflow-hidden">
            {{ scope.row.hobbies }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          {{ getGenderText(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="用户邮箱" />
      <el-table-column prop="follows" label="关注数" />
      <el-table-column prop="fans" label="粉丝数" />

      <el-table-column prop="registrationDate" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            title="删除"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 -->

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <el-dialog title="修改用户" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="sysRole"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="用户名称">
          <!-- <el-input :value="sysRole.username" /> -->
          <el-input placeholder="请输入内容" v-model="sysRole.username">
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="用户名称">
  <el-input placeholder="新的占位符文本" v-model="sysRole.username"></el-input>
</el-form-item> -->

        <el-form-item label="用户邮箱">
          <el-input placeholder="请输入内容" v-model="sysRole.email" clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="用户爱好">
          <el-input
            placeholder="请输入内容"
            v-model="sysRole.hobbies"
            clearable
          >
          </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-input placeholder="请输入内容" v-model="sysRole.gender" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveOrUpdate()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
import api from "@/api/system/sysRole";
export default {
  // 定义数据模型
  // 定义数据模型
  data() {
    return {
      // 表格数据
      sysRole: {
        username: "",
        email: "",
        hobbies: "",
        gender: "",
      },

      list: [], // 列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {
        keyword: "",
      }, // 查询条件
      loading1: false, // 是否显示加载状态
      multipleSelection: [], // 批量删除选中的记录列表
      dialogVisible: false, // 弹出层是否显示
      multipleSelection: [], // 批量删除选中的记录列表
    };
  },
  // 页面渲染成功后获取数据
  created() {
    this.fetchData();
  },
  // 定义方法
  methods: {
    add() {
      this.dialogVisible = true;
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true; // 防止表单重复提交
      if (!this.sysRole.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },

    // 新增
    saveData() {
      api.save(this.sysRole).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData(this.page);
      });
    },

    edit(id) {
      this.fetchDataById(id);
      // this.dialogVisible = false;
    },

    fetchDataById(id) {
      api.getById(id).then(
        function (response) {
          this.sysRole.id = response.data.id;
          this.sysRole.username = response.data.username;
          this.sysRole.email = response.data.email;
          this.sysRole.hobbies = response.data.hobbies;
          this.sysRole.gender = response.data.gender;
          console.log(response.data.username);
          if (this.loading1 == true) {
            this.dialogVisible = true;
          } else {
            this.loading1 = true;
          }
        }.bind(this)
      );
    },

    //
    updateData() {
      api.updateById(this.sysRole).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData(this.page);
      });
    },

    getGenderText(gender) {
      return gender === 1 ? "男" : gender === 2 ? "女" : "未知";
    },

    // 根据id删除数据
    removeDataById(id) {
      console.log(id);
      // debugger
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return api.removeById(id);
        })
        .then((response) => {
          this.fetchData(this.page);
          this.$message.success(response.message || "删除成功");
        });
    },

    fetchData(current = 1) {
      this.page = current;
      var that = this;
      // 调用api
      api.getPageList(this.page, this.limit, this.searchObj).then(
        function (response) {
          that.list = response.data.records;
          that.total = response.data.total;
        }.bind(this)
      );
    },

    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection);
      this.multipleSelection = selection;
    },

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
            idList.push(item.id);
          });
          // 调用api
          return api.batchRemove(idList);
        })
        .then((response) => {
          this.fetchData();
          this.$message.success(response.message);
        });
    },
  },
};
</script>


<style scoped>
/* 保留两行文字，剩余显示省略号 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}

/* 避免超出容器的文字被裁剪 */
.overflow-hidden {
  overflow: hidden;
}
</style>

