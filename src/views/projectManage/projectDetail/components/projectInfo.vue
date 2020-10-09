<template>
  <div>
    <div>
      <div>
        <span>关于2019年新员工入职优化项目请示</span>
        <span>云门户项目组</span>
        <span>进行中</span>
      </div>
      <div>
        <span>项目经理：张三</span>
        <span>项目所属部门：张三</span>
        <span>项目总预算：张三</span>
      </div>
      <div>
        <span>投入类型：张三</span>
        <span>申请时间：张三</span>
        <span>项目时间：张三</span>
      </div>
    </div>
    <div>
      <div style="display: flex">
        <div>项目成员</div>
        <div><el-button @click="addMembers">添加成员</el-button></div>
      </div>
      <div>
        <tl-crcloud-table
          :total="total"
          :currentPage.sync="currentPage"
          :pageSize.sync="pageSize"
          @searchList="searchList"
        >
          <div slot="tableContainer" class="table-container">
            <el-table :data="tableData" class="tl-table">
              <el-table-column prop="name" label="姓名" min-width="140">
                <template slot-scope="scope">
                  <p v-if="scope.row.name">
                    <span>{{ scope.row.name }}</span>
                    <template v-if="isTalentAdmin">
                      <span v-if="scope.row.memberType == '0'">(经理)</span>
                      <span
                        @click="setManager(scope.row)"
                        v-else-if="scope.row.memberType == '1'"
                        >(内部)</span
                      >
                      <span
                        @click="setManager(scope.row)"
                        v-else-if="scope.row.memberType == '2'"
                        >(外部)</span
                      >
                    </template>
                  </p>
                  <p v-else>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="departName" label="部门" min-width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.departName">{{
                    scope.row.departName
                  }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="totalTime"
                label="合计工时"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.totalTime">{{
                    scope.row.totalTime
                  }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="加入项目时间" min-width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.projectType">{{ scope.row.time }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    :disabled="scope.row.isManage == '1'"
                    @click="deleteMember(scope.row)"
                    type="text"
                    class="tl-btn"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </tl-crcloud-table>
      </div>
    </div>
    <tl-add-member
      ref="addMember"
      v-if="showAddMember"
      :server="server"
      @addSuccess="addSuccess"
    ></tl-add-member>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import addMember from './addMember';

export default {
  name: 'projectInfo',
  data() {
    return {
      total: 0,
      currentPage: 0,
      pageSize: 0,
      isTalentAdmin: false,
      showAddMember: false,
      tableData: [
        {
          name: '陈翔', departName: '华润云', totalTime: '20天', time: '2020-09-10', isManage: '0', memberType: '0',
        },
        {
          name: '陈翔', departName: '华润云', totalTime: '20天', time: '2020-09-10', isManage: '1', memberType: '1',
        },
        {
          name: '陈翔', departName: '华润云', totalTime: '20天', time: '2020-09-10', isManage: '0', memberType: '2',
        },
      ],
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
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.userInfo.roleList.forEach((item) => {
      if (item.roleCode == 'TENANT_ADMIN') {
        this.isTalentAdmin = true;
      }
    });
  },
  methods: {
    searchList() {},
    deleteMember(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.deleteMember({
          orguserIdId: data.userId,
        }).then((res) => {
          if (res.code == 200) {
            // this.$message.success('移除成员成功');
            this.searchList();
          }
        });
      });
    },
    setManager(data) {
      this.server.setManager({
        userId: data.userId,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.searchList();
        }
      });
    },
    addMembers() {
      this.showAddMember = true;
      this.$nextTick(() => {
        this.$refs.addMember.show();
      });
    },
    addSuccess() {
      this.searchList();
      this.showAddMember = false;
    },
  },
  watch: {},
};
</script>