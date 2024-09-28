<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
        >添 加</el-button
      >
    </div>

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

      <el-table-column prop="typeName" label="动态类型" />
      <el-table-column prop="description" label="类型描述" />
      <el-table-column prop="status" label="类型状态">
        <template slot-scope="scope">
          <!-- 使用scopedSlots自定义渲染 -->
          <span v-if="scope.row.status === 1">可用</span>
          <span v-else-if="scope.row.status === 0">不可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="creationDate" label="创建时间" />

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            title="修改"
          />
          <!-- <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            title="删除"
          /> -->
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

    <el-dialog title="类型修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="type"
        label-width="100px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="动态类型">
          <el-input placeholder="请输入内容" v-model="type.typeName"></el-input>
        </el-form-item>

        <el-form-item label="类型描述">
          <el-input
            placeholder="请输入内容"
            v-model="type.description"
          ></el-input>
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

    <el-dialog title="新增类型" :visible.sync="addVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="type1"
        label-width="100px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="动态类型">
          <el-input
            placeholder="请输入内容"
            v-model="type1.typeName"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型描述">
          <el-input
            placeholder="请输入内容"
            v-model="type1.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="addVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveData()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import api from "@/api/system/sysUser";
// import roleApi from "@/api/system/sysRole";
import api from "@/api/system/type";
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