<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="添加成员"
      :close-on-click-modal="false"
    >
      <span>成员:</span>
      <el-select
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
            <dd>{{ item.orgName }}</dd>
          </dl>
        </el-option>
      </el-select>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-form :model="dataForm" ref="dataForm">
            <el-table :data="dataForm.tableData" class="tl-table">
              <el-table-column
                prop="userName"
                label="姓名"
                min-width="140"
              ></el-table-column>
              <el-table-column prop="level" label="级别" min-width="140">
                <template slot-scope="scope">
                  <el-form-item
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
              <el-table-column prop="funcName" label="职能" min-width="140">
                <template slot-scope="scope">
                  <el-form-item
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
                label="所属公司"
                min-width="140"
              >
                <template slot-scope="scope">
                  <el-form-item
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
              <el-table-column fixed="right" label="操作" width="180">
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
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addMembers">确 定</el-button>
      </span> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMembers" class="tl-btn amt-bg-slip"
          >确定</el-button
        >
        <el-button
          plain
          @click="visible = false"
          class="tl-btn amt-border-fadeout"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';

export default {
  name: 'addMember',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      keyword: '',
      projectManagerList: [],
      tableData: [],
      levelList: [],
      funcList: [],
      companyList: [],
      dataForm: {
        tableData: [],
      },
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
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
  },
  computed: {},
  mounted() {
    this.server.projectUserList({}).then((res) => {
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
      this.projectManagerList.forEach((item) => {
        if (item.userId == data) {
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
      });
      this.keyword = '';
    },
    addMembers() {
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
            });
          });
          this.server.addProjectUser(params).then((res) => {
            if (res.code == '200') {
              this.visible = false;
              this.$emit('addSuccess');
            }
          });
        }
      });
    },
    filterMembers(param) {
      this.projectManagerList = [];
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