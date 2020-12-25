<template>
  <div class="working-hours-collection detaile">
    <div class="operating-area">
      <div class="operating-box">
        <el-button plain @click="back()" class="tl-btn amt-border-slip">
          返回
          <span class="lines"></span>
        </el-button>
      </div>
    </div>
    <div class="cont-area">
      <!-- <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      > -->
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container project-members">
          <el-table :data="tableData" class="tl-table">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.projectSupplementList"
                  row-key="supplementId"
                >
                  <el-table-column
                    prop="supplementUser"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column prop="userLevel" label="级别">
                    <template slot-scope="scope">
                      {{ getName(scope.row.userLevel, levelList) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="userPost" label="职能">
                    <template slot-scope="scope">
                      {{ getName(scope.row.userPost, funcList) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="userCompany" label="所属公司">
                    <template slot-scope="scope">
                      {{ getName(scope.row.userCompany, companyList) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="finalScore"
                    label="工时时间范围"
                    width="220"
                  >
                    <template slot-scope="scope">
                      {{
                        dateFormat("YYYY-mm-dd", scope.row.supplementTimeBegin)
                      }}至
                      {{
                        dateFormat("YYYY-mm-dd", scope.row.supplementTimeEnd)
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="supplementTime" label="补录工时(天)">
                  </el-table-column>
                  <el-table-column prop="supplementContent" label="工时内容">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="补录时间" prop="supplementSubmitTimeDate">
              <template slot-scope="scope">
                {{
                  dateFormat(
                    "YYYY-mm-dd HH:MM:SS",
                    scope.row.supplementSubmitTimeDate
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="补录人"
              prop="supplementSubmitter"
            ></el-table-column>
            <el-table-column prop="timeSum" label="工时(天)"> </el-table-column>
            <el-table-column prop="laborCost" label="人力成本(人民币)">
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';
import Server from '../../server';

const server = new Server();

export default {
  name: 'queryHistory',
  data() {
    return {
      CONST,
      server,
      tableData: [],
      visible: false,
      ruleDetailContentList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      levelList: [],
      funcList: [],
      companyList: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    this.searchList();
  },
  methods: {

    back() {
      if (this.$route.query.page) {
        this.$router.push({ name: 'mainHours', query: { projectId: this.$route.query.projectId } });
      } else {
        this.$router.back();
      }
    },
    searchList() {
      this.server.querySupplementHistory({
        projectId: this.$route.query.projectId,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }).then((res) => {
        this.tableData = res.data;
        this.getCode();
      });
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

};
</script>

<style>
</style>