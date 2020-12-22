<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="info.projectNameCn"
    :close-on-click-modal="false"
    width="900px"
  >
  <div class="project-info">
    <div class="project-description">

      <div class="dl-list">
  <dl class="dl-item project-type">
          <dt><span>确认后，工时将汇总到{{info.projectNameCn}}项目中</span></dt>
          <dd>

            已选{{info.userCount}}位，共计工时{{info.weekTimeCount}}天
          </dd>
        </dl>
           <dl class="dl-item project-type">
          <dt><span>已用人力成本</span></dt>
          <dd>
            {{info.innerCost+info.extendCost}}
            =内部同事预算({{info.innerCost}})+外部同事预算({{info.extendCost}})
          </dd>
        </dl>

      </div>
    </div>
     </div>
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container project-members">
          <el-table
            :data="tableData"
            class="tl-table"
            @select="selectList"
            @select-all="selectList"
            row-key="sourceId"
          >

            <el-table-column prop="applyTime" label="姓名" min-width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="职级" prop="userLevel" min-width="200px">
            </el-table-column>
               <el-table-column label="工时(天)" prop="weekTime" min-width="200px">
            </el-table-column>
            <el-table-column label="人力成本" prop="weekTime"  min-width="200px">

            </el-table-column>

             <el-table-column
              prop="approvalTime"
              label="提交时间"
              min-width="180"
            >

            </el-table-column>

          </el-table>
        </div>
      </tl-crcloud-table>
    <div slot="footer" class="dialog-footer">
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="approval"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>

import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';
import Server from '../../server';

const server = new Server();
export default {
  name: 'approval',
  data() {
    return {
      server,
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
      tableData: [],
      companyList: [],
      funcList: [],
      levelList: [],
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {},
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    this.getCode();
  },
  methods: {
    show(selection, info) {
      this.info = info;
      this.selection = selection;
      this.searchList();
      this.visible = true;
    },
    searchList() {
      const list = this.getPageTable(this.selection, this.currentPage, this.pageSize);
      this.tableData = list.list;
      this.total = list.total;
    },

    approval() {
      this.$emit('submit');
      this.close();
    },
    close() {
      this.visible = false;
    },
    getCode() {
      this.server.queryByCodes({
        codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
      }).then((res) => {
        if (res.code == '200') {
          this.codes = res.data;
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
        }
      });
    },
    getName(code, arr) {
      let name = arr.filter((item) => item.value == code);
      if (name.length == 0) {
        name = [{ meaning: '' }];
      }
      return name[0].meaning;
    },
  },
  watch: {},
};
</script>
