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
        <crcloud-table :isPage="false" @searchList="searchList">
          <div slot="tableContainer" class="table-container">
            <el-table ref="dicTable" v-loading="loading" :data="tableData">
              <el-table-column
                min-width="100px"
                align="left"
                prop="code"
                label="租户"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="name"
                label="是否默认租户"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="name"
                label="创建时间"
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
                    @click="deleteTenant(scope.row)"
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

export default {
  name: 'setTenant',
  components: {
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

    };
  },
  created() {
  },
  mounted() {},
  computed: {},
  methods: {
    show(group) {
      this.server.getTenantList({ group }).then((res) => {
        if (res.code == 200) {
          // this.tableData = res.data;
          this.tableData = [{}, {}];
        }
      });
      this.visible = true;
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