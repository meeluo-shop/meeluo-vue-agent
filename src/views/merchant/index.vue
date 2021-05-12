<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel style="width: 50%">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width: 50%">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="searchKey"
              placeholder="请输入用商户名称"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column prop="name" label="商户名称"></el-table-column>
      <el-table-column prop="type" label="商户类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 10 ? 'primary' : 'success'">
            {{ scope.row.type === 10 ? "商城" : "餐饮" }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="remark" label="商户描述">
        <template slot-scope="scope">
          <span v-if="scope.row.remark">
            {{ scope.row.remark }}
          </span>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="liaison" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="address" label="联系地址"></el-table-column>
      <el-table-column prop="allow_private_wechat" label="独立公众号">
        <template slot-scope="{ row }">
          <el-tag v-if="row.allow_private_wechat">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间">
        <template slot-scope="{ row }">
          <span v-if="row.created_at">
            {{ formatTime(row.created_at) }}
          </span>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="expire_time" label="过期时间">
        <template slot-scope="{ row }">
          <span v-if="row.expire_time">
            {{ formatTime(row.expire_time, "YYYY-MM-DD") }}
          </span>
          <el-tag v-else type="success">无限制</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template v-slot="scope">
          <el-button @click="showDetail(scope.row)">详情</el-button>
          <el-button type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page_index"
      :page-size="queryForm.page_size"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetchData="fetchData"></edit>
    <detail ref="detail"></detail>
  </div>
</template>

<script>
  import { getList } from "@/api/merchant";
  import Edit from "./components/MerchantEdit";
  import Detail from "./components/MerchantDetail";
  import dayjs from "dayjs";

  export default {
    name: "MerchantManagement",
    components: { Edit, Detail },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        elementLoadingText: "正在加载...",
        queryForm: {
          page_index: 1,
          page_size: 10,
          name: "",
        },
        searchKey: "",
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      formatTime(cellValue, format = "YYYY-MM-DD HH:mm:ss") {
        return dayjs(cellValue).format(format);
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs["edit"].showEdit(row);
        } else {
          this.$refs["edit"].showEdit();
        }
      },
      showDetail(row) {
        this.$refs["detail"].showDetail(row);
      },
      handleSizeChange(val) {
        this.queryForm.page_size = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.queryForm.page_index = val;
        this.fetchData();
      },
      queryData() {
        this.queryForm.page_index = 1;
        this.queryForm.name = this.searchKey;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.queryForm);
        this.list = data.rows;
        this.total = data.count;
        this.listLoading = false;
      },
    },
  };
</script>
