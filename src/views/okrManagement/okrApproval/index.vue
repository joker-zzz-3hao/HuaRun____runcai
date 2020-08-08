<template>
  <div>
    <crcloud-table
      :total="formData.total"
      :pageSize.sync="formData.pageSize"
      :currentPage.sync="formData.currentPage"
      @searchList="searchList"
    >
      <div slot="searchBar">
        <el-form :inline="true" @submit.native.prevent @keyup.enter.native="searchList">
          <el-form-item>
            <p>周期</p>
            <el-select v-model="formData.cycleId" clearable :popper-append-to-body="false">
              <el-option
                v-for="(item) in CONST.CYCLE_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <p>审批状态</p>
            <el-select v-model="formData.approvalStatus" clearable :popper-append-to-body="false">
              <el-option
                v-for="(item) in CONST.APPROVAL_STATUS_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <p>审批类型</p>
            <el-select v-model="formData.approvalType" clearable :popper-append-to-body="false">
              <el-option
                v-for="(item) in CONST.APPROVAL_TYPE_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <p>成员</p>
            <el-input v-model.trim="formData.keyword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native.prevent="searchList">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="actionBar">
        <div>
          <el-button>OKR对齐</el-button>
        </div>
      </div>
      <div slot="tableContainer">
        <el-table :data="tableData" max-height="600" :empty-text="emptyText">
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="okrCycle" label="OKR周期" width="200"></el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="150"></el-table-column>
          <el-table-column prop="approvalType" label="审批类型" width="150"></el-table-column>
          <el-table-column prop="okrProgress" label="OKR进度" width="300"></el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="300"></el-table-column>
          <el-table-column prop="approvalTime" label="审批时间" width="300"></el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button @click.native.prevent="okrApproval(scope.row)" type="text" size="small">审批</el-button>
              <el-button @click.native.prevent="detail(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </crcloud-table>
  </div>
</template>

<script>
import CONST from '@/lib/const';
import Server from './server';

const server = new Server();

export default {
  name: 'okrApproval',
  components: {},
  props: {},
  data() {
    return {
      CONST,
      server,
      tableData: [],
      emptyText: '暂无数据',
      formData: {
        cycleId: 1,
        approvalStatus: '01',
        approvalType: '001',
        keyword: '',
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
    };
  },
  created() {},
  mounted() {
    this.searchList();
  },
  computed: {},
  methods: {
    searchList() {
      this.tableData = [];
      this.server.getokrApproval({
        pageSize: this.formData.pageSize,
        currentPage: this.formData.currentPage,
        approvalStatus: this.formData.approvalStatus,
        cycleId: this.formData.cycleId,
        approvalType: this.formData.approvalType,
        keyword: this.formData.keyword,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.tableData = res.data.content;
        }
      });
    },
    okrApproval(row) {
      console.log(row);
    },
    detail(row) {
      console.log(row);
    },
  },
  watch: {},
};
</script>