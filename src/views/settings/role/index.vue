<template>
  <div>
    <crcloud-table
      :total="total"
      :pageSize.sync="pageSize"
      :currentPage.sync="currentPage"
      :isPage="isPage"
      @searchList="searchList"
    >
      <div slot="searchBar">
        <el-form :inline="true" @submit.native.prevent @keyup.enter.native="searchList">
          <el-form-item>
            <el-input placeholder="请输入角色名称/创建时间/角色状态" v-model="formData.keyWord" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native.prevent="searchList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="tableContainer">
        <el-table
          :data="tableData"
          style="width: 60%"
          max-height="500"
          :empty-text="emptyText"
          :pageSizes="pageSizes"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <expand :row="scope.row"></expand>
            </template>
          </el-table-column>
          <el-table-column sortable prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="province" label="省份" width="120"></el-table-column>
          <el-table-column prop="city" label="市区" width="120"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
  </div>
</template>
<script>
export default {
  name: 'role',
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      isPage: true,
      formData: {
        keyWord: '',
      },
      tableData: [],
      emptyText: '暂无数据',
    };
  },
  components: {},
  mounted() {},
  methods: {
    searchList() {},
  },
};
</script>