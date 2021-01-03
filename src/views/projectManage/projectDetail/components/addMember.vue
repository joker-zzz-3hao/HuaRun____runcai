<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @closed="closed"
    :before-close="close"
    title="添加成员"
    :close-on-click-modal="false"
    :modal="true"
    custom-class="add-members"
    class="tl-dialog"
  >
    <div class="cont-area">
      <dl class="layout-rows">
        <dd>
          <el-button plain @click="addDotted" class="tl-btn amt-border-slip"
            ><i class="el-icon-plus"></i><em>选择成员</em
            ><span class="lines"></span
          ></el-button>
          <!-- <el-select
            v-model="keyword"
            placeholder="请输入成员姓名"
            filterable
            reserve-keyword
            :remote-method="filterMembers"
            popper-class="tl-select-dropdown user-list"
            class="tl-select"
            @change="changeMember"
            :loading="loading"
          >
            <el-option
              v-for="(item, index) in projectManagerList"
              :key="index + item.userId"
              :label="item.userName"
              :value="item.userId"
            >
              <dl class="user-info">
                <dd>{{ item.userName }}</dd>
                <dd>( {{ item.orgName }} )</dd>
              </dl>
            </el-option>
          </el-select> -->
        </dd>
      </dl>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-form :model="dataForm" ref="dataForm">
            <el-table :data="dataForm.tableData" class="tl-table">
              <el-table-column
                prop="userName"
                label="姓名"
                min-width="140"
              ></el-table-column>
              <el-table-column prop="level" label="级别 *" min-width="140">
                <template slot-scope="scope">
                  <el-form-item
                    :key="scope.$index"
                    :prop="'tableData.' + scope.$index + '.level'"
                    :rules="[
                      {
                        trigger: 'change',
                        required: true,
                        message: '请选择级别',
                      },
                    ]"
                  >
                    <el-select
                      v-model="scope.row.level"
                      placeholder="请选择级别"
                      class="tl-select"
                    >
                      <el-option
                        v-for="item in levelList"
                        :key="item.value"
                        :label="item.meaning"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="funcName" label="职能 *" min-width="140">
                <template slot-scope="scope">
                  <el-form-item
                    :key="scope.$index"
                    :prop="'tableData.' + scope.$index + '.funcName'"
                    :rules="[
                      {
                        trigger: 'change',
                        required: true,
                        message: '请选择职能',
                      },
                    ]"
                  >
                    <el-select
                      v-model="scope.row.funcName"
                      placeholder="请选择职能"
                      class="tl-select"
                    >
                      <el-option
                        v-for="item in funcList"
                        :key="item.value"
                        :label="item.meaning"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="companyName"
                label="所属公司 *"
                min-width="140"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :key="scope.$index"
                    :prop="'tableData.' + scope.$index + '.companyName'"
                    :rules="[
                      {
                        trigger: 'change',
                        required: true,
                        message: '请选择职能',
                      },
                    ]"
                  >
                    <el-select
                      v-model="scope.row.companyName"
                      placeholder="请选择所属公司"
                      class="tl-select"
                    >
                      <el-option
                        v-for="item in companyList"
                        :key="item.value"
                        :label="item.meaning"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="orgName"
                label="所属部门"
                min-width="140"
              ></el-table-column>
              <el-table-column
                label="操作"
                width="55"
                v-if="dataForm.tableData.length > 0"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="deleteMember(scope.$index)"
                    type="text"
                    class="tl-btn"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </tl-crcloud-table>
    </div>
    <div class="operating-box">
      <el-button
        :disabled="commitLoading"
        plain
        @click="visible = false"
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
      <el-button
        :loading="commitLoading"
        type="primary"
        @click="addMembers"
        class="tl-btn amt-bg-slip"
        >确定</el-button
      >
    </div>
    <tl-add-member
      v-if="exist"
      :selectListed="selectListed"
      :exist.sync="exist"
      :objectType="true"
      :projectManagerList="projectManagerList"
      :userType="true"
      title="添加成员"
      :rouleType="true"
      :DisuserId="DisuserId"
      @submitFunctin="listRoleUser"
    ></tl-add-member>
  </el-dialog>
</template>

<script>
import addMember from '@/components/addMemberObject';
import crcloudTable from '@/components/crcloudTable';
import { mapState } from 'vuex';
import CONST from '../../const';

export default {
  name: 'addMember',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      commitLoading: false,
      keyword: '',
      projectManagerList: [],
      tableData: [],
      levelList: [],
      funcList: [],
      companyList: [],
      fictitiousList: [],
      selectListed: [],
      exist: false,
      dataForm: {
        tableData: [],
      },
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-add-member': addMember,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    codes: {
      type: Array,
      default() {
        return [];
      },
    },
    DisuserId: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.DisuserId[this.userInfo.userId] = true;
    this.server.projectUserList({ projectId: this.$route.query.projectId }).then((res) => {
      if (res.code == '200') {
        this.projectManagerList = res.data || [];
      }
    });
    this.codes.forEach((item) => {
      switch (item.code) {
        case 'PROJECT_EMPLOYEE_LEVEL':
          this.levelList = item.subList;
          break;
        case 'PROJECT_TECH_TYPE':
          this.funcList = item.subList;
          break;
        case 'PROJECT_EMPLOYEE_COMPANY':
          this.companyList = item.subList;
          break;
        default:
          break;
      }
    });
  },
  methods: {
    listRoleUser(data) {
      console.log(data);

      this.dataForm.tableData = data;
      this.selectListed = data;
      this.exist = false;
    },
    addDotted() {
      this.exist = true;
    },
    show() {
      this.visible = true;
      this.dataForm.tableData = [];
    },
    close() {
      this.visible = false;
    },
    deleteMember(index) {
      this.dataForm.tableData.splice(index, 1);
    },
    changeMember(data) {
      let flag = false;
      this.projectManagerList.forEach((item) => {
        flag = false;
        if (item.userId == data) {
          this.dataForm.tableData.forEach((dItem) => {
            if (dItem.userId == data) {
              flag = true;
            }
          });
          if (!flag) {
            this.server.projectUserRelation({
              projectId: this.$route.query.projectId || '',
              userId: item.userId,
            }).then((res) => {
              if (res.code == '200') {
                if (!res.data) {
                  this.dataForm.tableData.push(item);
                }
              }
            });
          }
        }
      });
      this.keyword = '';
    },
    addMembers() {
      if (this.dataForm.tableData.length == 0) {
        this.$message.success('请添加成员');
        return false;
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const params = [];
          this.dataForm.tableData.forEach((item) => {
            params.push({
              orgName: item.orgName,
              projectId: this.$route.query.projectId || '',
              userId: item.userId,
              userLevel: item.level,
              userName: item.userName,
              userPost: item.funcName,
              userCompany: item.companyName,
              projectUserType: '0',
            });
          });
          this.commitLoading = true;
          this.server.addProjectUser(params).then((res) => {
            this.commitLoading = false;
            if (res.code == '200') {
              this.$message.success('添加成功');
              this.visible = false;
              this.$emit('addSuccess');
            }
          });
        } else {
          this.$message.success('请选择级别职能与公司');
        }
      });
    },
    closed() {
      this.visible = false;
    },
    filterMembers(param) {
      // this.projectManagerList = [];
      this.server.projectUserList({
        param,
      }).then((res) => {
        if (res.code == '200') {
          this.projectManagerList = res.data;
        }
      });
    },
  },
  watch: {},
};
</script>