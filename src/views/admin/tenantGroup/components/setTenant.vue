<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="租户管理"
      :close-on-click-modal="false"
      width="60%"
    >
      <div>
        <div class="operating-area">
          <dl class="condition-lists tag-lists has-delete">
            <dd>
              <tl-tenantMultiple
                :tenantList="tenantList"
                v-model="searchTenant"
                :showSelect="false"
                @change="selectedChange"
              ></tl-tenantMultiple>
            </dd>
          </dl>
        </div>
        <crcloud-table :isPage="false" @searchList="searchList">
          <div slot="tableContainer" class="table-container">
            <el-table ref="dicTable" v-loading="loading" :data="tableData">
              <el-table-column
                width="100px"
                type="index"
                align="left"
                label="序号"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="tenantName"
                label="租户"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="defaultFlag"
                label="是否默认租户"
              >
                <template slot-scope="scope">
                  <div>
                    <el-checkbox
                      @change="defaultFlagChange(scope.row)"
                      v-model="scope.row.defaultFlag"
                      >{{
                        scope.row.defaultFlag == 1 ? "是" : "否"
                      }}</el-checkbox
                    >
                  </div>
                </template></el-table-column
              >
              <el-table-column
                min-width="100px"
                align="left"
                prop="createTime"
                label="加入时间"
              ></el-table-column>
              <el-table-column
                width="150px"
                fixed="right"
                align="left"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="removeTenant(scope.row)"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </crcloud-table>
        <div class="operating-box btn-margin-top">
          <el-button
            :disabled="loading"
            plain
            class="tl-btn amt-border-fadeout"
            @click="cancel"
            >关闭</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tenantMultiple from '@/components/tenantMultiple';

export default {
  name: 'setTenant',
  components: {
    'tl-tenantMultiple': tenantMultiple,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      tableData: [],
      group: {},
      tenantList: [],
      searchTenant: [],
    };
  },
  created() {
  },
  mounted() {},
  computed: {},
  methods: {
    show(group) {
      this.group = group;
      this.searchList();
      this.queryTenants();
      this.visible = true;
    },

    searchList() {
      this.server.getTenantByGroupId({ groupId: this.group.groupId }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.tableData.forEach((element) => {
            element.defaultFlag = Number(element.defaultFlag) == 1;
          });
          this.$forceUpdate();
        }
      });
    },
    queryTenants() {
      this.server.queryTenants().then((res) => {
        if (res.code == 200) {
          this.tenantList = res.data;
        }
      });
    },
    selectedChange(list) {
      const params = {
        groupDetailList: [],
        groupId: this.group.groupId,
      };
      list.forEach((id) => {
        params.groupDetailList.push({
          tenantId: id,
        });
      });
      this.server.addTenant(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('添加成功');
          this.searchList();
        }
      });
    },
    close(status) {
      this.visible = false;
      this.$emit('closeDialog', { refreshPage: status == 'refreshPage' });
    },
    save() {
      this.loading = true;
      this.server.addOrUpdate().then((res) => {
        if (res.code == 200) {
          this.$message.success('添加成功');
          this.close('refreshPage');
        }
        this.loading = false;
      });
    },
    cancel() {
      this.close();
    },
    addEdit() {

    },
    defaultFlagChange(tenant) {
      this.server.setDefaultTenant({
        groupId: this.group.groupId,
        id: tenant.id,
        defaultFlag: tenant.defaultFlag == false ? 2 : 1,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('操作成功');
          this.searchList();
        }
      });
    },
    removeTenant(tenant) {
      this.server.removeTenant({
        id: tenant.id,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('操作成功');
          this.searchList();
        }
      });
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.btn-margin-top {
  margin-top: 20px;
  margin-bottom: -10px;
}
</style>