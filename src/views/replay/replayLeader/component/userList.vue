<template>
  <div class="organize-management">
    <div class="operating-area">
      <div class="operating-box">
        <div class="flex-auto">
          <el-form class="tl-form" label-width="110px">
            <el-form-item label="周期">
              <el-select
                v-model.trim="form.userType"
                placeholder="用户类型"
                :popper-append-to-body="false"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option :label="11" :value="11"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="复盘状态">
              <el-select
                v-model.trim="form.userStatus"
                placeholder="用户状态"
                :popper-append-to-body="false"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option :label="111" :value="111"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="listRoleUser"
      >
        <div slot="tableContainer">
          <el-table
            :data="tableData"
            @selection-change="handleSelectionChange"
            class="tl-table"
          >
            <el-table-column
              prop="userAccount"
              label="姓名"
              min-width="165"
            ></el-table-column>
            <el-table-column
              prop="userName"
              label="OKR周期"
              min-width="90"
            ></el-table-column>
            <el-table-column
              prop="userMobile"
              label="OKR进度"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="复盘状态"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="提交复盘时间"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="复盘沟通时间"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="复盘沟通时间"
              min-width="180"
            ></el-table-column>

            <el-table-column fixed="right" label="操作" width="60">
              <template>
                <el-button type="text" class="tl-btn">复盘沟通</el-button>
                <el-button type="text" class="tl-btn">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';

export default {
  name: 'home',
  data() {
    return {
      form: {},
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
};
</script>