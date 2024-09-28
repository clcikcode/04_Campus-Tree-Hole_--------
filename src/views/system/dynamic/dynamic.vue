<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input
                style="width: 95%"
                v-model="searchObj.keyWord"
                placeholder="动态标题"
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
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <!-- <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
        >添 加</el-button
      >
    </div> -->

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="动态标题" width="250" />
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="typeName" label="动态类别" width="150" />
      <el-table-column prop="commentCount" label="评论数" />
      <el-table-column prop="likeCount" label="点赞数" />
      <el-table-column prop="favoriteCount" label="收藏数" />
      <el-table-column prop="postDate" label="发布日期" width="200" />
      <!-- <el-table-column prop="isDelete" label="是否删除" width="80" /> -->
      <!-- <el-table-column label="所属角色" width="130">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.roleList"
            :key="item.id"
            style="margin-right: 10px"
            >{{ item.roleName }}</span
          >
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="createTime" label="创建时间" width="160" /> -->

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-baseball"
            size="mini"
            @click="edit(scope.row.id)"
            title="详情"
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

    <el-dialog title="动态详情" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="dynamic"
        label-width="100px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="动态图片">
          <img
            :src="dynamic.imageUrl"
            alt="图片"
            style="width: 100%; height: 100%"
          />
        </el-form-item>

        <el-form-item label="动态ID">
          <el-input
            placeholder="请输入内容"
            v-model="dynamic.id"
            :readonly="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="作者">
          <el-input
            placeholder="请输入内容"
            v-model="dynamic.authorName"
            :readonly="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="动态标题">
          <el-input
            placeholder="请输入内容"
            v-model="dynamic.title"
            :readonly="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="动态类别">
          <el-input
            autosize
            placeholder="请输入内容"
            v-model="dynamic.typeName"
            :readonly="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="动态内容">
          <el-input
            autosize
            placeholder="请输入内容"
            v-model="dynamic.content"
            :readonly="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="评论数">
          <el-input
            autosize
            placeholder="请输入内容"
            v-model="dynamic.commentCount"
            :readonly="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="点赞数">
          <el-input
            autosize
            placeholder="请输入内容"
            v-model="dynamic.likeCount"
            :readonly="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="收藏数">
          <el-input
            autosize
            placeholder="请输入内容"
            v-model="dynamic.favoriteCount"
            :readonly="true"
          >
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
          @click="dialogVisible = false"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="dynamic.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="userRoleIds"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in allRoles"
              :key="role.id"
              :label="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="assignRole" size="small"
          >保存</el-button
        >
        <el-button @click="dialogRoleVisible = false" size="small"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import api from "@/api/system/sysUser";
// import roleApi from "@/api/system/sysRole";
import api from "@/api/system/dynamic";
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
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象

      createTimes: [],

      dialogVisible: false,
      dynamic: defaultForm,
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
    };
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log("list created......");
    this.fetchData();

    // api.getAll().then((response) => {
    //   this.roleList = response.data;
    //   console.log(this.roleList);
    // });
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log("list mounted......");
  },

  methods: {
    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size);
      this.limit = size;
      this.fetchData(1);
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

      api.getAll(this.page, this.limit, this.searchObj).then((response) => {
        //this.list = response.data.list
        this.list = response.data.records;
        this.total = response.data.total;

        // 数据加载并绑定成功
        this.listLoading = false;
      });
    },

    // 根据id删除数据
    removeDataById(id) {
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
      api.getById(id).then((response) => {
        this.dynamic = response.data;
      });
    },

    saveOrUpdate() {},

    // 根据id更新记录
    updateData() {
      api.updateById(this.sysUser).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData(this.page);
      });
    },
  },
};
</script>

