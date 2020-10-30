<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="close"
    @closed="closed"
    :visible="visible"
    title="选择项目"
  >
    <div class="cont-area">
      <div>
        <span>部门</span>
        <el-cascader
          v-model="orgIdList"
          ref="cascader"
          :options="rootOrgList"
          :show-all-levels="false"
          :props="{
            checkStrictly: true,
            value: 'orgId',
            label: 'orgName',
            children: 'sonTree',
          }"
          @change="selectIdChange"
        ></el-cascader>
      </div>
      <div>
        <crcloud-table
          :total="total"
          :pageSize.sync="pageSize"
          :currentPage.sync="currentPage"
          @searchList="searchList"
        >
          <div slot="tableContainer">
            <el-table
              ref="table"
              v-loading="loading"
              :data="projectList"
              @select="select"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="projectNameCn"
                label="项目名称"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                align="left"
                prop="projectManager"
                label="项目经理"
              ></el-table-column>
            </el-table>
          </div>
        </crcloud-table>
      </div>
    </div>
    <div style="margintop: 20px" class="operating-box">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="confirm"
        >确认</el-button
      >
      <el-button class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'selectProject',
  components: {},
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    randomIdForProject: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 0,
      visible: false,
      loading: false,
      projectList: [],
      tempTreeData: [],
      treeData: [],
      rootOrgList: [],
      orgIdList: [],
      selectedProject: {},
      orgName: '',
    };
  },
  created() {
    this.queryOrg();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:showProjectDialog', false);
    },
    queryOrg() {
      this.server.queryOrg().then((res) => {
        if (res.code == 200) {
          // this.tempTreeData = res.data;
          // 将返回的数据格式组合成element格式
          // 将对象转换成一维数组
          this.transObjToArr(res.data);
          // 找出根元素
          this.getRootOrg();
          // 将一维数组转换成树状结构数据
          this.transOneToSeveralArr();
          // 初始化下拉框中的数据
          this.initOrg();
          this.orgIdList.reverse();
          // 初始化部门之后，查询该组织下的项目
          this.searchList();
        }
      });
    },
    transObjToArr(data) {
      // const arr = [];
      for (const i in data) {
        if (data[i] != {} && i != 'orgId') {
          const o = {};
          if (data.orgId) {
            o.parentId = data.orgId;
          } else {
            o.parentId = '';
          }
          o.orgId = Math.random().toString(36).substr(3);
          o.orgName = i;
          o.sonTree = data[i];
          o.sonTree.orgId = o.orgId;
          this.tempTreeData.push(o);
          this.transObjToArr(o.sonTree);
        }
      }
    },
    getRootOrg() {
      for (const org of this.tempTreeData) {
        if (!org.parentId) {
          this.rootOrgList.push(org);
        }
      }
    },
    transOneToSeveralArr() {
      // 根据根节点遍历数据组装树状结构;
      for (const parentOrg of this.rootOrgList) {
        this.forEachTempTrteeData(parentOrg);
      }
    },
    forEachTempTrteeData(parentOrg) {
      parentOrg.sonTree = [];
      for (const org of this.tempTreeData) {
        if (parentOrg.orgId == org.parentId) {
          parentOrg.sonTree.push(org);
          this.forEachTempTrteeData(org);
        }
      }
    },
    initOrg() {
      this.orgIdList = [];
      for (const org of this.tempTreeData) {
        if (org.orgName.indexOf(this.userInfo.orgName) >= 0) {
          this.orgName = org.orgName;
          // 反显部门，给orgIdList数组赋值
          this.setOrgIdLIst(this.tempTreeData, org.orgId);
          return;// 防止多次匹配，因为可能有相似名称部门，我们只匹配第一次
        }
      }
    },
    setOrgIdLIst(orgList, orgId) {
      let parentId = '';
      for (const org of orgList) {
        if (org.orgId == orgId) {
          parentId = org.parentId;
          this.orgIdList.push(org.orgId);
          let result = '';
          if (this.orgIdList.length > 0) {
            // 给orgName赋值,每一层级都要拼接
            for (const tempOrg of this.tempTreeData) {
              for (const selectOrg of this.orgIdList) {
                if (tempOrg.orgId == selectOrg) {
                  result = `${tempOrg.orgName}/${result}`;
                }
              }
            }
          }
          this.orgName = result.slice(0, result.length - 1);
          this.setOrgIdLIst(orgList, parentId);
        }
      }
    },
    searchList() {
      this.loading = true;
      this.server.queryOrgProject({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        orgName: this.orgName,
      }).then((res) => {
        if (res.code == 200) {
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.projectList = res.data.content;
        }
        this.loading = false;
      });
    },
    select(selection) {
      if (selection.length > 1) {
        // eslint-disable-next-line camelcase
        const del_row = selection.shift();
        this.$refs.table.toggleRowSelection(del_row, false);
      }
      this.selectedProject = selection.length == 1 ? selection[0] : {};
    },
    confirm() {
      if (this.selectedProject.projectId) {
        this.$emit('closeProjectDia', {
          project: this.selectedProject,
          randomIdForProject: this.randomIdForProject,
        });
        this.visible = false;
        this.$emit('update:showProjectDialog', false);
      } else {
        this.$message.error('请选择项目');
      }
    },
    selectIdChange(orgIdList) {
      this.$refs.cascader.dropDownVisible = false;
      let result = '';
      if (orgIdList.length > 0) {
        // 给orgName赋值,每一层级都要拼接
        for (const org of this.tempTreeData) {
          for (const selectOrg of orgIdList) {
            if (org.orgId == selectOrg) {
              result = `${org.orgName}/${result}`;
            }
          }
        }
      }

      this.orgName = result.slice(0, result.length - 1);
      this.searchList();
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>